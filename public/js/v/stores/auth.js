// stores/auth.js
import { defineStore } from 'pinia';
import axios from 'axios';

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
      try {
        const res = await axios.post('/api/login', credentials);
        this.token = res.data.token;
        this.user = res.data.user;
        console.log("s")
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
      } catch (err) {
        throw new Error(err.response?.data?.message || 'خطا در ورود');
      }
    },

    async logout() {
      this.token = null;
      this.user = null;
      try {
        const res = await axios.post('/api/logout');
        this.user = null,
        this.token = null;
      delete axios.defaults.headers.common['Authorization'];
      }catch(err){
        return err;
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
