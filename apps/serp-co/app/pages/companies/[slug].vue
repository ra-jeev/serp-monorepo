<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug as string;

const { data: company, pending } = useCompanyDetails(slug);

useSeoMeta({
  title: () => company.value?.name || 'Company',
  description: () => company.value?.oneLiner,
});
</script>

<template>
  <UContainer>
    <UPage v-if="company && !pending">
      <UPageHeader
        :title="company.name"
        :description="company.oneLiner || company.excerpt || undefined"
      >
        <template #headline>
          <div class="flex items-center gap-2">
            <UAvatar :src="company.logo || ''" :alt="company.name" size="lg" />
            <div v-if="company.serplyLink" class="flex flex-col">
              <span class="text-sm text-gray-500 dark:text-gray-400">
                Website
              </span>
              <ULink
                :to="company.serplyLink"
                target="_blank"
                class="text-primary font-semibold"
              >
                {{ company.domain }}
              </ULink>
            </div>
          </div>
        </template>
        <template #title>
          <h1
            class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl"
          >
            {{ company.name }}
          </h1>
        </template>
        <template #description>
          <p class="mt-4 text-lg text-gray-500 dark:text-gray-400 mss">
            {{ company.excerpt }}
          </p>
        </template>
        <template #extra>
          <div class="flex items-center gap-2 mt-4">
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Categories:
            </span>
            <div class="flex flex-wrap gap-2">
              <UBadge
                v-for="category in company.categories"
                :key="category.id"
                :label="category.name"
                variant="soft"
              />
            </div>
          </div>
        </template>
      </UPageHeader>

      <UPageBody>
        <div
          class="prose prose-primary dark:prose-invert max-w-none"
          v-html="company.content"
        />
      </UPageBody>

      <template v-if="company.hydratedAlternatives?.length">
        <UPageGrid>
          <UPageCard
            v-for="altCompany in company.hydratedAlternatives"
            :key="altCompany.id"
            :title="altCompany.name"
            :description="altCompany.oneLiner || undefined"
            :to="`/companies/${altCompany.slug}`"
          >
            <template #icon>
              <UAvatar :src="altCompany.logo || ''" :alt="altCompany.name" />
            </template>
          </UPageCard>
        </UPageGrid>
      </template>
    </UPage>
    <div v-else class="flex items-center justify-center h-96">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin text-4xl" />
    </div>
  </UContainer>
</template>
