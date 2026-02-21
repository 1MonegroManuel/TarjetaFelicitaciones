import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { useLetter } from '../context/LetterContext';

export default function FinalScreen() {
  const { codigoQR, resetWizard } = useLetter();
  const qrRef = useRef(null);
  const shareUrl = codigoQR && typeof window !== 'undefined'
    ? `${window.location.origin}/escanear-qr?codigo=${encodeURIComponent(codigoQR)}`
    : '';

  const handleDownloadQR = () => {
    if (!qrRef.current || !codigoQR) return;
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const size = 256;
    canvas.width = size;
    canvas.height = size;
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      const a = document.createElement('a');
      a.download = 'carta-qr.png';
      a.href = canvas.toDataURL('image/png');
      a.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/escanear-qr?codigo=${encodeURIComponent(codigoQR)}`;
    navigator.clipboard?.writeText(url).then(() => alert('Enlace copiado'));
  };

  const handleShare = () => {
    const url = codigoQR ? `${window.location.origin}/escanear-qr?codigo=${encodeURIComponent(codigoQR)}` : window.location.origin;
    const text = `Abre mi carta digital: ${url}`;
    if (navigator.share) {
      navigator.share({
        title: 'Carta digital',
        text,
        url,
      }).catch(() => { });
    } else {
      navigator.clipboard?.writeText(text).then(() => alert('Enlace copiado'));
    }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareUrl + ' - Abre mi carta digital')}`;
  const instagramUrl = 'https://instagram.com/';

  if (!codigoQR) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
        <p className="text-slate-600">No hay código QR. <Link to="/enviar-carta" className="text-indigo-600 font-medium">Crear carta</Link></p>
      </div>
    );
  }

  return (
    <motion.main
      className="min-h-screen flex flex-col items-center justify-center px-6 py-8 safe-bottom bg-gradient-to-b from-white to-indigo-50/30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h1
        className="font-display text-3xl md:text-4xl text-indigo-900 text-center mb-2"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Tu carta está lista 🎉
      </motion.h1>
      <motion.p
        className="text-slate-600 text-center mb-8"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Comparte el QR para que puedan abrirla
      </motion.p>

      <motion.div
        ref={qrRef}
        className="bg-white p-4 rounded-2xl shadow-soft mb-8 border border-slate-200"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <QRCodeSVG value={codigoQR} size={200} level="M" bgColor="white" />
      </motion.div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <motion.button
          type="button"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold"
          whileTap={{ scale: 0.98 }}
          onClick={handleDownloadQR}
        >
          Descargar QR
        </motion.button>
        <motion.button
          type="button"
          className="w-full py-3 rounded-xl bg-white text-indigo-700 font-medium border border-indigo-200"
          whileTap={{ scale: 0.98 }}
          onClick={handleShare}
        >
          Compartir
        </motion.button>

        <div className="flex gap-3 justify-center mt-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 rounded-full bg-[#25D366] text-white text-xl"
            aria-label="Compartir en WhatsApp"
          >
            <span aria-hidden>📱</span>
          </a>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#f09433] to-[#e1306c] text-white text-xl"
            aria-label="Instagram"
          >
            <span aria-hidden>📷</span>
          </a>
          <motion.button
            type="button"
            className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-indigo-600"
            onClick={handleCopyLink}
            whileTap={{ scale: 0.95 }}
            aria-label="Copiar enlace"
          >
            🔗
          </motion.button>
        </div>

        <Link
          to="/"
          onClick={resetWizard}
          className="mt-6"
        >
          <motion.button
            type="button"
            className="w-full py-3 rounded-xl bg-slate-100 text-indigo-700 font-medium border border-indigo-200 hover:bg-slate-200 transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            ← Volver al inicio
          </motion.button>
        </Link>
      </div>
    </motion.main>
  );
}
