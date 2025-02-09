// https://nuxt.com/docs/api/configuration/nuxt-config

import Aura from '@primevue/themes/aura';

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: [
    'primeflex/themes/primeone-light.css ',
    'primeflex/primeflex.css',
    '~/assets/styles/global.css'
  ],
  modules: [
    '@primevue/nuxt-module',
    '@pinia/nuxt',
  ],
  primevue: {
    options: {
      theme: {
        preset: Aura
      }
    },
  }
})