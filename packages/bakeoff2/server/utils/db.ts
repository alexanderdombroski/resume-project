import { MongoClient, type Db } from 'mongodb';

export async function withDB<T>(operation: (db: Db) => Promise<T>): Promise<T> {
  const config = useRuntimeConfig();
  const mongoUri = config.mongoUri;

  if (!mongoUri) {
    throw new Error('Missing runtime config: mongoUri (set MONGO_URI).');
  }

  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    const db = client.db();
    return await operation(db);
  } finally {
    await client.close();
  }
}
