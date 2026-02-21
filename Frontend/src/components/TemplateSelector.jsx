import { motion } from 'framer-motion';
import { useLetter } from '../context/LetterContext';
import {
  BásicaPreview,
  MediaPreview,
  PREMIUM_OPTIONS,
} from './AnimatedBackgrounds';

const BASIC_COLORS = [
  { id: 0, color: '#3b82f6', variante: 'azul', name: 'Azul' },
  { id: 1, color: '#f9ffa4', variante: 'amarillo', name: 'Amarillo' },
  { id: 2, color: '#86efac', variante: 'verde', name: 'Verde' },
  { id: 3, color: '#a855f7', variante: 'purpura', name: 'Púrpura' },
];

const MEDIA_GRADIENTS = [
  { id: 0, from: '#2563eb', to: '#ec4899', variante: 'gradiente1', name: 'Azul → Rosa' },
  { id: 1, from: '#fbbf24', to: '#ec4899', variante: 'gradiente2', name: 'Amarillo → Rosa' },
  { id: 2, from: '#10b981', to: '#8b5cf6', variante: 'gradiente3', name: 'Verde → Púrpura' },
  { id: 3, from: '#eab308', to: '#ef4444', variante: 'gradiente4', name: 'Amarillo → Rojo' },
];

export default function TemplateSelector({ onNext }) {
  const { template, setTemplate } = useLetter();
  const tier = template.tier || 'basica';
  const option = template.option ?? 0;

  const ActivePreview = () => {
    if (tier === 'basica') return <BásicaPreview activeColor={option} />;
    if (tier === 'media') return <MediaPreview activeGradient={option} />;
    if (tier === 'premium') {
      const opt = PREMIUM_OPTIONS[option];
      const C = opt?.Component;
      return C ? <C /> : <BásicaPreview activeColor={0} />;
    }
    return <BásicaPreview activeColor={0} />;
  };

  return (
    <motion.div
      className="max-w-lg mx-auto px-4 py-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="font-display text-2xl text-indigo-900 mb-6 text-center">
        Elige tu plantilla
      </h2>

      {/* Rectángulo carta preview */}
      <div className="relative w-full max-w-[280px] h-[200px] mx-auto rounded-2xl overflow-hidden shadow-soft mb-8 bg-white">
        <ActivePreview />
      </div>

      {/* Básica */}
      <section className="mb-8">
        <p className="text-slate-600 text-sm mb-2">Básica (Gratis)</p>
        <div className="flex gap-3 flex-wrap">
          {BASIC_COLORS.map(({ id, color, variante }) => (
            <motion.button
              key={id}
              type="button"
              className={`w-10 h-10 rounded-full border-2 transition-all ${tier === 'basica' && option === id
                ? 'border-indigo-500 scale-110'
                : 'border-slate-300'
                }`}
              style={{ backgroundColor: color }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTemplate({ tier: 'basica', option: id, idPlantilla: 1, tipoPlantilla: 'basica', variantePlantilla: variante })}
            />
          ))}
        </div>
      </section>

      {/* Media */}
      <section className="mb-8">
        <p className="text-slate-600 text-sm mb-2">Media</p>
        <div className="flex gap-3 flex-wrap">
          {MEDIA_GRADIENTS.map(({ id, from, to, variante }) => (
            <motion.button
              key={id}
              type="button"
              className={`w-10 h-10 rounded-full border-2 transition-all ${tier === 'media' && option === id
                ? 'border-indigo-500 scale-110'
                : 'border-slate-300'
                }`}
              style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTemplate({ tier: 'media', option: id, idPlantilla: 2, tipoPlantilla: 'media', variantePlantilla: variante })}
            />
          ))}
        </div>
      </section>

      {/* Premium */}
      <section className="mb-8">
        <p className="text-slate-600 text-sm mb-2">Premium</p>
        <div className="flex flex-col gap-2">
          {PREMIUM_OPTIONS.map((opt, id) => (
            <motion.button
              key={opt.id}
              type="button"
              className={`text-left py-3 px-4 rounded-xl border-2 transition-all ${tier === 'premium' && option === id
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-slate-200 bg-slate-50'
                }`}
              whileTap={{ scale: 0.99 }}
              onClick={() => setTemplate({ tier: 'premium', option: id, idPlantilla: 3, tipoPlantilla: 'premium', variantePlantilla: opt.id })}
            >
              {opt.id === 'stars' && '✦ '}
              {opt.id === 'snow' && '❄ '}
              {opt.id === 'rain' && '🌧️ '}
              {opt.id === 'hearts' && '❤️ '}
              {opt.label}
            </motion.button>
          ))}
        </div>
      </section>

      <motion.button
        type="button"
        className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-semibold text-lg hover:bg-indigo-700 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onNext}
      >
        Siguiente
      </motion.button>
    </motion.div>
  );
}
