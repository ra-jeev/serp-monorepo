<script setup lang="ts">
const title = ref('Find Your Next SaaS');
const description = ref(
  'Discover and compare the best software companies in one place. Find the perfect solution for your business needs.',
);
const links = ref([
  {
    label: 'Search Companies',
    icon: 'i-lucide-search',
    to: '/products',
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

useSeoMeta({
  title: 'Find Your Next SaaS - Discover the Best Software Companies',
  description: description.value,
});

const {
  companies,
  total,
  totalPages,
  pending,
  search,
  page,
  limit: companiesLimit,
  generatePaginationLink,
} = useCompanies({ limit: 12 });

const {
  categories,
  limit: categoriesLimit,
  pending: categoriesPending,
} = useCategories({
  limit: 24,
  entityType: 'company',
});

function handleViewAllCategories() {
  navigateTo('/products/best');
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

      <UPageSection title="Search Companies">
        <div class="flex flex-col items-center gap-4">
          <UInput
            v-model="search"
            icon="i-lucide-search"
            size="xl"
            placeholder="Search companies..."
            class="w-full max-w-2xl"
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

          <UButton
            to="/products"
            color="neutral"
            variant="soft"
            icon="i-lucide-sliders-horizontal"
          >
            Advanced Search & Filters
          </UButton>
        </div>

        <CompanyList
          :companies="companies"
          :limit="companiesLimit"
          :pending="pending"
          :search="search"
          :total="total"
          @clear-search="search = ''"
        />

        <div v-if="!pending && totalPages > 1" class="flex justify-center">
          <UPagination
            v-model:page="page"
            :items-per-page="companiesLimit"
            :to="generatePaginationLink"
            :total="total"
            size="lg"
          />
        </div>
      </UPageSection>

      <UPageSection
        title="Browse by Category"
        description="Explore companies by category to find exactly what you need"
      >
        <CategoryList
          :categories="categories"
          :limit="categoriesLimit"
          :pending="categoriesPending"
          @view-all="handleViewAllCategories"
        />
      </UPageSection>
    </UPageBody>
  </UPage>
</template>
