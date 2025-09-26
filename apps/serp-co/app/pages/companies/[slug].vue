<script setup lang="ts">
import type { CompanyDetailResponse } from '@serp/api/companies';

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

interface TocLink {
  targetId: string;
  targetLabel?: string;
  label: string;
}

const findLinksInContent = (contentElement: HTMLElement) => {
  const links: TocLink[] = [];
  const headings = contentElement.querySelectorAll('h2');
  headings.forEach((heading) => {
    const label = heading.textContent?.trim();
    if (label) {
      const id = label
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '');

      heading.id = id;

      links.push({
        targetId: id,
        label,
      });
    }
  });

  return links;
};

const navLinksMap: Partial<Record<keyof CompanyDetailResponse, TocLink>> = {
  excerpt: { targetId: 'overview', label: 'Overview' },
  categories: { targetId: 'categories', label: 'Categories' },
  content: { targetId: 'details', label: 'Details' },
  hydratedAlternatives: { targetId: 'alternatives', label: `Alternatives` },
};

const contentRef = useTemplateRef('contentRef');
const addContentLinks = false;
const tocLinks = computed(() => {
  if (!company.value) {
    return [];
  }

  const data = company.value;
  const links: TocLink[] = [];
  for (const key of Object.keys(navLinksMap)) {
    const _key = key as keyof CompanyDetailResponse;
    const value = data[_key];
    if ((Array.isArray(value) && value.length) || Boolean(value)) {
      const link = navLinksMap[_key];
      if (link) {
        if (_key === 'hydratedAlternatives') {
          link.targetLabel = `${company.value?.name} Alternatives`;
        }

        links.push(link);
        if (_key === 'content' && addContentLinks && contentRef.value) {
          links.push(...findLinksInContent(contentRef.value));
        }
      }
    }
  }

  return links;
});

const router = useRouter();
function scrollToContent(id: string) {
  const element = document.getElementById(id);
  if (element) {
    router.push({ hash: `#${id}` });
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

const getTitle = (key: keyof CompanyDetailResponse) => {
  return navLinksMap[key]?.targetLabel ?? navLinksMap[key]?.label;
};

onMounted(async () => {
  if (route.hash) {
    await nextTick();
    scrollToContent(route.hash);
  }
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

      <div
        ref="navLinks"
        class="bg-default overflow-x-auto sticky top-(--ui-header-height)"
      >
        <UFieldGroup>
          <UButton
            v-for="link in tocLinks"
            :key="link.targetId"
            color="neutral"
            variant="ghost"
            class="whitespace-nowrap"
            @click="scrollToContent(link.targetId)"
          >
            {{ link.label }}
          </UButton>
        </UFieldGroup>
      </div>

      <UPageBody class="mt-4 space-y-6">
        <CompanyDetailsCard
          v-if="company.excerpt"
          :id="navLinksMap.excerpt?.targetId"
          :title="getTitle('excerpt')"
        >
          <p class="text-toned">{{ company.excerpt }}</p>
        </CompanyDetailsCard>

        <CompanyDetailsCard
          v-if="company.categories?.length"
          :id="navLinksMap.categories?.targetId"
          :title="getTitle('categories')"
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
          v-if="company.content"
          :id="navLinksMap.content?.targetId"
          :title="getTitle('content')"
        >
          <div
            ref="contentRef"
            class="prose prose-primary dark:prose-invert max-w-none"
            v-html="company.content"
          />
        </CompanyDetailsCard>

        <CompanyDetailsCard
          v-if="company.hydratedAlternatives?.length"
          :id="navLinksMap.hydratedAlternatives?.targetId"
          :title="getTitle('hydratedAlternatives')"
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
