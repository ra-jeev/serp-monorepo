import { PostService } from '@serp/api/posts';

export default defineCachedEventHandler(async (event) => {
  const query = getQuery(event);

  const postService = new PostService();
  const postsResponse = await postService.getPosts(query);

  return postsResponse;
}, {
  maxAge: 60 * 15, // 15 minutes
  swr: true,
  getKey: (event) => {
    const query = getQuery(event);
    return `posts:${JSON.stringify(query)}`;
  },
});
