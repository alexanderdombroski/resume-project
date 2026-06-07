import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@tursodatabase/serverless/compat';
// node --env-file=".env" scripts/init-db.ts
// Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN for a Turso database.

function resolveDatabaseUrl() {
  const databaseUrl = process.env.TURSO_DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('Missing required env var: TURSO_DATABASE_URL');
  }

  return databaseUrl;
}

function resolveAuthToken() {
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!authToken) {
    throw new Error('Missing required env var: TURSO_AUTH_TOKEN');
  }

  return authToken;
}

function createDbClient() {
  return createClient({
    url: resolveDatabaseUrl(),
    authToken: resolveAuthToken(),
  });
}

function splitSqlStatements(input: string) {
  const statements: string[] = [];
  let current = '';
  let inSingleQuote = false;
  let inLineComment = false;

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    const next = input[i + 1];

    if (inLineComment) {
      current += char;
      if (char === '\n') {
        inLineComment = false;
      }
      continue;
    }

    if (!inSingleQuote && char === '-' && next === '-') {
      inLineComment = true;
      current += char + next;
      i += 1;
      continue;
    }

    if (char === "'") {
      current += char;
      if (inSingleQuote && next === "'") {
        current += next;
        i += 1;
      } else {
        inSingleQuote = !inSingleQuote;
      }
      continue;
    }

    if (char === ';' && !inSingleQuote) {
      const statement = current.trim();
      if (statement) {
        statements.push(statement);
      }
      current = '';
      continue;
    }

    current += char;
  }

  const finalStatement = current.trim();
  if (finalStatement) {
    statements.push(finalStatement);
  }

  return statements;
}

async function runSqlBatch(
  // eslint-disable-next-line no-unused-vars
  db: { batch: (statements: Array<{ sql: string }>, mode: 'write') => Promise<unknown> },
  sql: string
) {
  const statements = splitSqlStatements(sql);
  await db.batch(
    statements.map((statement) => ({ sql: statement })),
    'write'
  );
}

const sqlPath = path.join(import.meta.dirname, 'init-db.sql');
const sql = fs.readFileSync(sqlPath, 'utf-8');

try {
  const db = createDbClient();
  console.info('Initializing Turso database...');
  await runSqlBatch(db, sql);
  console.info('Database initialized successfully.');
} catch (err) {
  console.error('Error initializing database:', err);
  process.exit(1);
}
