<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug as string;

const { category, buyingGuide, faqs } = await useCategoryDetails(slug, {
  entityType: 'post',
  includePosts: false,
});

const {
  posts: paginatedPosts,
  total,
  totalPages,
  pending,
  page,
  limit,
  generatePaginationLink,
} = usePosts({
  limit: 12,
  categorySlug: slug,
});

useSeoMeta({
  title: `${category.name} Posts - Browse Articles & Definitions`,
  description: `Discover blog articles and glossary terms in ${category.name.toLowerCase()}. Browse ${total} posts in this category.`,
});

const { breadcrumbs } = useBreadcrumbs(
  computed(() => ({
    categoryName: category.name,
  })),
);

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
      <UPageHeader>
        <template #headline>
          <UBreadcrumb class="mb-6" :items="breadcrumbs" />
        </template>

        <template #title>
          <div class="flex items-center gap-4">
            <div
              class="size-16 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center"
            >
              <UIcon name="i-lucide-folder" class="size-8 text-primary" />
            </div>
            <div>
              <h1 class="text-3xl font-bold text-highlighted">
                {{ category.name }}
              </h1>
              <p class="text-lg text-toned mt-1">
                {{ total }}
                {{ total === 1 ? 'post' : 'posts' }}
              </p>
            </div>
          </div>
        </template>
      </UPageHeader>

      <UPageBody>
        <!-- Buying Guide (if available) -->
        <div v-if="buyingGuide" class="space-y-6">
          <h2 class="text-2xl font-bold text-highlighted">
            {{ category.name }} Guide
          </h2>
          <UCard>
            <div
              class="prose prose-gray dark:prose-invert max-w-none prose-headings:text-highlighted prose-p:text-muted prose-strong:text-highlighted prose-ul:text-muted prose-ol:text-muted prose-li:text-muted prose-a:text-primary-600 dark:prose-a:text-primary-400"
              v-html="buyingGuide"
            />
          </UCard>
        </div>

        <!-- Posts Section -->
        <div class="space-y-6">
          <h2 class="text-2xl font-bold text-highlighted">
            Posts in {{ category.name }}
          </h2>

          <!-- No posts state -->
          <div v-if="!pending && total === 0" class="text-center py-12">
            <UIcon
              name="i-lucide-file-text"
              class="size-12 text-gray-400 mx-auto mb-4"
            />
            <h3 class="text-lg font-medium text-highlighted mb-2">
              No posts yet
            </h3>
            <p class="text-muted">
              No posts have been added to this category yet.
            </p>
          </div>

          <!-- Posts List -->
          <div
            v-else-if="!pending && paginatedPosts.length > 0"
            class="grid grid-cols-1 gap-4"
          >
            <NuxtLink
              v-for="post in paginatedPosts"
              :key="post.id"
              :to="`/posts/${post.slug}`"
              class="group"
            >
              <UCard class="transition-all duration-200 hover:shadow-md">
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
                      class="font-semibold text-highlighted group-hover:text-primary transition-colors line-clamp-2"
                    >
                      {{ post.name }}
                    </h3>
                    <p
                      v-if="post.excerpt"
                      class="text-muted text-sm mt-1 line-clamp-2"
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
                  </div>
                  <UIcon
                    name="i-lucide-arrow-right"
                    class="size-5 text-muted group-hover:text-primary transition-colors ml-4 flex-shrink-0"
                  />
                </div>
              </UCard>
            </NuxtLink>
          </div>

          <!-- Loading State -->
          <div v-if="pending" class="grid grid-cols-1 gap-4">
            <UCard v-for="i in limit" :key="i">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <USkeleton class="h-5 w-16 mb-2" />
                  <USkeleton class="h-6 w-full mb-2" />
                  <USkeleton class="h-4 w-4/5 mb-3" />
                  <div class="flex items-center gap-2">
                    <USkeleton class="size-6 rounded-full" />
                    <USkeleton class="h-4 w-24" />
                  </div>
                </div>
                <USkeleton class="size-5 ml-4" />
              </div>
            </UCard>
          </div>

          <!-- Pagination -->
          <div v-if="!pending && totalPages > 1" class="flex justify-center">
            <UPagination
              v-model:page="page"
              :items-per-page="limit"
              :to="generatePaginationLink"
              :total="total"
              size="lg"
            />
          </div>
        </div>

        <!-- FAQs (if available) -->
        <div v-if="faqs && faqs.length > 0" class="space-y-6">
          <h2 class="text-2xl font-bold text-highlighted">
            Frequently Asked Questions
          </h2>
          <UAccordion
            :items="
              faqs.map((faq, index) => ({
                label: faq.question,
                content: faq.answer,
                value: index.toString(),
              }))
            "
            default-value="0"
          />
        </div>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
