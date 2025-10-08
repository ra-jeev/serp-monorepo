<script setup lang="ts">
const { groupedPosts, availableLetters, total, pending } = useGlossary();

const jumpToLetter = (letter: string) => {
  const element = document.getElementById(`letter-${letter}`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

useSeoMeta({
  title: 'Glossary - Complete AI & Machine Learning Terms Dictionary',
  description:
    'Comprehensive glossary of AI and machine learning terms. Browse alphabetically through definitions, explanations, and key concepts in artificial intelligence.',
});

const { breadcrumbs } = useBreadcrumbs();
</script>

<template>
  <UContainer>
    <UPage>
      <UPageHeader
        title="Glossary"
        description="Comprehensive definitions of AI and machine learning terms, organized alphabetically for easy reference."
      >
        <template #headline>
          <UBreadcrumb class="mb-6" :items="breadcrumbs" />
        </template>
      </UPageHeader>

      <UPageBody class="space-y-8">
        <p v-if="total > 0" class="text-toned text-center">
          {{ total.toLocaleString() }}
          {{ total === 1 ? 'term defined' : 'terms defined' }}
        </p>

        <div
          v-if="availableLetters.length > 0"
          class="flex flex-wrap gap-3 justify-center p-4 bg-accented rounded-xl sticky top-(--ui-header-height)"
        >
          <UButton
            v-for="letter in availableLetters"
            :key="letter"
            :label="letter"
            class="font-bold text-lg"
            color="neutral"
            size="xl"
            variant="subtle"
            @click="jumpToLetter(letter)"
          />
        </div>

        <div v-if="!pending && availableLetters.length > 0" class="space-y-10">
          <div
            v-for="letter in availableLetters"
            :id="`letter-${letter}`"
            :key="letter"
            class="scroll-mt-[calc(var(--ui-header-height)+76px)]"
          >
            <div class="flex items-center gap-6 mb-6">
              <div
                class="flex size-16 items-center justify-center rounded-xl bg-elevated font-bold text-3xl"
              >
                {{ letter }}
              </div>
              <USeparator class="flex-1" />
            </div>

            <div class="grid gap-4 ml-4">
              <NuxtLink
                v-for="post in groupedPosts[letter]"
                :key="post.id"
                :to="`/glossary/${post.slug}`"
              >
                <GlossaryCard :title="post.name" :description="post.excerpt" />
              </NuxtLink>
            </div>
          </div>
        </div>

        <div v-if="pending" class="space-y-8">
          <div v-for="i in 5" :key="i">
            <div class="flex items-center gap-4 mb-4">
              <USkeleton class="size-12 rounded-xl" />
              <USkeleton class="h-px flex-1" />
            </div>
            <div class="space-y-3">
              <UCard v-for="j in 3" :key="j">
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <USkeleton class="h-6 w-1/3 mb-2" />
                    <USkeleton class="h-4 w-full" />
                  </div>
                  <USkeleton class="size-5 ml-4" />
                </div>
              </UCard>
            </div>
          </div>
        </div>

        <div v-if="!pending && total === 0" class="text-center py-12">
          <UIcon
            name="i-lucide-book-open"
            class="size-12 text-gray-400 mx-auto mb-4"
          />
          <h3 class="text-lg font-medium text-highlighted mb-2">
            No glossary terms found
          </h3>
          <p class="text-muted">
            The glossary is being updated. Please check back soon.
          </p>
        </div>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
