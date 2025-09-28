<script setup lang="ts">
import type { Category } from '~/components/category/Card.vue';

defineProps<{
  categories: Category[];
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
  </div>
</template>
