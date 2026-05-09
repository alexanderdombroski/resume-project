import pg from 'pg';
import { DATABASE_URI } from '$env/static/private';

const { Pool } = pg;

export const db = new Pool({
  connectionString: DATABASE_URI,
});
