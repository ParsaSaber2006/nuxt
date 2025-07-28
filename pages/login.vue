<template>
  <form @submit.prevent="submit">
    <input placeholder="mobile" v-model="mobile" type="text" />
    <input placeholder="password" v-model="password" type="password" />
    <button type="submit">Login</button>
  </form>
</template>

<script setup>
import { ref , onMounted } from 'vue'
const {setToken} = useAuth()
const mobile = ref('')
const password = ref('')

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
