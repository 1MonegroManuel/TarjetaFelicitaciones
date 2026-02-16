import { useParams, Link } from 'react-router-dom'
import { useMemo, useState, useEffect } from 'react'
import { parseQRPayload } from '../data/staticData'
import { TEMPLATES } from '../data/staticData'
import './CartaQR.css'

function decodeFromRoute(encoded) {
  try {
    return decodeURIComponent(escape(atob(decodeURIComponent(encoded))))
  } catch {
    return ''
  }
}

function useCountdown(openAt) {
  const [left, setLeft] = useState(() => {
    const ms = openAt.getTime() - Date.now()
    return ms > 0 ? ms : 0
  })
  const canOpen = left <= 0

  useEffect(() => {
    if (canOpen) return
    const t = setInterval(() => {
      const ms = openAt.getTime() - Date.now()
      setLeft(ms > 0 ? ms : 0)
    }, 1000)
    return () => clearInterval(t)
  }, [openAt, canOpen])

  const days = Math.floor(left / (24 * 60 * 60 * 1000))
  const hours = Math.floor((left % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
  const minutes = Math.floor((left % (60 * 60 * 1000)) / (60 * 1000))
  const seconds = Math.floor((left % (60 * 1000)) / 1000)

  return { canOpen, days, hours, minutes, seconds }
}

export default function CartaQR() {
  const { encoded } = useParams()
  const payload = useMemo(() => {
    const raw = decodeFromRoute(encoded || '')
    return raw ? parseQRPayload(raw) : null
  }, [encoded])

  const templateId = useMemo(() => {
    if (!payload) return 'clasica'
    const ids = ['clasica', 'floral', 'minimal']
    return ids.includes(payload.templateId) ? payload.templateId : ids[Math.floor(Math.random() * ids.length)]
  }, [payload])

  const openAt = useMemo(() => (payload?.openAt ? new Date(payload.openAt) : new Date()), [payload])
  const { canOpen, days, hours, minutes, seconds } = useCountdown(openAt)

  const template = TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0]
  const now = new Date()
  const dateStr = now.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const timeStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  if (!payload) {
    return (
      <main className="carta-qr carta-qr--error">
        <p>Carta no encontrada.</p>
        <Link to="/">Volver al inicio</Link>
      </main>
    )
  }

  return (
    <main className={`carta-qr carta-qr--${templateId}`}>
      <div className={`carta-qr__card ${template.bgClass}`}>
        {!canOpen ? (
          <div className="carta-qr__countdown">
            <h2>Tu carta se abrirá el</h2>
            <p className="carta-qr__open-at">
              {openAt.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              <br />
              {openAt.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </p>
            <div className="carta-qr__timer">
              <span className="carta-qr__unit"><strong>{days}</strong> días</span>
              <span className="carta-qr__unit"><strong>{hours}</strong> h</span>
              <span className="carta-qr__unit"><strong>{minutes}</strong> min</span>
              <span className="carta-qr__unit"><strong>{seconds}</strong> s</span>
            </div>
            <p className="carta-qr__hint">Tiempo restante para abrir la carta</p>
          </div>
        ) : (
          <div className="carta-qr__content">
            <p className="carta-qr__message">{payload.message}</p>
            <footer className="carta-qr__meta">
              <span>Fecha y hora de apertura: {dateStr}, {timeStr}</span>
            </footer>
          </div>
        )}
      </div>
      <Link to="/" className="carta-qr__back">← Volver al inicio</Link>
    </main>
  )
}
