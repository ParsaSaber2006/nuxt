// 📁 src/api/call.js
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const API_BASE = '/api/calls';
const API_BASE_OPERATE = '/api/call';

export function fetchCalls(params = {}) {
  const authStore = useAuthStore();
  return axios.get(API_BASE, {
    params,
    headers: {
      Authorization: `Bearer ${authStore.token}`,
      'Content-Type': 'application/json',
    },
  }).catch((error) => {
    console.log("ds");
    throw error;
  });
}

export function createCall(data) {
  const authStore = useAuthStore();
  return axios.post(`${API_BASE_OPERATE}/create`, data, {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  }).catch((error) => {
    throw error;
  });
}

// export function updateCall(id, data) {
//   const authStore = useAuthStore();
//   return axios.post(`${API_BASE_OPERATE}/${id}/update`, data, {
//     headers: {
//       Authorization: `Bearer ${authStore.token}`,
//     },
//   }).catch((error) => {
//     throw error;
//   });
// }

export function detailsCall(id) {
  const authStore = useAuthStore();
  return axios.get(`${API_BASE_OPERATE}/${id}`, {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  }).catch((error) => {
    throw error;
  });
}


export function downloadCall( data) {
  const authStore = useAuthStore();
  return axios.post(`${API_BASE_OPERATE}/file/download`, data, {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  }).catch((error) => {
    throw error;
  });
}
// export function deleteCall(id) {
//   const authStore = useAuthStore();
//   return axios.post(`${API_BASE_OPERATE}/${id}/delete`, {}, {
//     headers: {
//       Authorization: `Bearer ${authStore.token}`,
//     },
//   }).catch((error) => {
//     throw error;
//   });
// }
