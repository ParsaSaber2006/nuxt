import { createApp } from 'vue';
import App from './App.vue';

import router from './router';
import { createPinia } from 'pinia';
import vuetify from './plugins/vuetify'; 
import piniaPersistedstate from 'pinia-plugin-persistedstate';
import Toast, { POSITION } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import PersianDatePicker from "vue3-persian-datetime-picker"

import components from "./components"

const options = {
      position: POSITION.TOP_RIGHT,
      timeout: 3000,
      // ... other options
    };

const pinia = createPinia();
pinia.use(piniaPersistedstate);

createApp(App)
  .use(router)
  .use(pinia)
  .use(components)
  .use(vuetify)
  .use(Toast,options)
  
  .component("date-picker", PersianDatePicker)
  .mount('#app');
