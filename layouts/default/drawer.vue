<template>
  <v-navigation-drawer
    v-model="drawer"
    class="side"
    temporary
    
  >
    

    <!-- <v-list nav density="compact" :class="{'d-md-none':auth.isLoggedIn}" color="primary" > -->
      <!-- <template v-for="menu in options.get('mainMenu')" :key="menu.title">
        <v-list-item
          v-if="!menu.childs || menu.childs.length == 0"
          color="primary"
          :to="menu.url"
          :title="menu.title"
          :prepend-icon="menu.icon"
        >
        </v-list-item>
        <v-list-group v-else>
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              :prepend-icon="menu.icon"
              :title="menu.title"
            >
            </v-list-item>
          </template>
          <v-list-item
            color="primary"
            v-for="submenu in menu.childs"
            :key="submenu.title"
            :to="submenu.url"
            :title="submenu.title"
            :prepend-icon="submenu.icon"
          >
          </v-list-item>
        </v-list-group>
      </template> -->
    <!-- </v-list> -->
  
       <v-list nav density="compact" v-if="isLoggedIn">
  
        <!-- <v-list-item :to="{ name: 'Customers' }" color="primary" class="py-3">
          <template #prepend>
            <v-icon icon="mdi-file-account" class="me-2" />
          </template>
          <v-list-item-title>مشتریان</v-list-item-title>
        </v-list-item> -->

  <v-divider class="my-2" />

  
        <v-list-item to="/users" color="primary" class="py-3">
          <template #prepend>
            <v-icon icon="mdi-contacts" class="me-2" />
          </template>
          <v-list-item-title>مخاطبین</v-list-item-title>
        </v-list-item>

  <v-divider inset></v-divider>

   <v-list-item to="/calls" color="primary" class="py-3" v-if="isAdmin">
          <template #prepend>
            <v-icon icon="mdi-call" class="me-2" />
          </template>
          <v-list-item-title>گزارش تماس ها</v-list-item-title>
        </v-list-item>
      <!-- <v-list-item v-if="auth.isAdmin" color="primary" class="py-3">
        <template #prepend>
          <v-icon icon="mdi-shield-account" class="me-2" />
        </template>
        <v-list-item-title>ناحیه مدیریت</v-list-item-title>
      </v-list-item> -->
    </v-list>


    
    
    <template v-slot:append>
        <!-- <div class="pa-2 px-5" v-if="isAdmin">
        <v-btn color="grey-lighten-2" rounded prepend-icon="mdi-cloud-sync" @click="showDialog = true"  block>
          همگام سازی اولیه کاربران

          <base-sync :value="showDialog" title="My Dialog" @update:value="showDialog = $event">
        </base-sync>
        </v-btn>
      </div> -->
      <div class="pa-2 px-5" v-if="isAdmin">
        <v-btn color="grey-lighten-2" rounded prepend-icon="mdi-cloud-sync" @click="handleXml"  block>
          خروجی مخاطبین xml
        </v-btn>
      </div>

      <div class="pa-2 px-5" v-if="isLoggedIn">
        <v-btn color="grey-lighten-2" rounded prepend-icon="mdi-power" @click="logout" block>
          خروج
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { computed, ref, onMounted, watch, defineEmits } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useOptionsStore } from "@/stores/options";
import { useRoute, useRouter } from "vue-router";
import BaseSync from '@/components/BaseSync.vue';


const showDialog = ref(false); // State to control dialog visibility

const emit = defineEmits(["drawerChanged"]);

const props = defineProps(["drawer"]);

const drawer = ref(false),
  auth = useAuthStore(),
  options = useOptionsStore(),
  route = useRoute(),
  router = useRouter(),
  isAdmin = computed(()=>auth.isAdmin),
  isLoggedIn = computed(() => auth.isLogedIn);

const user = computed(() => {
  console.log(auth.user)
  if (auth.user !== null) {
    return auth.user;
  }
});

async function logout() {
  await auth.logout();
   router.push("/login");
}

watch(
  () => props.drawer,
  (first) => {
    drawer.value = first;
  }
);
watch(
  () => drawer.value,
  (first) => {
    emit("drawerChanged", first);
  }
);

onMounted(() => {
  drawer.value = props.drawer;
});

async function handleXml(){
try {
  const response = await $fetch('http://127.0.0.1:8000/api/user/contacts/xml', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
    responseType: 'blob',
    body: {},
  })

  const url = window.URL.createObjectURL(new Blob([response]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'contacts.xml')
  document.body.appendChild(link)
  link.click()
  link.remove()
} catch (error) {
  console.log(error)
}
}

</script>

<style scoped>

.v-list-item--nav .v-list-item-title {
  line-height: inherit;
}
</style>