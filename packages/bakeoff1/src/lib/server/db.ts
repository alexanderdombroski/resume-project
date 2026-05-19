import pg from 'pg';
import { DATABASE_URI } from '$env/static/private';

const { Pool } = pg;
type PoolClient = pg.PoolClient;

export async function withDbClient<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const db = new Pool({
    connectionString: DATABASE_URI,
    ssl: import.meta.env.PROD,
  });
  const client = await db.connect();
  try {
    return await fn(client);
  } finally {
    client.release();
    db.end();
  }
}
