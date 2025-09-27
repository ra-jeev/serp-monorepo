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
  <UCard
    :ui="{ body: 'sm:p-4' }"
    class="group hover:shadow-lg transition-all duration-200"
  >
    <div class="flex items-center gap-3">
      <div
        class="size-8 bg-default rounded-md flex items-center justify-center group-hover:bg-accented transition-colors"
      >
        <UIcon name="i-lucide-folder" class="size-5 text-primary" />
      </div>

      <h3
        class="text-toned font-medium group-hover:text-highlighted transition-colors line-clamp-2"
      >
        {{ category.name }}
      </h3>
    </div>
  </UCard>
</template>
