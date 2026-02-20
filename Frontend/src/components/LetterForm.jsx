import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLetter } from '../context/LetterContext';
import { apiUrl } from '../api/config';

export default function LetterForm({ onSuccess }) {
  const { template, formData, setFormData, setCodigoQR, setLoading, setError } = useLetter();
  const [titulo, setTitulo] = useState(formData.titulo);
  const [contenido, setContenido] = useState(formData.contenido);
  const [nombreRemitente, setNombreRemitente] = useState(formData.nombreRemitente);
  const [nombreDestinatario, setNombreDestinatario] = useState(formData.nombreDestinatario);
  const [fechaApertura, setFechaApertura] = useState(formData.fechaApertura);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormData({
      titulo,
      contenido,
      nombreRemitente,
      nombreDestinatario,
      fechaApertura,
    });
    setLoading(true);
    setError(null);
    try {
      const body = {
        Titulo: titulo,
        Mensaje: contenido,
        IdPlantilla: template.idPlantilla ?? 1,
        FechaApertura: fechaApertura ? new Date(fechaApertura).toISOString() : undefined,
        TipoPlantilla: template.tipoPlantilla ?? 'basica',
        VariantePlantilla: template.variantePlantilla ?? 'azul',
      };
      
      // Log para debug
      console.log('LetterForm - Enviando al backend:', {
        TipoPlantilla: body.TipoPlantilla,
        VariantePlantilla: body.VariantePlantilla,
        template: template
      });
      if (nombreRemitente.trim()) body.NombreRemitente = nombreRemitente.trim();
      if (nombreDestinatario.trim()) body.NombreDestinatario = nombreDestinatario.trim();
      if (!body.FechaApertura) {
        setError('La fecha de apertura es obligatoria.');
        setLoading(false);
        return;
      }

      const res = await fetch(apiUrl('/api/checkout'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Error al crear la carta');
        setLoading(false);
        return;
      }
      const codigo = data.codigoUnico || data.codigoQR;
      setCodigoQR(codigo);
      setLoading(false);
      onSuccess();
    } catch (err) {
      setError('Error de conexión. ¿Está el backend en marcha? Prueba con npm run dev en la carpeta Backend.');
      setLoading(false);
    }
  };

  return (
    <motion.form
      className="max-w-lg mx-auto px-4 py-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
    >
      <h2 className="font-display text-2xl text-indigo-900 mb-6 text-center">
        Completar contenido
      </h2>

      <div className="space-y-4 mb-6">
        <label className="block text-slate-600 text-sm">Título (Asunto) *</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Asunto de la carta"
          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          required
        />
      </div>

      <div className="space-y-4 mb-6">
        <label className="block text-slate-600 text-sm">Contenido *</label>
        <textarea
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          placeholder="Escribe el mensaje de tu carta..."
          rows={5}
          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          required
        />
      </div>

      <div className="space-y-4 mb-4">
        <label className="block text-slate-600 text-sm">Nombre remitente (opcional)</label>
        <input
          type="text"
          value={nombreRemitente}
          onChange={(e) => setNombreRemitente(e.target.value)}
          placeholder="Quién envía"
          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div className="space-y-4 mb-4">
        <label className="block text-slate-600 text-sm">Nombre destinatario (opcional)</label>
        <input
          type="text"
          value={nombreDestinatario}
          onChange={(e) => setNombreDestinatario(e.target.value)}
          placeholder="Para quién"
          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div className="space-y-4 mb-8">
        <label className="block text-slate-600 text-sm">Fecha de apertura *</label>
        <input
          type="date"
          value={fechaApertura}
          onChange={(e) => setFechaApertura(e.target.value)}
          min={new Date().toISOString().slice(0, 10)}
          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          required
        />
      </div>

      <motion.button
        type="submit"
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold text-lg shadow-soft"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Terminar Carta
      </motion.button>
    </motion.form>
  );
}

