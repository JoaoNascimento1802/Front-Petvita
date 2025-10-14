import axios from 'axios';


const api = axios.create({
  baseURL: 'https://videogamee-audkgzdjceemames.brazilsouth-01.azurewebsites.net/', // Porta padrão do Spring Boot
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
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