import type {
  CompanyListResponse,
  CompanySortOption,
} from '@serp/api/companies';

interface UseCompaniesOptions {
  limit?: number;
  defaultSort?: CompanySortOption;
}

export function useCompanies(options: UseCompaniesOptions = {}) {
  const { limit = 24, defaultSort = 'name-asc' } = options;

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

  const sortBy = computed({
    get: () => (route.query.sortBy as CompanySortOption) || defaultSort,
    set: (value: CompanySortOption) => {
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
    sortBy: route.query.sortBy || undefined,
    page: route.query.page || undefined,
    limit,
  }));

  const { data, pending, error } = useAsyncData<CompanyListResponse>(
    `companies-${limit}`,
    () => $fetch('/api/companies', { params: queryParams.value }),
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
    companies: computed(() => data.value?.companies ?? []),
    total: computed(() => data.value?.total ?? 0),
    totalPages: computed(() => data.value?.totalPages ?? 0),
    limit: readonly(ref(limit)),

    search,
    category,
    sortBy,
    page,
    pending,
    error,

    generatePaginationLink,
  };
}
