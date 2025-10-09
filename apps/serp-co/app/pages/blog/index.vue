<script setup lang="ts">
const {
  posts,
  total,
  totalPages,
  pending,
  page,
  limit,
  generatePaginationLink,
} = usePosts({ limit: 12, type: 'blog' });

const blogPosts = computed(() =>
  posts.value.map((post) => ({
    to: `/posts/${post.slug}`,
    title: post.name,
    description: post.excerpt ?? undefined,
    image: post.featuredImage ?? post.image ?? '/images/blog-placeholder.svg',
    date: post.createdAt,
    authors: post.author ? [{ name: post.author }] : [],
  })),
);

useSeoMeta({
  title: 'Serp Blog - Latest Insights & Trends',
  description:
    'Stay updated with the latest AI and machine learning insights, trends, and industry analysis.',
});

const { breadcrumbs } = useBreadcrumbs();
</script>

<template>
  <UContainer>
    <UPage>
      <UPageHeader
        title="Blog"
        description="Latest insights, trends, and analysis in artificial intelligence and machine learning."
      >
        <template #headline>
          <UBreadcrumb class="mb-6" :items="breadcrumbs" />
        </template>
      </UPageHeader>

      <UPageBody>
        <p v-if="total > 0" class="text-toned text-center mb-8">
          {{ total.toLocaleString() }}
          {{ total === 1 ? 'article published' : 'articles published' }}
        </p>

        <UBlogPosts v-if="!pending && posts.length > 0" :posts="blogPosts" />

        <div
          v-if="pending"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          <UCard v-for="i in limit" :key="i" class="h-full">
            <USkeleton class="w-full h-48 rounded-lg mb-4" />
            <div class="space-y-3">
              <USkeleton class="h-6 w-full" />
              <USkeleton class="h-4 w-full" />
              <USkeleton class="h-4 w-2/3" />
              <div class="flex justify-between">
                <USkeleton class="h-3 w-20" />
                <USkeleton class="h-3 w-24" />
              </div>
            </div>
          </UCard>
        </div>

        <div v-if="!pending && totalPages > 1" class="flex justify-center">
          <UPagination
            v-model:page="page"
            :items-per-page="limit"
            :to="generatePaginationLink"
            :total="total"
            size="lg"
          />
        </div>

        <div v-if="!pending && total === 0" class="text-center py-12">
          <UIcon
            name="i-lucide-file-text"
            class="size-12 text-gray-400 mx-auto mb-4"
          />
          <h3 class="text-lg font-medium text-highlighted mb-2">
            No blog posts found
          </h3>
          <p class="text-muted">New articles coming soon. Stay tuned!</p>
        </div>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
