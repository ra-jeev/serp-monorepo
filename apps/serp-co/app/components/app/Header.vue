<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

const headerItems: NavigationMenuItem[] = useAppConfig().site.headerNavItems;
</script>

<template>
  <UHeader>
    <template #title>
      <Logo class="h-12 w-auto" />
    </template>

    <UNavigationMenu :items="headerItems" />

    <template #right>
      <UColorModeButton />
    </template>
  </UHeader>
</template>
