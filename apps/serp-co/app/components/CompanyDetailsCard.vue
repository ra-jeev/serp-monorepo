<script setup lang="ts">
defineProps<{ title?: string }>();
</script>

<template>
  <UCard class="scroll-m-[calc(var(--ui-header-height)+2rem)]">
    <template v-if="title" #header>
      <h2 class="text-2xl font-bold text-highlighted">{{ title }}</h2>
    </template>

    <slot />
  </UCard>
</template>
