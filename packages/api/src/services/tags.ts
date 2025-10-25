import { z } from 'zod';
import { BaseService } from './base';
import {
  findTags,
  findTagBySlug,
  tagSortOptions,
  type TagFilters,
  type TagResult,
} from '@serp/db/queries/tags';
import {
  findCompaniesByTagId,
  type CompanyResult,
} from '@serp/db/queries/companies';
import { findPostsByTagId, type PostResult } from '@serp/db/queries/posts';
import type { selectTagSchema } from '@serp/db/validations';
import type { PaginatedResponse } from '../types';

export type { TagResult } from '@serp/db/queries/tags';

export type TagListResponse = PaginatedResponse<TagResult>;

export type TagDetailResponse = z.infer<typeof selectTagSchema> & {
  companies: CompanyResult[];
  posts: PostResult[];
  companyCount: number;
  postCount: number;
};

const tagListParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(150).default(50),
  search: z.string().trim().min(1).max(100).optional(),
  sortBy: tagSortOptions.default('name-asc'),
});

const tagDetailParamsSchema = z.object({
  slug: z.string().trim().min(1).max(100),
  companyLimit: z.coerce.number().int().positive().max(50).default(20),
  postLimit: z.coerce.number().int().positive().max(50).default(20),
  includeCompanies: z.coerce.boolean().default(true),
  includePosts: z.coerce.boolean().default(true),
});

export class TagService extends BaseService {
  async getTags(params: unknown): Promise<TagListResponse> {
    try {
      const validatedParams = tagListParamsSchema.parse(params);
      const { page, limit, search, sortBy } = validatedParams;

      const offset = (page - 1) * limit;

      const filters: TagFilters = {
        nameQuery: search,
        sortBy,
        limit,
        offset,
      };

      const result = await findTags(filters);
      const totalPages = Math.ceil(result.total / limit);

      return {
        data: result.tags,
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
        `Failed to fetch tags: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async getTagBySlug(params: unknown): Promise<TagDetailResponse | null> {
    try {
      const { slug, companyLimit, postLimit, includeCompanies, includePosts } =
        tagDetailParamsSchema.parse(params);

      const tag = await findTagBySlug(slug);

      if (!tag) {
        return null;
      }

      const [companies, posts] = await Promise.all([
        includeCompanies
          ? findCompaniesByTagId(tag.id, companyLimit)
          : Promise.resolve([]),
        includePosts
          ? findPostsByTagId(tag.id, postLimit)
          : Promise.resolve([]),
      ]);

      return {
        ...tag,
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
        `Failed to fetch tag: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
