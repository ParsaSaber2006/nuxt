<template>
  <v-card class="rounded-xl">
    <template v-slot:title>
      <v-container>
        <v-row>
          <v-col class="d-flex pa-0">
            اطلاعات کاربر
            <v-spacer> </v-spacer>
          </v-col>
        </v-row>
      </v-container>
    </template>
    <v-divider></v-divider>
    <v-card-text>
      <v-container>
        <v-row v-if="user.helloMessage">
          <v-col>
            <v-alert type="success">{{ user.helloMessage }} </v-alert>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="12" sm="10"> کاربر: {{ auth.user.name }} </v-col>
          <v-col cols="12" sm="10"> موبایل: {{ auth.user.mobile }}  </v-col>
        </v-row>
        <v-row v-if="!auth.user.mobile_verified">
          <v-col>
            <v-alert type="warning" variant="tonal" border="start">
              <div class="text-center">
                شماره موبایل شما تایید نشده است.
                <br>
                جهت تایید شماره موبایل روی کلید زیر کلیک کنید:
                <br>
                <v-btn class="mt-3" variant="outlined" size="small" @click="emit('changeMode','mobileVerify')" v-if="!user.mobile_verified" color="primary" rounded prepend-icon="mdi-cellphone">تایید شماره موبایل</v-btn> 
              </div>
            </v-alert>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="12" align="left">
            <v-btn
              variant="tonal"
              @click="gotoUserarea"
              class="me-1"
              color="primary"
              prepend-icon="mdi-account"
              rounded
            >
              ناحیه کاربری
            </v-btn>
            <v-btn
              color="red"
              variant="tonal"
              @click="logout()"
              :loading="data.loading"
              :disabled="data.loading"
              rounded
              prepend-icon="mdi-power"
            >
              خروج
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-divider></v-divider>
  </v-card>
</template>

<script setup>
import { ref, reactive, onMounted, defineEmits, watch, defineProps } from "vue";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "vue-router";
const emit = defineEmits(["loginWithToken", "changeMode"]);

const resender = ref(null);

const auth = useAuthStore();
const router = useRouter();

const props = defineProps(["user", "loading", "formErrors"]);

const data = reactive({
  user: {
    mobile: "",
    token: "",
  },
});

onMounted(() => {
  data.user = props.user;
  if (props.user.helloMessage) {
    setTimeout(() => {
      auth.hideLoginform();
    }, 2000);
  }
});

function gotoUserarea() {
  auth.hideLoginform();
  router.push({ name: "userarea" });
}

async function logout() {
  data.loading = true;
  await auth.logout();

  emitter.emit("notif", {
    text: "خروج از ناحیه کاربری انجام شد",
    type: "info",
  });

  auth.hideLoginform();
  data.loading = false;
}
</script>