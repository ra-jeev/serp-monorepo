<script setup lang="ts">
import type { Company, ViewMode } from '~/types';

const { pending = false, viewMode = 'grid' } = defineProps<{
  companies: Company[];
  pending?: boolean;
  limit?: number;
  search?: string;
  viewMode?: ViewMode;
}>();

defineEmits<{
  (e: 'clear-search'): void;
}>();
</script>

<template>
  <CompanyNoResults
    v-if="!pending && companies.length === 0"
    :search="search"
    @clear-search="$emit('clear-search')"
  />

  <CompanyGridView
    v-else-if="viewMode === 'grid'"
    :companies="companies"
    :pending="pending"
  />

  <CompanyListView v-else :companies="companies" :pending="pending" />
</template>
