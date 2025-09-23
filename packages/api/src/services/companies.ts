import { z } from 'zod';
import {
  findCompanies,
  findCompanyBySlug,
  findCompanyCategories,
  findCompaniesByIds,
  companySortOptions,
} from '@serp/db/queries/companies';
import type {
  CompanyQueryResult,
  CompanyFilters,
  CompanyCategoryResult,
  CompanyResult,
} from '@serp/db/queries/companies';
import type { selectCompanySchema } from '@serp/db/validations';

const companySearchApiParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(50),
  category: z.string().optional(),
  search: z.string().optional(),
  sortBy: companySortOptions.optional(),
});

export type CompanyListResponse = CompanyQueryResult & {
  page: number;
  limit: number;
  totalPages: number;
};

export type CompanyDetailResponse = z.infer<typeof selectCompanySchema> & {
  categories: CompanyCategoryResult[];
  hydratedAlternatives: CompanyResult[];
};

export class CompanyService {
  async getCompanies(
    params: unknown,
  ): Promise<CompanyListResponse> {
    const validatedParams = companySearchApiParamsSchema.parse(params);
    const { page, limit, category, search, sortBy } = validatedParams;

    const offset = (page - 1) * limit;

    const filters: CompanyFilters = {
      categorySlug: category,
      nameQuery: search?.trim(),
      sortBy,
      limit,
      offset,
    };

    const result = await findCompanies(filters);

    return {
      ...result,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit),
    };
  }

  async getCompanyBySlug(slug: string): Promise<CompanyDetailResponse | null> {
    if (!slug?.trim()) {
      throw new Error('Company slug is required');
    }

    const company = await findCompanyBySlug(slug.trim());

    if (!company) {
      return null;
    }

    const categories = await findCompanyCategories(company.id);

    let hydratedAlternatives: CompanyResult[] = [];
    if (company.alternatives && company.alternatives.length > 0) {
      hydratedAlternatives = await findCompaniesByIds(company.alternatives);
    }

    return {
      ...company,
      categories,
      hydratedAlternatives,
    };
  }

  async searchCompanies(searchTerm: string, limit: number = 10) {
    if (!searchTerm?.trim()) {
      return { companies: [], total: 0 };
    }

    const filters: CompanyFilters = {
      nameQuery: searchTerm.trim(),
      sortBy: 'name-asc',
      limit: Math.min(limit, 50),
      offset: 0,
    };

    return findCompanies(filters);
  }
}
