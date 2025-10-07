import type { CompanyDetailResponse } from '~/types';

export const useCompanyDetails = async (slug: string) => {
  const { data, error } = await useFetch<CompanyDetailResponse>(
    `/api/companies/${slug}`,
    {
      key: `company-detail-${slug}`,
    },
  );

  if (error.value) {
    const is404 = error.value.statusCode === 404;
    throw createError({
      statusCode: error.value.statusCode || error.value.status || 500,
      statusMessage:
        error.value.statusMessage ||
        error.value.message ||
        'Failed to fetch company details',
      message: is404
        ? 'The company you are looking for does not exist in our database.'
        : 'We have encountered an error. Please try again later.',
    });
  } else if (!data.value) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch company details',
      message: 'We have encountered an error. Please try again later.',
    });
  }

  return data.value;
};
