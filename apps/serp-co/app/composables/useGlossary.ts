import type { Post, PostListResponse } from '~/types';

export function useGlossary() {
  const { data, pending, error } = useAsyncData<PostListResponse>(
    'glossary-all',
    () =>
      $fetch('/api/posts', {
        params: {
          type: 'glossary',
          limit: 200, // Get all items at once
          sortBy: 'name-asc', // Alphabetical for glossary
        },
      }),
  );

  // Group posts by first letter
  const groupedPosts = computed(() => {
    if (!data.value?.data) return {};

    const groups: Record<string, Post[]> = {};

    data.value.data.forEach((post) => {
      const firstLetter = post.name.charAt(0).toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(post);
    });

    // Sort each group alphabetically
    Object.values(groups).forEach((group) => {
      group.sort((a, b) => a.name.localeCompare(b.name));
    });

    return groups;
  });

  // Get available letters (sorted)
  const availableLetters = computed(() => {
    return Object.keys(groupedPosts.value).sort();
  });

  return {
    posts: computed(() => data.value?.data ?? []),
    groupedPosts,
    availableLetters,
    total: computed(() => data.value?.pagination.total ?? 0),
    pending,
    error,
  };
}
