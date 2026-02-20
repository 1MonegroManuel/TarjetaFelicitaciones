import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLetter } from '../context/LetterContext';
import TemplateSelector from '../components/TemplateSelector';
import LetterForm from '../components/LetterForm';
import FinalScreen from '../components/FinalScreen';

export default function EnviarCarta() {
  const { step, setStep, loading, error } = useLetter();

  if (step === 3) {
    return <FinalScreen />;
  }

  return (
    <main className="min-h-screen bg-slate-50 safe-top safe-bottom">
      <header className="p-4 flex items-center gap-4 bg-white border-b border-slate-200">
        <Link to="/" className="text-indigo-600 font-medium">
          ← Volver
        </Link>
        <h1 className="font-display text-xl text-indigo-900">Enviar Carta</h1>
      </header>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-14 h-14 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-slate-600">Creando tu carta...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="mx-4 mb-4 py-3 px-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">
          {error}
        </div>
      )}

      {step === 1 && (
        <TemplateSelector onNext={() => setStep(2)} />
      )}
      {step === 2 && (
        <LetterForm onSuccess={() => setStep(3)} />
      )}
    </main>
  );
}
