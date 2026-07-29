import axios from 'axios';

const api = axios.create({
  // ¡Adiós IP y puerto! Hola dominio seguro
  baseURL: 'https://stopover-app.lat/api',
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