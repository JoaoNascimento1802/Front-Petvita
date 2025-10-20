import axios from 'axios';

// A configuração do Axios cria uma instância base para todas as chamadas à API.
const api = axios.create({
  // GARANTA QUE ESTA LINHA APONTE PARA SEU BACKEND LOCAL
  baseURL: 'videogamee-audkgzdjceemames.brazilsouth-01.azurewebsites.net', // Porta padrão do Spring Boot
});

// Este interceptor adiciona o token JWT a cada requisição, se ele existir no localStorage.
// Essencial para acessar rotas protegidas.
api.interceptors.request.use(
  (config) => {
    // Tenta buscar o token do localStorage primeiro (para "Lembrar-me")
    let token = localStorage.getItem('authToken');
    
    // Se não encontrar, tenta buscar no sessionStorage (para sessões normais)
    if (!token) {
      token = sessionStorage.getItem('authToken');
    }

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