import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ScanQR from './pages/ScanQR'
import CartaQR from './pages/CartaQR'
import EnviarCarta from './pages/EnviarCarta'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/escanear-qr" element={<ScanQR />} />
      <Route path="/carta/:encoded" element={<CartaQR />} />
      <Route path="/enviar-carta" element={<EnviarCarta />} />
    </Routes>
  )
}
