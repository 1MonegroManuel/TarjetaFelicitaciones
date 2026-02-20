const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Configurar CORS - DEBE IR ANTES de las rutas
app.use(cors({
  origin: [
    'https://tarjetafelicitaciones.onrender.com',
    'https://tarjetafelicitaciones-1.onrender.com',
    'http://localhost:5173',
    'http://localhost:3000',
    /\.onrender\.com$/
  ],
  credentials: true
}));

app.use(express.json());

const plantillasRoutes = require("./routes/plantillasRoutes");
app.use("/api/plantillas", plantillasRoutes);

const tarjetasRoutes = require('./routes/tarjetasRoutes');
app.use('/api/tarjetas', tarjetasRoutes);

const pagosRoutes = require('./routes/pagosRoutes');
app.use('/api/pagos', pagosRoutes);

const qrRoutes = require('./routes/qrRoutes');
app.use('/api/qr', qrRoutes);

const checkoutRoutes = require('./routes/checkoutRoutes');
app.use('/api/checkout', checkoutRoutes);

const reportesRoutes = require('./routes/reportesRoutes');
app.use('/api/reportes', reportesRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API TarjetaFelicitaciones funcionando" });
});

// Salud del API (para que el frontend compruebe si el backend está disponible)
app.get("/api/health", (req, res) => {
  res.status(200).json({ ok: true, message: "API disponible" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
});
