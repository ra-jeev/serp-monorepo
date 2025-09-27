import type {
  CategoryApiResult,
  CategoryListResponse,
} from '@serp/api/categories';

interface UseCategoriesOptions {
  limit?: number;
  entityType?: string;
  loadMore?: boolean;
}

export function useCategories(options: UseCategoriesOptions = {}) {
  const { limit = 20, entityType = 'company', loadMore = false } = options;

  // Use different cache keys for different contexts
  const cacheKey = loadMore
    ? `categories-loadmore-${entityType}`
    : `categories-${entityType}-${limit}`;

  const page = ref(1);
  const allCategories = ref<CategoryApiResult[]>([]);
  const isLoadingMore = ref(false);

  const { data, pending, error, refresh } = useAsyncData<CategoryListResponse>(
    cacheKey,
    () =>
      $fetch('/api/categories', {
        params: {
          limit,
          entityType,
          page: loadMore ? page.value : 1,
        },
      }),
    {
      server: !loadMore, // Don't run on server for load more functionality
    },
  );

  // For load more functionality
  if (loadMore) {
    watch(
      data,
      (newData) => {
        if (newData) {
          if (page.value === 1) {
            allCategories.value = newData.categories;
          } else {
            allCategories.value = [
              ...allCategories.value,
              ...newData.categories,
            ];
          }
        }
      },
      { immediate: true },
    );
  }

  const loadMoreCategories = async () => {
    if (!loadMore || !data.value || !data.value.hasMore || isLoadingMore.value)
      return;

    isLoadingMore.value = true;
    page.value++;

    try {
      await refresh();
    } finally {
      isLoadingMore.value = false;
    }
  };

  return {
    categories: loadMore
      ? computed(() => allCategories.value)
      : computed(() => data.value?.categories ?? []),
    total: computed(() => data.value?.total ?? 0),
    hasMore: computed(() => data.value?.hasMore ?? false),
    pending,
    error,
    isLoadingMore: readonly(isLoadingMore),
    loadMore: loadMoreCategories,
  };
}
