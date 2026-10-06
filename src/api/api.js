import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Adjust to the actual backend port
});

// Interceptor to add the JWT token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;


