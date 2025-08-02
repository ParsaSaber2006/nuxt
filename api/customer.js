import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const API_BASE = 'http://127.0.0.1:8000/api/customers';

export function fetchCustomers(params = {}) {
  const {getToken} = useAuthToken()

  return axios.get(API_BASE, {
    params,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
  });
}

export function createCustomer(data) {
  const {getToken} = useAuthToken()

  return axios.post(API_BASE, data, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  }).catch((error) => {
    
    throw error; // خیلی مهم!
  });
}

export function updateCustomer(id,data) {
  const {getToken} = useAuthToken()

  return axios.post(`${API_BASE}/${id}/update`, data,{
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  }).catch((error) => {
    
    throw error; // خیلی مهم!
  });
}



  export function deleteCustomer(id){
    const {getToken} = useAuthToken()
    console.log(authStore.token)
    return axios.post(`${API_BASE}/${id}/delete`,{
        headers:{
            Authorization: `Bearer ${getToken()}`,
        },
    }).catch((error) => {
    
    throw error; // خیلی مهم!
  });
}