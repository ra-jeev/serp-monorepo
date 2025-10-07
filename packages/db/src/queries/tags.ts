import { eq, ilike, desc, asc, count } from 'drizzle-orm';
import { z } from 'zod';
import { getDb } from '../client';
import { tags } from '../schema/tags';
import { selectTagSchema } from '../validations';

export const tagSortOptions = z.enum([
  'name-asc',
  'name-desc',
  'recent',
  'updated',
]);

export type TagSortOption = z.infer<typeof tagSortOptions>;

export const tagFiltersSchema = z.object({
  nameQuery: z.string().optional(),
  sortBy: tagSortOptions.default('name-asc'),
  limit: z.number().int().positive().default(50),
  offset: z.number().int().nonnegative().default(0),
});

export type TagFilters = z.input<typeof tagFiltersSchema>;

export const tagResultSchema = selectTagSchema.pick({
  id: true,
  slug: true,
  name: true,
  createdAt: true,
  updatedAt: true,
});

export type TagResult = z.infer<typeof tagResultSchema>;

export type TagQueryResult = {
  tags: TagResult[];
  total: number;
  hasMore: boolean;
};

const tagSelectFields = {
  id: tags.id,
  slug: tags.slug,
  name: tags.name,
  createdAt: tags.createdAt,
  updatedAt: tags.updatedAt,
};

export async function findTags(
  filters: TagFilters = {},
): Promise<TagQueryResult> {
  const db = getDb();

  const { nameQuery, sortBy, limit, offset } = tagFiltersSchema.parse(filters);

  let query = db.select(tagSelectFields).from(tags).$dynamic();
  let countQuery = db.select({ count: count() }).from(tags).$dynamic();

  if (nameQuery) {
    const sanitizedQuery = nameQuery.replace(/[%_]/g, '\\$&');
    const nameCondition = ilike(tags.name, `%${sanitizedQuery}%`);
    query = query.where(nameCondition);
    countQuery = countQuery.where(nameCondition);
  }

  switch (sortBy) {
    case 'name-desc':
      query = query.orderBy(desc(tags.name));
      break;
    case 'recent':
      query = query.orderBy(desc(tags.createdAt));
      break;
    case 'updated':
      query = query.orderBy(desc(tags.updatedAt));
      break;
    case 'name-asc':
    default:
      query = query.orderBy(asc(tags.name));
      break;
  }

  query = query.limit(limit).offset(offset);

  const [tagsResult, totalResult] = await Promise.all([
    query.execute(),
    countQuery.execute(),
  ]);

  const total = totalResult[0]?.count || 0;
  const hasMore = offset + limit < total;

  return {
    tags: tagsResult,
    total,
    hasMore,
  };
}

export async function findTagBySlug(slug: string) {
  const db = getDb();

  const result = await db
    .select()
    .from(tags)
    .where(eq(tags.slug, slug))
    .limit(1);

  if (!result[0]) {
    return null;
  }

  return selectTagSchema.parse(result[0]);
}
