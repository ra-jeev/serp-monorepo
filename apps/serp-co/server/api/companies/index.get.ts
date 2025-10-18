import { CompanyService } from '@serp/api/companies';

export default defineCachedEventHandler(async (event) => {
  console.log('inside get companies api: ');
  const query = getQuery(event);

  const companyService = new CompanyService();

  const companiesResponse = await companyService.getCompanies(query);

  return companiesResponse;
}, {
  maxAge: 60 * 15, // 15 minutes
  swr: true,
  getKey: (event) => {
    const query = getQuery(event);
    return `companies:${JSON.stringify(query)}`;
  },
});
