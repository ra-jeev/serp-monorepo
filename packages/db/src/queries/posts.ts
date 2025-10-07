import { eq, ilike, desc, asc, count, and, inArray } from 'drizzle-orm';
import { z } from 'zod';
import { getDb } from '../client';
import { posts } from '../schema/posts';
import { categories } from '../schema/categories';
import { tags } from '../schema/tags';
import {
  postCategories,
  postTags,
  relatedPosts,
} from '../schema/junction-tables';
import {
  selectPostSchema,
  selectCategorySchema,
  selectTagSchema,
} from '../validations';

export const postCategoryResultSchema = selectCategorySchema.pick({
  id: true,
  name: true,
  slug: true,
  entityType: true,
});
export type PostCategoryResult = z.infer<typeof postCategoryResultSchema>;

export const postTagResultSchema = selectTagSchema.pick({
  id: true,
  name: true,
  slug: true,
});
export type PostTagResult = z.infer<typeof postTagResultSchema>;

export const postTypes = z.enum(['blog', 'glossary']);
export type PostType = z.infer<typeof postTypes>;

export const postSortOptions = z.enum([
  'name-asc',
  'name-desc',
  'recent',
  'updated',
]);

export type PostSortOption = z.infer<typeof postSortOptions>;

export const postFiltersSchema = z.object({
  type: postTypes.optional(),
  categorySlug: z.string().optional(),
  tagSlug: z.string().optional(),
  nameQuery: z.string().optional(),
  sortBy: postSortOptions.default('recent'),
  limit: z.number().int().positive().default(50),
  offset: z.number().int().nonnegative().default(0),
});
export type PostFilters = z.input<typeof postFiltersSchema>;

export const postResultSchema = selectPostSchema.pick({
  id: true,
  slug: true,
  name: true,
  type: true,
  image: true,
  author: true,
  excerpt: true,
  featuredImage: true,
  createdAt: true,
  updatedAt: true,
});

export type PostResult = z.infer<typeof postResultSchema>;

export type PostQueryResult = {
  posts: PostResult[];
  total: number;
  hasMore: boolean;
};

const postSelectFields = {
  id: posts.id,
  slug: posts.slug,
  name: posts.name,
  type: posts.type,
  image: posts.image,
  author: posts.author,
  excerpt: posts.excerpt,
  featuredImage: posts.featuredImage,
  createdAt: posts.createdAt,
  updatedAt: posts.updatedAt,
};

export async function findPosts(
  filters: PostFilters = {},
): Promise<PostQueryResult> {
  const db = getDb();

  const { type, categorySlug, tagSlug, nameQuery, sortBy, limit, offset } =
    postFiltersSchema.parse(filters);

  let query = db.select(postSelectFields).from(posts).$dynamic();
  let countQuery = db.select({ count: count() }).from(posts).$dynamic();

  if (type) {
    query = query.where(eq(posts.type, type));
    countQuery = countQuery.where(eq(posts.type, type));
  }

  if (categorySlug) {
    query = query
      .innerJoin(postCategories, eq(posts.id, postCategories.postId))
      .innerJoin(categories, eq(postCategories.categoryId, categories.id))
      .where(eq(categories.slug, categorySlug));

    countQuery = countQuery
      .innerJoin(postCategories, eq(posts.id, postCategories.postId))
      .innerJoin(categories, eq(postCategories.categoryId, categories.id))
      .where(eq(categories.slug, categorySlug));
  }

  if (tagSlug) {
    query = query
      .innerJoin(postTags, eq(posts.id, postTags.postId))
      .innerJoin(tags, eq(postTags.tagId, tags.id))
      .where(eq(tags.slug, tagSlug));

    countQuery = countQuery
      .innerJoin(postTags, eq(posts.id, postTags.postId))
      .innerJoin(tags, eq(postTags.tagId, tags.id))
      .where(eq(tags.slug, tagSlug));
  }

  if (nameQuery) {
    const sanitizedQuery = nameQuery.replace(/[%_]/g, '\\$&');
    const nameCondition = ilike(posts.name, `%${sanitizedQuery}%`);

    const conditions = [];
    if (type) conditions.push(eq(posts.type, type));
    if (categorySlug) conditions.push(eq(categories.slug, categorySlug));
    if (tagSlug) conditions.push(eq(tags.slug, tagSlug));
    conditions.push(nameCondition);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
      countQuery = countQuery.where(and(...conditions));
    }
  }

  switch (sortBy) {
    case 'name-desc':
      query = query.orderBy(desc(posts.name));
      break;
    case 'name-asc':
      query = query.orderBy(asc(posts.name));
      break;
    case 'updated':
      query = query.orderBy(desc(posts.updatedAt));
      break;
    case 'recent':
    default:
      query = query.orderBy(desc(posts.createdAt));
      break;
  }

  query = query.limit(limit).offset(offset);

  const [postsResult, totalResult] = await Promise.all([
    query.execute(),
    countQuery.execute(),
  ]);

  const total = totalResult[0]?.count || 0;
  const hasMore = offset + limit < total;

  return {
    posts: postsResult,
    total,
    hasMore,
  };
}

export async function findPostBySlug(slug: string) {
  const db = getDb();

  const result = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1);

  if (!result[0]) {
    return null;
  }

  return selectPostSchema.parse(result[0]);
}

export async function findPostCategories(
  postId: number,
): Promise<PostCategoryResult[]> {
  const db = getDb();

  return db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      entityType: categories.entityType,
    })
    .from(categories)
    .innerJoin(postCategories, eq(categories.id, postCategories.categoryId))
    .where(eq(postCategories.postId, postId))
    .orderBy(asc(categories.name));
}

export async function findPostTags(postId: number): Promise<PostTagResult[]> {
  const db = getDb();

  return db
    .select({
      id: tags.id,
      name: tags.name,
      slug: tags.slug,
    })
    .from(tags)
    .innerJoin(postTags, eq(tags.id, postTags.tagId))
    .where(eq(postTags.postId, postId))
    .orderBy(asc(tags.name));
}

export async function findRelatedPosts(postId: number): Promise<PostResult[]> {
  const db = getDb();

  return db
    .select(postSelectFields)
    .from(posts)
    .innerJoin(relatedPosts, eq(posts.id, relatedPosts.relatedPostId))
    .where(eq(relatedPosts.postId, postId))
    .orderBy(asc(posts.name));
}

export async function findPostsByCategoryId(
  categoryId: number,
  limit: number = 10,
): Promise<PostResult[]> {
  const db = getDb();

  return db
    .select(postSelectFields)
    .from(posts)
    .innerJoin(postCategories, eq(posts.id, postCategories.postId))
    .where(eq(postCategories.categoryId, categoryId))
    .orderBy(desc(posts.createdAt))
    .limit(limit);
}

export async function findPostsByTagId(
  tagId: number,
  limit: number = 10,
): Promise<PostResult[]> {
  const db = getDb();

  return db
    .select(postSelectFields)
    .from(posts)
    .innerJoin(postTags, eq(posts.id, postTags.postId))
    .where(eq(postTags.tagId, tagId))
    .orderBy(desc(posts.createdAt))
    .limit(limit);
}

export async function findPostsByIds(ids: number[]): Promise<PostResult[]> {
  if (ids.length === 0) {
    return [];
  }

  const db = getDb();
  return db.select(postSelectFields).from(posts).where(inArray(posts.id, ids));
}
