<script setup lang="ts">
import type { Company } from '~/types';

defineProps<{
  company: Company;
}>();
</script>

<template>
  <UCard
    class="hover:bg-elevated hover:shadow-lg transition-all duration-200 group"
  >
    <div class="flex gap-4 sm:gap-6">
      <UAvatar
        :src="company.logo ?? undefined"
        :alt="company.name"
        class="size-16 rounded-xl ring-2 ring-gray-100 dark:ring-gray-800 group-hover:ring-primary-200 dark:group-hover:ring-primary-800 transition-colors"
      />

      <div class="flex-1 min-w-0">
        <div class="mb-3">
          <h3
            class="text-lg font-semibold text-highlighted truncate group-hover:text-primary transition-colors"
          >
            {{ company.name }}
          </h3>

          <p
            v-if="company.oneLiner"
            class="text-sm text-toned font-medium mt-1"
          >
            {{ company.oneLiner }}
          </p>
        </div>

        <p v-if="company.excerpt" class="text-sm text-muted line-clamp-2">
          {{ company.excerpt }}
        </p>

        <p v-else-if="!company.oneLiner" class="text-sm text-muted italic">
          No description available
        </p>
      </div>

      <div class="flex-shrink-0 flex items-center">
        <UIcon
          name="i-lucide-arrow-right"
          class="size-6 text-primary opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-2"
        />
      </div>
    </div>
  </UCard>
</template>
