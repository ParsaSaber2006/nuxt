<template>
  <v-layout app full-height>
    <v-locale-provider app rtl>
      <v-app-bar
        app
        scroll-behavior="elevate"
        scroll-threshold="50"
        color="secondary"
        class="appbar"
      >
        <v-app-bar-nav-icon
          v-if="appNavDisplay"
          @click.stop="drawer = !drawer"
        />
        <a
          href="#"
          class="ms-5 site-name"
          style="padding: 0"
          @click.stop="router.push('/')"
        >
          <img v-if="siteLogo" class="mx-5" :src="siteLogo" height="50" />
          <span v-else>{{ siteName }}</span>
        </a>
        <div class="d-none d-md-block">
          <v-menu
            v-for="menu in optionsStore.get('mainMenu')"
            :key="menu.title"
            :open-on-hover="menu.childs && menu.childs.length > 0"
          >
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                :prepend-icon="menu.icon"
                :to="menu.url"
                :append-icon="menu.childs?.length > 0 ? 'mdi-menu-down' : ''"
              >
                {{ menu.title }}
              </v-btn>
            </template>
            <v-list nav density="compact" v-if="menu.childs?.length">
              <v-list-item
                v-for="submenu in menu.childs"
                :key="submenu.title"
                :to="submenu.url"
                color="primary"
                :prepend-icon="submenu.icon"
              >
                <v-list-item-title>
                  {{ submenu.title }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <v-spacer />
        <v-btn color="black" @click="handleClick" prepend-icon="mdi-account" rounded>
          <template #append>
            <v-icon v-if="isLogedIn && !auth.user.mobile_verified" color="warning">
              mdi-alert-circle-outline
            </v-icon>
          </template>
          <template v-if="isLogedIn">{{ auth.user.full_name }}</template>
          <template v-else>ورود/ثبت‌نام</template>
        </v-btn>
      </v-app-bar>
      <nav-drawer :drawer="drawer" @drawerChanged="drawerChanged" />
      <v-main>
        <breadcrumbs-auto />
        <app-progress />
        <router-view v-slot="{ Component, route }">
          <transition name="fade">
            <component :is="Component" :key="route.path" style="min-height: 500px" />
          </transition>
        </router-view>
      </v-main>
    </v-locale-provider>
  </v-layout>
</template>

<script setup lang="ts">
import NavDrawer from "./default/drawer.vue";
import { ref, computed } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useRoute, useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import { useOptionsStore } from "@/stores/options";

const {getToken} = useAuthToken()

const drawer = ref(false);
const auth = useAuthStore();
const display = useDisplay();
const route = useRoute();
const router = useRouter();
const isLogedIn = getToken() ? true : false

const optionsStore = useOptionsStore(); // مهم: inject حذف شده و pinia مستقیماً استفاده می‌شود

const appNavDisplay = computed(() => {
  return true; // همچنین می‌توانید از display.smAndDown استفاده کنید
});

function handleClick() {
  if (!isLogedIn) {
    router.push("/login");
  } else {
    auth.showLoginForm();
  }
}

function drawerChanged(val: boolean) {
  drawer.value = val;
}

const siteName = computed(() => {
  // بدون استفاده از .value روی optionsStore
  return optionsStore.get("sitename") || "دفترچه تلفن به ویپ";
});

const siteLogo = computed(() => {
  return optionsStore.getMedia("siteLogo", null);
});
</script>

<style scoped>
.appbar a.site-name {
  text-decoration: none;
  color: white;
  margin-left: 30px;
}
.v-layout--full-height {
  position: relative;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>