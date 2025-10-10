<!-- /pages/posts/category/index.vue -->
<script setup lang="ts">
const { categories, total, limit, pending } = useCategories({
  limit: 50,
  entityType: 'post',
});

useSeoMeta({
  title: 'Post Categories - Browse by Topic',
  description:
    'Browse all post categories to discover AI blog articles and glossary terms organized by topic.',
});

const { breadcrumbs } = useBreadcrumbs();
</script>

<template>
  <UContainer>
    <UPage>
      <UPageHeader
        title="Post Categories"
        description="Explore all categories to find blog articles and glossary terms that match your interests."
      >
        <template #headline>
          <UBreadcrumb class="mb-6" :items="breadcrumbs" />
        </template>
      </UPageHeader>

      <UPageBody>
        <p v-if="total > 0" class="text-toned text-center mb-8">
          {{ total.toLocaleString() }}
          {{ total === 1 ? 'category found' : 'categories found' }}
        </p>

        <!-- Categories Grid -->
        <div
          v-if="!pending && categories.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <NuxtLink
            v-for="category in categories"
            :key="category.id"
            :to="`/posts/category/${category.slug}`"
            class="group"
          >
            <UCard class="h-full transition-all duration-200 hover:shadow-md">
              <div class="flex items-center gap-4">
                <div
                  class="size-12 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center flex-shrink-0"
                >
                  <UIcon name="i-lucide-folder" class="size-6 text-primary" />
                </div>
                <div class="flex-1 min-w-0">
                  <h3
                    class="font-semibold text-highlighted group-hover:text-primary transition-colors line-clamp-2"
                  >
                    {{ category.name }}
                  </h3>
                </div>
              </div>
            </UCard>
          </NuxtLink>
        </div>

        <!-- Loading State -->
        <div
          v-if="pending"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <UCard v-for="i in limit" :key="i">
            <div class="flex items-center gap-4">
              <USkeleton class="size-12 rounded-xl" />
              <USkeleton class="h-6 flex-1" />
            </div>
          </UCard>
        </div>

        <!-- Empty State -->
        <div v-if="!pending && total === 0" class="text-center py-12">
          <UIcon
            name="i-lucide-folder-x"
            class="size-12 text-gray-400 mx-auto mb-4"
          />
          <h3 class="text-lg font-medium text-highlighted mb-2">
            No categories found
          </h3>
          <p class="text-muted">
            No post categories are available at the moment.
          </p>
        </div>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
