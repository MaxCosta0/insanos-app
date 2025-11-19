import insanosLogo from '../assets/insanos-logo.png'
import './MobileLogo.css'

function MobileLogo() {
  return (
    <div className="mobile-logo">
      <img src={insanosLogo} alt="Logo Insanos" className="logo-image" />
    </div>
  )
}

export default MobileLogo


