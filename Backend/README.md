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

## Ejecución

- Desarrollo: `npm run dev` (usa Nodemon).
- Producción: `npm start`.

El servidor corre en el puerto definido en `.env` (por defecto 3000).

## Rutas de la API

- **GET /**: Mensaje de estado de la API.
- **Plantillas** (`/api/plantillas`):
  - `GET /`: Obtiene todas las plantillas.
  - `POST /`: Crea una nueva plantilla.
- **Tarjetas** (`/api/tarjetas`):
  - `POST /`: Crea una nueva tarjeta.
  - `GET /:id`: Obtiene una tarjeta por ID.
  - `PUT /:id`: Actualiza una tarjeta por ID.
  - `DELETE /:id`: Elimina una tarjeta por ID.
- **Pagos** (`/api/pagos`):
  - `POST /`: Crea un nuevo pago.
- **QR** (`/api/qr`):
  - `GET /:codigo`: Obtiene una tarjeta por código QR (verifica fecha de apertura y registra escaneo).
- **Checkout** (`/api/checkout`):
  - `POST /`: Crea una tarjeta, procesa pago simulado y genera código QR.

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
