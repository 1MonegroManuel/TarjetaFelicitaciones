import { motion } from 'framer-motion';

const colors = ['#3b82f6', '#f9ffa4', '#86efac', '#a855f7'];

export function BásicaPreview({ activeColor }) {
  const c = activeColor != null ? colors[activeColor] : colors[0];
  return (
    <div
      className="absolute inset-0 rounded-2xl transition-colors duration-300"
      style={{ backgroundColor: c }}
    />
  );
}

const gradients = [
  'linear-gradient(135deg, #2563eb 0%, #ec4899 100%)',
  'linear-gradient(135deg, #fbbf24 0%,rgb(37, 83, 182) 100%)',
  'linear-gradient(135deg, #10b981 0%, #8b5cf6 100%)',
  'linear-gradient(135deg, #eab308 0%,rgb(221, 41, 41) 100%)',
];

export function MediaPreview({ activeGradient }) {
  const g = activeGradient != null ? gradients[activeGradient] : gradients[0];
  return (
    <div
      className="absolute inset-0 rounded-2xl transition-all duration-300"
      style={{ background: g }}
    />
  );
}

// Estrellitas
export function PremiumStars() {
  return (
    <div className="absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-100 to-violet-200">
      {[...Array(16)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute text-2xl opacity-90"
          style={{
            left: `${8 + (i % 4) * 28}%`,
            top: `${10 + Math.floor(i / 4) * 28}%`,
          }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
        >
          ✦
        </motion.span>
      ))}
    </div>
  );
}

// Copos de nieve
export function PremiumSnow() {
  return (
    <div className="absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-b from-sky-100 to-sky-300">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-white text-xl opacity-80"
          style={{
            left: `${(i * 7) % 100}%`,
            top: -20,
          }}
          animate={{
            y: ['0vh', '100vh'],
            x: [0, 20, -20, 0],
          }}
          transition={{
            duration: 4 + (i % 3),
            repeat: Infinity,
            delay: i * 0.2,
          }}
        >
          ❄
        </motion.div>
      ))}
    </div>
  );
}

// Lluvia animada cayendo
export function PremiumRain() {
  return (
    <div className="absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-b from-slate-200 to-slate-400">
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 bg-slate-500/70 rounded-full"
          style={{
            left: `${(i * 5) % 100}%`,
            top: '-10%',
            height: '20px',
          }}
          animate={{
            y: ['0vh', '110vh'],
          }}
          transition={{
            duration: 0.8 + (i % 5) * 0.2,
            repeat: Infinity,
            delay: (i * 0.03) % 1.5,
          }}
        />
      ))}
    </div>
  );
}

// Corazones palpitando
export function PremiumHearts() {
  return (
    <div className="absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-br from-rose-200 to-pink-400">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl"
          style={{
            left: `${15 + (i % 4) * 22}%`,
            top: `${20 + Math.floor(i / 4) * 35}%`,
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
        >
          ❤️
        </motion.div>
      ))}
    </div>
  );
}

export const PREMIUM_OPTIONS = [
  { id: 'stars', label: 'Estrellitas animadas', Component: PremiumStars },
  { id: 'snow', label: 'Copos de nieve', Component: PremiumSnow },
  { id: 'rain', label: 'Lluvia animada', Component: PremiumRain },
  { id: 'hearts', label: 'Corazones palpitando', Component: PremiumHearts },
];

// Mapeo variante -> índice para Básica y Media
const VARIANTE_BASICA_INDEX = { azul: 0, indigo: 1, violeta: 2, purpura: 3 };
const VARIANTE_MEDIA_INDEX = { gradiente1: 0, gradiente2: 1, gradiente3: 2, gradiente4: 3 };
const VARIANTE_PREMIUM_MAP = { stars: PremiumStars, snow: PremiumSnow, rain: PremiumRain, hearts: PremiumHearts };

/** Fondo de la carta al abrirla, según TipoPlantilla y VariantePlantilla guardados en BD */
export function CartaBackground({ tipoPlantilla, variantePlantilla, className = '' }) {
  // Normalizar valores: manejar null, undefined, y diferentes casos
  const tipoRaw = tipoPlantilla || null;
  const varianteRaw = variantePlantilla || null;
  const tipo = tipoRaw ? String(tipoRaw).toLowerCase().trim() : 'basica';
  const variante = varianteRaw ? String(varianteRaw).toLowerCase().trim() : 'azul';

  // Log para debug
  console.log('CartaBackground recibió:', { tipoPlantilla: tipoRaw, variantePlantilla: varianteRaw, tipo, variante });

  if (tipo === 'basica') {
    const idx = VARIANTE_BASICA_INDEX[variante] ?? 0;
    const c = colors[idx] ?? colors[0];
    return <div className={className} style={{ backgroundColor: c }} />;
  }
  if (tipo === 'media') {
    const idx = VARIANTE_MEDIA_INDEX[variante] ?? 0;
    const g = gradients[idx] ?? gradients[0];
    return <div className={className} style={{ background: g }} />;
  }
  if (tipo === 'premium') {
    const Component = VARIANTE_PREMIUM_MAP[variante] || PremiumStars;
    return <div className={className}><Component /></div>;
  }
  // Fallback: si el tipo no coincide, usar básica azul
  const c = colors[0];
  return <div className={className} style={{ backgroundColor: c }} />;
}
