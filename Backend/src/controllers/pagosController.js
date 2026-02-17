const sql = require('mssql');
const { poolPromise } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const createPago = async (req, res) => {
  try {
    const { IdTarjeta, Monto, MetodoPago } = req.body;

    if (!IdTarjeta || !Monto) {
      return res.status(400).json({
        message: "IdTarjeta y Monto son obligatorios"
      });
    }

    const pool = await poolPromise;

    //Verificar tarjeta y obtener precio
    const tarjetaResult = await pool.request()
      .input("IdTarjeta", sql.Int, IdTarjeta)
      .query(`
        SELECT t.Estado, p.Precio
        FROM Tarjetas t
        INNER JOIN Plantillas p 
          ON t.IdPlantilla = p.IdPlantilla
        WHERE t.IdTarjeta = @IdTarjeta
      `);

    if (tarjetaResult.recordset.length === 0) {
      return res.status(404).json({
        message: "Tarjeta no encontrada"
      });
    }

    const { Estado, Precio } = tarjetaResult.recordset[0];

    if (Estado === 'Pagado' || Estado === 'Disponible') {
      return res.status(400).json({
        message: "La tarjeta ya fue pagada"
          });
      }

    if (parseFloat(Monto) !== parseFloat(Precio)) {
      return res.status(400).json({
        message: `El monto debe ser ${Precio}`
      });
    }

    //Insertar pago
    await pool.request()
      .input("IdTarjeta", sql.Int, IdTarjeta)
      .input("Monto", sql.Decimal(10,2), Monto)
      .input("MetodoPago", sql.NVarChar, MetodoPago)
      .query(`
        INSERT INTO Pagos (IdTarjeta, Monto, MetodoPago)
        VALUES (@IdTarjeta, @Monto, @MetodoPago)
      `);

    //Actualizar estado tarjeta
    await pool.request()
      .input("IdTarjeta", sql.Int, IdTarjeta)
      .query(`
        UPDATE Tarjetas
        SET Estado = 'Pagado'
        WHERE IdTarjeta = @IdTarjeta
      `);

    const codigoUnico = uuidv4();
    await pool.request()
      .input("IdTarjeta", sql.Int, IdTarjeta)
      .input("CodigoUnico", sql.NVarChar, codigoUnico)
      .query(`
        INSERT INTO CodigosQR (IdTarjeta, CodigoUnico)
        VALUES (@IdTarjeta, @CodigoUnico)
      `);

    // Cambiar estadoa Disponible
    await pool.request()
      .input("IdTarjeta", sql.Int, IdTarjeta)
      .query(`
        UPDATE Tarjetas
        SET Estado = 'Disponible'
        WHERE IdTarjeta = @IdTarjeta
      `);

    res.status(201).json({
      message: "Pago registrado correctamente"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error registrando pago"
    });
  }
};


module.exports = {
  createPago
};
