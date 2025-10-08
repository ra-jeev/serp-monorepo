<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug as string;

const { post, categories, tags, relatedPosts } = await usePostDetails(slug);

useSeoMeta({
  title: () => `${post.name} - Serp Blog`,
  description: () =>
    post.excerpt || `Read about ${post.name} on our Serp blog.`,
});

const { breadcrumbs } = useBreadcrumbs(
  computed(() => ({
    postName: post.name,
  })),
);

const publishDate = computed(() => {
  if (!post.createdAt) return '';
  return new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

const relatedArticles = computed(() =>
  relatedPosts.map((post) => ({
    to: `/blog/${post.slug}`,
    title: post.name,
    description: post.excerpt ?? undefined,
    date: post.createdAt,
    authors: post.author ? [{ name: post.author }] : [],
  })),
);
</script>

<template>
  <UContainer>
    <UPage>
      <UPageHeader :title="post.name">
        <template #headline>
          <UBreadcrumb class="mb-6" :items="breadcrumbs" />
        </template>

        <template #description>
          <p v-if="post.excerpt">
            {{ post.excerpt }}
          </p>

          <UUser
            v-if="post.author"
            class="mt-4"
            :avatar="{ alt: post.author }"
            :description="publishDate"
            :name="post.author"
          />
        </template>
      </UPageHeader>

      <UPageBody>
        <img
          v-if="post.featuredImage"
          :src="post.featuredImage"
          :alt="post.name"
          class="w-full h-64 md:h-80 object-cover rounded-lg"
        >

        <div
          v-if="post.content"
          class="prose prose-zinc dark:prose-invert max-w-none"
          v-html="post.content"
        />

        <div class="grid md:grid-cols-2 gap-6">
          <div v-if="categories.length > 0" class="space-y-4">
            <h2 class="text-2xl font-bold text-highlighted">Categories</h2>
            <div class="flex flex-wrap gap-2">
              <NuxtLink
                v-for="category in categories"
                :key="category.id"
                :to="`/products/best/${category.slug}`"
              >
                <UBadge
                  variant="subtle"
                  color="primary"
                  class="hover:bg-primary/20 transition-colors"
                >
                  {{ category.name }}
                </UBadge>
              </NuxtLink>
            </div>
          </div>

          <div v-if="tags.length > 0" class="space-y-4">
            <h2 class="text-2xl font-bold text-highlighted">Tags</h2>
            <div class="flex flex-wrap gap-2">
              <UBadge
                v-for="tag in tags"
                :key="tag.id"
                variant="outline"
                color="neutral"
              >
                {{ tag.name }}
              </UBadge>
            </div>
          </div>
        </div>

        <div v-if="relatedArticles.length > 0" class="space-y-6">
          <h2 class="text-2xl font-bold text-highlighted">Related Articles</h2>
          <UBlogPosts :posts="relatedArticles" />
        </div>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
