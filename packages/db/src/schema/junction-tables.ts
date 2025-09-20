import { pgTable, serial, integer, timestamp, unique } from 'drizzle-orm/pg-core';
import { companies } from './companies';
import { categories } from './categories';

export const companyCategories = pgTable('company_categories', {
  id: serial('id').primaryKey(),
  companyId: integer('company_id').notNull().references(() => companies.id, { onDelete: 'cascade' }),
  categoryId: integer('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [unique().on(t.companyId, t.categoryId)]);
