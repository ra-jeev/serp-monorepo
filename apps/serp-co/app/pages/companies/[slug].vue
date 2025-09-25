<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug as string;

const { data: company, pending } = useCompanyDetails(slug);

const companyLinks = computed(() => {
  if (!company.value || !company.value.serplyLink) {
    return [];
  }

  return [
    {
      label: company.value.domain || 'Visit Website',
      icon: 'i-lucide-external-link',
      trailing: true,
      to: company.value.serplyLink,
      target: '_blank',
    },
  ];
});

useSeoMeta({
  title: () => company.value?.name || 'Company',
  description: () => company.value?.oneLiner,
});
</script>

<template>
  <UContainer v-if="!pending && company">
    <UPage>
      <UPageHeader :links="companyLinks">
        <template #headline>
          <UButton
            variant="link"
            icon="i-lucide-arrow-left"
            @click="$router.go(-1)"
          >
            Back to Companies
          </UButton>
        </template>
        <template #title>
          <div class="flex items-center gap-6">
            <UAvatar
              :src="company.logo || ''"
              :alt="company.name"
              class="size-20"
            />
            <div>
              <h1>
                {{ company.name }}
              </h1>
              <p class="mt-2 text-lg text-muted">
                {{ company.oneLiner }}
              </p>
            </div>
          </div>
        </template>
      </UPageHeader>

      <UPageBody>
        <CompanyDetailsCard
          v-if="company.excerpt"
          id="overview"
          title="Overview"
        >
          <p class="text-toned">{{ company.excerpt }}</p>
        </CompanyDetailsCard>

        <CompanyDetailsCard
          v-if="company.categories?.length"
          id="categories"
          title="Related Categories"
        >
          <div class="flex flex-wrap gap-2">
            <UBadge
              v-for="category in company.categories"
              :key="category.id"
              :label="category.name"
              size="lg"
              variant="subtle"
            />
          </div>
        </CompanyDetailsCard>

        <CompanyDetailsCard
          v-if="company.excerpt"
          id="details"
          title="More Details"
        >
          <div
            ref="contentRef"
            class="prose prose-primary dark:prose-invert max-w-none"
            v-html="company.content"
          />
        </CompanyDetailsCard>

        <CompanyDetailsCard
          v-if="company.hydratedAlternatives?.length"
          id="alternatives"
          :title="`Alternatives to ${company.name}`"
        >
          <UPageGrid>
            <CompanyCard
              v-for="altCompany in company.hydratedAlternatives"
              :key="altCompany.id"
              :company="altCompany"
            />
          </UPageGrid>
        </CompanyDetailsCard>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
