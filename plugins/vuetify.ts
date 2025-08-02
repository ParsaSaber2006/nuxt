import { createVuetify } from 'vuetify';

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    // تنظیمات Vuetify
  });
  nuxtApp.vueApp.use(vuetify);
});