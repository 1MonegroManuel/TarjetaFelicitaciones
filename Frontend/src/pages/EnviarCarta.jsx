import { Link } from 'react-router-dom'
import { useState } from 'react'
import { TEMPLATES } from '../data/staticData'
import './EnviarCarta.css'

export default function EnviarCarta() {
  const [templateId, setTemplateId] = useState('clasica')
  const [message, setMessage] = useState('')
  const [openAtDate, setOpenAtDate] = useState('')
  const [openAtTime, setOpenAtTime] = useState('')
  const [includeImages, setIncludeImages] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Datos estáticos: solo simular envío (luego API)
    setSent(true)
  }

  if (sent) {
    return (
      <main className="enviar enviar--done">
        <div className="enviar__success">
          <h2>✓ Carta guardada</h2>
          <p>Los datos se enviarán al API cuando esté conectado.</p>
          <Link to="/" className="enviar__btn">Volver al inicio</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="enviar">
      <header className="enviar__header">
        <Link to="/" className="enviar__back">← Volver</Link>
        <h1 className="enviar__title">Enviar carta</h1>
        <p className="enviar__subtitle">Elige plantilla, mensaje y cuándo se podrá abrir</p>
      </header>

      <form className="enviar__form" onSubmit={handleSubmit}>
        <section className="enviar__section">
          <h2>Plantilla</h2>
          <div className="enviar__templates">
            {TEMPLATES.map((t) => (
              <label key={t.id} className={`enviar__template ${templateId === t.id ? 'enviar__template--active' : ''}`}>
                <input
                  type="radio"
                  name="template"
                  value={t.id}
                  checked={templateId === t.id}
                  onChange={() => setTemplateId(t.id)}
                />
                <span className="enviar__template-name">{t.name}</span>
                <span className="enviar__template-desc">{t.description}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="enviar__section">
          <label htmlFor="message">Mensaje</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe el mensaje de la carta..."
            rows={4}
            required
          />
        </section>

        <section className="enviar__section">
          <label htmlFor="openDate">Fecha y hora exacta de apertura</label>
          <div className="enviar__datetime">
            <input
              id="openDate"
              type="date"
              value={openAtDate}
              onChange={(e) => setOpenAtDate(e.target.value)}
              required
            />
            <input
              type="time"
              value={openAtTime}
              onChange={(e) => setOpenAtTime(e.target.value)}
              required
            />
          </div>
        </section>

        <section className="enviar__section enviar__section--check">
          <label className="enviar__checkbox">
            <input
              type="checkbox"
              checked={includeImages}
              onChange={(e) => setIncludeImages(e.target.checked)}
            />
            Incluir imágenes JPG
          </label>
        </section>

        <button type="submit" className="enviar__submit">Enviar carta</button>
      </form>
    </main>
  )
}
