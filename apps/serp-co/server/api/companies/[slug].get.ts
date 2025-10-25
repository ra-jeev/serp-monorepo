import { CompanyService } from '@serp/api/companies';

export default defineCachedEventHandler(
  async (event) => {
    try {
      const slug = getRouterParam(event, 'slug');

      if (!slug) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Company slug is required',
        });
      }

      const dbConnectionString = getDbConnectionString(event);
      const companyService = new CompanyService(dbConnectionString);
      const company = await companyService.getCompanyBySlug(slug);

      if (!company) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Company not found',
        });
      }

      return company;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';

      if (message.includes('Invalid parameters')) {
        throw createError({
          statusCode: 400,
          statusMessage: message,
        });
      }

      throw createError({
        statusCode: 500,
        statusMessage: 'Internal server error',
      });
    }
  },
  {
    maxAge: 60 * 60, // 1 hour
    swr: true,
    getKey: (event) => {
      const slug = getRouterParam(event, 'slug');
      return `company:${slug}`;
    },
  },
);
