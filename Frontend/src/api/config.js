// En desarrollo usa backend local; en producción usa variable o Render
const defaultBase = import.meta.env.DEV
  ? 'http://localhost:3000'
  : 'https://tarjetafelicitaciones.onrender.com';

export const API_BASE = import.meta.env.VITE_API_URL || defaultBase;

export function apiUrl(path) {
  const base = API_BASE.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}
