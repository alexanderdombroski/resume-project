import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';

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

  const resumeResult = await db.query<ResumeRow>(
    `
      SELECT id, user_id, title, summary, created_at, updated_at
      FROM resume
      WHERE id = $1 AND user_id = $2
      LIMIT 1
    `,
    [parsedResumeId, 0]
  );

  const resume = resumeResult.rows[0];
  if (!resume) {
    throw error(404, `Resume ${parsedResumeId} not found for user 0`);
  }

  const sectionsResult = await db.query<SectionRow>(
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
      db.query<SectionItemRow>(
        `
          SELECT id, section_id, label, value, start_date, end_date, location, description, item_order
          FROM section_item
          WHERE section_id = ANY($1::int[])
          ORDER BY section_id ASC, item_order ASC, id ASC
        `,
        [sectionIds]
      ),
      db.query<BulletRow>(
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
};
