<template>
  <div>

    <!-- <router-view /> -->

    <layout></layout>
    <!-- فقط وقتی ورود انجام شده باشه دکمه خروج نمایش داده میشه -->
    <!-- <button v-if="auth.token" @click="logout">خروج</button> -->
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Layout from "./layout/default.vue";
import { computed, provide } from 'vue';
import { useOptionsStore } from "./stores/options";

const auth = useAuthStore();
const router = useRouter();

// چک کن اگه لاگین نیست، ریدایرکت کن به login
// if (!auth.token) {
//   router.push('/users/view/guest');
// }

const logout = async () => {
  try {
    await axios.post('/api/logout', null, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
  } catch (e) {
    // حتی اگه logout خطا داد، ادامه بده
  }

  auth.logout();
  router.push('/login');
};

const optionsStore = useOptionsStore();
const options = computed(() => optionsStore)
provide("optionsStore", options);


</script>
