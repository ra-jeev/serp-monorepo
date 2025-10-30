// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@serp/ui'],
  modules: ['nitro-cloudflare-dev', '@nuxtjs/seo'],
  devtools: { enabled: true },
  css: ['~/assets/css/typography.css'],
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://serp.co',
    name: process.env.NUXT_PUBLIC_SITE_NAME || 'SERP',
  },
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
  ogImage: {
    enabled: false,
  },
  schemaOrg: {
    identity: 'Organization',
  },
  seo: {
    meta: {
      themeColor: [
        { content: '#18181b', media: '(prefers-color-scheme: dark)' },
        { content: 'white', media: '(prefers-color-scheme: light)' },
      ],
    },
  },
  sitemap: {
    // sitemapsPathPrefix: '/',
    defaultSitemapsChunkSize: 10000,
    sitemaps: {
      ['sitemap-pages']: {
        includeAppSources: true,
      },
      ['sitemap-products']: {
        sources: ['/api/__sitemap__/urls/products'],
        chunks: true,
      },
      ['sitemap-posts']: {
        sources: ['/api/__sitemap__/urls/posts'],
        chunks: true,
      },
    },
  },
});
