import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { withDbClient } from '$lib/server/db';

const DEFAULT_USER_ID = 1;

type ResumeRow = {
  id: number;
  user_id: number;
  title: string;
  summary: string | null;
  created_at: string;
  updated_at: string;
};

type SectionRow = {
  id: number;
  resume_id: number;
  title: string;
  type: string | null;
  item_order: number;
};

type SectionItemRow = {
  id: number;
  section_id: number;
  label: string | null;
  value: string | null;
  start_date: string | null;
  end_date: string | null;
  location: string | null;
  description: string | null;
  item_order: number;
};

type BulletRow = {
  id: number;
  section_id: number;
  content: string;
  item_order: number;
};

type SaveSectionPayload = {
  id: number;
  items: Array<{
    id: number;
    label: string | null;
    value: string | null;
    start_date: string | null;
    end_date: string | null;
    location: string | null;
    description: string | null;
    item_order: number;
  }>;
  bullets: Array<{
    id: number;
    content: string;
    item_order: number;
  }>;
};

function parseResumeId(raw: string | null): number | null {
  if (!raw) return null;

  const trimmed = raw.trim();
  const prefixed = /^rsm-(\d+)$/i.exec(trimmed);
  const numeric = /^\d+$/.test(trimmed);

  const value = prefixed ? prefixed[1] : numeric ? trimmed : null;
  if (!value) return null;

  const id = Number(value);
  if (!Number.isInteger(id) || id < 0) return null;
  return id;
}

export const load: PageServerLoad = async ({ url }) => {
  const parsedResumeId = parseResumeId(url.searchParams.get('resumeId'));

  if (parsedResumeId === null) {
    return {
      mode: 'create' as const,
      resume: null,
    };
  }

  return withDbClient(async (client) => {
    const resumeResult = await client.query<ResumeRow>(
      `
      SELECT id, user_id, title, summary, created_at, updated_at
      FROM resume
      WHERE id = $1 AND user_id = $2
      LIMIT 1
    `,
      [parsedResumeId, DEFAULT_USER_ID]
    );

    const resume = resumeResult.rows[0];
    if (!resume) {
      throw error(404, `Resume ${parsedResumeId} not found for user ${DEFAULT_USER_ID}`);
    }

    const sectionsResult = await client.query<SectionRow>(
      `
      SELECT id, resume_id, title, type, item_order
      FROM section
      WHERE resume_id = $1
      ORDER BY item_order ASC, id ASC
    `,
      [resume.id]
    );

    const sectionIds = sectionsResult.rows.map((section) => section.id);

    let sectionItems: SectionItemRow[] = [];
    let bullets: BulletRow[] = [];

    if (sectionIds.length > 0) {
      const [itemsResult, bulletsResult] = await Promise.all([
        client.query<SectionItemRow>(
          `
          SELECT id, section_id, label, value, start_date, end_date, location, description, item_order
          FROM section_item
          WHERE section_id = ANY($1::int[])
          ORDER BY section_id ASC, item_order ASC, id ASC
        `,
          [sectionIds]
        ),
        client.query<BulletRow>(
          `
          SELECT id, section_id, content, item_order
          FROM bullet_point
          WHERE section_id = ANY($1::int[])
          ORDER BY section_id ASC, item_order ASC, id ASC
        `,
          [sectionIds]
        ),
      ]);

      sectionItems = itemsResult.rows;
      bullets = bulletsResult.rows;
    }

    const itemsBySection = new Map<number, SectionItemRow[]>();
    for (const item of sectionItems) {
      const list = itemsBySection.get(item.section_id) ?? [];
      list.push(item);
      itemsBySection.set(item.section_id, list);
    }

    const bulletsBySection = new Map<number, BulletRow[]>();
    for (const bullet of bullets) {
      const list = bulletsBySection.get(bullet.section_id) ?? [];
      list.push(bullet);
      bulletsBySection.set(bullet.section_id, list);
    }

    return {
      mode: 'edit' as const,
      resume: {
        id: resume.id,
        userId: resume.user_id,
        title: resume.title,
        summary: resume.summary,
        createdAt: resume.created_at,
        updatedAt: resume.updated_at,
        sections: sectionsResult.rows.map((section) => ({
          id: section.id,
          title: section.title,
          type: section.type,
          order: section.item_order,
          items: itemsBySection.get(section.id) ?? [],
          bullets: bulletsBySection.get(section.id) ?? [],
        })),
      },
    };
  });
};

export const actions: Actions = {
  save: async ({ request }) => {
    const formData = await request.formData();
    const resumeId = parseResumeId(String(formData.get('resumeId') ?? ''));
    const title = String(formData.get('title') ?? '').trim();
    const summaryRaw = String(formData.get('summary') ?? '');
    const summary = summaryRaw.trim().length > 0 ? summaryRaw.trim() : null;
    const sectionsRaw = String(formData.get('sections') ?? '[]');

    if (resumeId === null) {
      return fail(400, { message: 'Invalid resume id' });
    }

    if (!title) {
      return fail(400, { message: 'Resume title is required' });
    }

    let sections: SaveSectionPayload[];
    try {
      sections = JSON.parse(sectionsRaw) as SaveSectionPayload[];
    } catch {
      return fail(400, { message: 'Invalid sections payload' });
    }

    if (!Array.isArray(sections)) {
      return fail(400, { message: 'Invalid sections payload' });
    }

    return withDbClient(async (client) => {
      try {
        await client.query('BEGIN');

        const resumeUpdate = await client.query<{ id: number }>(
          `
          UPDATE resume
          SET title = $1, summary = $2, updated_at = NOW()
          WHERE id = $3 AND user_id = $4
          RETURNING id
        `,
          [title, summary, resumeId, DEFAULT_USER_ID]
        );

        if (resumeUpdate.rowCount === 0) {
          await client.query('ROLLBACK');
          return fail(404, { message: 'Resume not found' });
        }

        const sectionIds = sections.map((section) => section.id);
        const validSectionIdsResult = await client.query<{ id: number }>(
          `
          SELECT s.id
          FROM section s
          JOIN resume r ON r.id = s.resume_id
          WHERE r.id = $1 AND r.user_id = $2 AND s.id = ANY($3::int[])
        `,
          [resumeId, DEFAULT_USER_ID, sectionIds]
        );
        const validSectionIds = new Set(validSectionIdsResult.rows.map((row) => row.id));

        for (const section of sections) {
          if (!validSectionIds.has(section.id)) continue;

          for (const [idx, item] of section.items.entries()) {
            if (item.id <= 0) continue;

            await client.query(
              `
              UPDATE section_item si
              SET
                label = $1,
                value = $2,
                start_date = $3,
                end_date = $4,
                location = $5,
                description = $6,
                item_order = $7
              FROM section s
              WHERE
                si.id = $8
                AND si.section_id = s.id
                AND s.id = $9
            `,
              [
                item.label?.trim() || null,
                item.value?.trim() || null,
                item.start_date?.trim() || null,
                item.end_date?.trim() || null,
                item.location?.trim() || null,
                item.description?.trim() || null,
                Number.isInteger(item.item_order) ? item.item_order : idx,
                item.id,
                section.id,
              ]
            );
          }

          const persistedBulletIds = section.bullets
            .filter((bullet) => bullet.id > 0)
            .map((bullet) => bullet.id);
          await client.query(
            `
            DELETE FROM bullet_point
            WHERE section_id = $1
              AND id NOT IN (
                SELECT unnest($2::int[])
              )
          `,
            [section.id, persistedBulletIds.length > 0 ? persistedBulletIds : [0]]
          );

          for (const [idx, bullet] of section.bullets.entries()) {
            const content = bullet.content.trim();
            if (!content) continue;

            const itemOrder = Number.isInteger(bullet.item_order) ? bullet.item_order : idx;
            if (bullet.id > 0) {
              await client.query(
                `
                UPDATE bullet_point
                SET content = $1, item_order = $2
                WHERE id = $3 AND section_id = $4
              `,
                [content, itemOrder, bullet.id, section.id]
              );
            } else {
              await client.query(
                `
                INSERT INTO bullet_point (section_id, content, item_order)
                VALUES ($1, $2, $3)
              `,
                [section.id, content, itemOrder]
              );
            }
          }
        }

        await client.query('COMMIT');
        return { success: true };
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      }
    });
  },
};
