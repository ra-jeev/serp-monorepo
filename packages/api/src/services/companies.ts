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
  limit: z.coerce.number().int().positive().max(100).default(50),
  category: z.string().trim().min(1).optional(),
  search: z.string().trim().min(1).max(100).optional(),
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
  async getCompanies(params: unknown): Promise<CompanyListResponse> {
    try {
      const validatedParams = companySearchApiParamsSchema.parse(params);
      const { page, limit, category, search, sortBy } = validatedParams;

      const offset = (page - 1) * limit;

      const filters: CompanyFilters = {
        categorySlug: category,
        nameQuery: search,
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
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.issues.map((issue) => issue.message);
        throw new Error(`Invalid parameters: ${messages.join(', ')}`);
      }

      throw new Error(
        `Failed to fetch companies: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async getCompanyBySlug(slug: string): Promise<CompanyDetailResponse | null> {
    try {
      if (!slug?.trim()) {
        throw new Error('Company slug is required');
      }

      const company = await findCompanyBySlug(slug.trim());

      if (!company) {
        return null;
      }

      const [categories, hydratedAlternatives] = await Promise.all([
        findCompanyCategories(company.id),
        company.alternatives && company.alternatives.length > 0
          ? findCompaniesByIds(company.alternatives)
          : Promise.resolve([]),
      ]);

      return {
        ...company,
        categories,
        hydratedAlternatives,
      };
    } catch (error) {
      throw new Error(
        `Failed to fetch company: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async searchCompanies(searchTerm: string, limit: number = 10) {
    try {
      if (!searchTerm?.trim()) {
        return { companies: [], total: 0, hasMore: false };
      }

      const cleanSearchTerm = searchTerm.trim();

      if (cleanSearchTerm.length > 100) {
        throw new Error('Search term too long');
      }

      const filters: CompanyFilters = {
        nameQuery: searchTerm.trim(),
        sortBy: 'name-asc',
        limit: Math.min(limit, 50),
        offset: 0,
      };

      return await findCompanies(filters);
    } catch (error) {
      throw new Error(
        `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
