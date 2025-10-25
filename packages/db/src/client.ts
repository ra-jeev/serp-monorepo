import { drizzle } from 'drizzle-orm/node-postgres';

let db: ReturnType<typeof drizzle> | null = null;

export function initializeDb(connectionString: string) {
  db = drizzle(connectionString);
}

export function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDb first.');
  }

  return db;
}
