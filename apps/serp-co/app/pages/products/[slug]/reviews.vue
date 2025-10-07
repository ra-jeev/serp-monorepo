<script setup lang="ts">
import type { CompanyDetailResponse } from '@serp/api/companies';

const route = useRoute();
const slug = route.params.slug as string;

const company = await useCompanyDetails(slug);

const companyLinks = computed(() => {
  if (!company.serplyLink) {
    return [];
  }

  return [
    {
      label: company.domain || 'Visit Website',
      icon: 'i-lucide-external-link',
      trailing: true,
      to: company.serplyLink,
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
  tags: { targetId: 'tags', label: 'Tags' },
  content: { targetId: 'details', label: 'Details' },
  alternatives: { targetId: 'alternatives', label: `Alternatives` },
};

const contentRef = useTemplateRef('contentRef');
const addContentLinks = false;
const tocLinks = computed(() => {
  const links: TocLink[] = [];
  for (const key of Object.keys(navLinksMap)) {
    const _key = key as keyof CompanyDetailResponse;
    const value = company[_key];

    const addLink = Array.isArray(value) ? value.length > 0 : Boolean(value);
    if (addLink) {
      const link = navLinksMap[_key];
      if (link) {
        if (_key === 'alternatives') {
          link.targetLabel = `${company.name} Alternatives`;
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
const scrollTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

async function scrollToContent(id: string) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
    if (scrollTimeout.value) {
      clearTimeout(scrollTimeout.value);
    }

    scrollTimeout.value = setTimeout(() => {
      router.push({ hash: `#${id}` });
    }, 1000);
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

onUnmounted(() => {
  if (scrollTimeout.value) {
    clearTimeout(scrollTimeout.value);
  }
});

useSeoMeta({
  title: () => company.name,
  description: () => company.oneLiner || company.excerpt,
});

const { breadcrumbs } = useBreadcrumbs(
  computed(() => ({
    companyName: company.name,
  })),
);
</script>

<template>
  <UContainer>
    <UPage>
      <UPageHeader :links="companyLinks">
        <template #headline>
          <UBreadcrumb class="mb-6" :items="breadcrumbs" />
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
        <CompanyDetailSection
          v-if="company.excerpt"
          :id="navLinksMap.excerpt?.targetId"
          :title="getTitle('excerpt')"
        >
          <p class="text-toned">{{ company.excerpt }}</p>
        </CompanyDetailSection>

        <CompanyDetailSection
          v-if="company.categories?.length"
          :id="navLinksMap.categories?.targetId"
          :title="getTitle('categories')"
        >
          <div class="flex flex-wrap gap-2">
            <NuxtLink
              v-for="category in company.categories"
              :key="category.id"
              :to="`/products/best/${category.slug}`"
            >
              <UBadge :label="category.name" size="xl" variant="subtle" />
            </NuxtLink>
          </div>
        </CompanyDetailSection>

        <CompanyDetailSection
          v-if="company.content"
          :id="navLinksMap.content?.targetId"
          :title="getTitle('content')"
        >
          <div
            ref="contentRef"
            class="prose prose-primary dark:prose-invert max-w-none"
            v-html="company.content"
          />
        </CompanyDetailSection>

        <CompanyDetailSection
          v-if="company.tags?.length"
          :id="navLinksMap.tags?.targetId"
          :title="getTitle('tags')"
        >
          <div class="flex flex-wrap gap-2">
            <UBadge
              v-for="tag in company.tags"
              :key="tag.id"
              :label="tag.name"
              size="lg"
              variant="outline"
              color="neutral"
            />
          </div>
        </CompanyDetailSection>

        <CompanyDetailSection
          v-if="company.alternatives?.length"
          :id="navLinksMap.alternatives?.targetId"
          :title="getTitle('alternatives')"
        >
          <CompanyCollection :companies="company.alternatives" />
        </CompanyDetailSection>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
