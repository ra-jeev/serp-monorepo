<script setup lang="ts">
export type Category = {
  id: number;
  name: string;
  slug: string;
  entityType: string;
  createdAt: Date;
  updatedAt: Date;
};

defineProps<{
  category: Category;
}>();
</script>

<template>
  <UCard class="h-full hover:shadow-lg transition-all duration-200 text-center">
    <div class="p-4">
      <!-- Category Icon/Placeholder -->
      <div
        class="w-12 h-12 mx-auto mb-3 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-800 transition-colors"
      >
        <UIcon
          name="i-lucide-folder"
          class="w-6 h-6 text-primary-600 dark:text-primary-400"
        />
      </div>

      <!-- Category Name -->
      <h3
        class="font-medium text-sm text-highlighted group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2"
      >
        {{ category.name }}
      </h3>
    </div>
  </UCard>
</template>
