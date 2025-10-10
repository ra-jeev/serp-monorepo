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
        <PostStats :total="total" singular="post found" plural="posts found" />

        <PostList
          :posts="posts"
          :pending="pending"
          :limit="limit"
          :show-categories="true"
        />

        <div v-if="!pending && totalPages > 1" class="flex justify-center">
          <UPagination
            v-model:page="page"
            :items-per-page="limit"
            :to="generatePaginationLink"
            :total="total"
            size="lg"
          />
        </div>

        <PostEmptyState
          v-if="!pending && total === 0"
          icon="i-lucide-file-text"
          title="No posts found"
          description="Content is being added. Check back soon!"
        />
      </UPageBody>
    </UPage>
  </UContainer>
</template>
