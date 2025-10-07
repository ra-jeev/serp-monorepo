<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

const route = useRoute();
const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Blog',
    to: '/blog',
    active: route.path.startsWith('/blog'),
  },
  {
    label: 'Glossary',
    to: '/glossary',
    active: route.path.startsWith('/glossary'),
  },
]);
</script>

<template>
  <UHeader>
    <template #title>
      <Logo class="h-12 w-auto" />
    </template>

    <UNavigationMenu :items="items" />

    <template #right>
      <UColorModeButton />
    </template>
  </UHeader>
</template>
