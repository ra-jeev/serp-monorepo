import { defineSitemapEventHandler } from '#imports';
import { CompanyService } from '@serp/api/companies';
import type { SitemapUrl } from '#sitemap/types';

export default defineSitemapEventHandler(async (event) => {
  try {
    const connectionString = getDbConnectionString(event);
    const companyService = new CompanyService(connectionString);
    const categories = await companyService.getAllCompanyCategoriesForSitemap();

    return categories.map((category) => ({
      loc: `/products/best/${category.slug}`,
      lastmod: category.updatedAt,
    } satisfies SitemapUrl));
  } catch (error) {
    console.error('Error generating product categories sitemap:', error);
    return [];
  }
});
