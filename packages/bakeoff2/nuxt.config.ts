// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    mongoUri: process.env.MONGO_URI,
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
    '/dashboard': { prerender: true },
    '/api/**': { prerender: false },
  },
  nitro: {
    vercel: {
      config: {},
    },
  },
});
