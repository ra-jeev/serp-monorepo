<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug as string;

const { post, categories, tags, relatedPosts } = await usePostDetails(slug);

const title = computed(
  () =>
    `${post.name} - ${post.type === 'blog' ? 'Serp Blog' : 'AI Glossary Definition'}`,
);
const description = computed(() => {
  if (post.excerpt) return post.excerpt;
  if (post.type === 'blog') return `Read about ${post.name} on our Serp blog.`;
  return `Learn about ${post.name} - comprehensive definition and explanation of this AI/ML term.`;
});

useSeoMeta({
  title: title.value,
  description: description.value,
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
    to: `/posts/${post.slug}`,
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
      <UPageHeader v-if="post.type === 'blog'" :title="post.name">
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
      <UPageHeader v-else>
        <template #headline>
          <UBreadcrumb class="mb-6" :items="breadcrumbs" />
        </template>

        <template #title>
          <div class="flex items-center gap-4">
            <div
              class="size-16 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center"
            >
              <UIcon name="i-lucide-book-open" class="size-8 text-primary" />
            </div>
            <div>
              <h1>
                {{ post.name }}
              </h1>
              <p v-if="post.excerpt" class="text-lg text-toned mt-1">
                {{ post.excerpt }}
              </p>
            </div>
          </div>
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
                :to="`/posts/category/${category.slug}`"
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

        <div v-if="relatedPosts.length > 0" class="space-y-6">
          <h2 class="text-2xl font-bold text-highlighted">
            Related {{ post.type === 'blog' ? 'Articles' : 'Terms' }}
          </h2>
          <UBlogPosts v-if="post.type === 'blog'" :posts="relatedArticles" />
          <template v-else>
            <NuxtLink
              v-for="relatedPost in relatedPosts"
              :key="relatedPost.id"
              :to="`/posts/${relatedPost.slug}`"
            >
              <GlossaryCard
                :title="relatedPost.name"
                :description="relatedPost.excerpt"
              />
            </NuxtLink>
          </template>
        </div>

        <div v-if="post.videoId" class="space-y-6">
          <h2 class="text-2xl font-bold text-highlighted">Video Explanation</h2>
          <UCard>
            <div class="aspect-video">
              <iframe
                :src="`https://www.youtube.com/embed/${post.videoId}`"
                title="Video explanation"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                class="w-full h-full rounded-lg"
              />
            </div>
          </UCard>
        </div>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
