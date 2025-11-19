import axios from 'axios';

// Logger estruturado
const logger = {
  info: (message, data = {}) => console.log(`[API-INFO] ${message}`, data),
  error: (message, data = {}) => console.error(`[API-ERROR] ${message}`, data),
  warn: (message, data = {}) => console.warn(`[API-WARN] ${message}`, data),
  debug: (message, data = {}) => console.debug(`[API-DEBUG] ${message}`, data),
};

// Detecta se está acessando via rede local ou localhost
const getApiUrl = () => {
  // Se estiver em produção, use a variável de ambiente
  if (import.meta.env.VITE_API_URL) {
    logger.info('API URL configurada via variável de ambiente', { url: import.meta.env.VITE_API_URL });
    return import.meta.env.VITE_API_URL;
  }
  
  // Em desenvolvimento, detecta o IP da rede
  const hostname = window.location.hostname;
  logger.debug('Detectando hostname para configurar API', { hostname });
  
  // Se for localhost ou 127.0.0.1, usa localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    const url = 'http://localhost:8080/api';
    logger.info('API URL configurada para localhost', { url });
    return url;
  }
  
  // Caso contrário, usa o mesmo hostname (IP da rede local)
  const url = `http://${hostname}:8080/api`;
  logger.info('API URL configurada para rede local', { url, hostname });
  return url;
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    logger.debug('Enviando requisição', { 
      method: config.method?.toUpperCase(), 
      url: config.url,
      baseURL: config.baseURL 
    });
    
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
          logger.debug('Token JWT adicionado à requisição');
        }
      } catch (error) {
        logger.error('Erro ao parsear dados do usuário do localStorage', { error: error.message });
      }
    }
    
    return config;
  },
  (error) => {
    logger.error('Erro no interceptor de requisição', { error: error.message });
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => {
    logger.debug('Resposta recebida com sucesso', { 
      status: response.status,
      url: response.config.url 
    });
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    const message = error.response?.data?.message || error.message;
    
    logger.error('Erro na requisição', { 
      status, 
      url, 
      message,
      data: error.response?.data 
    });
    
    if (status === 401) {
      logger.warn('Erro 401 - Não autorizado. Removendo usuário e redirecionando para login');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;
