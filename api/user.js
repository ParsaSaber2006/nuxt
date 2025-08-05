// import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const API_BASE = 'http://127.0.0.1:8000/api/users';
const API_BASE_OPERATE = 'http://127.0.0.1:8000/api/user';

export function fetchUsers(params = {}) {
const { getToken } = useAuthToken()

return $fetch(API_BASE, {
  method: 'GET',
  params,
  headers: {
    Authorization: `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
  },
}).catch((error) => {
  throw error
})

  }

export function fetchGuestUsers(params = {}) {
const { getToken } = useAuthToken()

return $fetch(API_BASE + "/guest", {
  method: 'GET',
  params,
})

}

export function createUser(data) {
const { getToken } = useAuthToken()

return $fetch(API_BASE_OPERATE + "/create", {
  method: 'POST',
  body: data,
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
}).catch((error) => {
  throw error
})

  }


export function updateUser(id, data) {
const { getToken } = useAuthToken()

return $fetch(`${API_BASE_OPERATE}/${id}/update`, {
  method: 'POST',
  body: data,
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
}).catch((error) => {
  throw error
})

  }

  export function detailsUser(id){
    const { getToken } = useAuthToken()

return $fetch(`${API_BASE_OPERATE}/${id}`, {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
}).catch((error) => {
  throw error
})

  }

  export function deleteUser(id){
const { getToken } = useAuthToken()

return $fetch(`${API_BASE_OPERATE}/${id}/delete`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
}).catch((error) => {
  throw error
})
}

export function getProvince(){
return $fetch('http://127.0.0.1:8000/api/provinces').catch((error) => {
  throw error
})
}

export function getCity(provinceId){
return $fetch(`http://127.0.0.1:8000/api/provinces/${provinceId}/cities`).catch((error) => {
  throw error
})

}



