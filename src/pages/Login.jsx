import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoginForm from '../components/LoginForm'
import LoginImage from '../components/LoginImage'
import MobileLogo from '../components/MobileLogo'
import './Login.css'

// Logger estruturado
const logger = {
  info: (message, data = {}) => console.log(`[LOGIN-PAGE] ${message}`, data),
  error: (message, data = {}) => console.error(`[LOGIN-PAGE] ${message}`, data),
  warn: (message, data = {}) => console.warn(`[LOGIN-PAGE] ${message}`, data),
};

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [keepLoggedIn, setKeepLoggedIn] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    logger.info('Formulário de login submetido', { username })
    
    setError('')
    setLoading(true)

    try {
      await login(username, password)
      logger.info('Login bem-sucedido, redirecionando para home', { username })
      navigate('/')
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.'
      logger.error('Falha no login', { 
        username, 
        error: errorMessage,
        status: err.response?.status 
      })
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <LoginImage />
        
        <div className="login-right">
          <MobileLogo />
          <div className="login-form-container">
            <h1 className="login-title">Login</h1>
            <p className="login-subtitle">Faça login na sua conta em segundos</p>
            
            <LoginForm
              username={username}
              password={password}
              keepLoggedIn={keepLoggedIn}
              onUsernameChange={setUsername}
              onPasswordChange={setPassword}
              onKeepLoggedInChange={setKeepLoggedIn}
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login


