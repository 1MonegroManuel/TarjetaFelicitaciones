import { Link } from 'react-router-dom'
import './Home.css'

export default function Home() {
  return (
    <main className="home">
      <header className="home__header">
        <h1 className="home__title">Tarjeta Felicitaciones</h1>
        <p className="home__subtitle">Escanea o envía una carta especial</p>
      </header>
      <nav className="home__actions">
        <Link to="/escanear-qr" className="home__btn home__btn--scan">
          <span className="home__btn-icon" aria-hidden>📷</span>
          Escanear QR
        </Link>
        <Link to="/enviar-carta" className="home__btn home__btn--send">
          <span className="home__btn-icon" aria-hidden>✉️</span>
          Enviar carta
        </Link>
      </nav>
    </main>
  )
}
