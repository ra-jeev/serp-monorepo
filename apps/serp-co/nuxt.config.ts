// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@serp/ui'],
  devtools: { enabled: true },
  css: ['~/assets/css/typography.css'],
  compatibilityDate: '2025-07-15',
});
