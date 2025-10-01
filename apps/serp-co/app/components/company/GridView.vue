<script setup lang="ts">
import type { Company } from '~/types';

const { hasSidebar = false } = defineProps<{
  companies: Company[];
  pending: boolean;
  hasSidebar?: boolean;
}>();
</script>

<template>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 gap-4"
    :class="{ 'lg:grid-cols-3': !hasSidebar }"
  >
    <template v-if="pending">
      <UCard v-for="i in 12" :key="i" :ui="{ body: 'sm:p-4' }">
        <div class="flex items-center gap-4">
          <USkeleton class="size-16 rounded-xl" />

          <div class="flex-1">
            <USkeleton class="h-6 w-2/3 mb-2" />
            <USkeleton class="h-4 w-full mb-1" />
            <USkeleton class="h-4 w-4/5" />
          </div>
        </div>
      </UCard>
    </template>
    <template v-else>
      <NuxtLink
        v-for="company in companies"
        :key="company.id"
        :to="`/products/${company.slug}/reviews`"
      >
        <CompanyGridCard :company="company" />
      </NuxtLink>
    </template>
  </div>
</template>
