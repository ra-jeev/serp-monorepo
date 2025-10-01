<script setup lang="ts">
import type { Category } from '~/types';

const { limit = 12, pending = false } = defineProps<{
  categories: Category[];
  pending?: boolean;
  limit?: number;
}>();
</script>

<template>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
  >
    <NuxtLink
      v-for="category in categories"
      :key="category.id"
      :to="`/products/best/${category.slug}`"
    >
      <CategoryCard :category="category" />
    </NuxtLink>

    <template v-if="pending">
      <UCard v-for="i in limit" :key="i">
        <div class="flex items-center gap-4">
          <USkeleton class="size-8 rounded-md" />
          <USkeleton class="h-6 flex-1" />
        </div>
      </UCard>
    </template>
  </div>
</template>
