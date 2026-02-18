const { poolPromise, sql } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const checkout = async (req, res) => {
    try {
        const { NombreRemitente, NombreDestinatario, Titulo, Mensaje, FechaApertura, IdPlantilla } = req.body;

        // Validar campos requeridos
        if (!NombreRemitente || !NombreDestinatario || !Titulo || !Mensaje || !FechaApertura || !IdPlantilla) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        const pool = await poolPromise;
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // Verificar que IdPlantilla existe y obtener Precio
            const plantillaResult = await transaction.request()
                .input('IdPlantilla', sql.Int, IdPlantilla)
                .query('SELECT Precio FROM Plantillas WHERE IdPlantilla = @IdPlantilla');

            if (plantillaResult.recordset.length === 0) {
                await transaction.rollback();
                return res.status(404).json({ error: 'Plantilla no encontrada' });
            }

            const precio = plantillaResult.recordset[0].Precio;

            // Crear Tarjeta con Estado = 'Pendiente'
            const tarjetaResult = await transaction.request()
                .input('NombreRemitente', sql.NVarChar, NombreRemitente)
                .input('NombreDestinatario', sql.NVarChar, NombreDestinatario)
                .input('Titulo', sql.NVarChar, Titulo)
                .input('Mensaje', sql.NVarChar, Mensaje)
                .input('FechaApertura', sql.DateTime, new Date(FechaApertura))
                .input('IdPlantilla', sql.Int, IdPlantilla)
                .input('Estado', sql.NVarChar, 'Pendiente')
                .query(`
          INSERT INTO Tarjetas (NombreRemitente, NombreDestinatario, Titulo, Mensaje, FechaApertura, IdPlantilla, Estado)
          OUTPUT INSERTED.IdTarjeta
          VALUES (@NombreRemitente, @NombreDestinatario, @Titulo, @Mensaje, @FechaApertura, @IdPlantilla, @Estado)
        `);

            const tarjetaId = tarjetaResult.recordset[0].IdTarjeta;

            // Crear Pago con Confirmado = 1
            await transaction.request()
                .input('IdTarjeta', sql.Int, tarjetaId)
                .input('Monto', sql.Decimal(10, 2), precio)
                .input('Confirmado', sql.Bit, 1)
                .input('FechaPago', sql.DateTime, new Date())
                .query('INSERT INTO Pagos (IdTarjeta, Monto, Confirmado, FechaPago) VALUES (@IdTarjeta, @Monto, @Confirmado, @FechaPago)');

            // Cambiar Estado de Tarjeta a 'Disponible'
            await transaction.request()
                .input('IdTarjeta', sql.Int, tarjetaId)
                .input('Estado', sql.NVarChar, 'Disponible')
                .query('UPDATE Tarjetas SET Estado = @Estado WHERE IdTarjeta = @IdTarjeta');

            // Generar UUID y insertar en CodigosQR
            const codigoQR = uuidv4();
            await transaction.request()
                .input('CodigoQR', sql.NVarChar, codigoQR)
                .input('IdTarjeta', sql.Int, tarjetaId)
                .input('Activo', sql.Bit, 1)
                .query('INSERT INTO CodigosQR (CodigoQR, IdTarjeta, Activo) VALUES (@CodigoQR, @IdTarjeta, @Activo)');

            await transaction.commit();

            res.status(201).json({ tarjetaId, codigoQR, precio });
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        console.error('Error en checkout:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = { checkout };