const { poolPromise, sql } = require('../config/db');

const getTarjetaByQR = async (req, res) => {
  try {
    const { codigo } = req.params;

    const pool = await poolPromise;

    // Buscar código en CodigosQR JOIN Tarjetas
    const result = await pool.request()
      .input('codigo', sql.NVarChar, codigo)
      .query(`
        SELECT
          qr.IdCodigo,
          t.IdTarjeta,
          t.NombreRemitente,
          t.NombreDestinatario,
          t.Titulo,
          t.Mensaje,
          t.UrlImagen,
          t.FechaApertura,
          t.Estado
        FROM CodigosQR qr
        INNER JOIN Tarjetas t ON qr.IdTarjeta = t.IdTarjeta
        WHERE qr.CodigoQR = @codigo
        AND qr.Activo = 1
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Código QR no encontrado o inactivo' });
    }

    const tarjeta = result.recordset[0];

    // Verificar Estado = 'Disponible'
    if (tarjeta.Estado !== 'Disponible') {
      return res.status(403).json({ error: 'La tarjeta no está disponible' });
    }

    // Verificar FechaApertura <= fecha actual
    const now = new Date();
    const fechaApertura = new Date(tarjeta.FechaApertura);
    if (fechaApertura > now) {
      return res.status(403).json({ error: 'La carta aún no puede abrirse.' });
    }

    // Registrar escaneo en EscaneosQR
    await pool.request()
      .input('IdCodigo', sql.Int, tarjeta.IdCodigo)
      .input('FechaEscaneo', sql.DateTime, now)
      .query('INSERT INTO EscaneosQR (IdCodigo, FechaEscaneo) VALUES (@IdCodigo, @FechaEscaneo)');

    // Devolver datos de la tarjeta (excluir IdCodigo interno)
    const { IdCodigo, ...tarjetaData } = tarjeta;
    res.status(200).json(tarjetaData);

  } catch (error) {
    console.error('Error en getTarjetaByQR:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { getTarjetaByQR };
