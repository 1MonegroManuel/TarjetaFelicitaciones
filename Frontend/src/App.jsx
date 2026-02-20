import { Routes, Route } from 'react-router-dom';
import { LetterProvider } from './context/LetterContext';
import Home from './components/Home';
import QRScanner from './components/QRScanner';
import EnviarCarta from './pages/EnviarCarta';

export default function App() {
  return (
    <LetterProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/escanear-qr" element={<QRScanner />} />
        <Route path="/enviar-carta" element={<EnviarCarta />} />
      </Routes>
    </LetterProvider>
  );
}
