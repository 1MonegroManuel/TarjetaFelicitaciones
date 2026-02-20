const sql = require('mssql');
const { poolPromise } = require('../config/db');

const getResumen = async (req, res) => {
  try {
    const pool = await poolPromise;

    // Total de cartas creadas
    const totalCartasResult = await pool.request()
      .query('SELECT COUNT(*) AS total FROM Tarjetas');

    // Total de cartas abiertas (Estado = 'Disponible' y FechaApertura <= fecha actual)
    const abiertasResult = await pool.request()
      .query(`
        SELECT COUNT(*) AS total 
        FROM Tarjetas 
        WHERE Estado = 'Disponible' 
        AND FechaApertura <= GETDATE()
      `);

    // Total de cartas pendientes (Estado = 'Disponible' y FechaApertura > fecha actual)
    const pendientesResult = await pool.request()
      .query(`
        SELECT COUNT(*) AS total 
        FROM Tarjetas 
        WHERE Estado = 'Disponible' 
        AND FechaApertura > GETDATE()
      `);

    // Total de ingresos generados (suma de todos los pagos)
    const ingresosResult = await pool.request()
      .query(`
        SELECT ISNULL(SUM(Monto), 0) AS total 
        FROM Pagos
      `);

    // Total de escaneos (registros en EscaneosQR)
    const escaneosResult = await pool.request()
      .query('SELECT COUNT(*) AS total FROM EscaneosQR');

    const resumen = {
      totalCartas: totalCartasResult.recordset[0].total || 0,
      abiertas: abiertasResult.recordset[0].total || 0,
      pendientes: pendientesResult.recordset[0].total || 0,
      ingresos: parseFloat(ingresosResult.recordset[0].total || 0),
      totalEscaneos: escaneosResult.recordset[0].total || 0
    };

    res.status(200).json(resumen);

  } catch (error) {
    console.error('Error obteniendo resumen:', error);
    res.status(500).json({
      message: 'Error obteniendo resumen de reportes',
      error: error.message
    });
  }
};

module.exports = {
  getResumen
};
