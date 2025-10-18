<script setup lang="ts">
import type { FooterColumn, NavigationMenuItem } from '@nuxt/ui';

const { site } = useAppConfig();

const companyName = site.name;
const socialLinks = site.socialLinks;
const footerColumnsData: FooterColumn[] = site.footerColumns;
const legalLinks: NavigationMenuItem[] = site.legalLinks;
</script>

<template>
  <UFooter>
    <template #top>
      <UContainer>
        <UFooterColumns :columns="footerColumnsData">
          <template #left>
            <div class="flex flex-col">
              <span
                class="text-primary-100 dark:text-primary-100 pb-4 text-4xl font-bold"
              >
                {{ companyName }}
              </span>
              <div class="flex gap-x-2 items-center">
                <UButton
                  v-for="social in socialLinks"
                  :key="social.name"
                  :to="social.href"
                  :icon="social.icon"
                  :aria-label="social.name"
                  color="neutral"
                  target="_blank"
                  variant="ghost"
                />
              </div>
            </div>
          </template>
        </UFooterColumns>
      </UContainer>
    </template>

    <template #left>
      <p class="text-muted text-sm">
        Copyright © {{ new Date().getFullYear() }} {{ companyName }}. All rights reserved.
      </p>
    </template>

    <template #right>
      <UNavigationMenu :items="legalLinks" variant="link" />
    </template>

    <!-- <template #bottom>
      <div
        class="mx-auto flex max-w-[1248px] flex-col items-start justify-between px-4 pb-8 md:flex-row md:items-center"
        data-testid="footer-bottom-section"
      >
        <div
          aria-label="Legal Navigation"
          class="flex flex-col text-sm sm:items-center md:flex-row"
          data-testid="legal-links-container"
        >
          <div
            class="flex flex-col flex-wrap justify-center gap-4 sm:flex-row md:justify-end"
            data-testid="legal-links-list"
          >
            <NuxtLink
              v-for="link in legalLinks"
              :key="link.text"
              :to="link.slug"
              class="text-primary-100 dark:text-primary-100"
              data-testid="legal-link"
            >
              {{ link.text }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </template> -->
  </UFooter>
</template>
