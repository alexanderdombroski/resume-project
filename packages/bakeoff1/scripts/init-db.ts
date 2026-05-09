import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

// node --env-file=.env scripts/init-db.ts

const pool = new Pool({
  connectionString: process.env.DATABASE_URI,
});

const sqlPath = path.join(import.meta.dirname, 'init-db.sql');
const sql = fs.readFileSync(sqlPath, 'utf-8');

try {
  console.log('Initializing database...');

  await pool.query(sql);

  console.log('Database initialized successfully.');
} catch (err) {
  console.error('Error initializing database:', err);
  process.exit(1);
} finally {
  await pool.end();
}
