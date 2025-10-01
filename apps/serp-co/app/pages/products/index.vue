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
  viewMode,
} = useCompanies({ limit: 24 });

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
            <CompanyFilters
              v-model:search="search"
              v-model:category="categoryObject"
              v-model:sort-by="sortBy"
              class="sticky top-(--ui-header-height)"
              :categories="categories"
              :categories-pending="categoriesPending"
            />
          </div>

          <div class="lg:col-span-3 space-y-6">
            <div
              v-if="!pending && total > 0"
              class="flex items-center justify-between"
            >
              <div class="flex items-center gap-3">
                <UBadge color="neutral" variant="subtle" size="lg">
                  {{ total.toLocaleString() }}
                  {{ total === 1 ? 'company' : 'companies' }}
                </UBadge>
                <div v-if="search || category" class="text-sm text-muted">
                  <template v-if="search"> for "{{ search }}" </template>
                  <template v-if="categoryObject">
                    in {{ categoryObject.label }}
                  </template>
                </div>
              </div>

              <div class="hidden sm:flex items-center gap-2">
                <span class="text-sm text-muted">View:</span>
                <UFieldGroup size="sm">
                  <UButton
                    icon="i-lucide-grid-2x2"
                    variant="subtle"
                    :color="viewMode === 'grid' ? 'primary' : 'neutral'"
                    @click="viewMode = 'grid'"
                  >
                    Grid
                  </UButton>
                  <UButton
                    icon="i-lucide-list"
                    variant="subtle"
                    :color="viewMode === 'list' ? 'primary' : 'neutral'"
                    @click="viewMode = 'list'"
                  >
                    List
                  </UButton>
                </UFieldGroup>
              </div>
            </div>

            <CompanyCollection
              has-sidebar
              :companies="companies"
              :pending="pending"
              :search="search"
              :view-mode="viewMode"
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
          </div>
        </div>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
