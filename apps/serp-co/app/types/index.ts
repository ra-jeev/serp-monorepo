export type {
  CompanyResult as Company,
  CompanyListResponse,
  CompanyDetailResponse,
  CompanySortOption,
} from '@serp/api/companies';

export type {
  CategoryResult as Category,
  CategoryListResponse,
  CategoryDetailResponse,
} from '@serp/api/categories';

export type {
  PostResult as Post,
  PostListResponse,
  PostDetailResponse,
  PostSortOption,
  PostType,
} from '@serp/api/posts';

export type { TagResult as Tag, TagDetailResponse } from '@serp/api/tags';

export type ViewMode = 'list' | 'grid';
