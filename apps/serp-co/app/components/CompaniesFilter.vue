<script setup lang="ts">
import type { CompanySortOption } from '@serp/api/companies';

type Category = {
  id: number;
  name: string;
  slug: string;
  entityType: string;
};

const { categories } = defineProps<{
  categories: Category[];
  categoriesPending?: boolean;
}>();

const search = defineModel<string>('search', { default: '' });
const categoryModel = defineModel<{ value: string; label: string } | undefined>(
  'category',
  { default: undefined },
);
const sortBy = defineModel<CompanySortOption>('sortBy', {
  default: 'name-asc',
});

const sortOptions = [
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'recent', label: 'Recently Added' },
  { value: 'updated', label: 'Recently Updated' },
];

const categoryOptions = computed(() => [
  { value: '', label: 'All Categories' },
  ...categories.map((cat) => ({
    value: cat.slug,
    label: cat.name,
  })),
]);

const category = computed({
  get: () => categoryModel.value?.value || '',
  set: (value: string) => {
    const option = categoryOptions.value.find((opt) => opt.value === value);
    categoryModel.value = option || undefined;
  },
});

const hasActiveFilters = computed(() => {
  return !!(search.value || category.value);
});

function clearAllFilters() {
  search.value = '';
  categoryModel.value = undefined;
  sortBy.value = 'name-asc';
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <label class="block text-sm font-medium text-highlighted mb-2">
        Search Products
      </label>
      <UInput
        v-model="search"
        icon="i-lucide-search"
        size="lg"
        placeholder="Search companies..."
        class="w-full"
        color="neutral"
      >
        <template v-if="search.length" #trailing>
          <UButton
            color="neutral"
            variant="link"
            size="sm"
            icon="i-lucide-circle-x"
            aria-label="Clear search"
            @click="search = ''"
          />
        </template>
      </UInput>
    </div>

    <div>
      <label class="block text-sm font-medium text-highlighted mb-2">
        Category
      </label>
      <USelectMenu
        v-model="categoryModel"
        class="w-full"
        placeholder="All Categories"
        size="lg"
        :items="categoryOptions"
        :loading="categoriesPending"
        :search-input="{
          placeholder: 'Search categories...',
          icon: 'i-lucide-search',
        }"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-highlighted mb-2">
        Sort By
      </label>
      <USelect v-model="sortBy" :items="sortOptions" class="w-full" size="lg" />
    </div>

    <div v-if="hasActiveFilters" class="space-y-3">
      <div class="flex flex-wrap gap-2">
        <UBadge v-if="search" variant="soft" size="lg">
          Search: "{{ search }}"
          <UButton
            color="neutral"
            variant="link"
            size="sm"
            icon="i-lucide-x"
            class="ml-1 -mr-1"
            @click="search = ''"
          />
        </UBadge>

        <UBadge v-if="category" variant="soft" size="lg">
          Category: {{ categoryModel?.label || 'Unknown' }}
          <UButton
            color="neutral"
            variant="link"
            size="sm"
            icon="i-lucide-x"
            class="ml-1 -mr-1"
            @click="categoryModel = undefined"
          />
        </UBadge>
      </div>

      <UButton
        variant="outline"
        size="sm"
        icon="i-lucide-x"
        @click="clearAllFilters"
      >
        Clear All Filters
      </UButton>
    </div>
  </div>
</template>
