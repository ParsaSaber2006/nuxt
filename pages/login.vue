<template>
  <v-container>
     <v-card
      class="mx-auto pa-12 pb-8"
      elevation="8"
      max-width="448"
      rounded="lg"
    >
    <v-form @submit.prevent="handleLogin">
      <v-text-field 
      v-model="form.mobile_number"
      label="شماره همراه" 
      required
       density="compact"
        prepend-inner-icon="mdi-account-outline"
        variant="outlined"
      ></v-text-field>
      <v-text-field 
      v-model="form.password"
      label="رمز عبور" 
      required
      :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
      :type="visible ? 'text' : 'password'"
      density="compact"
      placeholder="Enter your password"
      prepend-inner-icon="mdi-lock-outline"
      variant="outlined"
      @click:append-inner="visible = !visible"
      ></v-text-field>
       <v-btn
        class="mb-8"
        color="blue"
        size="large"
        variant="tonal"
        block
        type="submit" :loading="loading"
        
      >
      ورود
      <v-icon icon="mdi-login" class="mx-2"></v-icon>
      </v-btn>
      
      <v-alert v-if="error" type="error" class="mt-2">{{ error }}</v-alert>
    </v-form>
  </v-card>
  </v-container>

  
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';


  const visible = ref(false)

const auth = useAuthStore();
const router = useRouter();

const form = ref({
  mobile_number: '',
  password: '',
});

const loading = ref(false);
const error = ref(null);

async function handleLogin() {
  loading.value = true;
  error.value = null;

  try {
    await auth.login(form.value);
    navigateTo('/users');
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}
</script>
