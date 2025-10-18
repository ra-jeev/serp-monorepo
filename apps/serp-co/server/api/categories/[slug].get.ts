import { CategoryService } from '@serp/api/categories';

export default defineCachedEventHandler(async (event) => {
  try {
    const slug = getRouterParam(event, 'slug');
    const query = getQuery(event);

    if (!slug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Category slug is required',
      });
    }

    const categoryService = new CategoryService();
    const category = await categoryService.getCategoryBySlug({
      slug,
      ...query,
    });

    if (!category) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Category not found',
      });
    }

    return category;
  } catch (error) {
    // If it's already a Nuxt error, re-throw it
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }

    const message =
      error instanceof Error ? error.message : 'Unknown error occurred';

    if (
      message.includes('Invalid parameters') ||
      message.includes('Invalid slug format')
    ) {
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
}, {
  maxAge: 60 * 60, // 1 hour
  swr: true,
  getKey: (event) => {
    const slug = getRouterParam(event, 'slug');
    const query = getQuery(event);
    return `category:${slug}:${JSON.stringify(query)}`;
  },
});
