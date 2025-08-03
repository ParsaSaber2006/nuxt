import { defineStore } from 'pinia';
import axios from 'axios';
import { fetchUsers, createUser,detailsUser,updateUser,deleteUser,fetchGuestUsers, getProvince,getCity } from '@/api/user';


export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    filters: {
      full_name: '',
      simotel_users:false,
      job:  [],
      city:  [],
      coding_code: '',
    },
    allCities: [],
    allJobs: [],
    loading: false,
    error: null,
  }),

// store user.js (getters)
getters: {
  filteredUsers(state) {
    return state.users.filter(user => {
      const matchString = (key, val) => !val || user[key]?.toLowerCase().startsWith(val.toLowerCase());
      const matchArray = (key, vals) => !vals.length || vals.includes(user[key]);

      return (
        matchString('full_name', state.filters.full_name) &&
        matchArray('job', state.filters.job) &&
        matchArray('city', state.filters.city) &&
        matchArray('simotel_users', state.filters.simotel_users) &&
        matchString('coding_code', state.filters.coding_code)
      );
    });
  },
},


actions: {
async loadUsers(options) {
  this.loading = true;

  console.log(options,"oo")
  try {
    const params = {
      per_page: options?.per_page ?? 10,
      page: options?.page ?? 1,
      sort_by: options?.sort_by ?? null,
      sort_desc: options?.sort_desc ?? false,
      filter: {
        job: this.filters.job,
        city: this.filters.city,
        full_name: this.filters.full_name,
        coding_code: this.filters.coding_code,
        simotel_users: this.filters.simotel_users,
      },
    };
    console.log("ارسال به fetchUsers:", params);
    const res = await fetchUsers(params);
    console.log(res,"sdds")
    this.users = res.data.data;
    this.totalItems = res.data.meta.total || 0;
    return res;
  } catch (err) {
    this.error = err.message;
    return {
      data: {
        data: [],
        meta: { total: 0 }
      },
      error: err.status
    };
  } finally {
    this.loading = false;
  }
}
,



    
async loadGuestUsers(options) {
  this.loading = true;
  try {
    const params = {
      per_page: options?.per_page ?? 10,
      page: options?.page ?? 1,
      sort_by: options?.sort_by ?? null,
      sort_desc: options?.sort_desc ?? false,
      filter: {
        job: this.filters.job,
        city: this.filters.city,
        full_name: this.filters.full_name,
        coding_code: this.filters.coding_code,
        simotel_users: this.filters.simotel_users,
      },
    };
    
    const res = await fetchGuestUsers(params);
    
    this.users = res.data.data;
    this.totalItems = res.data.meta.total || 0;
    return res;
  } catch (err) {
    this.error = err.message;
    return {
      data: {
        data: [],
        meta: { total: 0 }
      },
      error: err.status
    };
  } finally {
    this.loading = false;
  }
}
,

   

    async initFilterOptions() {
  const res = await axios.get('http://127.0.0.1:8000/api/users/filters');
  
  this.allCities = res.data.cities;
  this.allJobs = res.data.jobs;
},


    async getUser(id) {
      try{

        const res = await detailsUser(id)
        return res.data.data;
      } catch(err){
        
         return { error:err.status };
      }
      
      
    },

async userUpdate(id, data) {
  try {
    return await updateUser(id, data); // فرض: این هم از فایل api/user.js میاد
  } catch (err) {
    console.log('err store update', err);
    return {
      error: err.response?.status || 500,
      data: err.response?.data || 'خطای ناشناخته'
    };
  }
},

    
    

     async userCreate(data) {
      try{
      return await createUser(data);
         } catch(err){
           return { error : err.status,data:err.response.data };
        
      }
    },
    
    async userDelete(data) {
      try{

        return await deleteUser(data);
      }catch(err){
         return { error:err.status };
        
      }
    },

    async getProvinces (){
      return await getProvince();
    },

    async getCitiesByProvince(id){
      
      return await getCity(id);
    }


  },
});
