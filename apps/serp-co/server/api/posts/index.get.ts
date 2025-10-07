import { PostService } from '@serp/api/posts';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const postService = new PostService();
  const postsResponse = await postService.getPosts(query);

  return postsResponse;
});
