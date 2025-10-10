<script setup lang="ts">
interface Props {
  icon: string;
  title: string;
  description: string;
}

const { icon, title, description } = defineProps<Props>();
</script>

<template>
  <div class="text-center py-12">
    <UIcon :name="icon" class="size-12 text-gray-400 mx-auto mb-4" />
    <h3 class="text-lg font-medium text-highlighted mb-2">
      {{ title }}
    </h3>
    <p class="text-muted">
      {{ description }}
    </p>
  </div>
</template>
