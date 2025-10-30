import { z } from 'zod';
import { BaseService } from './base';
import {
  findAllPostSlugsForSitemap,
  findPosts,
  findPostsWithCategories,
  findPostBySlug,
  findPostCategories,
  findPostTags,
  findRelatedPosts,
  postSortOptions,
  postTypes,
  type PostFilters,
  type PostCategoryResult,
  type PostResult,
  type PostTagResult,
} from '@serp/db/queries/posts';
import type { selectPostSchema } from '@serp/db/validations';
import type { PaginatedResponse } from '../types';

export type {
  PostResult,
  PostSortOption,
  PostType,
} from '@serp/db/queries/posts';

export type PostListResponse = PaginatedResponse<PostResult>;

export type PostDetailResponse = z.infer<typeof selectPostSchema> & {
  categories: PostCategoryResult[];
  tags: PostTagResult[];
  relatedPosts: PostResult[];
};

const postListParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(200).default(50),
  type: postTypes.optional(),
  category: z.string().trim().min(1).optional(),
  tag: z.string().trim().min(1).optional(),
  search: z.string().trim().min(1).max(100).optional(),
  sortBy: postSortOptions.default('recent'),
  includeCategories: z.coerce.boolean().default(false),
});

export class PostService extends BaseService {
  async getPosts(params: unknown): Promise<PostListResponse> {
    try {
      const validatedParams = postListParamsSchema.parse(params);
      const {
        page,
        limit,
        type,
        category,
        tag,
        search,
        sortBy,
        includeCategories,
      } = validatedParams;

      const offset = (page - 1) * limit;

      const filters: PostFilters = {
        type,
        categorySlug: category,
        tagSlug: tag,
        nameQuery: search,
        sortBy,
        limit,
        offset,
      };

      const result = includeCategories
        ? await findPostsWithCategories(filters)
        : await findPosts(filters);

      const totalPages = Math.ceil(result.total / limit);

      return {
        data: result.posts,
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
        `Failed to fetch posts: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async getBlogPosts(params: unknown): Promise<PostListResponse> {
    const validatedParams = postListParamsSchema.parse(params);
    return this.getPosts({ ...validatedParams, type: 'blog' });
  }

  async getGlossaryPosts(params: unknown): Promise<PostListResponse> {
    const validatedParams = postListParamsSchema.parse(params);
    return this.getPosts({ ...validatedParams, type: 'glossary' });
  }

  async getPostBySlug(slug: string): Promise<PostDetailResponse | null> {
    try {
      if (!slug?.trim()) {
        throw new Error('Post slug is required');
      }

      const post = await findPostBySlug(slug.trim());

      if (!post) {
        return null;
      }

      const [categories, tags, relatedPosts] = await Promise.all([
        findPostCategories(post.id),
        findPostTags(post.id),
        findRelatedPosts(post.id),
      ]);

      return {
        ...post,
        categories,
        tags,
        relatedPosts,
      };
    } catch (error) {
      throw new Error(
        `Failed to fetch post: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async searchPosts(
    searchTerm: string,
    type?: 'blog' | 'glossary',
    limit: number = 10,
  ) {
    try {
      if (!searchTerm?.trim()) {
        return { posts: [], total: 0, hasMore: false };
      }

      const cleanSearchTerm = searchTerm.trim();

      if (cleanSearchTerm.length > 100) {
        throw new Error('Search term too long');
      }

      const filters: PostFilters = {
        type,
        nameQuery: cleanSearchTerm,
        sortBy: 'recent',
        limit: Math.min(limit, 50),
        offset: 0,
      };

      return await findPosts(filters);
    } catch (error) {
      throw new Error(
        `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async searchGlossary(searchTerm: string, limit: number = 10) {
    return this.searchPosts(searchTerm, 'glossary', limit);
  }

  async searchBlog(searchTerm: string, limit: number = 10) {
    return this.searchPosts(searchTerm, 'blog', limit);
  }

  async getAllPostsForSitemap() {
    try {
      return await findAllPostSlugsForSitemap();
    } catch (error) {
      throw new Error(
        `Failed to fetch posts for sitemap: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
