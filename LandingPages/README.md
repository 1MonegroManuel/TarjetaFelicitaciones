# MomentoCarta - Landing Page

Landing page moderna y profesional para el proyecto de envío de cartas digitales con apertura programada.

## Características

- ✨ Diseño moderno tipo startup tecnológica
- 📱 Completamente responsive (móvil, tablet, desktop)
- 🎨 Estilos con Tailwind CSS
- ⚡ Construido con Vite y React
- 🔄 Consumo dinámico de API para planes de precios
- 🎭 Animaciones sutiles y efectos visuales

## Estructura

```
LandingPages/
├── src/
│   ├── components/
│   │   └── landing/
│   │       ├── Hero.jsx          # Sección principal
│   │       ├── Hero.css          # Animaciones del Hero
│   │       ├── HowItWorks.jsx    # Sección "Cómo funciona"
│   │       ├── Pricing.jsx       # Sección de planes (consume API)
│   │       ├── Benefits.jsx      # Sección de beneficios
│   │       └── Footer.jsx        # Footer
│   ├── pages/
│   │   └── LandingPage.jsx       # Página principal
│   ├── App.jsx                    # Componente raíz
│   ├── main.jsx                   # Punto de entrada
│   └── index.css                  # Estilos globales con Tailwind
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Instalación

```bash
cd LandingPages
npm install
```

## Ejecutar en desarrollo

```bash
npm run dev
```

Abre en el navegador la URL que muestre Vite (por ejemplo `http://localhost:5173`).

## Build para producción

```bash
npm run build
```

Los archivos compilados se generarán en la carpeta `dist/`.

## Preview del build

```bash
npm run preview
```

## API

La landing page consume la siguiente API para mostrar los planes:

- **Endpoint**: `https://tarjetafelicitaciones.onrender.com/api/plantillas`
- **Método**: GET
- **Respuesta**: Array de objetos con `IdPlantilla`, `Nombre`, `Descripcion`, `Precio`

## Secciones

1. **Hero**: Sección principal con título impactante y CTAs
2. **Cómo funciona**: 3 pasos explicativos del proceso
3. **Planes**: Tarjetas dinámicas de precios consumiendo la API
4. **Beneficios**: 4 beneficios principales del servicio
5. **Footer**: Información y enlaces

## Tecnologías

- React 18
- Vite 5
- Tailwind CSS 3
- PostCSS
- Autoprefixer
