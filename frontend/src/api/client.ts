import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// Base API URL pointing to the FastAPI backend
const API_URL = 'http://127.0.0.1:8000/api/v1';

// Create a configured Axios instance
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to automatically attach JWT token to all requests
apiClient.interceptors.request.use(
  (config) => {
    // Get the token from Zustand store
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle 401 Unauthorized responses (token expired)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
