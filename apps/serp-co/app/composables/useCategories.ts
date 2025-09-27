import type {
  CategoryApiResult,
  CategoryListResponse,
} from '@serp/api/categories';

interface UseCategoriesOptions {
  limit?: number;
  entityType?: string;
  canLoadMore?: boolean;
}

export function useCategories(options: UseCategoriesOptions = {}) {
  const { limit = 20, entityType = 'company', canLoadMore = false } = options;

  const cacheKey = canLoadMore
    ? `categories-load-more-${entityType}`
    : `categories-${entityType}-${limit}`;

  const page = ref(1);
  const allCategories = ref<CategoryApiResult[]>([]);

  const { data, pending, error } = useAsyncData<CategoryListResponse>(
    cacheKey,
    () =>
      $fetch('/api/categories', {
        params: {
          limit,
          entityType,
          page: page.value,
        },
      }),
    { watch: [page] },
  );

  if (canLoadMore) {
    watch(
      data,
      (newData) => {
        if (newData) {
          if (page.value === 1) {
            allCategories.value = newData.categories;
          } else {
            allCategories.value.push(...newData.categories);
          }
        }
      },
      { immediate: true },
    );
  }

  const loadMoreCategories = async () => {
    if (!canLoadMore || !data.value || !data.value.hasMore) {
      return;
    }

    page.value++;
  };

  return {
    categories: computed(() => allCategories.value),
    total: computed(() => data.value?.total ?? 0),
    hasMore: computed(() => data.value?.hasMore ?? false),
    pending,
    error,
    loadMore: loadMoreCategories,
  };
}
