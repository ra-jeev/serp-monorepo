<script setup lang="ts">
defineProps<{
  company: {
    id: number;
    name: string;
    slug: string;
    logo: string | null;
    oneLiner: string | null;
    excerpt: string | null;
  };
}>();
</script>

<template>
  <NuxtLink :to="`/companies/${company.slug}`">
    <UCard
      :ui="{ body: 'p-3 sm:p-3' }"
      class="hover:shadow-lg transition-all duration-200 group"
    >
      <div class="flex gap-3 items-center">
        <UAvatar
          :src="company.logo ?? undefined"
          :alt="company.name"
          class="size-16 rounded-xl ring-2 ring-gray-100 dark:ring-gray-800 group-hover:ring-primary-200 dark:group-hover:ring-primary-800 transition-colors"
        />

        <div class="flex-1 min-w-0 flex flex-col">
          <h3
            class="font-semibold text-highlighted mb-2 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
          >
            {{ company.name }}
          </h3>

          <p
            v-if="company.oneLiner || company.excerpt"
            class="text-sm text-toned line-clamp-2"
          >
            {{ company.oneLiner || company.excerpt }}
          </p>

          <p v-else class="text-sm text-muted italic">
            No description available
          </p>
        </div>
      </div>
    </UCard>
  </NuxtLink>
</template>
