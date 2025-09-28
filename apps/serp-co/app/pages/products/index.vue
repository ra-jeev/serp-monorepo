<script setup lang="ts">
useSeoMeta({
  title: 'Browse Products - Find Your Next SaaS',
  description:
    'Browse and search through our comprehensive database of SaaS companies. Filter by category, sort by different criteria, and find the perfect solution for your needs.',
});

const {
  companies,
  total,
  totalPages,
  pending,
  search,
  category,
  sortBy,
  page,
  limit,
  generatePaginationLink,
} = useCompanies({ limit: 50 });

const { categories, pending: categoriesPending } = useCategories({
  limit: 150,
  entityType: 'company',
});

const categoryObject = computed({
  get: () => {
    if (!category.value) {
      return undefined;
    }

    const matchingCategory = categories.value.find(
      (cat) => cat.slug === category.value,
    );

    return matchingCategory
      ? {
          value: category.value,
          label: matchingCategory.name,
        }
      : undefined;
  },
  set: (value: { value: string; label: string } | undefined) => {
    category.value = value?.value || '';
  },
});

const { breadcrumbs } = useBreadcrumbs();
</script>

<template>
  <UContainer>
    <UPage>
      <UPageHeader
        title="Browse Products"
        description="Discover and compare software companies with powerful search and filtering options."
      >
        <template #headline>
          <UBreadcrumb class="mb-6" :items="breadcrumbs" />
        </template>
      </UPageHeader>

      <UPageBody>
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div class="lg:col-span-1">
            <div class="sticky top-(--ui-header-height)">
              <UCard>
                <template #header>
                  <h2 class="text-lg font-semibold text-highlighted">
                    Filter & Search
                  </h2>
                </template>

                <CompaniesFilter
                  v-model:search="search"
                  v-model:category="categoryObject"
                  v-model:sort-by="sortBy"
                  :categories="categories"
                  :categories-pending="categoriesPending"
                />
              </UCard>
            </div>
          </div>

          <div class="lg:col-span-3 space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <div
                  v-if="!pending && total > 0"
                  class="flex items-center gap-3"
                >
                  <UBadge variant="subtle" size="lg">
                    {{ total.toLocaleString() }}
                    {{ total === 1 ? 'company' : 'companies' }}
                  </UBadge>
                  <div v-if="search || category" class="text-sm text-muted">
                    <template v-if="search && category">
                      for "{{ search }}" in
                      {{ categories.find((c) => c.slug === category)?.name }}
                    </template>
                    <template v-else-if="search"> for "{{ search }}" </template>
                    <template v-else-if="category">
                      in {{ categories.find((c) => c.slug === category)?.name }}
                    </template>
                  </div>
                </div>
              </div>

              <div class="hidden sm:flex items-center gap-2">
                <span class="text-sm text-muted">View:</span>
                <UFieldGroup size="sm">
                  <UButton variant="soft" icon="i-lucide-grid-3x3">
                    Grid
                  </UButton>
                  <UButton variant="ghost" icon="i-lucide-list" disabled>
                    List
                  </UButton>
                </UFieldGroup>
              </div>
            </div>

            <CompanyList
              :companies="companies"
              :pending="pending"
              :search="search"
              :total="total"
              @reset-search="search = ''"
            />

            <div
              v-if="!pending && totalPages > 1"
              class="flex justify-center pt-8"
            >
              <UPagination
                v-model:page="page"
                :items-per-page="limit"
                :to="generatePaginationLink"
                :total="total"
                size="lg"
                :max="7"
                show-first
                show-last
              />
            </div>
          </div>
        </div>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
