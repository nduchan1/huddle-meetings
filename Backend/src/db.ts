import { Pool, type QueryResultRow } from 'pg';
import { config } from './config.js';

const pool = new Pool({
  connectionString: config.databaseUrl,
  max: 5,
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 10_000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on an idle database connection', err);
});

export async function query<T extends QueryResultRow>(text: string, params: unknown[] = []): Promise<T[]> {
  const result = await pool.query<T>(text, params);
  return result.rows;
}

export async function closePool(): Promise<void> {
  await pool.end();
}
