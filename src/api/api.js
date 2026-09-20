import axios from 'axios';
import { startLoading, stopLoading } from './loadingBridge';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Adjust to the actual backend port
});

// Interceptor to add the JWT token to all requests
api.interceptors.request.use((config) => {
  startLoading();
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  stopLoading();
  return Promise.reject(error);
});

// Interceptor to stop loading on response
api.interceptors.response.use((response) => {
  stopLoading();
  return response;
}, (error) => {
  stopLoading();
  return Promise.reject(error);
});

export default api;


