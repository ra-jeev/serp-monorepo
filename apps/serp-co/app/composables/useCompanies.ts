import type { CompanyListResponse } from '@serp/api/companies';

interface UseCompaniesOptions {
  limit?: number;
}

export function useCompanies(options: UseCompaniesOptions = {}) {
  const { limit = 12 } = options;

  const route = useRoute();
  const router = useRouter();

  const search = computed({
    get: () => String(route.query.search || ''),
    set: (value: string) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        router.push({
          query: {
            search: value || undefined,
            page: undefined,
          },
        });
      }, 300);
    },
  });

  const page = computed({
    get: () => Number(route.query.page) || 1,
    set: (value: number) => {
      const query: { page?: number; search?: string } = {};
      if (value > 1) query.page = value;
      if (route.query.search) query.search = String(route.query.search);
      router.push({ query });
    },
  });

  let debounceTimer: NodeJS.Timeout;
  const queryParams = computed(() => ({
    search: route.query.search || undefined,
    page: route.query.page || undefined,
    limit,
  }));

  const { data, pending, error } = useAsyncData<CompanyListResponse>(
    'companies',
    () => $fetch('/api/companies', { params: queryParams.value }),
    {
      watch: [queryParams],
    },
  );

  const generatePaginationLink = (p: number) => {
    const query: { page?: number; search?: string } = {};
    if (p > 1) query.page = p;
    if (route.query.search) query.search = String(route.query.search);
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
    page,
    pending,
    error,

    generatePaginationLink,
  };
}
