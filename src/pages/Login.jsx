import { useState } from 'react'
import LoginForm from '../components/LoginForm'
import LoginImage from '../components/LoginImage'
import MobileLogo from '../components/MobileLogo'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [keepLoggedIn, setKeepLoggedIn] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Login:', { email, password, keepLoggedIn })
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
              email={email}
              password={password}
              keepLoggedIn={keepLoggedIn}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onKeepLoggedInChange={setKeepLoggedIn}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login


