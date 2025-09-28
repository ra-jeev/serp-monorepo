<script setup lang="ts">
const { categories, total, limit, pending, hasMore, loadMore } = useCategories({
  limit: 24,
  entityType: 'company',
  canLoadMore: true,
});

useSeoMeta({
  title: 'Browse Categories - Find Your Next SaaS',
  description:
    'Browse all software categories to discover companies by type and find the perfect solution for your needs.',
});

const { breadcrumbs } = useBreadcrumbs();
</script>

<template>
  <UContainer>
    <UPage>
      <UPageHeader
        title="Browse Categories"
        description="Explore all software categories to find companies that match your specific needs."
      >
        <template #headline>
          <UBreadcrumb class="mb-6" :items="breadcrumbs" />
        </template>
      </UPageHeader>

      <UPageBody>
        <p v-if="total > 0" class="text-toned text-center">
          {{ total.toLocaleString() }}
          {{ total === 1 ? 'category found' : 'categories found' }}
        </p>

        <CategoryList
          :categories="categories"
          :pending="pending"
          :show-all="true"
          :has-more="hasMore"
          :limit="limit"
          @load-more="loadMore"
        />

        <div v-if="!pending && total === 0" class="text-center py-12">
          <UIcon
            name="i-lucide-folder-x"
            class="size-12 text-gray-400 mx-auto mb-4"
          />
          <h3 class="text-lg font-medium text-highlighted mb-2">
            No categories found
          </h3>
          <p class="text-muted">No categories are available at the moment.</p>
        </div>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
