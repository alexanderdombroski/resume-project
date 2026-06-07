import { createDbClient } from './db';

export type ResumeListItem = {
  id: number;
  title: string;
  summary: string | null;
  createdAt: string;
  updatedAt: string;
};

type ResumeRow = {
  id: number;
  title: string;
  summary: string | null;
  created_at: string;
  updated_at: string;
};

export async function getResumesForUser(clerkUserId: string): Promise<ResumeListItem[]> {
  const db = createDbClient();
  const result = await db.execute(
    'SELECT id, title, summary, created_at, updated_at FROM resume WHERE clerk_user_id = ? ORDER BY updated_at DESC, created_at DESC, id DESC',
    [clerkUserId]
  );

  return (result.rows as unknown as ResumeRow[]).map((row) => ({
    id: Number(row.id),
    title: String(row.title),
    summary: row.summary,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}
