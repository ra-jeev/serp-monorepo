import { CategoryService } from '@serp/api/categories';

export default defineCachedEventHandler(async (event) => {
  console.log('inside get categories api: ');
  try {
    const query = getQuery(event);
    const categoryService = new CategoryService();

    return await categoryService.getCategories(query);
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
}, {
  maxAge: 60 * 15, // 15 minutes
  swr: true,
  getKey: (event) => {
    const query = getQuery(event);
    return `categories:${JSON.stringify(query)}`;
  },
});
