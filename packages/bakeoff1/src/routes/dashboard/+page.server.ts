import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';

type DashboardResume = {
  id: string;
  title: string;
  kind: 'standard' | 'cv';
  lastUpdated: string;
  createdAt: string;
  tags: string[];
};

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

function formatDate(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  return dateFormatter.format(date);
}

function parseResumeId(raw: string): number | null {
  const trimmed = raw.trim();
  const prefixed = /^rsm-(\d+)$/i.exec(trimmed);
  const numeric = /^\d+$/.test(trimmed);
  const value = prefixed ? prefixed[1] : numeric ? trimmed : null;
  if (!value) return null;

  const id = Number(value);
  if (!Number.isInteger(id) || id < 0) return null;
  return id;
}

export const load: PageServerLoad = async () => {
  const result = await db.query<{
    id: number;
    title: string;
    created_at: string;
    updated_at: string;
    section_types: string[] | null;
  }>(
    `
    SELECT
      r.id,
      r.title,
      r.created_at,
      r.updated_at,
      ARRAY_REMOVE(ARRAY_AGG(DISTINCT s.type), NULL) AS section_types
    FROM resume r
    LEFT JOIN section s ON s.resume_id = r.id
    WHERE r.user_id = $1
    GROUP BY r.id
    ORDER BY r.updated_at DESC
  `,
    [0]
  );

  const resumes: DashboardResume[] = result.rows.map((row, index) => ({
    id: `rsm-${String(row.id).padStart(3, '0')}`,
    title: row.title,
    kind: index === 0 ? 'cv' : 'standard',
    lastUpdated: formatDate(row.updated_at),
    createdAt: formatDate(row.created_at),
    tags: (row.section_types ?? []).map((type) =>
      type
        .split(/[_\s-]+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    ),
  }));

  return { resumes };
};

export const actions: Actions = {
  rename: async ({ request }) => {
    const formData = await request.formData();
    const resumeIdRaw = String(formData.get('resumeId') ?? '');
    const titleRaw = String(formData.get('title') ?? '').trim();

    const resumeId = parseResumeId(resumeIdRaw);
    if (resumeId === null) {
      return fail(400, { message: 'Invalid resume id' });
    }

    if (!titleRaw) {
      return fail(400, { message: 'Title is required' });
    }

    const result = await db.query<{ id: number }>(
      `
      UPDATE resume
      SET title = $1, updated_at = NOW()
      WHERE id = $2 AND user_id = $3
      RETURNING id
      `,
      [titleRaw, resumeId, 0]
    );

    if (result.rowCount === 0) {
      return fail(404, { message: 'Resume not found' });
    }

    return { ok: true };
  },
  delete: async ({ request }) => {
    const formData = await request.formData();
    const resumeIdRaw = String(formData.get('resumeId') ?? '');
    const resumeId = parseResumeId(resumeIdRaw);

    if (resumeId === null) {
      return fail(400, { message: 'Invalid resume id' });
    }

    const result = await db.query<{ id: number }>(
      `
      DELETE FROM resume
      WHERE id = $1 AND user_id = $2
      RETURNING id
      `,
      [resumeId, 0]
    );

    if (result.rowCount === 0) {
      return fail(404, { message: 'Resume not found' });
    }

    return { ok: true };
  },
  duplicate: async ({ request }) => {
    const formData = await request.formData();
    const resumeIdRaw = String(formData.get('resumeId') ?? '');
    const resumeId = parseResumeId(resumeIdRaw);

    if (resumeId === null) {
      return fail(400, { message: 'Invalid resume id' });
    }

    const client = await db.connect();
    try {
      await client.query('BEGIN');
      await client.query(`
        SELECT setval(pg_get_serial_sequence('resume', 'id'), COALESCE((SELECT MAX(id) FROM resume), 0), true);
        SELECT setval(pg_get_serial_sequence('section', 'id'), COALESCE((SELECT MAX(id) FROM section), 0), true);
        SELECT setval(pg_get_serial_sequence('section_item', 'id'), COALESCE((SELECT MAX(id) FROM section_item), 0), true);
        SELECT setval(pg_get_serial_sequence('bullet_point', 'id'), COALESCE((SELECT MAX(id) FROM bullet_point), 0), true);
      `);

      const sourceResume = await client.query<{
        id: number;
        title: string;
        summary: string | null;
      }>(
        `
        SELECT id, title, summary
        FROM resume
        WHERE id = $1 AND user_id = $2
        LIMIT 1
        `,
        [resumeId, 0]
      );

      if (sourceResume.rowCount === 0) {
        await client.query('ROLLBACK');
        return fail(404, { message: 'Resume not found' });
      }

      const source = sourceResume.rows[0];
      const newResumeResult = await client.query<{ id: number }>(
        `
        INSERT INTO resume (user_id, title, summary, created_at, updated_at)
        VALUES ($1, $2, $3, NOW(), NOW())
        RETURNING id
        `,
        [0, `${source.title} (Copy)`, source.summary]
      );
      const newResumeId = newResumeResult.rows[0].id;

      const sourceSections = await client.query<{
        id: number;
        title: string;
        type: string | null;
        item_order: number;
      }>(
        `
        SELECT id, title, type, item_order
        FROM section
        WHERE resume_id = $1
        ORDER BY item_order ASC, id ASC
        `,
        [source.id]
      );

      const sectionIdMap = new Map<number, number>();
      for (const section of sourceSections.rows) {
        const inserted = await client.query<{ id: number }>(
          `
          INSERT INTO section (resume_id, title, item_order, type)
          VALUES ($1, $2, $3, $4)
          RETURNING id
          `,
          [newResumeId, section.title, section.item_order, section.type]
        );
        sectionIdMap.set(section.id, inserted.rows[0].id);
      }

      for (const [oldSectionId, newSectionId] of sectionIdMap.entries()) {
        const sourceItems = await client.query<{
          label: string | null;
          value: string | null;
          start_date: string | null;
          end_date: string | null;
          location: string | null;
          description: string | null;
          item_order: number;
        }>(
          `
          SELECT label, value, start_date, end_date, location, description, item_order
          FROM section_item
          WHERE section_id = $1
          ORDER BY item_order ASC, id ASC
          `,
          [oldSectionId]
        );

        for (const item of sourceItems.rows) {
          await client.query(
            `
            INSERT INTO section_item (section_id, label, value, start_date, end_date, location, description, item_order)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `,
            [
              newSectionId,
              item.label,
              item.value,
              item.start_date,
              item.end_date,
              item.location,
              item.description,
              item.item_order,
            ]
          );
        }

        const sourceBullets = await client.query<{
          content: string;
          item_order: number;
        }>(
          `
          SELECT content, item_order
          FROM bullet_point
          WHERE section_id = $1
          ORDER BY item_order ASC, id ASC
          `,
          [oldSectionId]
        );

        for (const bullet of sourceBullets.rows) {
          await client.query(
            `
            INSERT INTO bullet_point (section_id, content, item_order)
            VALUES ($1, $2, $3)
            `,
            [newSectionId, bullet.content, bullet.item_order]
          );
        }
      }

      await client.query('COMMIT');
      return { ok: true, id: newResumeId };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },
};
