<script setup lang="ts">
import type { Company } from '~/types';

defineProps<{ company: Company }>();
</script>

<template>
  <UCard
    :ui="{ body: 'sm:p-4' }"
    class="hover:bg-elevated hover:shadow-lg transition-all duration-200 group"
  >
    <div class="flex gap-4 items-center">
      <UAvatar
        :src="company.logo ?? undefined"
        :alt="company.name"
        class="size-16 rounded-xl ring-2 ring-gray-100 dark:ring-gray-800 group-hover:ring-primary-200 dark:group-hover:ring-primary-800 transition-colors"
      />

      <div class="flex-1 min-w-0">
        <h3
          class="text-lg font-semibold text-highlighted mb-2 truncate group-hover:text-primary transition-colors"
        >
          {{ company.name }}
        </h3>

        <p
          v-if="company.oneLiner || company.excerpt"
          class="text-sm text-toned line-clamp-2"
        >
          {{ company.oneLiner || company.excerpt }}
        </p>

        <p v-else class="text-sm text-muted italic">No description available</p>
      </div>
    </div>
  </UCard>
</template>
