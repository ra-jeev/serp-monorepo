import { z } from 'zod';
import {
  findCategoryBySlug,
  findCategories,
  categorySortOptions,
  type CategoryQueryResult,
  type CategoryFilters,
} from '@serp/db/queries/categories';
import {
  findCompaniesByCategoryId,
  type CompanyResult,
} from '@serp/db/queries/companies';

import type { selectCategorySchema } from '@serp/db/validations';

export type { CategoryResult } from '@serp/db/queries/categories';

export type CategoryListResponse = CategoryQueryResult & {
  page: number;
  limit: number;
  totalPages: number;
};

export type CategoryDetailResponse = z.infer<typeof selectCategorySchema> & {
  companies: CompanyResult[];
  companyCount: number;
};

const categoryListParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(150).default(50),
  entityType: z.string().trim().min(1).optional(),
  sortBy: categorySortOptions.default('name-asc'),
});

const categoryDetailParamsSchema = z.object({
  slug: z.string().trim().min(1).max(100),
  entityType: z.string().trim().min(1).default('company'),
  companyLimit: z.coerce.number().int().positive().max(50).default(20),
});

export class CategoryService {
  async getCategories(params: unknown): Promise<CategoryListResponse> {
    try {
      const validatedParams = categoryListParamsSchema.parse(params);
      const { page, limit, entityType, sortBy } = validatedParams;

      const offset = (page - 1) * limit;

      const filters: CategoryFilters = {
        entityType,
        sortBy,
        limit,
        offset,
      };

      const result = await findCategories(filters);

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
        `Failed to fetch categories: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async getCategoryBySlug(
    params: unknown,
  ): Promise<CategoryDetailResponse | null> {
    try {
      const { slug, entityType, companyLimit } =
        categoryDetailParamsSchema.parse(params);

      const category = await findCategoryBySlug(entityType, slug);

      if (!category) {
        return null;
      }

      const companies = await findCompaniesByCategoryId(
        category.id,
        companyLimit,
      );

      return {
        ...category,
        companies,
        companyCount: companies.length,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.issues.map((issue) => issue.message);
        throw new Error(`Invalid parameters: ${messages.join(', ')}`);
      }
      throw new Error(
        `Failed to fetch category: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
