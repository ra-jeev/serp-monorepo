import { defineSitemapEventHandler } from '#imports';
import { CompanyService } from '@serp/api/companies';
import type { SitemapUrl } from '#sitemap/types';

export default defineSitemapEventHandler(async (event) => {
  try {
    const connectionString = getDbConnectionString(event);
    const companyService = new CompanyService(connectionString);

    const { companies, categories } = await companyService.getAllCompaniesForSitemap();

    const companiesUrls = companies.map((company) => ({
      loc: `/products/${company.slug}/reviews`,
      lastmod: company.updatedAt,
    } satisfies SitemapUrl));

    const categoriesUrls = categories.map((category) => ({
      loc: `/products/best/${category.slug}`,
      lastmod: category.updatedAt,
    } satisfies SitemapUrl));

    return [...companiesUrls, ...categoriesUrls];
  } catch (error) {
    console.error('Error generating products sitemap:', error);
    return [];
  }
});
