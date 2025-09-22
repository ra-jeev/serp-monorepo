import { eq, ilike, desc, asc, count, and } from 'drizzle-orm';
import { getDb } from '../client';
import { companies } from '../schema/companies';
import { categories } from '../schema/categories';
import { companyCategories } from '../schema/junction-tables';

export type CompanySortOption = 'name-asc' | 'name-desc' | 'recent' | 'updated';

export interface CompanyFilters {
  categorySlug?: string;
  nameQuery?: string;
  sortBy?: CompanySortOption;
  limit?: number;
  offset?: number;
}

export interface CompanyQueryResult {
  companies: Array<{
    id: number;
    slug: string;
    name: string;
    logo: string | null;
    excerpt: string | null;
    domain: string | null;
    oneLiner: string | null;
    createdAt: Date;
    updatedAt: Date;
  }>;
  total: number;
  hasMore: boolean;
}

// Base company selection fields (without heavy content)
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

  const {
    categorySlug,
    nameQuery,
    sortBy = 'name-asc',
    limit = 50,
    offset = 0,
  } = filters;

  let query = db.select(companySelectFields).from(companies).$dynamic();
  let countQuery = db.select({ count: count() }).from(companies).$dynamic();

  if (categorySlug) {
    query = query
      .innerJoin(companyCategories, eq(companies.id, companyCategories.companyId))
      .innerJoin(categories, eq(companyCategories.categoryId, categories.id))
      .where(eq(categories.slug, categorySlug));

    countQuery = countQuery
      .innerJoin(companyCategories, eq(companies.id, companyCategories.companyId))
      .innerJoin(categories, eq(companyCategories.categoryId, categories.id))
      .where(eq(categories.slug, categorySlug));
  }

  if (nameQuery) {
    const nameCondition = ilike(companies.name, `%${nameQuery}%`);

    if (categorySlug) {
      query = query.where(and(eq(categories.slug, categorySlug), nameCondition));
      countQuery = countQuery.where(and(eq(categories.slug, categorySlug), nameCondition));
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
      query = query.orderBy(desc(companies.createdAt));
      break;
    case 'updated':
      query = query.orderBy(desc(companies.updatedAt));
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

  return result[0] || null;
}

export async function findCompanyCategories(companyId: number) {
  const db = getDb();

  return db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      entityType: categories.entityType,
    })
    .from(categories)
    .innerJoin(companyCategories, eq(categories.id, companyCategories.categoryId))
    .where(eq(companyCategories.companyId, companyId))
    .orderBy(asc(categories.name));
}
