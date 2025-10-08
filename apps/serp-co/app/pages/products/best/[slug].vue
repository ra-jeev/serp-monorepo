<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui';

const route = useRoute();
const slug = route.params.slug as string;

const { category, companies, companyCount, buyingGuide, faqs } =
  await useCategoryDetails(slug);

useSeoMeta({
  title: `${category.name} Companies - Find Your Next SaaS`,
  description: `Discover the best ${category.name.toLowerCase()} companies. Browse ${companyCount} companies in this category.`,
});

const faqItems = computed<AccordionItem[]>(() => {
  if (!faqs || faqs.length === 0) {
    return [];
  }

  return faqs.map((faq) => ({
    label: faq.question,
    content: faq.answer,
  }));
});

const { breadcrumbs } = useBreadcrumbs(
  computed(() => ({
    categoryName: category.name,
  })),
);
</script>

<template>
  <UContainer>
    <UPage>
      <UPageHeader>
        <template #headline>
          <UBreadcrumb class="mb-6" :items="breadcrumbs" />
        </template>

        <template #title>
          <div class="flex items-center gap-4">
            <div
              class="size-16 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center"
            >
              <UIcon name="i-lucide-folder" class="size-8 text-primary" />
            </div>
            <div>
              <h1 class="text-3xl font-bold text-highlighted">
                The Best {{ category.name }} Companies
              </h1>
              <p class="text-lg text-toned mt-1">
                {{ companyCount }}
                {{ companyCount === 1 ? 'company' : 'companies' }}
              </p>
            </div>
          </div>
        </template>
      </UPageHeader>

      <UPageBody>
        <div v-if="buyingGuide" class="space-y-6">
          <h2 class="text-2xl font-bold text-highlighted">
            {{ category.name }} Buying Guide
          </h2>
          <UCard>
            <div
              class="prose prose-zinc dark:prose-invert max-w-none"
              v-html="buyingGuide"
            />
          </UCard>
        </div>

        <div class="space-y-6">
          <h2 class="text-2xl font-bold text-highlighted">
            Companies in {{ category.name }}
          </h2>

          <div v-if="companies.length === 0" class="text-center py-12">
            <UIcon
              name="i-lucide-building-2"
              class="size-12 text-gray-400 mx-auto mb-4"
            />
            <h3 class="text-lg font-medium text-highlighted mb-2">
              No companies yet
            </h3>
            <p class="text-muted">
              No companies have been added to this category yet.
            </p>
          </div>

          <CompanyCollection v-else :companies="companies" />
        </div>

        <div v-if="faqs && faqs.length > 0" class="space-y-6">
          <h2 class="text-2xl font-bold text-highlighted">
            Frequently Asked Questions
          </h2>
          <UAccordion :items="faqItems" default-value="0" />
        </div>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
