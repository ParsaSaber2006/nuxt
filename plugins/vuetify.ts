import { defineNuxtPlugin } from '#app';
import { createVuetify } from 'vuetify';
import 'vuetify/lib/styles/main.sass';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    icons: {
      defaultSet: 'mdi',
    },
  });

  nuxtApp.vueApp.use(vuetify);
});