import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

let pool: Pool | undefined = undefined;

export const getDb = () => {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  return drizzle(pool);
};

export const getData = (fileName: string) => {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const categoriesPath = path.resolve(__dirname, fileName);
    return JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'));
  } catch (error) {
    console.error(`Failed to read ${fileName}:`, error);
    throw error;
  }
};

export const closeDb = async () => {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
};

export const sanitizeSlug = (slug: string): string => {
  return slug
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};
