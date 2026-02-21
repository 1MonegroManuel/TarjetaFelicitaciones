import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import jsQR from 'jsqr';
import { motion, AnimatePresence } from 'framer-motion';
import { apiUrl } from '../api/config';
import { CartaBackground } from './AnimatedBackgrounds';

// Reloj animado (arena del tiempo)
function AnimatedClock() {
  return (
    <motion.div
      className="relative w-32 h-32 mx-auto mt-6"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      <div className="absolute inset-0 rounded-full border-4 border-indigo-200 bg-white/80 shadow-inner" />
      <motion.div
        className="absolute left-1/2 top-1/2 w-1 origin-left -translate-y-1/2"
        style={{ height: '36px', marginLeft: '-2px', background: '#6366f1' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 w-0.5 origin-left -translate-y-1/2"
        style={{ height: '28px', marginLeft: '-1px', background: '#8b5cf6' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      />
      <div className="absolute left-1/2 top-1/2 w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500" />
    </motion.div>
  );
}

function CountdownView({ fechaApertura, onBack }) {
  const [left, setLeft] = useState(() => {
    const open = new Date(fechaApertura).getTime();
    const ms = open - Date.now();
    return ms > 0 ? ms : 0;
  });

  useEffect(() => {
    if (left <= 0) return;
    const t = setInterval(() => {
      const open = new Date(fechaApertura).getTime();
      const ms = open - Date.now();
      setLeft(ms > 0 ? ms : 0);
    }, 1000);
    return () => clearInterval(t);
  }, [fechaApertura, left]);

  const days = Math.floor(left / (24 * 60 * 60 * 1000));
  const hours = Math.floor((left % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((left % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((left % (60 * 1000)) / 1000);
  const openDate = new Date(fechaApertura);

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-white to-indigo-50/50 safe-top safe-bottom"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="font-display text-xl text-indigo-900 text-center mb-2">Esta carta se abrirá el</h2>
      <p className="text-slate-600 text-center mb-6">
        {openDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        <br />
        {openDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
      </p>
      <div className="flex gap-4 flex-wrap justify-center mb-6">
        <div className="bg-white rounded-2xl shadow-soft px-6 py-4 min-w-[70px] text-center border border-indigo-100">
          <span className="block text-2xl font-bold text-indigo-600">{days}</span>
          <span className="text-sm text-slate-500">días</span>
        </div>
        <div className="bg-white rounded-2xl shadow-soft px-6 py-4 min-w-[70px] text-center border border-indigo-100">
          <span className="block text-2xl font-bold text-indigo-600">{hours}</span>
          <span className="text-sm text-slate-500">horas</span>
        </div>
        <div className="bg-white rounded-2xl shadow-soft px-6 py-4 min-w-[70px] text-center border border-indigo-100">
          <span className="block text-2xl font-bold text-indigo-600">{minutes}</span>
          <span className="text-sm text-slate-500">min</span>
        </div>
        <div className="bg-white rounded-2xl shadow-soft px-6 py-4 min-w-[70px] text-center border border-indigo-100">
          <span className="block text-2xl font-bold text-indigo-600">{seconds}</span>
          <span className="text-sm text-slate-500">seg</span>
        </div>
      </div>
      <p className="text-slate-500 text-sm text-center mb-8">Tiempo restante para abrir la carta</p>
      <Link to="/" className="text-indigo-600 font-medium" onClick={onBack}>← Volver al inicio</Link>
    </motion.div>
  );
}

function ExpiredView({ onBack }) {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-slate-100 to-indigo-50/30 safe-top safe-bottom"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="font-display text-xl text-indigo-900 text-center mb-4">Esta carta ya expiró</h2>
      <p className="text-slate-600 text-center max-w-sm mb-2">Lo que te mandó se perdió en las arenas del tiempo.</p>
      <AnimatedClock />
      <Link to="/" className="mt-10 text-indigo-600 font-medium" onClick={onBack}>← Volver al inicio</Link>
    </motion.div>
  );
}

export default function QRScanner() {
  const [searchParams] = useSearchParams();
  const codigoFromUrl = searchParams.get('codigo');
  const [error, setError] = useState('');
  const [validating, setValidating] = useState(false);
  const [carta, setCarta] = useState(null);
  const [countdownDate, setCountdownDate] = useState(null);
  const [expired, setExpired] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const scanLoopRef = useRef(null);
  const scanningRef = useRef(false);
  const fileInputRef = useRef(null);

  const resetState = useCallback(() => {
    setCarta(null);
    setCountdownDate(null);
    setExpired(false);
    setError('');
  }, []);

  const fetchCartaByCodigo = useCallback(async (codigo) => {
    setValidating(true);
    setCarta(null);
    setCountdownDate(null);
    setExpired(false);
    try {
      const res = await fetch(apiUrl(`/api/qr/${encodeURIComponent(codigo)}`));
      const data = await res.json().catch(() => ({}));
      if (res.status === 410 || data.error === 'expired') {
        setExpired(true);
        setValidating(false);
        return;
      }
      if (res.status === 403 && data.FechaApertura) {
        setCountdownDate(data.FechaApertura);
        setValidating(false);
        return;
      }
      if (!res.ok) {
        setError(data.error || 'La carta no puede abrirse.');
        setValidating(false);
        return;
      }
      // Log para debug
      console.log('Carta recibida del backend:', {
        TipoPlantilla: data.TipoPlantilla,
        VariantePlantilla: data.VariantePlantilla,
        CodigoUnico: data.CodigoUnico,
        dataCompleta: data
      });
      setCarta(data);
    } catch (err) {
      setError('Error de conexión. ¿Backend en marcha?');
    }
    setValidating(false);
  }, []);

  const onScanSuccess = useCallback((decodedText) => {
    if (!decodedText || scanningRef.current) return;
    scanningRef.current = true;
    setError('');
    fetchCartaByCodigo(decodedText).finally(() => {
      scanningRef.current = false;
    });
  }, [fetchCartaByCodigo]);

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;
    setError('');
    setValidating(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const result = jsQR(imageData.data, imageData.width, imageData.height);
        if (result && result.data) {
          onScanSuccess(result.data);
        } else {
          setError('No se encontró un código QR válido en la imagen.');
          setValidating(false);
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }, [onScanSuccess]);

  // Abrir por enlace (codigo en query)

  // Cámara: getUserMedia + <video> + loop de escaneo con jsQR
  useEffect(() => {
    if (codigoFromUrl) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    let cancelled = false;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        video.srcObject = stream;
        video.play().catch((err) => setError('No se pudo reproducir el video: ' + (err?.message || '')));
      })
      .catch((err) => setError('No se pudo acceder a la cámara: ' + (err?.message || 'Error')));

    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    function tick() {
      if (cancelled || !streamRef.current) return;
      if (video.readyState !== video.HAVE_ENOUGH_DATA) {
        scanLoopRef.current = requestAnimationFrame(tick);
        return;
      }
      const w = video.videoWidth;
      const h = video.videoHeight;
      if (!w || !h) {
        scanLoopRef.current = requestAnimationFrame(tick);
        return;
      }
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(video, 0, 0);
      const imageData = ctx.getImageData(0, 0, w, h);
      const result = jsQR(imageData.data, imageData.width, imageData.height);
      if (result && result.data) {
        onScanSuccess(result.data);
        return;
      }
      scanLoopRef.current = requestAnimationFrame(tick);
    }

    const startTicking = () => {
      scanLoopRef.current = requestAnimationFrame(tick);
    };
    video.addEventListener('loadedmetadata', startTicking);
    video.addEventListener('playing', startTicking);
    if (video.readyState >= 2) startTicking();

    return () => {
      cancelled = true;
      video.removeEventListener('loadedmetadata', startTicking);
      video.removeEventListener('playing', startTicking);
      if (scanLoopRef.current) cancelAnimationFrame(scanLoopRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (video.srcObject) video.srcObject = null;
    };
  }, [codigoFromUrl, onScanSuccess]);

  if (carta) {
    return (
      <motion.main
        className="min-h-screen bg-slate-50 p-6 safe-top safe-bottom"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-lg mx-auto">
          <div
            className="relative rounded-3xl p-6 md:p-8 shadow-soft text-slate-800 min-h-[320px] flex flex-col justify-between border border-slate-200 overflow-hidden"
            style={
              carta.UrlImagen
                ? { background: `url(${carta.UrlImagen}) center/cover` }
                : undefined
            }
          >
            {!carta.UrlImagen && (
              <CartaBackground
                tipoPlantilla={carta.TipoPlantilla || carta.tipoPlantilla}
                variantePlantilla={carta.VariantePlantilla || carta.variantePlantilla}
                className="absolute inset-0 rounded-3xl overflow-hidden"
              />
            )}
            <div className="relative z-10">
              <h2 className="font-display text-2xl font-semibold mb-2">{carta.Titulo}</h2>
              <p className="whitespace-pre-wrap text-slate-800/90">{carta.Mensaje}</p>
            </div>
            <footer className="relative z-10 mt-6 pt-4 border-t border-slate-300/50 text-sm">
              {carta.NombreRemitente && <p>De: {carta.NombreRemitente}</p>}
              {carta.NombreDestinatario && <p>Para: {carta.NombreDestinatario}</p>}
            </footer>
          </div>
          <Link to="/" className="mt-6 inline-block text-indigo-600 font-medium">← Volver al inicio</Link>
        </div>
      </motion.main>
    );
  }

  if (countdownDate) return <CountdownView fechaApertura={countdownDate} onBack={resetState} />;
  if (expired) return <ExpiredView onBack={resetState} />;

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col safe-top safe-bottom">
      <header className="p-4 flex items-center gap-4 bg-white border-b border-slate-200">
        <Link to="/" className="text-indigo-600 font-medium">← Volver</Link>
        <h1 className="font-display text-xl text-indigo-900">Abrir Carta</h1>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        {!codigoFromUrl && (
          <>
            <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden bg-slate-200 shadow-soft">
              <video
                ref={videoRef}
                muted
                playsInline
                className="block w-full h-full object-cover"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <canvas ref={canvasRef} className="hidden" width="0" height="0" />
              <div
                className="absolute inset-0 pointer-events-none flex items-center justify-center"
                aria-hidden
              >
                <div className="w-[220px] h-[220px] rounded-2xl border-4 border-white shadow-lg bg-transparent" />
              </div>
            </div>
          </>
        )}

        {codigoFromUrl && !carta && !countdownDate && !expired && !error && (
          <div className="w-full max-w-sm aspect-square rounded-2xl bg-white border border-slate-200 flex items-center justify-center">
            <span className="text-slate-500">Cargando...</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {validating && (
            <motion.div
              key="loading"
              className="mt-6 flex flex-col items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-600">Validando carta...</p>
            </motion.div>
          )}
          {error && (
            <motion.p
              key="err"
              className="mt-6 text-red-600 text-center max-w-xs"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {!codigoFromUrl && (
          <motion.button
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium shadow-soft hover:bg-indigo-700 transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            Subir imagen con QR
          </motion.button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        <p className="mt-6 text-slate-500 text-sm text-center">Apunta la cámara al código QR de la carta</p>
      </div>
    </main>
  );
}
