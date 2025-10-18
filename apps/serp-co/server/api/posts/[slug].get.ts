import { PostService } from '@serp/api/posts';

export default defineCachedEventHandler(async (event) => {
  try {
    const slug = getRouterParam(event, 'slug');

    if (!slug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Post slug is required',
      });
    }

    const postService = new PostService();
    const post = await postService.getPostBySlug(slug);

    if (!post) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Post not found',
      });
    }

    return post;
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
  maxAge: 60 * 60, // 1 hour
  swr: true,
  getKey: (event) => {
    const slug = getRouterParam(event, 'slug');
    return `post:${slug}`;
  },
});
