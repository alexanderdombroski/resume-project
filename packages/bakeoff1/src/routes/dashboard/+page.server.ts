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
};
