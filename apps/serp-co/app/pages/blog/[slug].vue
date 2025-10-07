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
</script>

<template>
  <UContainer>
    <UPage>
      <UPageHeader>
        <template #headline>
          <UBreadcrumb class="mb-6" :items="breadcrumbs" />
        </template>

        <template #title>
          <div class="space-y-4">
            <div class="flex items-center gap-4">
              <div
                class="size-16 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center"
              >
                <UIcon name="i-lucide-file-text" class="size-8 text-primary" />
              </div>
              <div class="flex-1">
                <h1 class="text-3xl font-bold text-highlighted">
                  {{ post.name }}
                </h1>
                <div class="flex items-center gap-4 mt-2 text-muted">
                  <span v-if="post.author">By {{ post.author }}</span>
                  <span>{{ publishDate }}</span>
                </div>
              </div>
            </div>
            <p v-if="post.excerpt" class="text-lg text-toned">
              {{ post.excerpt }}
            </p>
          </div>
        </template>
      </UPageHeader>

      <UPageBody class="space-y-8">
        <div v-if="post.featuredImage" class="space-y-4">
          <UCard>
            <img
              :src="post.featuredImage"
              :alt="post.name"
              class="w-full h-64 md:h-80 object-cover rounded-lg"
            >
          </UCard>
        </div>

        <UCard>
          <div
            v-if="post.content"
            class="prose prose-gray dark:prose-invert max-w-none prose-headings:text-highlighted prose-p:text-muted prose-strong:text-highlighted prose-ul:text-muted prose-ol:text-muted prose-li:text-muted prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 dark:prose-pre:bg-gray-800 prose-lg"
            v-html="post.content"
          />
        </UCard>

        <div class="grid md:grid-cols-2 gap-6">
          <div v-if="categories.length > 0" class="space-y-4">
            <h3 class="text-lg font-semibold text-highlighted">Categories</h3>
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
            <h3 class="text-lg font-semibold text-highlighted">Tags</h3>
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
          <h3 class="text-lg font-semibold text-highlighted">
            Related Articles
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <NuxtLink
              v-for="relatedPost in relatedPosts"
              :key="relatedPost.id"
              :to="`/blog/${relatedPost.slug}`"
              class="group"
            >
              <UCard class="h-full transition-all duration-200 hover:shadow-md">
                <div class="space-y-3">
                  <h4
                    class="font-semibold text-highlighted group-hover:text-primary transition-colors"
                  >
                    {{ relatedPost.name }}
                  </h4>
                  <p
                    v-if="relatedPost.excerpt"
                    class="text-muted text-sm line-clamp-3"
                  >
                    {{ relatedPost.excerpt }}
                  </p>
                </div>
              </UCard>
            </NuxtLink>
          </div>
        </div>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
