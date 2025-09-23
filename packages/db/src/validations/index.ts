import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { companies } from '../schema/companies';
import { categories } from '../schema/categories';

const faqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const screenshotsSchema = z.array(z.string());
const alternativesSchema = z.array(z.number());
const topicsSchema = z.array(z.number());

export const selectCompanySchema = createSelectSchema(companies, {
  screenshots: screenshotsSchema.nullable(),
  alternatives: alternativesSchema.nullable(),
  topics: topicsSchema.nullable(),
});

export const insertCompanySchema = createInsertSchema(companies, {
  screenshots: screenshotsSchema.nullable(),
  alternatives: alternativesSchema.nullable(),
  topics: topicsSchema.nullable(),
});

export type Company = z.infer<typeof selectCompanySchema>;
export type NewCompany = z.infer<typeof insertCompanySchema>;

export const selectCategorySchema = createSelectSchema(categories, {
  faqs: z.array(faqSchema).nullable(),
});

export const insertCategorySchema = createInsertSchema(categories, {
  faqs: z.array(faqSchema).nullable(),
});

export type Category = z.infer<typeof selectCompanySchema>;
export type NewCategory = z.infer<typeof insertCategorySchema>;
