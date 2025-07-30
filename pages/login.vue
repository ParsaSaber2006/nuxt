<template>
  <v-container>
     <v-card
      class="mx-auto pa-12 pb-8"
      elevation="8"
      max-width="448"
      rounded="lg"
    >
    <v-form @submit.prevent="submit">
      <v-text-field 
      v-model="mobile"
      label="شماره همراه" 
      required
       density="compact"
        prepend-inner-icon="mdi-account-outline"
        variant="outlined"
      ></v-text-field>
      <v-text-field 
      v-model="password"
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
      
    </v-form>
  </v-card>
  </v-container>

  
</template>


<script setup>
import { ref , onMounted } from 'vue'
import { useRouter } from 'vue-router'
const {setToken,getToken} = useAuth()
if(getToken()){
  navigateTo('/')
}
const mobile = ref('')
const password = ref('')
const visible = ref(false)
const loading = ref(false);

const submit = async(event)=>{
  const login = await $fetch('http://127.0.0.1:8000/api/login',{
    method:"post",
    body: {
      mobile_number: mobile.value,
      password: password.value
    }
  })

  setToken(login.token)
  alert("Logged in")
  navigateTo('/')
  mobile.value = ''
  password.value = ''
}


</script>
