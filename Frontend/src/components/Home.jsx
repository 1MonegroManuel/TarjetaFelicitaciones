import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 safe-top safe-bottom bg-gradient-to-b from-white via-indigo-50/30 to-violet-50/50">
      <motion.header
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="font-display text-4xl md:text-5xl font-semibold text-indigo-900 mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Tarjeta Felicitaciones
        </motion.h1>
        <motion.p
          className="text-slate-600 text-lg max-w-sm mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          Abre o envía una carta especial con un toque único
        </motion.p>
      </motion.header>

      <motion.nav
        className="flex flex-col gap-4 w-full max-w-xs"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <Link to="/escanear-qr">
          <motion.span
            className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl bg-white text-indigo-700 font-medium text-lg shadow-soft border border-indigo-100"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span aria-hidden>📷</span>
            Abrir Carta
          </motion.span>
        </Link>
        <Link to="/enviar-carta">
          <motion.span
            className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl bg-indigo-500 text-white font-semibold text-lg shadow-glow"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span aria-hidden>✉️</span>
            Enviar Carta
          </motion.span>
        </Link>
      </motion.nav>
    </main>
  );
}
