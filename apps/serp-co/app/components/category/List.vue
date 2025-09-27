<script setup lang="ts">
import type { Category } from '@/components/category/Card.vue';

defineProps<{
  categories: Category[];
  pending?: boolean;
  showAll?: boolean;
  limit?: number;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}>();

defineEmits<{
  'view-all': [];
  'load-more': [];
}>();
</script>

<template>
  <div class="space-y-6">
    <CategoryGridSkeleton v-if="pending" />

    <!-- Categories Grid -->
    <template v-else>
      <CategoryGrid :categories="categories" />

      <!-- Action Buttons -->
      <div v-if="categories.length > 0" class="flex justify-center pt-4">
        <!-- View All Button (for homepage) -->
        <UButton v-if="!showAll" variant="outline" @click="$emit('view-all')">
          View All Categories
        </UButton>

        <!-- Load More Button (for categories page) -->
        <UButton
          v-else-if="hasMore"
          variant="outline"
          :loading="isLoadingMore"
          @click="$emit('load-more')"
        >
          <template v-if="isLoadingMore"> Loading... </template>
          <template v-else> Load More Categories </template>
        </UButton>
      </div>
    </template>
  </div>
</template>
