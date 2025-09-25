<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<template>
  <UCard>
    <template #header>
      <h2 class="text-2xl font-bold text-highlighted">{{ title }}</h2>
    </template>

    <slot />
  </UCard>
</template>
