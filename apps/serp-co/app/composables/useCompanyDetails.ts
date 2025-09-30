import type { CompanyDetailResponse } from '~/types';

export const useCompanyDetails = (slug: string) => {
  const { data, pending, error, refresh } = useFetch<CompanyDetailResponse>(
    `/api/companies/${slug}`,
  );

  return {
    data,
    pending,
    error,
    refresh,
  };
};
