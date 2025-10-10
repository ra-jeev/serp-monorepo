<script setup lang="ts">
const {
  posts,
  total,
  totalPages,
  pending,
  page,
  limit,
  generatePaginationLink,
} = usePosts({ limit: 12, includeCategories: true });

useSeoMeta({
  title: 'Posts - AI Blog & Glossary',
  description:
    'Explore our collection of AI insights, trends, and comprehensive glossary of machine learning terms.',
});

const { breadcrumbs } = useBreadcrumbs();

const getPublishDate = (date: Date | undefined) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
</script>

<template>
  <UContainer>
    <UPage>
      <UPageHeader
        title="All Posts"
        description="Explore our collection of AI blog articles and glossary terms in one place."
      >
        <template #headline>
          <UBreadcrumb class="mb-6" :items="breadcrumbs" />
        </template>
      </UPageHeader>

      <UPageBody>
        <div v-if="total > 0" class="text-center mb-8">
          <UBadge color="neutral" variant="subtle" size="lg">
            {{ total.toLocaleString() }}
            {{ total === 1 ? 'post found' : 'posts found' }}
          </UBadge>
        </div>

        <div v-if="!pending && posts.length > 0" class="grid grid-cols-1 gap-4">
          <NuxtLink
            v-for="post in posts"
            :key="post.id"
            :to="`/posts/${post.slug}`"
          >
            <UCard
              class="group h-full transition-all duration-200 hover:shadow-md overflow-hidden"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <UBadge
                    :label="post.type === 'blog' ? 'Blog' : 'Glossary'"
                    class="mb-2"
                    color="neutral"
                    variant="subtle"
                    size="sm"
                  />
                  <h3
                    class="font-semibold text-highlighted group-hover:underline line-clamp-2"
                  >
                    {{ post.name }}
                  </h3>
                  <p
                    v-if="post.excerpt"
                    class="text-muted text-sm line-clamp-2 mt-1"
                  >
                    {{ post.excerpt }}
                  </p>
                  <UUser
                    v-if="post.author"
                    class="mt-3"
                    :avatar="{ alt: post.author }"
                    :description="getPublishDate(post.createdAt)"
                    :name="post.author"
                  />

                  <div
                    v-if="post.categories?.length"
                    class="flex flex-wrap gap-2 mt-4"
                  >
                    <NuxtLink
                      v-for="category in post.categories"
                      :key="category.id"
                      :to="`/posts/category/${category.slug}`"
                    >
                      <UBadge variant="subtle">
                        {{ category.name }}
                      </UBadge>
                    </NuxtLink>
                  </div>
                </div>
                <UIcon
                  name="i-lucide-arrow-right"
                  class="size-5 text-muted group-hover:text-primary transition-colors ml-4 flex-shrink-0"
                />
              </div>
            </UCard>
          </NuxtLink>
        </div>

        <div
          v-if="pending"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          <USkeleton v-for="i in limit" :key="i" class="h-64" />
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
            No posts found
          </h3>
          <p class="text-muted">Content is being added. Check back soon!</p>
        </div>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
