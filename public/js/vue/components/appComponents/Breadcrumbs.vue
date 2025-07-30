<template><v-container class="pa-0 rounded-pill my-2" >
    <v-row no-gutters>
      <v-col class="rounded-pill py-0">
        <v-breadcrumbs density="compact" :items="items" color="grey-darken-4" class="py-0">
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
  name: "Breadcrumbs",
  data: () => {
    return {};
  },
  computed: {},
  methods: {},
};
</script>