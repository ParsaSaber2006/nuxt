// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    'pinia-plugin-persistedstate',
    'vuetify-nuxt-module'
    ],
    css: [
      '~/assets/scss/_variables.scss',
      '~/assets/scss/app.scss',
      '~/assets/scss/fonts.scss',
      '~/assets/scss/vuetify.scss'
    ],
    vite: {
    optimizeDeps: {
      include: [
        'pinia-plugin-persistedstate',
      ]
    }
  }
})