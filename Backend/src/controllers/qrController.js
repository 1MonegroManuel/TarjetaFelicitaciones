const sql = require('mssql');
const { poolPromise } = require('../config/db');

const getTarjetaByQR = async (req, res) => {
  try {
    const { codigo } = req.params;

    const pool = await poolPromise;

    const result = await pool.request()
      .input("CodigoUnico", sql.NVarChar, codigo)
      .query(`
        SELECT 
          t.IdTarjeta,
          t.NombreRemitente,
          t.NombreDestinatario,
          t.Titulo,
          t.Mensaje,
          t.UrlImagen,
          t.FechaApertura,
          t.Estado
        FROM CodigosQR qr
        INNER JOIN Tarjetas t 
          ON qr.IdTarjeta = t.IdTarjeta
        WHERE qr.CodigoUnico = @CodigoUnico
        AND qr.Activo = 1
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: "Código QR inválido o inactivo"
      });
    }

    res.status(200).json(result.recordset[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error consultando QR"
    });
  }
};

module.exports = {
  getTarjetaByQR
};
