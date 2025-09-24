<script setup lang="ts"></script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />

    <UHeader>
      <template #title>
        <Logo class="h-12 w-auto" />
      </template>

      <template #right>
        <UColorModeButton />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <UFooter>
      <template #left>
        Copyright © {{ new Date().getFullYear() }} SERP Co. All rights
        reserved.
      </template>
    </UFooter>
  </UApp>
</template>
