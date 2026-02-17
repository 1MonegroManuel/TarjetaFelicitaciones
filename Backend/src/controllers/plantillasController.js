const sql = require('mssql');
const { poolPromise } = require("../config/db");

const getPlantillas = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT IdPlantilla, Nombre, Descripcion, Precio, UrlVistaPrevia
      FROM Plantillas
      WHERE Activa = 1
      ORDER BY FechaCreacion DESC
    `);

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo plantillas" });
  }
};

const createPlantilla = async (req, res) => {
  try {
    const { Nombre, Descripcion, Precio, UrlVistaPrevia } = req.body;
    if (!Nombre || Precio === undefined) {
      return res.status(400).json({
        message: "Nombre y Precio son obligatorios"
      });
    }

    if (Precio < 0) {
      return res.status(400).json({
        message: "El precio no puede ser negativo"
      });
    }

    const pool = await poolPromise;

    await pool.request()
      .input("Nombre", sql.NVarChar, Nombre)
      .input("Descripcion", sql.NVarChar, Descripcion)
      .input("Precio", sql.Decimal(10,2), Precio)
      .input("UrlVistaPrevia", sql.NVarChar, UrlVistaPrevia)
      .query(`
        INSERT INTO Plantillas (Nombre, Descripcion, Precio, UrlVistaPrevia)
        VALUES (@Nombre, @Descripcion, @Precio, @UrlVistaPrevia)
      `);

    res.status(201).json({
      message: "Plantilla creada correctamente"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error creando plantilla"
    });
  }
};

module.exports = {
  getPlantillas,
  createPlantilla
};
