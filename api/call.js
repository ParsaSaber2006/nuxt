// 📁 src/api/call.js
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const API_BASE = 'http://127.0.0.1:8000/api/calls';
const API_BASE_OPERATE = 'http://127.0.0.1:8000/api/call';

export function fetchCalls(params = {}) {
  const {getToken} = useAuthToken()
  return axios.get(API_BASE, {
    params,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
  }).catch((error) => {
    console.log("ds");
    throw error;
  });
}

export function createCall(data) {
  const {getToken} = useAuthToken()
  return axios.post(`${API_BASE_OPERATE}/create`, data, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  }).catch((error) => {
    throw error;
  });
}

// export function updateCall(id, data) {
//   const {getToken} = useAuthToken()
//   return axios.post(`${API_BASE_OPERATE}/${id}/update`, data, {
//     headers: {
//       Authorization: `Bearer ${getToken()}`,
//     },
//   }).catch((error) => {
//     throw error;
//   });
// }

export function detailsCall(id) {
  const {getToken} = useAuthToken()
  return axios.get(`${API_BASE_OPERATE}/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  }).catch((error) => {
    throw error;
  });
}


export function downloadCall( data) {
  const {getToken} = useAuthToken()
  return axios.post(`${API_BASE_OPERATE}/file/download`, data, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  }).catch((error) => {
    throw error;
  });
}
// export function deleteCall(id) {
//   const {getToken} = useAuthToken()
//   return axios.post(`${API_BASE_OPERATE}/${id}/delete`, {}, {
//     headers: {
//       Authorization: `Bearer ${getToken()}`,
//     },
//   }).catch((error) => {
//     throw error;
//   });
// }
