import { pgTable, serial, timestamp, varchar, text, jsonb, boolean } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const companies = pgTable('companies', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  sourceId: varchar('source_id', { length: 255 }),
  name: varchar('name', { length: 255 }).notNull(),
  logo: varchar('logo', { length: 500 }),
  domain: varchar('domain', { length: 255 }),
  excerpt: text('excerpt'),
  oneLiner: varchar('one_liner', { length: 500 }),
  serplyLink: varchar('serply_link', { length: 255 }),
  content: text('content'),
  videoId: varchar('video_id', { length: 255 }),
  screenshots: jsonb('screenshots'),
  alternatives: jsonb('alternatives'),
  topics: jsonb('topics'),
  searchText: text('search_text'),
  needsSourceSync: boolean('needs_source_sync').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => sql`NOW()`),
});
