import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const API_BASE = '/api/users';
const API_BASE_OPERATE = '/api/user';

export function fetchUsers(params = {}) {
  const authStore = useAuthStore();
  

  return axios.get(API_BASE, {
    params,
    headers: {
      Authorization: `Bearer ${authStore.token}`,
      'Content-Type': 'application/json',
    },
  }).catch((error) => {
    
    throw error; // خیلی مهم!
  });
  }

export function fetchGuestUsers(params = {}) {
  const authStore = useAuthStore();

  return axios.get(API_BASE+"/guest", {
    params,
    
  });
}

export function createUser(data) {
  const authStore = useAuthStore();
  return axios.post(API_BASE_OPERATE+"/create", data, {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  }).catch((error) => {
    
    throw error; // خیلی مهم!
  });
  }


export function updateUser(id, data) {
  const authStore = useAuthStore();
  return axios.post(`${API_BASE_OPERATE}/${id}/update`, data, {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  }).catch((error) => {
    
    throw error; // خیلی مهم!
  });
  }

  export function detailsUser(id){
    
    const authStore = useAuthStore();

    return axios.get(`${API_BASE_OPERATE}/${id}`,{
        headers:{
            Authorization: `Bearer ${authStore.token}`,
        },
    }).catch((error) => {
    
    throw error; // خیلی مهم!
  });
  }

  export function deleteUser(id){
    const authStore = useAuthStore();
    console.log(authStore.token)
    return axios.post(`${API_BASE_OPERATE}/${id}/delete`,{
        headers:{
            Authorization: `Bearer ${authStore.token}`,
        },
    }).catch((error) => {
    
    throw error; // خیلی مهم!
  });
}

export function getProvince(){
  return  axios.get('/api/provinces').catch((error)=>{
    throw error;
  })
}

export function getCity(provinceId){
  return  axios.get(`/api/provinces/${provinceId}/cities`).catch((error)=>
    {
    throw error;
  })
}



