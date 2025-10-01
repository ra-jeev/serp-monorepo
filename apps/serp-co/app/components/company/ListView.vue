<script setup lang="ts">
import type { Company } from '~/types';

defineProps<{
  companies: Company[];
  pending: boolean;
}>();

defineEmits(['clear-search']);
</script>

<template>
  <div class="flex flex-col gap-4 sm:gap-6">
    <template v-if="pending">
      <UCard v-for="i in 6" :key="i">
        <div class="flex items-center gap-4 sm:gap-6">
          <USkeleton class="size-16 rounded-xl" />

          <div class="flex-1">
            <USkeleton class="h-6 w-1/3 mb-1" />
            <USkeleton class="h-4 w-1/2 mb-3" />
            <USkeleton class="h-4 w-full mb-1" />
            <USkeleton class="h-4 w-3/4" />
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
        <CompanyListCard :company="company" />
      </NuxtLink>
    </template>
  </div>
</template>
