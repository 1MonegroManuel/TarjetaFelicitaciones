// Datos estáticos (luego se reemplazará por API)

export const TEMPLATES = [
  {
    id: 'clasica',
    name: 'Clásica',
    description: 'Fondo elegante con bordes dorados',
    bgClass: 'template-clasica',
  },
  {
    id: 'floral',
    name: 'Floral',
    description: 'Motivos florales suaves',
    bgClass: 'template-floral',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Diseño limpio y moderno',
    bgClass: 'template-minimal',
  },
]

// Simula payload que vendría en el QR (fondo, tipo mensaje, fecha/hora de apertura)
export function parseQRPayload(qrText) {
  try {
    const data = JSON.parse(qrText)
    return {
      templateId: data.templateId ?? 'clasica',
      message: data.message ?? '¡Felicitaciones!',
      openAt: data.openAt ? new Date(data.openAt) : new Date(),
      includeImages: data.includeImages ?? false,
    }
  } catch {
    // Si no es JSON, usar valores por defecto y texto como mensaje
    return {
      templateId: 'clasica',
      message: qrText || '¡Felicitaciones!',
      openAt: new Date(),
      includeImages: false,
    }
  }
}

// Genera un payload de ejemplo para simular QR (para pruebas sin cámara)
export function getRandomMockQRPayload() {
  const templateIds = ['clasica', 'floral', 'minimal']
  const messages = [
    '¡Feliz cumpleaños! Que este día esté lleno de alegría.',
    'Gracias por ser parte de este momento especial.',
    'Te deseamos lo mejor en este nuevo año.',
  ]
  // Fecha/hora de apertura: puede ser ya pasada (abre ya) o futura (countdown)
  const now = new Date()
  const future = new Date(now.getTime() + 2 * 60 * 60 * 1000) // 2 horas después
  const openAt = Math.random() > 0.5 ? now : future

  return JSON.stringify({
    templateId: templateIds[Math.floor(Math.random() * templateIds.length)],
    message: messages[Math.floor(Math.random() * messages.length)],
    openAt: openAt.toISOString(),
    includeImages: Math.random() > 0.5,
  })
}
