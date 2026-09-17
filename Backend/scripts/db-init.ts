import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config as loadEnv } from 'dotenv';
import { Client } from 'pg';

loadEnv({ quiet: true });

const DATABASE_DIR = fileURLToPath(new URL('../../Database', import.meta.url));

const connectionString = process.env.DATABASE_URL?.trim();
if (!connectionString) {
  console.error('DATABASE_URL is not set. Copy .env.example to .env and fill in the PostgreSQL connection string.');
  process.exit(1);
}

const skipSeed = process.argv.includes('--no-seed');
const client = new Client({ connectionString });

async function runSqlFile(fileName: string): Promise<void> {
  const sql = await readFile(path.join(DATABASE_DIR, fileName), 'utf8');
  await client.query(sql);
  console.log(`Applied Database/${fileName}`);
}

async function printCounts(): Promise<void> {
  const { rows } = await client.query<{ teams: number; meetings: number }>(
    'SELECT (SELECT count(*)::int FROM teams) AS teams, (SELECT count(*)::int FROM meetings) AS meetings',
  );
  console.log(`Database now holds ${rows[0].teams} teams and ${rows[0].meetings} meetings`);
}

await client.connect();
try {
  await runSqlFile('schema.sql');
  if (skipSeed) {
    console.log('Skipped Database/seed.sql (--no-seed)');
  } else {
    await runSqlFile('seed.sql');
  }
  await printCounts();
} finally {
  await client.end();
}
