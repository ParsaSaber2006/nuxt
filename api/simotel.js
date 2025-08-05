// import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
const API_BASE = 'http://127.0.0.1:8000/api/simotel/call';

export function generateCall(data) {
const { getToken } = useAuthToken()

return $fetch(API_BASE, {
  method: 'POST',
  body: data,
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
}).catch((error) => {
  throw error
})
}