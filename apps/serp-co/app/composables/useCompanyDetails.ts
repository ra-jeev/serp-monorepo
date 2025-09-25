import type { CompanyDetailResponse } from '@serp/api/companies';

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
