import fs from 'fs';
import path from 'path';
// @ts-ignore
import { createDbClient, runSqlBatch } from '../src/utils/db.ts';

// node --env-file=".env" scripts/init-db.ts
// Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN for a Turso database.

const sqlPath = path.join(import.meta.dirname, 'init-db.sql');
const sql = fs.readFileSync(sqlPath, 'utf-8');
const db = createDbClient();

try {
  console.info('Initializing Turso database...');
  await runSqlBatch(db, sql);
  console.info('Database initialized successfully.');
} catch (err) {
  console.error('Error initializing database:', err);
  process.exit(1);
}
