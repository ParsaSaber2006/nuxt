<template>
  
<v-container class="pa-0 rounded-pill my-2"  v-if="pages[route.name]">
    <v-row no-gutters>
      <v-col class="rounded-pill py-0">
        <v-breadcrumbs density="compact" :items="breadItems" color="grey-darken-4" class="py-0">
          <template v-slot:prepend>
            <v-icon size="small" icon="mdi-home" color="grey-darken-4"></v-icon>
          </template>
        </v-breadcrumbs>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useRoute } from "vue-router";
export default {
  props: ["items"],
  name: "BreadcrumbsAuto",
  data: () => {
    return {
      pages: {
  Users: [
    {
      title: "لیست مخاطبین",
      disabled: false,
      to: "/users",
    },
  ],
  UserCreate: [
    {
      title: "لیست مخاطبین",
      disabled: false,
      to: "/users",
    },
    {
      title: "ثبت مخاطبین",
      disabled: true, // این صفحه فعلیه، پس غیرفعاله
      to: "/users/create",
    },
  ],
  UserForm: [
    {
      title: "لیست مخاطبین",
      disabled: false,
      to: "/users",
    },
    {
      title: "ویرایش مخاطب",
      disabled: true,
      to: "", // مسیر فعلی
    },
  ]
}

    };
  },
  computed: {
    breadItems() {
      let routeName = this.route.name;
      return this.pages[routeName];
    },
    route() {
      return useRoute();
    },
  },
  methods: {},
};
</script>