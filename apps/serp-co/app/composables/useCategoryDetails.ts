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
    const is404 = error.value.statusCode === 404;
    throw createError({
      statusCode: error.value.statusCode || error.value.status || 500,
      statusMessage:
        error.value.statusMessage ||
        error.value.message ||
        'Failed to fetch category details',
      message: is404
        ? 'The category you are looking for does not exist in our database.'
        : 'We have encountered an error. Please try again later.',
    });
  }

  if (!data.value) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch category details',
      message: 'We have encountered an error. Please try again later.',
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
