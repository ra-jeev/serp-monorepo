<script setup lang="ts">
import type { Category } from '~/components/category/Card.vue';

defineProps<{
  categories: Category[];
}>();
</script>

<template>
  <div
    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
  >
    <ULink
      v-for="category in categories"
      :key="category.id"
      :to="`/categories/${category.slug}`"
      class="group"
    >
      <CategoryCard :category="category" />
    </ULink>
  </div>
</template>
