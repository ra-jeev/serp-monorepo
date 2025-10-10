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
              <PostStats
                :total="total"
                singular="post"
                plural="posts"
                variant="default"
                class="text-lg text-toned mt-1"
              />
            </div>
          </div>
        </template>
      </UPageHeader>

      <UPageBody>
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

          <PostList
            :posts="paginatedPosts"
            :pending="pending"
            :limit="limit"
            :show-categories="false"
          />

          <PostEmptyState
            v-if="!pending && total === 0"
            icon="i-lucide-file-text"
            title="No posts yet"
            description="No posts have been added to this category yet."
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
        </div>

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
