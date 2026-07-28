import axios from 'axios';

const api = axios.create({
  // Cambiamos el localhost por la IP pública y el puerto nuevo del backend
  baseURL: 'http://18.188.66.230:9000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;