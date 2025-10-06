import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { companies } from '../schema/companies';
import { categories } from '../schema/categories';
import { posts } from '../schema/posts';
import { tags } from '../schema/tags';

const faqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const screenshotsSchema = z.array(z.string());

export const selectCompanySchema = createSelectSchema(companies, {
  screenshots: screenshotsSchema.nullable(),
});

export const insertCompanySchema = createInsertSchema(companies, {
  screenshots: screenshotsSchema.nullable(),
});

export const selectCategorySchema = createSelectSchema(categories, {
  faqs: z.array(faqSchema).nullable(),
});

export const insertCategorySchema = createInsertSchema(categories, {
  faqs: z.array(faqSchema).nullable(),
});

export const selectTagSchema = createSelectSchema(tags);
export const insertTagSchema = createInsertSchema(tags);

export const selectPostSchema = createSelectSchema(posts);
export const insertPostSchema = createInsertSchema(posts);

export type Company = z.infer<typeof selectCompanySchema>;
export type NewCompany = z.infer<typeof insertCompanySchema>;
export type Category = z.infer<typeof selectCategorySchema>;
export type NewCategory = z.infer<typeof insertCategorySchema>;
export type Tag = z.infer<typeof selectTagSchema>;
export type NewTag = z.infer<typeof insertTagSchema>;
export type Post = z.infer<typeof selectPostSchema>;
export type NewPost = z.infer<typeof insertPostSchema>;
