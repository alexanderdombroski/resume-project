import type { PageServerLoad } from './$types';
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

export const load: PageServerLoad = async () => {
  const result = await db.query<{
    id: number;
    title: string;
    createdat: string;
    updatedat: string;
    section_types: string[] | null;
  }>(
    `
    SELECT
      r.id,
      r.title,
      r.createdat,
      r.updatedat,
      ARRAY_REMOVE(ARRAY_AGG(DISTINCT s.type), NULL) AS section_types
    FROM "RESUME" r
    LEFT JOIN "SECTION" s ON s.resumeid = r.id
    WHERE r.userid = $1
    GROUP BY r.id
    ORDER BY r.updatedat DESC
  `,
    [0]
  );

  const resumes: DashboardResume[] = result.rows.map((row, index) => ({
    id: `rsm-${String(row.id).padStart(3, '0')}`,
    title: row.title,
    kind: index === 0 ? 'cv' : 'standard',
    lastUpdated: formatDate(row.updatedat),
    createdAt: formatDate(row.createdat),
    tags: (row.section_types ?? []).map((type) =>
      type
        .split(/[_\s-]+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    ),
  }));

  return { resumes };
};
