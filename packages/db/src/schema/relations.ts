import { relations } from 'drizzle-orm';
import { companies } from './companies';
import { categories } from './categories';
import { posts } from './posts';
import { tags } from './tags';
import {
  companyCategories,
  companyAlternatives,
  companyTags,
  postCategories,
  postTags,
  relatedPosts,
} from './junction-tables';

export const companyRelations = relations(companies, ({ many }) => ({
  companyCategories: many(companyCategories),
  companyTags: many(companyTags),
  alternatives: many(companyAlternatives, { relationName: 'alternatives' }),
}));

export const categoryRelations = relations(categories, ({ many }) => ({
  categoryCompanies: many(companyCategories),
  categoryPosts: many(postCategories),
}));

export const postRelations = relations(posts, ({ many }) => ({
  postCategories: many(postCategories),
  postTags: many(postTags),
  relatedPosts: many(relatedPosts),
}));

export const tagRelations = relations(tags, ({ many }) => ({
  tagCompanies: many(companyTags),
  tagPosts: many(postTags),
}));

export const companyCategoryRelations = relations(
  companyCategories,
  ({ one }) => ({
    company: one(companies, {
      fields: [companyCategories.companyId],
      references: [companies.id],
    }),
    category: one(categories, {
      fields: [companyCategories.categoryId],
      references: [categories.id],
    }),
  }),
);

export const companyAlternativeRelations = relations(
  companyAlternatives,
  ({ one }) => ({
    company: one(companies, {
      fields: [companyAlternatives.companyId],
      references: [companies.id],
    }),
    alternative: one(companies, {
      fields: [companyAlternatives.alternativeId],
      references: [companies.id],
    }),
  }),
);

export const companyTagRelations = relations(companyTags, ({ one }) => ({
  company: one(companies, {
    fields: [companyTags.companyId],
    references: [companies.id],
  }),
  tag: one(tags, {
    fields: [companyTags.tagId],
    references: [tags.id],
  }),
}));

export const postCategoryRelations = relations(postCategories, ({ one }) => ({
  post: one(posts, {
    fields: [postCategories.postId],
    references: [posts.id],
  }),
  category: one(categories, {
    fields: [postCategories.categoryId],
    references: [categories.id],
  }),
}));

export const postTagRelations = relations(postTags, ({ one }) => ({
  post: one(posts, {
    fields: [postTags.postId],
    references: [posts.id],
  }),
  tag: one(tags, {
    fields: [postTags.tagId],
    references: [tags.id],
  }),
}));

export const relatedPostRelations = relations(relatedPosts, ({ one }) => ({
  post: one(posts, {
    fields: [relatedPosts.postId],
    references: [posts.id],
  }),
  relatedPost: one(posts, {
    fields: [relatedPosts.relatedPostId],
    references: [posts.id],
  }),
}));
