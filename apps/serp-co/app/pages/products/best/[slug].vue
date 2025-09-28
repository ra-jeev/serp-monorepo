<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui';

const route = useRoute();
const slug = route.params.slug as string;

const { category, companies, companyCount, pending, error, buyingGuide, faqs } =
  useCategoryDetails(slug);

useSeoMeta({
  title: category.value
    ? `${category.value.name} Companies - Find Your Next SaaS`
    : 'Category - Find Your Next SaaS',
  description: category.value
    ? `Discover the best ${category.value.name.toLowerCase()} companies. Browse ${companyCount.value} companies in this category.`
    : 'Browse companies by category.',
});

const faqItems = computed<AccordionItem[]>(() => {
  if (!faqs.value || faqs.value.length === 0) return [];

  return faqs.value.map((faq) => ({
    label: faq.question,
    content: faq.answer,
  }));
});

// Handle 404
watch(error, (newError) => {
  if (newError?.statusCode === 404) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Category not found',
    });
  }
});
</script>

<template>
  <UContainer>
    <UPage>
      <div v-if="pending" class="space-y-8">
        <div class="space-y-4">
          <USkeleton class="h-4 w-24" />
          <USkeleton class="h-8 w-64" />
          <USkeleton class="h-4 w-96" />
        </div>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <USkeleton v-for="i in 8" :key="i" class="h-48 rounded-lg" />
        </div>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <UIcon
          name="i-lucide-alert-circle"
          class="size-12 text-red-500 mx-auto mb-4"
        />
        <h2 class="text-xl font-semibold text-highlighted mb-2">
          Something went wrong
        </h2>
        <p class="text-muted mb-6">
          We couldn't load the category details. Please try again.
        </p>
        <div class="flex justify-center gap-4">
          <UButton to="/products/best"> Browse Categories </UButton>
          <UButton variant="outline" @click="$router.go(-1)"> Go Back </UButton>
        </div>
      </div>

      <template v-else-if="category">
        <UPageHeader class="pb-8">
          <template #headline>
            <div class="flex items-center gap-2">
              <UButton
                variant="ghost"
                size="sm"
                icon="i-lucide-arrow-left"
                to="/products/best"
              >
                Back to Categories
              </UButton>
            </div>
          </template>

          <template #title>
            <div class="flex items-center gap-4">
              <div
                class="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center"
              >
                <UIcon
                  name="i-lucide-folder"
                  class="w-8 h-8 text-primary-600 dark:text-primary-400"
                />
              </div>
              <div>
                <h1 class="text-3xl font-bold text-highlighted">
                  {{ category.name }}
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
                class="prose prose-gray dark:prose-invert max-w-none prose-headings:text-highlighted prose-p:text-muted prose-strong:text-highlighted prose-ul:text-muted prose-ol:text-muted prose-li:text-muted prose-a:text-primary-600 dark:prose-a:text-primary-400"
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

            <div v-else>
              <UPageGrid>
                <CompanyCard
                  v-for="company in companies"
                  :key="company.id"
                  :company="company"
                />
              </UPageGrid>
            </div>
          </div>

          <div v-if="faqs && faqs.length > 0" class="space-y-6">
            <h2 class="text-2xl font-bold text-highlighted">
              Frequently Asked Questions
            </h2>
            <UAccordion :items="faqItems" default-value="0" />
          </div>
        </UPageBody>
      </template>
    </UPage>
  </UContainer>
</template>
