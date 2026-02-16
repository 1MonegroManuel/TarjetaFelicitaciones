# Tarjeta Felicitaciones - Frontend

Frontend en React (Vite) para escanear QR de cartas y enviar cartas. Responsive para móvil y PC.

## Cómo ejecutar

```bash
npm install
npm run dev
```

Abre en el navegador la URL que muestre Vite (por ejemplo `http://localhost:5173`).

## Estructura

- **/** – Página principal con 2 botones: **Escanear QR** y **Enviar carta**.
- **/escanear-qr** – Lector de QR con cuadrado central; al escanear redirige a la carta. Incluye botón "Abrir carta de prueba" para probar sin cámara (datos aleatorios).
- **/carta/:encoded** – Vista de la carta según el QR: una de las 3 plantillas (Clásica, Floral, Minimal), mensaje y fecha/hora. Si la fecha/hora de apertura es futura, se muestra un **contador** hasta que se pueda abrir.
- **/enviar-carta** – Formulario: elegir plantilla, mensaje, fecha y hora exacta de apertura, y opción "Incluir imágenes JPG".

Los datos son estáticos; más adelante se conectarán a una API.

## Formato del QR (futuro)

El QR puede llevar un JSON con:

- `templateId`: `"clasica"` | `"floral"` | `"minimal"`
- `message`: texto del mensaje
- `openAt`: fecha/hora ISO en que se puede abrir la carta
- `includeImages`: boolean (incluir imágenes JPG)

Si no es JSON válido, se usan valores por defecto y el texto del QR como mensaje.
