const { poolPromise, sql } = require('../config/db');

const getTarjetaByQR = async (req, res) => {
  try {
    const { codigo } = req.params;

    const pool = await poolPromise;

    // Buscar código en CodigosQR JOIN Tarjetas (relación 1 Tarjeta -> 1 CódigoQR)
    let result;
    try {
      result = await pool.request()
        .input('codigo', sql.NVarChar, codigo)
        .query(`
          SELECT
            qr.IdQR,
            qr.CodigoUnico,
            t.IdTarjeta,
            t.NombreRemitente,
            t.NombreDestinatario,
            t.Titulo,
            t.Mensaje,
            t.UrlImagen,
            t.FechaApertura,
            t.Estado,
            t.TipoPlantilla,
            t.VariantePlantilla
          FROM CodigosQR qr
          INNER JOIN Tarjetas t ON qr.IdTarjeta = t.IdTarjeta
          WHERE qr.CodigoUnico = @codigo
          AND qr.Activo = 1
        `);
    } catch (err) {
      // Si falla por TipoPlantilla/VariantePlantilla, intentar sin esos campos
      if (err.message && (err.message.includes('TipoPlantilla') || err.message.includes('VariantePlantilla') || err.message.includes('Invalid column'))) {
        console.log('Fallback: Columnas TipoPlantilla/VariantePlantilla no existen, usando consulta sin ellas');
        try {
          result = await pool.request()
            .input('codigo', sql.NVarChar, codigo)
            .query(`
              SELECT qr.IdQR, qr.CodigoUnico, t.IdTarjeta, t.NombreRemitente, t.NombreDestinatario,
                t.Titulo, t.Mensaje, t.UrlImagen, t.FechaApertura, t.Estado
              FROM CodigosQR qr
              INNER JOIN Tarjetas t ON qr.IdTarjeta = t.IdTarjeta
              WHERE qr.CodigoUnico = @codigo AND qr.Activo = 1
            `);
          // Si las columnas no existen, establecer valores por defecto
          if (result.recordset.length > 0) {
            result.recordset[0].TipoPlantilla = null;
            result.recordset[0].VariantePlantilla = null;
          }
        } catch (fallbackErr) {
          throw err; // Lanzar el error original
        }
      } else {
        throw err;
      }
    }

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Código QR no encontrado o inactivo' });
    }

    const tarjeta = result.recordset[0];

    // Verificar Estado = 'Disponible'
    if (tarjeta.Estado !== 'Disponible') {
      return res.status(403).json({ error: 'La tarjeta no está disponible' });
    }

    const now = new Date(new Date().toISOString());
    const fechaApertura = new Date(tarjeta.FechaApertura);

    // Aún no es la fecha de apertura → 403 con FechaApertura para countdown
    if (fechaApertura > now) {
      return res.status(403).json({
        error: 'La carta aún no puede abrirse.',
        FechaApertura: tarjeta.FechaApertura,
      });
    }

    // La fecha de apertura ya pasó hace más de 24h → carta "expirada"
    const unDiaMs = 24 * 60 * 60 * 1000;
    if (now - fechaApertura > unDiaMs) {
      return res.status(410).json({
        error: 'expired',
        message: 'Esta carta ya expiró.',
      });
    }

    // Registrar escaneo en EscaneosQR (ligado al IdQR del código)
    await pool.request()
      .input('IdQR', sql.Int, tarjeta.IdQR)
      .input('FechaEscaneo', sql.DateTime, now)
      .query('INSERT INTO EscaneosQR (IdQR, FechaEscaneo) VALUES (@IdQR, @FechaEscaneo)');

    // Devolver datos de la tarjeta (excluir IdQR interno pero mantener CodigoUnico)
    const { IdQR, ...tarjetaData } = tarjeta;

    // Log para debug (puedes comentarlo después)
    console.log('Tarjeta devuelta:', {
      TipoPlantilla: tarjetaData.TipoPlantilla,
      VariantePlantilla: tarjetaData.VariantePlantilla,
      CodigoUnico: tarjetaData.CodigoUnico,
      IdTarjeta: tarjetaData.IdTarjeta,
      TodosLosCampos: Object.keys(tarjetaData)
    });

    res.status(200).json(tarjetaData);

  } catch (error) {
    console.error('Error en getTarjetaByQR:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { getTarjetaByQR };
