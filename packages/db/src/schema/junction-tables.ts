import { pgTable, integer, primaryKey } from 'drizzle-orm/pg-core';
import { companies } from './companies';
import { categories } from './categories';

export const companyCategories = pgTable('company_categories', {
  companyId: integer('company_id').notNull().references(() => companies.id, { onDelete: 'cascade' }),
  categoryId: integer('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
}, (t) => ({
  pk: primaryKey({ columns: [t.companyId, t.categoryId] }),
}));
