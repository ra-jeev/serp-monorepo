import { relations } from 'drizzle-orm';
import { companies } from './companies';
import { categories } from './categories';
import { companyCategories } from './junction-tables';

export const companyRelations = relations(companies, ({ many }) => ({
  companyCategories: many(companyCategories),
}));

export const categoryRelations = relations(categories, ({ many }) => ({
  companyCategories: many(companyCategories),
}));

export const companyCategoryRelations = relations(companyCategories, ({ one }) => ({
  company: one(companies, {
    fields: [companyCategories.companyId],
    references: [companies.id],
  }),
  category: one(categories, {
    fields: [companyCategories.categoryId],
    references: [categories.id],
  }),
}));
