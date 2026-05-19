import pg from 'pg';
import { DATABASE_URI } from '$env/static/private';

const { Pool } = pg;

export const db = new Pool({
  connectionString: DATABASE_URI,
  ssl: import.meta.env.PROD,
  // Prevent indefinitely pending DB calls in Cloudflare Workers.
  connectionTimeoutMillis: 10_000,
  idleTimeoutMillis: 30_000,
  query_timeout: 15_000,
  statement_timeout: 15_000,
});
