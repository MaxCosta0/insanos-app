import { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

// Logger estruturado
const logger = {
  info: (message, data = {}) => console.log(`[AUTH-CONTEXT] ${message}`, data),
  error: (message, data = {}) => console.error(`[AUTH-CONTEXT] ${message}`, data),
  warn: (message, data = {}) => console.warn(`[AUTH-CONTEXT] ${message}`, data),
  debug: (message, data = {}) => console.debug(`[AUTH-CONTEXT] ${message}`, data),
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      logger.info('Inicializando AuthProvider - carregando usuário');
      
      const currentUser = authService.getCurrentUser();
      
      if (currentUser) {
        logger.debug('Usuário encontrado no localStorage, verificando token', { 
          username: currentUser.username 
        });
        
        // Verificar se o token ainda é válido
        const userData = await authService.checkAuth();
        
        if (userData && userData.authenticated) {
          logger.info('Token válido, usuário autenticado', { username: userData.username });
          setUser(currentUser);
        } else {
          logger.warn('Token inválido ou expirado, removendo usuário');
          authService.logout();
        }
      } else {
        logger.debug('Nenhum usuário encontrado no localStorage');
      }
      
      setLoading(false);
      logger.debug('AuthProvider inicializado');
    };

    loadUser();
  }, []);

  const login = async (username, password) => {
    logger.info('AuthContext: Iniciando login', { username });
    
    try {
      const userData = await authService.login(username, password);
      setUser(userData);
      logger.info('AuthContext: Login concluído, estado atualizado', { username: userData.username });
      return userData;
    } catch (error) {
      logger.error('AuthContext: Falha no login', { username, error: error.message });
      throw error;
    }
  };

  const register = async (username, email, password) => {
    logger.info('AuthContext: Iniciando registro', { username, email });
    
    try {
      const result = await authService.register(username, email, password);
      logger.info('AuthContext: Registro concluído', { username });
      return result;
    } catch (error) {
      logger.error('AuthContext: Falha no registro', { username, email, error: error.message });
      throw error;
    }
  };

  const logout = () => {
    logger.info('AuthContext: Fazendo logout');
    authService.logout();
    setUser(null);
    logger.debug('AuthContext: Estado limpo, redirecionando para login');
    window.location.href = '/login';
  };

  const value = {
    user,
    login,
    logout,
    register,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.roles?.includes('ROLE_ADMIN'),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
