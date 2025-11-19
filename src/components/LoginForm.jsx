import './LoginForm.css'

function LoginForm({
  email,
  password,
  keepLoggedIn,
  onEmailChange,
  onPasswordChange,
  onKeepLoggedInChange,
  onSubmit
}) {
  return (
    <form onSubmit={onSubmit} className="login-form">
      <div className="form-group">
        <label htmlFor="email">Endereço de Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="seu@email.com"
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Senha</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="••••••••"
          required
          className="form-input"
        />
      </div>

      <div className="form-options">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={keepLoggedIn}
            onChange={(e) => onKeepLoggedInChange(e.target.checked)}
            className="checkbox-input"
          />
          <span>Manter-me conectado</span>
        </label>
        <a href="#" className="forgot-password">Esqueceu a senha?</a>
      </div>

      <button type="submit" className="login-button">
        Entrar
      </button>
    </form>
  )
}

export default LoginForm


