import type { PostListResponse, PostSortOption, PostType } from '~/types';

interface UsePostsOptions {
  limit?: number;
  defaultSort?: PostSortOption;
  type?: PostType;
  includeCategories?: boolean;
}

export function usePosts(options: UsePostsOptions = {}) {
  const {
    limit = 24,
    defaultSort = 'recent',
    type,
    includeCategories = false,
  } = options;

  const route = useRoute();
  const router = useRouter();

  let debounceTimer: NodeJS.Timeout;
  const search = computed({
    get: () => String(route.query.search || ''),
    set: (value: string) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        router.push({
          query: {
            ...route.query,
            search: value || undefined,
            page: undefined,
          },
        });
      }, 300);
    },
  });

  const category = computed({
    get: () => String(route.query.category || ''),
    set: (value: string) => {
      router.push({
        query: {
          ...route.query,
          category: value || undefined,
          page: undefined,
        },
      });
    },
  });

  const postType = computed({
    get: () => (route.query.type as PostType) || type || '',
    set: (value: PostType | '') => {
      router.push({
        query: {
          ...route.query,
          type: value || undefined,
          page: undefined,
        },
      });
    },
  });

  const sortBy = computed({
    get: () => (route.query.sortBy as PostSortOption) || defaultSort,
    set: (value: PostSortOption) => {
      router.push({
        query: {
          ...route.query,
          sortBy: value === defaultSort ? undefined : value,
          page: undefined,
        },
      });
    },
  });

  const page = computed({
    get: () => Number(route.query.page) || 1,
    set: (value: number) => {
      router.push({
        query: {
          ...route.query,
          page: value > 1 ? value : undefined,
        },
      });
    },
  });

  const queryParams = computed(() => ({
    search: route.query.search || undefined,
    category: route.query.category || undefined,
    type: postType.value || undefined,
    sortBy: route.query.sortBy || defaultSort,
    page: route.query.page || undefined,
    limit,
    includeCategories,
  }));

  const { data, pending, error } = useAsyncData<PostListResponse>(
    `posts-${limit}-${type || 'all'}`,
    () => $fetch('/api/posts', { params: queryParams.value }),
    {
      watch: [queryParams],
    },
  );

  const generatePaginationLink = (p: number) => {
    const query = { ...route.query };
    if (p > 1) {
      query.page = p.toString();
    } else {
      delete query.page;
    }

    return { query };
  };

  onUnmounted(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
  });

  return {
    posts: computed(() => data.value?.data ?? []),
    total: computed(() => data.value?.pagination.total ?? 0),
    totalPages: computed(() => data.value?.pagination.totalPages ?? 0),
    hasMore: computed(() => data.value?.pagination.hasMore ?? false),
    currentPage: computed(() => data.value?.pagination.page ?? 1),
    limit: readonly(ref(limit)),

    search,
    category,
    postType,
    sortBy,
    page,
    pending,
    error,

    generatePaginationLink,
  };
}
