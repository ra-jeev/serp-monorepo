import {
  pgTable,
  jsonb,
  serial,
  text,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  entityType: varchar('entity_type', { length: 50 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  faqs: jsonb('faqs'),
  buyingGuide: text('buying_guide'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => sql`NOW()`),
}, (t) => [unique().on(t.entityType, t.slug)]);
