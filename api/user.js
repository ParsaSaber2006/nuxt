import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const API_BASE = 'http://127.0.0.1:8000/api/users';
const API_BASE_OPERATE = 'http://127.0.0.1:8000/api/user';

export function fetchUsers(params = {}) {
  const {getToken} = useAuthToken()
  

  return axios.get(API_BASE, {
    params,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
  }).catch((error) => {
    
    throw error; // خیلی مهم!
  });
  }

export function fetchGuestUsers(params = {}) {
  const {getToken} = useAuthToken()

  return axios.get(API_BASE+"/guest", {
    params,
    
  });
}

export function createUser(data) {
  const {getToken} = useAuthToken()
  return axios.post(API_BASE_OPERATE+"/create", data, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  }).catch((error) => {
    
    throw error; // خیلی مهم!
  });
  }


export function updateUser(id, data) {
  const {getToken} = useAuthToken()
  return axios.post(`${API_BASE_OPERATE}/${id}/update`, data, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  }).catch((error) => {
    
    throw error; // خیلی مهم!
  });
  }

  export function detailsUser(id){
    
    const {getToken} = useAuthToken()

    return axios.get(`${API_BASE_OPERATE}/${id}`,{
        headers:{
            Authorization: `Bearer ${getToken()}`,
        },
    }).catch((error) => {
    
    throw error; // خیلی مهم!
  });
  }

  export function deleteUser(id){
    const {getToken} = useAuthToken()
    console.log(authStore.token)
    return axios.post(`${API_BASE_OPERATE}/${id}/delete`,{
        headers:{
            Authorization: `Bearer ${getToken()}`,
        },
    }).catch((error) => {
    
    throw error; // خیلی مهم!
  });
}

export function getProvince(){
  return  axios.get('http://127.0.0.1:8000/api/provinces').catch((error)=>{
    throw error;
  })
}

export function getCity(provinceId){
  return  axios.get(`http://127.0.0.1:8000/api/provinces/${provinceId}/cities`).catch((error)=>
    {
    throw error;
  })
}



