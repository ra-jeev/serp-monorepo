<script setup lang="ts">
const { limit = 12 } = defineProps<{ limit?: number }>();
</script>

<template>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
  >
    <UCard v-for="i in limit" :key="i">
      <div class="flex items-center gap-3">
        <USkeleton class="size-8 rounded-md" />
        <USkeleton class="h-6 w-3/4" />
      </div>
    </UCard>
  </div>
</template>
