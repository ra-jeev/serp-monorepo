import { eq, ilike, desc, asc, count, and, inArray } from 'drizzle-orm';
import { z } from 'zod';
import { getDb } from '../client';
import { companies } from '../schema/companies';
import { categories } from '../schema/categories';
import { tags } from '../schema/tags';
import {
  companyCategories,
  companyAlternatives,
  companyTags,
} from '../schema/junction-tables';
import {
  selectCategorySchema,
  selectCompanySchema,
  selectTagSchema,
} from '../validations';

export const companyCategoryResultSchema = selectCategorySchema.pick({
  id: true,
  name: true,
  slug: true,
  entityType: true,
});
export type CompanyCategoryResult = z.infer<typeof companyCategoryResultSchema>;

export const companyTagResultSchema = selectTagSchema.pick({
  id: true,
  name: true,
  slug: true,
});
export type CompanyTagResult = z.infer<typeof companyTagResultSchema>;

export const companySortOptions = z.enum([
  'name-asc',
  'name-desc',
  'recent',
  'updated',
]);

export type CompanySortOption = z.infer<typeof companySortOptions>;

export const companyFiltersSchema = z.object({
  categorySlug: z.string().optional(),
  tagSlug: z.string().optional(),
  nameQuery: z.string().optional(),
  sortBy: companySortOptions.default('name-asc'),
  limit: z.number().int().positive().default(50),
  offset: z.number().int().nonnegative().default(0),
});
export type CompanyFilters = z.input<typeof companyFiltersSchema>;

export const companyResultSchema = selectCompanySchema.pick({
  id: true,
  slug: true,
  name: true,
  logo: true,
  excerpt: true,
  domain: true,
  oneLiner: true,
  createdAt: true,
  updatedAt: true,
});

export type CompanyResult = z.infer<typeof companyResultSchema>;

export type CompanyQueryResult = {
  companies: CompanyResult[];
  total: number;
  hasMore: boolean;
};

const companySelectFields = {
  id: companies.id,
  slug: companies.slug,
  name: companies.name,
  logo: companies.logo,
  excerpt: companies.excerpt,
  domain: companies.domain,
  oneLiner: companies.oneLiner,
  createdAt: companies.createdAt,
  updatedAt: companies.updatedAt,
};

export async function findCompanies(
  filters: CompanyFilters = {},
): Promise<CompanyQueryResult> {
  const db = getDb();

  const { categorySlug, tagSlug, nameQuery, sortBy, limit, offset } =
    companyFiltersSchema.parse(filters);

  let query = db.select(companySelectFields).from(companies).$dynamic();
  let countQuery = db.select({ count: count() }).from(companies).$dynamic();

  if (categorySlug) {
    query = query
      .innerJoin(
        companyCategories,
        eq(companies.id, companyCategories.companyId),
      )
      .innerJoin(categories, eq(companyCategories.categoryId, categories.id))
      .where(eq(categories.slug, categorySlug));

    countQuery = countQuery
      .innerJoin(
        companyCategories,
        eq(companies.id, companyCategories.companyId),
      )
      .innerJoin(categories, eq(companyCategories.categoryId, categories.id))
      .where(eq(categories.slug, categorySlug));
  }

  if (tagSlug) {
    query = query
      .innerJoin(companyTags, eq(companies.id, companyTags.companyId))
      .innerJoin(tags, eq(companyTags.tagId, tags.id))
      .where(eq(tags.slug, tagSlug));

    countQuery = countQuery
      .innerJoin(companyTags, eq(companies.id, companyTags.companyId))
      .innerJoin(tags, eq(companyTags.tagId, tags.id))
      .where(eq(tags.slug, tagSlug));
  }

  if (nameQuery) {
    const sanitizedQuery = nameQuery.replace(/[%_]/g, '\\$&');
    const nameCondition = ilike(companies.name, `%${sanitizedQuery}%`);

    if (categorySlug && tagSlug) {
      query = query.where(
        and(
          eq(categories.slug, categorySlug),
          eq(tags.slug, tagSlug),
          nameCondition,
        ),
      );
      countQuery = countQuery.where(
        and(
          eq(categories.slug, categorySlug),
          eq(tags.slug, tagSlug),
          nameCondition,
        ),
      );
    } else if (categorySlug) {
      query = query.where(
        and(eq(categories.slug, categorySlug), nameCondition),
      );
      countQuery = countQuery.where(
        and(eq(categories.slug, categorySlug), nameCondition),
      );
    } else if (tagSlug) {
      query = query.where(and(eq(tags.slug, tagSlug), nameCondition));
      countQuery = countQuery.where(and(eq(tags.slug, tagSlug), nameCondition));
    } else {
      query = query.where(nameCondition);
      countQuery = countQuery.where(nameCondition);
    }
  }

  switch (sortBy) {
    case 'name-desc':
      query = query.orderBy(desc(companies.name));
      break;
    case 'recent':
      query = query.orderBy(desc(companies.createdAt), desc(companies.id));
      break;
    case 'updated':
      query = query.orderBy(desc(companies.updatedAt), desc(companies.id));
      break;
    case 'name-asc':
    default:
      query = query.orderBy(asc(companies.name));
      break;
  }

  query = query.limit(limit).offset(offset);

  const [companiesResult, totalResult] = await Promise.all([
    query.execute(),
    countQuery.execute(),
  ]);

  const total = totalResult[0]?.count || 0;
  const hasMore = offset + limit < total;

  return {
    companies: companiesResult,
    total,
    hasMore,
  };
}

export async function findCompanyBySlug(slug: string) {
  const db = getDb();

  const result = await db
    .select()
    .from(companies)
    .where(eq(companies.slug, slug))
    .limit(1);

  if (!result[0]) {
    return null;
  }

  return selectCompanySchema.parse(result[0]);
}

export async function findCompanyCategories(
  companyId: number,
): Promise<CompanyCategoryResult[]> {
  const db = getDb();

  return db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      entityType: categories.entityType,
    })
    .from(categories)
    .innerJoin(
      companyCategories,
      eq(categories.id, companyCategories.categoryId),
    )
    .where(eq(companyCategories.companyId, companyId))
    .orderBy(asc(categories.name));
}

export async function findCompanyTags(
  companyId: number,
): Promise<CompanyTagResult[]> {
  const db = getDb();

  return db
    .select({
      id: tags.id,
      name: tags.name,
      slug: tags.slug,
    })
    .from(tags)
    .innerJoin(companyTags, eq(tags.id, companyTags.tagId))
    .where(eq(companyTags.companyId, companyId))
    .orderBy(asc(tags.name));
}

export async function findCompanyAlternatives(
  companyId: number,
): Promise<CompanyResult[]> {
  const db = getDb();

  return db
    .select(companySelectFields)
    .from(companies)
    .innerJoin(
      companyAlternatives,
      eq(companies.id, companyAlternatives.alternativeId),
    )
    .where(eq(companyAlternatives.companyId, companyId))
    .orderBy(asc(companies.name));
}

export async function findCompaniesByIds(
  ids: number[],
): Promise<CompanyResult[]> {
  if (ids.length === 0) {
    return [];
  }

  const db = getDb();
  const result = await db
    .select(companySelectFields)
    .from(companies)
    .where(inArray(companies.id, ids));

  return result;
}

export async function findCompaniesByCategoryId(
  categoryId: number,
  limit: number = 10,
): Promise<CompanyResult[]> {
  const db = getDb();

  const results = await db
    .select(companySelectFields)
    .from(companies)
    .innerJoin(companyCategories, eq(companies.id, companyCategories.companyId))
    .where(eq(companyCategories.categoryId, categoryId))
    .orderBy(asc(companies.name))
    .limit(limit);

  return results;
}

export async function findCompaniesByTagId(
  tagId: number,
  limit: number = 10,
): Promise<CompanyResult[]> {
  const db = getDb();

  const results = await db
    .select(companySelectFields)
    .from(companies)
    .innerJoin(companyTags, eq(companies.id, companyTags.companyId))
    .where(eq(companyTags.tagId, tagId))
    .orderBy(asc(companies.name))
    .limit(limit);

  return results;
}

export async function findAllCompanySlugsForSitemap() {
  const db = getDb();

  const [companiesSlugs, categoriesSlugs] = await Promise.all([
    db
      .select({
        slug: companies.slug,
        updatedAt: companies.updatedAt,
      })
      .from(companies)
      .orderBy(asc(companies.slug)),
    db
      .select({
        slug: categories.slug,
        updatedAt: categories.updatedAt,
      })
      .from(categories)
      .where(eq(categories.entityType, 'company'))
      .orderBy(asc(categories.slug)),
  ]);

  return { companies: companiesSlugs, categories: categoriesSlugs };
}
