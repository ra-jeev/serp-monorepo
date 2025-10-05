<script setup lang="ts">
import type { NuxtError } from '#app';

const { error } = defineProps<{
  error: NuxtError;
}>();

const displayError = computed(() => {
  if (error.statusCode === 404 && error.data) {
    return {
      ...error,
      statusMessage: 'Page not found',
      message:
        'The page you are looking for could not be found. It might have been moved or deleted.',
    };
  }

  return error;
});
</script>

<template>
  <UApp>
    <AppHeader />

    <UError :error="displayError" />

    <AppFooter />
  </UApp>
</template>
