import brasaoImage from '../assets/brasao-insanos.webp'
import './LoginImage.css'

function LoginImage() {
  return (
    <div className="login-left">
      <img src={brasaoImage} alt="Brasão Insanos" className="login-image" />
    </div>
  )
}

export default LoginImage


