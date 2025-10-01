<script setup lang="ts">
defineProps<{ title?: string }>();
</script>

<template>
  <section class="scroll-m-[calc(var(--ui-header-height)+2rem)]">
    <UCard>
      <template v-if="title" #header>
        <h2 class="text-2xl font-bold text-highlighted">{{ title }}</h2>
      </template>

      <slot />
    </UCard>
  </section>
</template>
