import { eq, and, desc, asc, count } from 'drizzle-orm';
import { z } from 'zod';
import { getDb } from '../client';
import { categories } from '../schema/categories';
import { selectCategorySchema } from '../validations';

export const categorySortOptions = z.enum([
  'name-asc',
  'name-desc',
  'recent',
  'updated',
]);

export type CategorySortOption = z.infer<typeof categorySortOptions>;

export const categoryFiltersSchema = z.object({
  entityType: z.string().optional(),
  sortBy: categorySortOptions.default('name-asc'),
  limit: z.number().int().positive().default(50),
  offset: z.number().int().nonnegative().default(0),
});

export type CategoryFilters = z.input<typeof categoryFiltersSchema>;

export const categoryResultSchema = selectCategorySchema.pick({
  id: true,
  slug: true,
  name: true,
  entityType: true,
  createdAt: true,
  updatedAt: true,
});

export type CategoryResult = z.infer<typeof categoryResultSchema>;

export type CategoryQueryResult = {
  categories: CategoryResult[];
  total: number;
  hasMore: boolean;
};

const categorySelectFields = {
  id: categories.id,
  slug: categories.slug,
  name: categories.name,
  entityType: categories.entityType,
  createdAt: categories.createdAt,
  updatedAt: categories.updatedAt,
};

export async function findCategories(
  filters: CategoryFilters = {},
): Promise<CategoryQueryResult> {
  try {
    const db = getDb();

    const { entityType, sortBy, limit, offset } =
      categoryFiltersSchema.parse(filters);

    let query = db.select(categorySelectFields).from(categories).$dynamic();
    let countQuery = db.select({ count: count() }).from(categories).$dynamic();

    if (entityType) {
      const entityTypeCondition = eq(categories.entityType, entityType);
      query = query.where(entityTypeCondition);
      countQuery = countQuery.where(entityTypeCondition);
    }

    switch (sortBy) {
      case 'name-desc':
        query = query.orderBy(desc(categories.name));
        break;
      case 'recent':
        query = query.orderBy(desc(categories.createdAt), desc(categories.id));
        break;
      case 'updated':
        query = query.orderBy(desc(categories.updatedAt), desc(categories.id));
        break;
      case 'name-asc':
      default:
        query = query.orderBy(asc(categories.name));
        break;
    }

    query = query.limit(limit).offset(offset);

    const [categoriesResult, totalResult] = await Promise.all([
      query.execute(),
      countQuery.execute(),
    ]);

    const total = totalResult[0]?.count || 0;
    const hasMore = offset + limit < total;

    return {
      categories: categoriesResult,
      total,
      hasMore,
    };
  } catch (error) {
    throw new Error(
      `Database query failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

export async function findCategoryBySlug(entityType: string, slug: string) {
  try {
    const db = getDb();

    const result = await db
      .select()
      .from(categories)
      .where(
        and(eq(categories.entityType, entityType), eq(categories.slug, slug)),
      )
      .limit(1);

    if (!result[0]) {
      return null;
    }

    return selectCategorySchema.parse(result[0]);
  } catch (error) {
    throw new Error(
      `Database query failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}
