const { poolPromise, sql } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const checkout = async (req, res) => {
    try {
        const {
            NombreRemitente,
            NombreDestinatario,
            Titulo,
            Mensaje,
            Contenido,
            FechaApertura,
            IdPlantilla,
            TipoPlantilla,
            VariantePlantilla
        } = req.body;

        const contenidoCarta = Mensaje || Contenido || '';

        // Validar campos requeridos (Titulo, Contenido/Mensaje, IdPlantilla, FechaApertura)
        if (!Titulo || !contenidoCarta || !IdPlantilla || !FechaApertura) {
            return res.status(400).json({ error: 'Título, contenido, fecha de apertura e IdPlantilla son requeridos' });
        }

        const remitente = NombreRemitente || 'Anónimo';
        const destinatario = NombreDestinatario || 'Destinatario';
        const ahora = new Date();
        const fechaApertura = new Date(FechaApertura);

        // Validación: FechaApertura debe ser hoy o futura
        if (fechaApertura < new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate())) {
            return res.status(400).json({ error: 'La fecha de apertura no puede ser anterior a hoy' });
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

            const tipoPlantillaVal = TipoPlantilla != null ? String(TipoPlantilla).substring(0, 50) : null;
            const variantePlantillaVal = VariantePlantilla != null ? String(VariantePlantilla).substring(0, 50) : null;
            
            // Log para debug
            console.log('Checkout - Guardando plantilla:', {
                TipoPlantilla: tipoPlantillaVal,
                VariantePlantilla: variantePlantillaVal,
                IdPlantilla
            });

            let tarjetaResult;
            try {
                tarjetaResult = await transaction.request()
                    .input('NombreRemitente', sql.NVarChar, remitente)
                    .input('NombreDestinatario', sql.NVarChar, destinatario)
                    .input('Titulo', sql.NVarChar, Titulo)
                    .input('Mensaje', sql.NVarChar, contenidoCarta)
                    .input('FechaApertura', sql.DateTime, fechaApertura)
                    .input('IdPlantilla', sql.Int, IdPlantilla)
                    .input('Estado', sql.NVarChar, 'Pendiente')
                    .input('TipoPlantilla', sql.NVarChar, tipoPlantillaVal)
                    .input('VariantePlantilla', sql.NVarChar, variantePlantillaVal)
                    .query(`
          INSERT INTO Tarjetas (NombreRemitente, NombreDestinatario, Titulo, Mensaje, FechaApertura, IdPlantilla, Estado, TipoPlantilla, VariantePlantilla)
          OUTPUT INSERTED.IdTarjeta
          VALUES (@NombreRemitente, @NombreDestinatario, @Titulo, @Mensaje, @FechaApertura, @IdPlantilla, @Estado, @TipoPlantilla, @VariantePlantilla)
        `);
            } catch (insertErr) {
                const msg = insertErr.message || '';
                if (msg.includes('TipoPlantilla') || msg.includes('VariantePlantilla') || msg.includes('Invalid column')) {
                    tarjetaResult = await transaction.request()
                        .input('NombreRemitente', sql.NVarChar, remitente)
                        .input('NombreDestinatario', sql.NVarChar, destinatario)
                        .input('Titulo', sql.NVarChar, Titulo)
                        .input('Mensaje', sql.NVarChar, contenidoCarta)
                        .input('FechaApertura', sql.DateTime, fechaApertura)
                        .input('IdPlantilla', sql.Int, IdPlantilla)
                        .input('Estado', sql.NVarChar, 'Pendiente')
                        .query(`
          INSERT INTO Tarjetas (NombreRemitente, NombreDestinatario, Titulo, Mensaje, FechaApertura, IdPlantilla, Estado)
          OUTPUT INSERTED.IdTarjeta
          VALUES (@NombreRemitente, @NombreDestinatario, @Titulo, @Mensaje, @FechaApertura, @IdPlantilla, @Estado)
        `);
                } else {
                    throw insertErr;
                }
            }

            const tarjetaId = tarjetaResult.recordset[0].IdTarjeta;

            // Generar código único para QR e insertar en CodigosQR
            const codigoUnico = uuidv4();
            await transaction.request()
                .input('IdTarjeta', sql.Int, tarjetaId)
                .input('CodigoUnico', sql.NVarChar, codigoUnico)
                .input('Activo', sql.Bit, 1)
                .input('FechaGeneracion', sql.DateTime, new Date())
                .query('INSERT INTO CodigosQR (IdTarjeta, CodigoUnico, Activo, FechaGeneracion) VALUES (@IdTarjeta, @CodigoUnico, @Activo, @FechaGeneracion)');

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

            await transaction.commit();

            // Devolver el código único generado para que el frontend lo use en el QR
            res.status(201).json({ tarjetaId, codigoUnico, codigoQR: codigoUnico, precio });
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