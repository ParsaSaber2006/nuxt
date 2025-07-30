import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const API_BASE = '/api/customers';

export function fetchCustomers(params = {}) {
  const authStore = useAuthStore();

  return axios.get(API_BASE, {
    params,
    headers: {
      Authorization: `Bearer ${authStore.token}`,
      'Content-Type': 'application/json',
    },
  });
}

export function createCustomer(data) {
  const authStore = useAuthStore();

  return axios.post(API_BASE, data, {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  }).catch((error) => {
    
    throw error; // خیلی مهم!
  });
}

export function updateCustomer(id,data) {
  const authStore = useAuthStore();

  return axios.post(`${API_BASE}/${id}/update`, data,{
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  }).catch((error) => {
    
    throw error; // خیلی مهم!
  });
}



  export function deleteCustomer(id){
    const authStore = useAuthStore();
    console.log(authStore.token)
    return axios.post(`${API_BASE}/${id}/delete`,{
        headers:{
            Authorization: `Bearer ${authStore.token}`,
        },
    }).catch((error) => {
    
    throw error; // خیلی مهم!
  });
}