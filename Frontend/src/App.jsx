import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LetterProvider } from './context/LetterContext';
import Home from './components/Home';
import QRScanner from './components/QRScanner';
import EnviarCarta from './pages/EnviarCarta';

export default function App() {
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) return;

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallModal(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
        setShowInstallModal(false);
      });
    }
  };

  const handleClose = () => {
    setShowInstallModal(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  return (
    <LetterProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/escanear-qr" element={<QRScanner />} />
        <Route path="/enviar-carta" element={<EnviarCarta />} />
      </Routes>

      <AnimatePresence>
        {showInstallModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 className="text-lg font-semibold text-indigo-900 mb-2">Instalar App</h3>
              <p className="text-slate-600 mb-4">Descarga la app en tu celular para una mejor experiencia.</p>
              <div className="flex gap-3">
                <button
                  onClick={handleInstall}
                  className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                >
                  Instalar
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 py-2 px-4 bg-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-300 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LetterProvider>
  );
}
