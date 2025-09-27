import { CategoryService } from '@serp/api/categories';

export default defineEventHandler(async (event) => {
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
});
