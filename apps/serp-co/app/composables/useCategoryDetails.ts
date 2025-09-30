import type { CategoryDetailResponse } from '~/types';

export function useCategoryDetails(
  slug: string,
  entityType: string = 'company',
) {
  const { data, pending, error } = useAsyncData<CategoryDetailResponse>(
    `category-detail-${entityType}-${slug}`,
    () =>
      $fetch(`/api/categories/${slug}`, {
        params: { entityType },
      }),
  );

  return {
    category: data,
    companies: computed(() => data.value?.companies ?? []),
    companyCount: computed(() => data.value?.companyCount ?? 0),
    pending,
    error,
    // Extract content sections
    buyingGuide: computed(() => data.value?.buyingGuide || null),
    faqs: computed(() => data.value?.faqs || []),
  };
}
