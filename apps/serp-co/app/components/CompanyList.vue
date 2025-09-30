<script setup lang="ts">
import type { Company } from '~/types';

defineProps<{
  companies: Company[];
  pending: boolean;
  search?: string;
  total?: number;
  limit?: number;
}>();

defineEmits(['clear-search']);
</script>

<template>
  <div class="space-y-8">
    <div
      v-if="pending"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <UCard v-for="i in 12" :key="i" :ui="{ body: 'p-3 sm:p-3' }">
        <div class="flex items-center gap-3">
          <USkeleton class="size-16 rounded-xl" />

          <div class="flex-1 flex flex-col">
            <USkeleton class="h-4 w-2/3 mb-2" />
            <USkeleton class="h-4 w-full mb-1" />
            <USkeleton class="h-4 w-full" />
          </div>
        </div>
      </UCard>
    </div>

    <div
      v-else-if="companies.length === 0"
      class="flex flex-col items-center justify-center"
    >
      <UIcon name="i-lucide-search-x" class="size-12 text-dimmed" />
      <h3 class="mt-4 text-lg font-medium text-highlighted">
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

    <template v-else>
      <div class="text-center text-muted">
        {{ total?.toLocaleString() }}
        {{ total === 1 ? 'company found' : 'companies found' }}
        <template v-if="search">for "{{ search }}"</template>
      </div>

      <UPageGrid>
        <CompanyCard
          v-for="company in companies"
          :key="company.id"
          :company="company"
        />
      </UPageGrid>
    </template>
  </div>
</template>
