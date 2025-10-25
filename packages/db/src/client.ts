import { drizzle } from 'drizzle-orm/node-postgres';

let db: ReturnType<typeof drizzle> | null = null;
let currentConnectionString: string | null = null;

export function initializeDb(connectionString: string) {
  if (currentConnectionString !== connectionString) {
    db = drizzle(connectionString);
    currentConnectionString = connectionString;
  }
}

export function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDb first.');
  }

  return db;
}
