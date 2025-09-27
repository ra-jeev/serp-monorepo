<script setup lang="ts">
const { limit = 12 } = defineProps<{ limit?: number }>();
</script>

<template>
  <div
    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
  >
    <div v-for="i in limit" :key="i" class="space-y-2">
      <USkeleton class="h-16 rounded-lg" />
      <USkeleton class="h-4 w-3/4" />
    </div>
  </div>
</template>
