import { CompanyService } from '@serp/api/companies';

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Company slug is required',
    });
  }

  const companyService = new CompanyService();
  const company = await companyService.getCompanyBySlug(slug);

  if (!company) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Company not found',
    });
  }

  return company;
});
