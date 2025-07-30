import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const API_BASE = '/api/simotel/call';

export function generateCall(data) {
  const authStore = useAuthStore();

  return axios.post(API_BASE, data, {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
    },
  }).catch((error) => {
    throw error; // خیلی مهم!
  });
}