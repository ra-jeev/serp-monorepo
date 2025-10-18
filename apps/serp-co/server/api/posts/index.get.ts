import { PostService } from '@serp/api/posts';

export default defineCachedEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const postService = new PostService();
    return await postService.getPosts(query);
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
    return `posts:${JSON.stringify(query)}`;
  },
});
