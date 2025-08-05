// stores/auth.js
import { defineStore } from 'pinia';
// import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null,
    intended_url: null,
    loginFormDisplay: false,
  }),
  persist: true, // برای اینکه بعد از refresh توکن بمونه
 getters: {
    isAdmin: (state) => {
      
      return state.user?.is_admin ;
    },
    LoggedUser: (state)=>{
      return state.user;
    },
 isLogedIn: (state) => {
    return !!state.token && !!state.user; // هم توکن باشه، هم اطلاعات کاربر
  },
  },
  
  actions: {
    async login(credentials) {
const { setToken } = useAuthToken()

try {
  const res = await $fetch('http://127.0.0.1:8000/api/login', {
    method: 'POST',
    body: credentials,
  })
  this.token = res.token
  this.user = res.user
  setToken(res.token)
  console.log("s")

  // برای تنظیم هدر پیش‌فرض در $fetch نیازی به این خط نیست
} catch (err) {
  throw new Error(err.data?.message || 'خطا در ورود')
}

    },

    async logout() {
 const { removeToken } = useAuthToken()
this.token = null
this.user = null

try {
  const res = await $fetch('http://127.0.0.1:8000/api/logout', {
    method: 'POST',
  })
  this.user = null
  this.token = null
  removeToken()
  navigateTo('/login')
} catch (err) {
  return err
}
   },

      setIntendedUrl(url) {
    this.intended_url = url;
  },

  showLoginForm() {
    
    this.loginFormDisplay = true;
  },

  hideLoginForm() {
    this.loginFormDisplay = false;
  },
    
  },
});
