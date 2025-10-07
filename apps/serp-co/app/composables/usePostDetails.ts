import type { PostDetailResponse } from '~/types';

export async function usePostDetails(slug: string) {
  const { data, error } = await useFetch<PostDetailResponse>(
    `/api/posts/${slug}`,
    {
      key: `post-detail-${slug}`,
    },
  );

  if (error.value) {
    const is404 = error.value.statusCode === 404;
    throw createError({
      statusCode: error.value.statusCode || error.value.status || 500,
      statusMessage:
        error.value.statusMessage ||
        error.value.message ||
        'Failed to fetch post details',
      message: is404
        ? 'The post you are looking for does not exist in our database.'
        : 'We have encountered an error. Please try again later.',
    });
  }

  if (!data.value) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch post details',
      message: 'We have encountered an error. Please try again later.',
    });
  }

  const post = data.value;

  return {
    post,
    categories: post.categories,
    tags: post.tags,
    relatedPosts: post.relatedPosts,
    isGlossary: post.type === 'glossary',
    isBlog: post.type === 'blog',
  };
}
