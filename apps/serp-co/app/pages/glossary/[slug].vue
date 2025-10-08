<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug as string;

const { post, categories, tags, relatedPosts } = await usePostDetails(slug);

useSeoMeta({
  title: () => `${post.name} - AI Glossary Definition`,
  description: () =>
    post.excerpt ||
    `Learn about ${post.name} - comprehensive definition and explanation of this AI/ML term.`,
});

const { breadcrumbs } = useBreadcrumbs(
  computed(() => ({
    postName: post.name,
  })),
);
</script>

<template>
  <UContainer>
    <UPage>
      <UPageHeader v-if="post">
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
        <div
          v-if="post.content"
          class="prose prose-zinc dark:prose-invert max-w-none"
          v-html="post.content"
        />

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

        <div v-if="relatedPosts.length > 0" class="space-y-6">
          <h2 class="text-2xl font-bold text-highlighted">Related Terms</h2>
          <NuxtLink
            v-for="relatedPost in relatedPosts"
            :key="relatedPost.id"
            :to="`/glossary/${relatedPost.slug}`"
          >
            <GlossaryCard
              :title="relatedPost.name"
              :description="relatedPost.excerpt"
            />
          </NuxtLink>
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
