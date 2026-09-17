const DEFAULT_PORT = 3001;

const DEFAULT_CORS_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
  'https://nduchan1.github.io',
];

function readPort(raw: string | undefined): number {
  const port = Number(raw);
  return Number.isInteger(port) && port > 0 ? port : DEFAULT_PORT;
}

function readDatabaseUrl(raw: string | undefined): string {
  const url = raw?.trim();
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. Copy .env.example to .env and fill in the PostgreSQL connection string.',
    );
  }
  return url;
}

function readCorsOrigins(raw: string | undefined): string[] {
  const origins = (raw ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
  return origins.length > 0 ? origins : DEFAULT_CORS_ORIGINS;
}

export const config = {
  port: readPort(process.env.PORT),
  databaseUrl: readDatabaseUrl(process.env.DATABASE_URL),
  corsOrigins: readCorsOrigins(process.env.CORS_ORIGINS),
};
