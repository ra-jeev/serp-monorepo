import { defineSitemapEventHandler } from '#imports';
import { PostService } from '@serp/api/posts';
import type { SitemapUrl } from '#sitemap/types';

export default defineSitemapEventHandler(async (event) => {
  try {
    const connectionString = getDbConnectionString(event);
    const postService = new PostService(connectionString);

    const { posts, categories } = await postService.getAllPostsForSitemap();

    const postsUrls = posts.map((post) => ({
      loc: `/posts/${post.slug}`,
      lastmod: post.updatedAt,
    } satisfies SitemapUrl));

    const categoriesUrls = categories.map((category) => ({
      loc: `/posts/category/${category.slug}`,
      lastmod: category.updatedAt,
    } satisfies SitemapUrl));

    return [...postsUrls, ...categoriesUrls];
  } catch (error) {
    console.error('Error generating post sitemap:', error);
    return [];
  }
});
