import type { CompanyDetailResponse } from '~/types';

export const useCompanyDetails = async (slug: string) => {
  const { data, error } = await useFetch<CompanyDetailResponse>(
    `/api/companies/${slug}`,
  );

  if (error.value) {
    throw createError({
      statusCode: error.value.statusCode || error.value.status || 500,
      statusMessage:
        error.value.statusMessage ||
        error.value.message ||
        'Failed to fetch company details',
    });
  } else if (!data.value) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch company details',
    });
  }

  return data.value;
};
