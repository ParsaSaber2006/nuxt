// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.css',
    '~/assets/styles/fonts.scss',
    '~/assets/styles/app.scss',
    '~/assets/styles/vuetify.scss',
    '~/assets/styles/_variables.scss'
  ],
  build: {
    transpile: ['vuetify'],
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  app:{
    head:{
      script:[
        {src:'/js/app.js', type:'module'}
      ]
    }
  }
})
