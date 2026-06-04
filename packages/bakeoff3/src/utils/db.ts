import { createClient } from '@tursodatabase/serverless/compat';

export function resolveDatabaseUrl() {
  return process.env.TURSO_DATABASE_URL;
}

export function createDbClient() {
  const databaseUrl = resolveDatabaseUrl();
  if (!databaseUrl) {
    throw new Error('Missing required env var: TURSO_DATABASE_URL');
  }

  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!authToken) {
    throw new Error('Missing required env var: TURSO_AUTH_TOKEN');
  }

  return createClient({ url: databaseUrl, authToken });
}

export function splitSqlStatements(input: string) {
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

// eslint-disable-next-line no-unused-vars -- TypeScript requires parameter names in function types.
type BatchWriter = (statements: Array<{ sql: string }>) => Promise<unknown>;

export async function runSqlBatch(db: { batch: BatchWriter }, sql: string) {
  const statements = splitSqlStatements(sql);
  await db.batch(
    statements.map((statement) => ({ sql: statement })),
    'write'
  );
}
