import { PostService } from '@serp/api/posts';

export default defineCachedEventHandler(async (event) => {
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
}, {
  maxAge: 60 * 60, // 1 hour
  swr: true,
  getKey: (event) => {
    const slug = getRouterParam(event, 'slug');
    return `post:${slug}`;
  },
});
