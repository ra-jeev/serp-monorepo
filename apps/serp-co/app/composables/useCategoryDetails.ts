import type { CategoryDetailResponse } from '~/types';

export async function useCategoryDetails(
  slug: string,
  entityType: string = 'company',
) {
  const { data, error } = await useFetch<CategoryDetailResponse>(
    `/api/categories/${slug}`,
    {
      key: `category-detail-${entityType}-${slug}`,
      params: { entityType },
    },
  );

  if (error.value) {
    throw createError({
      statusCode: error.value.statusCode || error.value.status || 500,
      statusMessage:
        error.value.statusMessage ||
        error.value.message ||
        'Failed to fetch category details',
    });
  }

  if (!data.value) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch category details',
    });
  }

  const category = data.value;

  return {
    category,
    companies: category.companies,
    companyCount: category.companyCount,
    buyingGuide: category.buyingGuide,
    faqs: category.faqs,
  };
}
