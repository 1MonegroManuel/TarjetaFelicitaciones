# API TarjetaFelicitaciones - Backend

API REST en Node.js para gestionar tarjetas de felicitaciones, plantillas, pagos y códigos QR.

## Tecnologías

- **Node.js** con **Express.js** para el servidor.
- **MSSQL** para la base de datos.
- **Dotenv** para variables de entorno.
- **CORS** para manejo de orígenes cruzados.
- **UUID** para identificadores únicos.
- **Nodemon** para desarrollo (reinicio automático).

## Instalación

1. Instala dependencias: `npm install`
2. Configura las variables de entorno en `.env` (ej. conexión a DB, puerto).
3. **Migración opcional**: para guardar la plantilla visual (TipoPlantilla, VariantePlantilla), ejecuta el script `scripts/add-tipo-variante-plantilla.sql` en tu base de datos para añadir las columnas a la tabla `Tarjetas`.

## Ejecución

- Desarrollo: `npm run dev` (usa Nodemon).
- Producción: `npm start`.

El servidor corre en el puerto definido en `.env` (por defecto 3000).

## Rutas de la API

### Endpoints usados por el frontend (PWA)

| Método | Ruta | Uso en frontend |
|--------|------|------------------|
| **GET** | `/api/health` | Comprobar si el backend está disponible. Respuesta: `{ ok: true }`. |
| **GET** | `/api/qr/:codigo` | Abrir carta por QR o por enlace. Respuestas: 200 (carta), 403 + `FechaApertura` (countdown), 410 (expirada), 404/403 (error). |
| **POST** | `/api/checkout` | Crear carta y obtener código QR. Body: `Titulo`, `Mensaje`, `IdPlantilla`, `FechaApertura` (obligatorios); `TipoPlantilla`, `VariantePlantilla` (ej. basica, azul; premium, stars); `NombreRemitente`, `NombreDestinatario` (opcionales). Respuesta: `{ codigoQR, tarjetaId, precio }`. |
| **GET** | `/api/plantillas` | Listar plantillas (opcional; el frontend usa `IdPlantilla` 1, 2, 3 por defecto). |

### Resto de rutas

- **GET /**: Mensaje de estado de la API.
- **Plantillas** (`/api/plantillas`): `GET /`, `POST /`.
- **Tarjetas** (`/api/tarjetas`): CRUD de tarjetas.
- **Pagos** (`/api/pagos`): `POST /`.
- **QR** (`/api/qr`): `GET /:codigo` — obtiene tarjeta por código QR, valida fecha de apertura y registra escaneo.
- **Checkout** (`/api/checkout`): `POST /` — crea tarjeta, pago simulado y código QR.

## Distribución del Proyecto

```
Backend/
├── .env                 # Variables de entorno (DB, puerto)
├── package.json         # Dependencias y scripts
├── README.md            # Este archivo
└── src/
    ├── app.js           # Punto de entrada del servidor
    ├── config/
    │   └── db.js        # Configuración de conexión a MSSQL
    ├── controllers/     # Lógica de negocio
    │   ├── pagosController.js
    │   ├── plantillasController.js
    │   ├── qrController.js
    │   └── tarjetasController.js
    └── routes/          # Definición de rutas
        ├── pagosRoutes.js
        ├── plantillasRoutes.js
        ├── qrRoutes.js
        └── tarjetasRoutes.js
```
