import { z } from 'zod';
import {
  findCategoryBySlug,
  findCategories,
  categorySortOptions,
  type CategoryFilters,
  type CategoryResult,
} from '@serp/db/queries/categories';
import {
  findCompaniesByCategoryId,
  type CompanyResult,
} from '@serp/db/queries/companies';
import { findPostsByCategoryId, type PostResult } from '@serp/db/queries/posts';
import type { PaginatedResponse } from '../types';

import type { selectCategorySchema } from '@serp/db/validations';

export type { CategoryResult } from '@serp/db/queries/categories';

export type CategoryListResponse = PaginatedResponse<CategoryResult>;

export type CategoryDetailResponse = z.infer<typeof selectCategorySchema> & {
  companies: CompanyResult[];
  posts: PostResult[];
  companyCount: number;
  postCount: number;
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
  postLimit: z.coerce.number().int().positive().max(50).default(20),
  includeCompanies: z.coerce.boolean().default(true),
  includePosts: z.coerce.boolean().default(true),
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
      const totalPages = Math.ceil(result.total / limit);

      return {
        data: result.categories,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages,
          hasMore: result.hasMore,
        },
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
      const {
        slug,
        entityType,
        companyLimit,
        postLimit,
        includeCompanies,
        includePosts,
      } = categoryDetailParamsSchema.parse(params);

      const category = await findCategoryBySlug(entityType, slug);

      if (!category) {
        return null;
      }

      const [companies, posts] = await Promise.all([
        includeCompanies
          ? findCompaniesByCategoryId(category.id, companyLimit)
          : Promise.resolve([]),
        includePosts
          ? findPostsByCategoryId(category.id, postLimit)
          : Promise.resolve([]),
      ]);

      return {
        ...category,
        companies,
        posts,
        companyCount: companies.length,
        postCount: posts.length,
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
