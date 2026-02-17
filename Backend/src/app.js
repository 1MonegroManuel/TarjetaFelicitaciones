const express = require("express");
require("dotenv").config();

const app = express();
app.use(express.json());

const plantillasRoutes = require("./routes/plantillasRoutes");
app.use("/api/plantillas", plantillasRoutes);

const tarjetasRoutes = require('./routes/tarjetasRoutes');
app.use('/api/tarjetas', tarjetasRoutes);

const pagosRoutes = require('./routes/pagosRoutes');
app.use('/api/pagos', pagosRoutes);

const qrRoutes = require('./routes/qrRoutes');
app.use('/api/qr', qrRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API TarjetaFelicitaciones funcionando" });
});

const PORT = process.env.PORT || 3000;

app.listen(process.env.PORT, () => {
  console.log("Servidor corriendo en puerto", process.env.PORT);
});
