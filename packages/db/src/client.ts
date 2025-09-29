import { drizzle } from 'drizzle-orm/node-postgres';

let globalDb: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  if (!globalDb) {
    globalDb = drizzle(process.env.DATABASE_URL);
  }

  return globalDb;
}
