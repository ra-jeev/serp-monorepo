<script setup lang="ts">
const title = ref('Find Your Next SaaS');
const description = ref(
  'Discover and compare the best software companies in one place. Find the perfect solution for your business needs.',
);
const links = ref([
  {
    label: 'Search Companies',
    icon: 'i-lucide-search',
    onClick: scrollToResultsSection,
  },
]);

const logos = [
  'i-simple-icons-google',
  'i-simple-icons-amazon',
  'i-simple-icons-meta',
  'i-simple-icons-microsoft',
  'i-simple-icons-apple',
  'i-simple-icons-adobe',
  'i-simple-icons-slack',
  'i-simple-icons-shopify',
];

useHead({
  title: 'Find Your Next SaaS - Discover the Best Software Companies',
  meta: [
    {
      name: 'description',
      content: description.value,
    },
  ],
});

const {
  companies,
  total,
  totalPages,
  pending,
  search,
  page,
  limit,
  generatePaginationLink,
} = useCompanies({ limit: 12 });

const resultsSectionRef = useTemplateRef('resultsSection');
function scrollToResultsSection() {
  resultsSectionRef.value?.$el.scrollIntoView({ behavior: 'smooth' });
}

const { categories, pending: categoriesPending } = useCategories({
  limit: 12,
  entityType: 'company',
});
function handleViewAllCategories() {
  navigateTo('/categories');
}
</script>

<template>
  <UPage>
    <UPageBody>
      <UPageHero
        :title="title"
        :description="description"
        :links="links"
        headline="Discover SaaS Companies"
        class="mb-0"
      >
        <UPageLogos
          :items="logos"
          :marquee="{ pauseOnHover: true }"
          :ui="{ logo: 'opacity-50' }"
        />
      </UPageHero>

      <UPageSection
        title="Browse by Category"
        description="Explore companies by category to find exactly what you need"
      >
        <CategoryList
          :categories="categories"
          :pending="categoriesPending"
          :limit="12"
          @view-all="handleViewAllCategories"
        />
      </UPageSection>

      <UPageSection ref="resultsSection" title="Search Companies">
        <UInput
          v-model="search"
          icon="i-lucide-search"
          size="xl"
          placeholder="Search companies..."
          class="w-full max-w-2xl mx-auto"
          color="neutral"
          variant="subtle"
        >
          <template v-if="search.length" #trailing>
            <UButton
              color="neutral"
              variant="link"
              size="md"
              icon="i-lucide-circle-x"
              aria-label="Clear search"
              @click="search = ''"
            />
          </template>
        </UInput>

        <CompanyList
          :companies="companies"
          :pending="pending"
          :search="search"
          :total="total"
          @clear-search="search = ''"
        />

        <div v-if="!pending && totalPages > 1" class="flex justify-center">
          <UPagination
            v-model:page="page"
            :items-per-page="limit"
            :to="generatePaginationLink"
            :total="total"
            size="lg"
          />
        </div>
      </UPageSection>
    </UPageBody>
  </UPage>
</template>
