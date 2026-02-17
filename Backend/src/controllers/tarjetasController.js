const sql = require('mssql');
const { poolPromise } = require('../config/db');

const createTarjeta = async (req, res) => {
  try {
    const {
      NombreRemitente,
      NombreDestinatario,
      Titulo,
      Mensaje,
      UrlImagen,
      FechaApertura,
      IdPlantilla
    } = req.body;

    if (!NombreRemitente || !NombreDestinatario || !Mensaje || !FechaApertura || !IdPlantilla) {
      return res.status(400).json({
        message: "Faltan campos obligatorios"
      });
    }

    const pool = await poolPromise;

    const result = await pool.request()
      .input("NombreRemitente", sql.NVarChar, NombreRemitente)
      .input("NombreDestinatario", sql.NVarChar, NombreDestinatario)
      .input("Titulo", sql.NVarChar, Titulo)
      .input("Mensaje", sql.NVarChar, Mensaje)
      .input("UrlImagen", sql.NVarChar, UrlImagen)
      .input("FechaApertura", sql.DateTime, FechaApertura)
      .input("IdPlantilla", sql.Int, IdPlantilla)
      .query(`
        INSERT INTO Tarjetas 
        (NombreRemitente, NombreDestinatario, Titulo, Mensaje, UrlImagen, FechaApertura, IdPlantilla)
        OUTPUT INSERTED.IdTarjeta
        VALUES 
        (@NombreRemitente, @NombreDestinatario, @Titulo, @Mensaje, @UrlImagen, @FechaApertura, @IdPlantilla)
      `);

    res.status(201).json({
      message: "Tarjeta creada correctamente",
      IdTarjeta: result.recordset[0].IdTarjeta
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error creando tarjeta"
    });
  }
};

const getTarjetaById = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await poolPromise;

    const result = await pool.request()
      .input("IdTarjeta", sql.Int, id)
      .query(`
        SELECT 
          t.IdTarjeta,
          t.NombreRemitente,
          t.NombreDestinatario,
          t.Titulo,
          t.Mensaje,
          t.UrlImagen,
          t.FechaApertura,
          t.Estado,
          t.FechaCreacion,
          p.Nombre AS NombrePlantilla,
          p.Precio
        FROM Tarjetas t
        INNER JOIN Plantillas p 
          ON t.IdPlantilla = p.IdPlantilla
        WHERE t.IdTarjeta = @IdTarjeta
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: "Tarjeta no encontrada"
      });
    }

    res.status(200).json(result.recordset[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error obteniendo tarjeta"
    });
  }
};

//posible añadido No permitir edición si Estado = 'Pagado' Hacer actualización parcial (PATCH) Validar formato de fecha
const updateTarjeta = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      NombreRemitente,
      NombreDestinatario,
      Titulo,
      Mensaje,
      UrlImagen,
      FechaApertura
    } = req.body;

    const pool = await poolPromise;

    //Verificar que exista
    const tarjetaExiste = await pool.request()
      .input("IdTarjeta", sql.Int, id)
      .query("SELECT IdTarjeta FROM Tarjetas WHERE IdTarjeta = @IdTarjeta");

    if (tarjetaExiste.recordset.length === 0) {
      return res.status(404).json({
        message: "Tarjeta no encontrada"
      });
    }

    // Actualizar solo campos permitidos
    await pool.request()
      .input("IdTarjeta", sql.Int, id)
      .input("NombreRemitente", sql.NVarChar, NombreRemitente)
      .input("NombreDestinatario", sql.NVarChar, NombreDestinatario)
      .input("Titulo", sql.NVarChar, Titulo)
      .input("Mensaje", sql.NVarChar, Mensaje)
      .input("UrlImagen", sql.NVarChar, UrlImagen)
      .input("FechaApertura", sql.DateTime, FechaApertura)
      .query(`
        UPDATE Tarjetas
        SET 
          NombreRemitente = @NombreRemitente,
          NombreDestinatario = @NombreDestinatario,
          Titulo = @Titulo,
          Mensaje = @Mensaje,
          UrlImagen = @UrlImagen,
          FechaApertura = @FechaApertura
        WHERE IdTarjeta = @IdTarjeta
      `);

    res.status(200).json({
      message: "Tarjeta actualizada correctamente"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error actualizando tarjeta"
    });
  }
};

/* No borrar físicamente (soft delete)

Cambiar Estado = 'Cancelada'

Mantener historial de pagos */

const deleteTarjeta = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await poolPromise;

    // Verificar que exista y obtener estado
    const result = await pool.request()
      .input("IdTarjeta", sql.Int, id)
      .query(`
        SELECT Estado 
        FROM Tarjetas 
        WHERE IdTarjeta = @IdTarjeta
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: "Tarjeta no encontrada"
      });
    }

    const estado = result.recordset[0].Estado;

    // No permitir borrar si está pagada o entregada
    if (estado === 'Pagado' || estado === 'Entregado') {
      return res.status(400).json({
        message: `No se puede eliminar una tarjeta en estado ${estado}`
      });
    }

    // Eliminar
    await pool.request()
      .input("IdTarjeta", sql.Int, id)
      .query(`
        DELETE FROM Tarjetas 
        WHERE IdTarjeta = @IdTarjeta
      `);

    res.status(200).json({
      message: "Tarjeta eliminada correctamente"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error eliminando tarjeta"
    });
  }
};




module.exports = {
  createTarjeta,
  getTarjetaById,
  updateTarjeta,
  deleteTarjeta
};