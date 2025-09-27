<script setup lang="ts">
useHead({
  title: 'Browse Categories - Find Your Next SaaS',
  meta: [
    {
      name: 'description',
      content:
        'Browse all software categories to discover companies by type and find the perfect solution for your needs.',
    },
  ],
});

const { categories, total, pending, hasMore, isLoadingMore, loadMore } =
  useCategories({
    limit: 24,
    entityType: 'company',
    loadMore: true,
  });
</script>

<template>
  <UPage>
    <UPageBody>
      <UContainer>
        <UPageHeader class="pb-8">
          <template #headline>
            <div class="flex items-center gap-2">
              <UButton
                variant="ghost"
                size="sm"
                icon="i-lucide-arrow-left"
                to="/"
              >
                Back to Home
              </UButton>
            </div>
          </template>

          <template #title> Browse Categories </template>

          <template #description>
            Explore all software categories to find companies that match your
            specific needs.
          </template>
        </UPageHeader>

        <div class="space-y-8">
          <!-- Categories Count -->
          <div v-if="!pending && total > 0" class="text-center">
            <UBadge variant="subtle" size="lg">
              {{ total.toLocaleString() }}
              {{ total === 1 ? 'category' : 'categories' }}
            </UBadge>
          </div>

          <!-- Loading State -->
          <div v-if="pending" class="text-center py-12">
            <UIcon
              name="i-lucide-loader-2"
              class="size-8 animate-spin text-primary-500 mx-auto mb-4"
            />
            <p class="text-muted">Loading categories...</p>
          </div>

          <!-- Categories Grid -->
          <CategoryList
            v-else
            :categories="categories"
            :pending="pending"
            :show-all="true"
            :has-more="hasMore"
            :is-loading-more="isLoadingMore"
            @load-more="loadMore"
          />

          <!-- Empty State -->
          <div
            v-if="!pending && categories.length === 0"
            class="text-center py-12"
          >
            <UIcon
              name="i-lucide-folder-x"
              class="size-12 text-gray-400 mx-auto mb-4"
            />
            <h3 class="text-lg font-medium text-highlighted mb-2">
              No categories found
            </h3>
            <p class="text-muted">No categories are available at the moment.</p>
          </div>
        </div>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
