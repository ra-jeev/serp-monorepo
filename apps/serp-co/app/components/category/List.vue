<script setup lang="ts">
import type { Category } from '@/components/category/Card.vue';

defineProps<{
  categories: Category[];
  pending?: boolean;
  showAll?: boolean;
  limit?: number;
  hasMore?: boolean;
}>();

defineEmits<{
  'view-all': [];
  'load-more': [];
}>();
</script>

<template>
  <div class="space-y-6">
    <CategoryGrid v-if="categories.length > 0" :categories="categories" />

    <CategoryGridSkeleton v-if="pending" :limit="limit" />

    <div v-else-if="categories.length > 0" class="flex justify-center pt-4">
      <UButton v-if="!showAll" variant="outline" @click="$emit('view-all')">
        View All Categories
      </UButton>

      <UButton
        v-else-if="hasMore"
        color="neutral"
        variant="subtle"
        trailing-icon="i-lucide-chevrons-down"
        :disabled="pending"
        :loading="pending"
        @click="$emit('load-more')"
      >
        {{ pending ? 'Loading...' : 'View More Categories' }}
      </UButton>
    </div>
  </div>
</template>
