import api from './api';

const API_URL = '/auth';

// Logger estruturado
const logger = {
  info: (message, data = {}) => console.log(`[AUTH-SERVICE] ${message}`, data),
  error: (message, data = {}) => console.error(`[AUTH-SERVICE] ${message}`, data),
  warn: (message, data = {}) => console.warn(`[AUTH-SERVICE] ${message}`, data),
  debug: (message, data = {}) => console.debug(`[AUTH-SERVICE] ${message}`, data),
};

class AuthService {
  async login(username, password) {
    logger.info('Tentando fazer login', { username });
    
    try {
      const response = await api.post(`${API_URL}/login`, {
        username,
        password,
      });
      
      if (response.data.token) {
        logger.info('Login bem-sucedido', { 
          username: response.data.username,
          roles: response.data.roles 
        });
        localStorage.setItem('user', JSON.stringify(response.data));
        logger.debug('Dados do usuário salvos no localStorage');
      } else {
        logger.warn('Login retornou sem token', { data: response.data });
      }
      
      return response.data;
    } catch (error) {
      logger.error('Erro ao fazer login', { 
        username,
        error: error.message,
        response: error.response?.data 
      });
      throw error;
    }
  }

  async register(username, email, password) {
    logger.info('Tentando registrar novo usuário', { username, email });
    
    try {
      const response = await api.post(`${API_URL}/register`, {
        username,
        email,
        password,
      });
      
      logger.info('Registro bem-sucedido', { username, email });
      return response.data;
    } catch (error) {
      logger.error('Erro ao registrar usuário', { 
        username,
        email,
        error: error.message,
        response: error.response?.data 
      });
      throw error;
    }
  }

  logout() {
    logger.info('Fazendo logout');
    localStorage.removeItem('user');
    logger.debug('Dados do usuário removidos do localStorage');
  }

  getCurrentUser() {
    logger.debug('Obtendo usuário atual do localStorage');
    const userStr = localStorage.getItem('user');
    
    if (!userStr) {
      logger.debug('Nenhum usuário encontrado no localStorage');
      return null;
    }
    
    try {
      const user = JSON.parse(userStr);
      logger.debug('Usuário recuperado do localStorage', { username: user.username });
      return user;
    } catch (error) {
      logger.error('Erro ao parsear dados do usuário do localStorage', { error: error.message });
      return null;
    }
  }

  async checkAuth() {
    logger.debug('Verificando autenticação no servidor');
    
    try {
      const response = await api.get(`${API_URL}/check`);
      logger.info('Autenticação verificada com sucesso', { authenticated: response.data.authenticated });
      return response.data;
    } catch (error) {
      logger.warn('Falha ao verificar autenticação', { error: error.message });
      return null;
    }
  }

  async getMe() {
    logger.debug('Obtendo dados do usuário atual do servidor');
    
    try {
      const response = await api.get(`${API_URL}/me`);
      logger.info('Dados do usuário obtidos com sucesso', { username: response.data.username });
      return response.data;
    } catch (error) {
      logger.warn('Falha ao obter dados do usuário', { error: error.message });
      return null;
    }
  }
}

export default new AuthService();
