<script setup lang="ts">
import type { Post } from '~/types';

interface Props {
  posts: Post[];
  pending: boolean;
  limit: number;
  showCategories?: boolean;
}

const { posts, pending, limit, showCategories = false } = defineProps<Props>();

const getPublishDate = (date: Date | undefined) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
</script>

<template>
  <div v-if="!pending && posts.length > 0" class="grid grid-cols-1 gap-4">
    <NuxtLink
      v-for="post in posts"
      :key="post.id"
      :to="`/posts/${post.slug}`"
      class="group"
    >
      <UCard class="transition-all duration-200 hover:shadow-md">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-start gap-2.5">
              <UIcon
                :name="
                  post.type === 'blog'
                    ? 'i-lucide-file-text'
                    : 'i-lucide-book-open'
                "
                :class="
                  post.type === 'blog' ? 'text-blue-500' : 'text-green-500'
                "
                class="size-4 mt-1 flex-shrink-0"
              />
              <h3
                class="font-semibold text-highlighted group-hover:text-primary transition-colors line-clamp-2"
              >
                {{ post.name }}
              </h3>
            </div>
            <p v-if="post.excerpt" class="text-muted text-sm mt-1 line-clamp-2">
              {{ post.excerpt }}
            </p>
            <UUser
              v-if="post.author"
              class="mt-3"
              :avatar="{ alt: post.author }"
              :description="getPublishDate(post.createdAt)"
              :name="post.author"
            />

            <div
              v-if="showCategories && post.categories?.length"
              class="flex flex-wrap gap-2 mt-4"
            >
              <NuxtLink
                v-for="category in post.categories"
                :key="category.id"
                :to="`/posts/category/${category.slug}`"
                @click.stop
              >
                <UBadge variant="subtle" color="neutral">
                  {{ category.name }}
                </UBadge>
              </NuxtLink>
            </div>
          </div>
          <UIcon
            name="i-lucide-arrow-right"
            class="size-5 text-muted group-hover:text-primary transition-colors ml-4 flex-shrink-0"
          />
        </div>
      </UCard>
    </NuxtLink>
  </div>

  <div v-if="pending" class="grid grid-cols-1 gap-4">
    <UCard v-for="i in limit" :key="i">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <USkeleton class="h-6 w-full mb-2" />
          <USkeleton class="h-4 w-4/5 mb-3" />
          <div class="flex items-center gap-2">
            <USkeleton class="size-6 rounded-full" />
            <USkeleton class="h-4 w-24" />
          </div>
          <div v-if="showCategories" class="flex gap-2 mt-4">
            <USkeleton class="h-6 w-16 rounded-full" />
            <USkeleton class="h-6 w-20 rounded-full" />
          </div>
        </div>
        <USkeleton class="size-5 ml-4" />
      </div>
    </UCard>
  </div>
</template>
