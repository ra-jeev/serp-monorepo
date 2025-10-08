<script setup lang="ts">
defineProps<{
  title: string;
  description?: string | null;
}>();
</script>

<template>
  <UCard class="group transition-all duration-200 hover:shadow-md">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <h3
          class="font-semibold text-highlighted group-hover:text-primary transition-colors text-lg"
        >
          {{ title }}
        </h3>
        <p v-if="description" class="text-muted mt-2 line-clamp-2">
          {{ description }}
        </p>
      </div>
      <UIcon
        name="i-lucide-arrow-right"
        class="size-5 text-muted group-hover:text-primary transition-colors ml-4 flex-shrink-0"
      />
    </div>
  </UCard>
</template>
