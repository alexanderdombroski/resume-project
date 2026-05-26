// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    mongoUri: process.env.MONGO_URI,
  },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', sizes: '64x64', href: '/favicon-64.png' },
        { rel: 'icon', type: 'image/png', sizes: '128x128', href: '/favicon-128.png' },
      ],
    },
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  vite: {
    optimizeDeps: {
      include: ['@vue/devtools-core', '@vue/devtools-kit'],
    },
  },
  modules: ['@nuxt/eslint'],
  routeRules: {
    '/': { prerender: true },
    '/features': { prerender: true },
    '/dashboard': { prerender: true },
    '/api/**': { prerender: false },
  },
  nitro: {
    vercel: {
      config: {},
    },
  },
});
