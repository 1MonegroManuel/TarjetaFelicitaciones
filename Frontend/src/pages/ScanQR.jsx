import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Html5Qrcode } from 'html5-qrcode'
import { parseQRPayload, getRandomMockQRPayload } from '../data/staticData'
import './ScanQR.css'

function encodeForRoute(text) {
  return encodeURIComponent(btoa(unescape(encodeURIComponent(text))))
}

export default function ScanQR() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [scanning, setScanning] = useState(false)
  const html5QrRef = useRef(null)
  const scannerRef = useRef(null)

  const onScanSuccess = useCallback(
    (decodedText) => {
      if (!decodedText) return
      try {
        parseQRPayload(decodedText)
        const encoded = encodeForRoute(decodedText)
        navigate(`/carta/${encoded}`, { replace: true })
      } catch (e) {
        setError('Código QR no válido.')
      }
    },
    [navigate]
  )

  const startScanner = useCallback(() => {
    if (scannerRef.current) return
    setError('')
    const html5Qr = new Html5Qrcode('qr-reader')
    scannerRef.current = html5Qr
    html5Qr
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        onScanSuccess,
        () => {}
      )
      .then(() => setScanning(true))
      .catch((err) => setError('No se pudo acceder a la cámara: ' + (err.message || 'Error')))
  }, [onScanSuccess])

  const stopScanner = useCallback(() => {
    if (!scannerRef.current) return
    scannerRef.current.stop().then(() => {
      scannerRef.current.clear()
      scannerRef.current = null
      setScanning(false)
    })
  }, [])

  useEffect(() => {
    startScanner()
    return () => {
      stopScanner()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDemo = () => {
    const mockPayload = getRandomMockQRPayload()
    const encoded = encodeForRoute(mockPayload)
    navigate(`/carta/${encoded}`)
  }

  return (
    <main className="scan-qr">
      <header className="scan-qr__header">
        <Link to="/" className="scan-qr__back">← Volver</Link>
        <h1 className="scan-qr__title">Escanear QR</h1>
        <p className="scan-qr__subtitle">Apunta la cámara al código QR de la carta</p>
      </header>

      <div className="scan-qr__area">
        <div className="scan-qr__frame">
          <div id="qr-reader" className="qr-reader" />
        </div>
        {error && <p className="scan-qr__error">{error}</p>}
      </div>

      <p className="scan-qr__hint">¿Sin QR? Prueba con datos de demostración:</p>
      <button type="button" className="scan-qr__demo" onClick={handleDemo}>
        Abrir carta de prueba
      </button>
    </main>
  )
}
