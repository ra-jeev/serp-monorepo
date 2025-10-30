// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@serp/ui'],
  modules: ['nitro-cloudflare-dev', '@nuxtjs/seo'],
  devtools: { enabled: true },
  css: ['~/assets/css/typography.css'],
  compatibilityDate: '2025-07-15',
  nitro: {
    preset: 'cloudflare_module',
    rollupConfig: {
      external: ['pg-native'],
    },
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
  },
});
