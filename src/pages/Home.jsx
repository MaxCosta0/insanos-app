import { useAuth } from '../context/AuthContext'
import './Home.css'

function Home() {
  const { user, logout } = useAuth()

  return (
    <div className="home-container">
      <h1>Bem-vindo, {user?.username}!</h1>
      <button onClick={logout} className="logout-button">
        Sair
      </button>
    </div>
  )
}

export default Home
