import { useState, useEffect } from 'react'

const API_URL = 'https://tarjetafelicitaciones.onrender.com/api/plantillas'

export default function Pricing() {
  const [plantillas, setPlantillas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPlantillas = async () => {
      let timeoutId = null
      try {
        setLoading(true)
        setError(null)

        console.log('Fetching plantillas from:', API_URL)

        // Crear un AbortController para timeout
        const controller = new AbortController()
        timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos timeout

        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        })

        if (timeoutId) clearTimeout(timeoutId)

        console.log('Response status:', response.status)
        console.log('Response ok:', response.ok)
        console.log('Response headers:', Object.fromEntries(response.headers.entries()))

        if (!response.ok) {
          const errorText = await response.text()
          console.error('Error response:', errorText)
          throw new Error(`Error al cargar las plantillas: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log('Data received:', data)
        console.log('Number of plantillas:', data?.length)

        if (!Array.isArray(data)) {
          throw new Error('La respuesta no es un array válido')
        }

        if (data.length === 0) {
          console.warn('Array vacío recibido')
        }

        setPlantillas(data)
        setError(null)
      } catch (err) {
        if (timeoutId) clearTimeout(timeoutId)
        console.error('Error fetching plantillas:', err)

        if (err.name === 'AbortError') {
          setError('La petición tardó demasiado. Por favor, intenta de nuevo.')
        } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          setError('Error de conexión. Verifica tu conexión a internet o que la API esté disponible.')
        } else {
          setError(err.message || 'Error desconocido al cargar las plantillas')
        }

        // En caso de error, mostrar datos de ejemplo para desarrollo
        if (import.meta.env.DEV) {
          console.warn('Modo desarrollo: Usando datos de ejemplo debido al error')
          setPlantillas([
            { IdPlantilla: 1, Nombre: 'Basica', Descripcion: 'Diseño con colores simples y estilo minimalista.', Precio: 10 },
            { IdPlantilla: 2, Nombre: 'Media', Descripcion: 'Incluye fondos decorativos y estilos visuales mejorados.', Precio: 20 },
            { IdPlantilla: 3, Nombre: 'Premium', Descripcion: 'Incluye animaciones CSS, efectos especiales y diseño avanzado.', Precio: 35 }
          ])
          setError(null) // Limpiar el error si usamos datos de ejemplo
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPlantillas()
  }, [])

  const getPlanStyles = (nombre) => {
    const nombreLower = nombre.toLowerCase()

    if (nombreLower.includes('premium')) {
      return {
        container: 'bg-gradient-to-br from-purple-600 to-pink-600 text-white transform scale-105 shadow-2xl border-4 border-yellow-300',
        badge: 'bg-yellow-300 text-purple-900',
        button: 'bg-white text-purple-600 hover:bg-gray-100',
        price: 'text-white',
      }
    } else if (nombreLower.includes('media')) {
      return {
        container: 'bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-purple-200',
        badge: 'bg-purple-600 text-white',
        button: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700',
        price: 'text-gray-900',
      }
    } else {
      return {
        container: 'bg-white border-2 border-gray-200',
        badge: 'bg-gray-200 text-gray-800',
        button: 'bg-gray-800 text-white hover:bg-gray-900',
        price: 'text-gray-900',
      }
    }
  }

  const getPlanFeatures = (nombre) => {
    const nombreLower = nombre.toLowerCase()

    if (nombreLower.includes('premium')) {
      return [
        'Animaciones CSS avanzadas',
        'Efectos especiales interactivos',
        'Diseño completamente personalizado',
        'Soporte prioritario',
        'Plantillas exclusivas',
      ]
    } else if (nombreLower.includes('media')) {
      return [
        'Fondos decorativos',
        'Diseño mejorado',
        'Múltiples opciones de estilo',
        'Soporte estándar',
      ]
    } else {
      return [
        'Fondo simple y elegante',
        'Estilo minimalista',
        'Funcionalidad completa',
        'Soporte básico',
      ]
    }
  }

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              Nuestros Planes
            </h2>
            <p className="text-xl text-gray-600">
              Cargando opciones disponibles...
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </section>
    )
  }

  if (error && plantillas.length === 0) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              Nuestros Planes
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-800 font-semibold mb-2">Error al cargar los planes</p>
              <p className="text-red-600 text-sm mb-4">{error}</p>
              <p className="text-red-500 text-xs">
                Por favor, verifica la consola del navegador para más detalles.
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            Nuestros Planes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Elige el plan perfecto para crear tu carta especial
          </p>
        </div>

        {plantillas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No hay planes disponibles en este momento.</p>
            {error && (
              <p className="text-red-500 text-sm mt-2">Error: {error}</p>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 lg:gap-6">
            {plantillas.map((plan) => {
              if (!plan || !plan.Nombre || plan.Precio === undefined) {
                console.warn('Plan inválido:', plan)
                return null
              }

              const styles = getPlanStyles(plan.Nombre)
              const features = getPlanFeatures(plan.Nombre)
              const isPremium = plan.Nombre.toLowerCase().includes('premium')

              return (
                <div
                  key={plan.IdPlantilla}
                  className={`rounded-2xl p-8 ${styles.container} transition-all duration-300 hover:shadow-xl relative`}
                >
                  {isPremium && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className={`${styles.badge} px-4 py-1 rounded-full text-sm font-bold shadow-lg`}>
                        ⭐ MÁS POPULAR
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-display font-bold mb-2">
                      {plan.Nombre}
                    </h3>
                    <div className={`text-5xl font-bold mb-2 ${styles.price}`}>
                      ${plan.Precio}
                    </div>
                    <p className="text-sm opacity-80 mt-2">
                      {plan.Descripcion || 'Plan completo para tu carta especial'}
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className={`w-5 h-5 mr-2 mt-0.5 flex-shrink-0 ${isPremium ? 'text-yellow-300' : 'text-purple-600'
                            }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="https://tarjetafelicitaciones-2.onrender.com/"
                    className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${styles.button}`}
                  >
                    Seleccionar
                  </a>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
