import { CompanyService } from '@serp/api/companies';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const companyService = new CompanyService();

  const companiesResponse = await companyService.getCompanies(query);

  return companiesResponse;
});
