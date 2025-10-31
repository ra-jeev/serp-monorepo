import { defineSitemapEventHandler } from '#imports';
import { PostService } from '@serp/api/posts';
import type { SitemapUrl } from '#sitemap/types';

export default defineSitemapEventHandler(async (event) => {
  try {
    const connectionString = getDbConnectionString(event);
    const postService = new PostService(connectionString);
    const categories = await postService.getAllPostCategoriesForSitemap();

    return categories.map((category) => ({
      loc: `/posts/category/${category.slug}`,
      lastmod: category.updatedAt,
    } satisfies SitemapUrl));
  } catch (error) {
    console.error('Error generating post categories sitemap:', error);
    return [];
  }
});
