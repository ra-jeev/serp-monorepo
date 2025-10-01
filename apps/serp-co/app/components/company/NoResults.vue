<script setup lang="ts">
defineProps<{
  search?: string;
}>();

defineEmits<{
  (e: 'clear-search'): void;
}>();
</script>

<template>
  <UCard>
    <div class="flex flex-col items-center justify-center">
      <UIcon name="i-lucide-search-x" class="size-12 text-dimmed" />
      <h3 class="mt-6 text-lg font-medium text-highlighted">
        No companies found
      </h3>
      <p class="mt-2 text-muted">
        {{
          search
            ? `No results for "${search}". Try adjusting your search.`
            : 'No companies available at the moment. Please check back later.'
        }}
      </p>
      <UButton
        v-if="search"
        class="mt-4"
        variant="soft"
        @click="$emit('clear-search')"
      >
        Clear search
      </UButton>
    </div>
  </UCard>
</template>
