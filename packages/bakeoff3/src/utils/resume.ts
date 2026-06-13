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

// Get a single resume by ID for a user
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

// Create a new resume for a user
export async function createResume(
  clerkUserId: string,
  data: { title: string; summary?: string | null }
): Promise<ResumeListItem> {
  const db = createDbClient();

  // Ensure the user exists in app_user table to satisfy foreign key constraints
  await db.execute('INSERT OR IGNORE INTO app_user (clerk_user_id) VALUES (?)', [clerkUserId]);

  const result = await db.execute(
    'INSERT INTO resume (clerk_user_id, title, summary) VALUES (?, ?, ?) RETURNING id, title, summary, created_at, updated_at',
    [clerkUserId, data.title, data.summary ?? null]
  );
  const row = (result.rows as unknown as ResumeRow[])[0];
  const resumeId = Number(row.id);

  // Insert default sections
  const sectionsResult = await db.execute(
    `INSERT INTO section (resume_id, title, item_order, type) VALUES 
      (?, 'Experience', 1, 'experience'),
      (?, 'Education', 2, 'education'),
      (?, 'Skills', 3, 'skills')
     RETURNING id, title`,
    [resumeId, resumeId, resumeId]
  );

  const sections = sectionsResult.rows as unknown as { id: number; title: string }[];
  const expSection = sections.find((s) => s.title === 'Experience');
  const eduSection = sections.find((s) => s.title === 'Education');
  const skillsSection = sections.find((s) => s.title === 'Skills');

  if (expSection) {
    await db.execute(
      `INSERT INTO section_item (section_id, label, value, start_date, location, description, item_order) VALUES
        (?, 'Software Engineer', 'Example Corp', '2020-01-01', 'Remote', 'Worked on scalable backend systems.', 1)
       RETURNING id`,
      [expSection.id]
    );
    await db.execute(
      `INSERT INTO bullet_point (section_id, content, item_order) VALUES
        (?, 'Developed REST APIs using Node.js and TypeScript.', 1),
        (?, 'Improved database query performance by 20%.', 2)`,
      [expSection.id, expSection.id]
    );
  }

  if (eduSection) {
    await db.execute(
      `INSERT INTO section_item (section_id, label, value, start_date, end_date, location, item_order) VALUES
        (?, 'B.S. Computer Science', 'State University', '2016-08-01', '2020-05-01', 'City, ST', 1)`,
      [eduSection.id]
    );
  }

  if (skillsSection) {
    await db.execute(
      `INSERT INTO bullet_point (section_id, content, item_order) VALUES
        (?, 'JavaScript, TypeScript, React, Node.js', 1)`,
      [skillsSection.id]
    );
  }

  return {
    id: resumeId,
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
