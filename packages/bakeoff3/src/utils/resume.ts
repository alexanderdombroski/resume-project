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

export async function getResumeById(
  clerkUserId: string,
  resumeId: number
): Promise<ResumeListItem | null> {
  const db = createDbClient();
  const result = await db.execute(
    'SELECT id, title, summary, created_at, updated_at FROM resume WHERE clerk_user_id = ? AND id = ?',
    [clerkUserId, resumeId]
  );
  const rows = result.rows as unknown as ResumeRow[];
  if (rows.length === 0) return null;
  const row = rows[0];
  return {
    id: Number(row.id),
    title: String(row.title),
    summary: row.summary,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getFullResumeById(
  clerkUserId: string,
  resumeId: number
): Promise<any | null> {
  const db = createDbClient();
  const resumeResult = await db.execute(
    'SELECT id, title, summary, created_at, updated_at FROM resume WHERE clerk_user_id = ? AND id = ?',
    [clerkUserId, resumeId]
  );
  const resumeRows = resumeResult.rows;
  if (resumeRows.length === 0) return null;
  const resumeRow = resumeRows[0];

  const sectionsResult = await db.execute(
    'SELECT id, title, item_order, type FROM section WHERE resume_id = ? ORDER BY item_order ASC, id ASC',
    [resumeId]
  );

  const sections = [];
  for (const secRow of sectionsResult.rows) {
    const secId = Number(secRow.id);

    const itemsResult = await db.execute(
      'SELECT id, section_id, label, value, start_date, end_date, location, description, item_order FROM section_item WHERE section_id = ? ORDER BY item_order ASC, id ASC',
      [secId]
    );

    const bulletsResult = await db.execute(
      'SELECT id, section_id, content, item_order FROM bullet_point WHERE section_id = ? ORDER BY item_order ASC, id ASC',
      [secId]
    );

    sections.push({
      id: secId,
      title: String(secRow.title),
      item_order: Number(secRow.item_order),
      type: secRow.type ? String(secRow.type) : null,
      items: itemsResult.rows.map((row: any) => ({
        id: Number(row.id),
        section_id: Number(row.section_id),
        label: row.label ? String(row.label) : null,
        value: row.value ? String(row.value) : null,
        start_date: row.start_date ? String(row.start_date) : null,
        end_date: row.end_date ? String(row.end_date) : null,
        location: row.location ? String(row.location) : null,
        description: row.description ? String(row.description) : null,
        item_order: Number(row.item_order),
      })),
      bullets: bulletsResult.rows.map((row: any) => ({
        id: Number(row.id),
        section_id: Number(row.section_id),
        content: String(row.content),
        item_order: Number(row.item_order),
      })),
    });
  }

  return {
    id: Number(resumeRow.id),
    title: String(resumeRow.title),
    summary: resumeRow.summary ? String(resumeRow.summary) : null,
    createdAt: String(resumeRow.created_at),
    updatedAt: String(resumeRow.updated_at),
    sections,
  };
}

// Create a new resume for a user
export async function createResume(
  clerkUserId: string,
  data: { title: string; summary?: string | null }
): Promise<ResumeListItem> {
  const db = createDbClient();
  const result = await db.execute(
    'INSERT INTO resume (clerk_user_id, title, summary) VALUES (?, ?, ?) RETURNING id, title, summary, created_at, updated_at',
    [clerkUserId, data.title, data.summary ?? null]
  );
  const row = (result.rows as unknown as ResumeRow[])[0];
  return {
    id: Number(row.id),
    title: String(row.title),
    summary: row.summary,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Update an existing resume
export async function updateResume(
  clerkUserId: string,
  resumeId: number,
  data: { title?: string; summary?: string | null }
): Promise<number> {
  const db = createDbClient();
  const fields: string[] = [];
  const values: any[] = [];
  if (data.title !== undefined) {
    fields.push('title = ?');
    values.push(data.title);
  }
  if (data.summary !== undefined) {
    fields.push('summary = ?');
    values.push(data.summary);
  }
  if (fields.length === 0) return 0;
  const setClause = fields.join(', ');
  const sql = `UPDATE resume SET ${setClause} WHERE clerk_user_id = ? AND id = ?`;
  values.push(clerkUserId, resumeId);
  const result = await db.execute(sql, values);
  // result.changes may not be available with this client; return affected rows count if possible
  return (result as any).changes ?? 0;
}

// Delete a resume
export async function deleteResume(clerkUserId: string, resumeId: number): Promise<number> {
  const db = createDbClient();
  const result = await db.execute('DELETE FROM resume WHERE clerk_user_id = ? AND id = ?', [
    clerkUserId,
    resumeId,
  ]);
  return (result as any).changes ?? 0;
}
