-- Añade columnas para persistir la plantilla visual seleccionada en el frontend.
-- Ejecutar en la base de datos antes de usar el nuevo checkout.

IF NOT EXISTS (
  SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_NAME = 'Tarjetas' AND COLUMN_NAME = 'TipoPlantilla'
)
BEGIN
  ALTER TABLE Tarjetas ADD TipoPlantilla NVARCHAR(50) NULL;
END

IF NOT EXISTS (
  SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_NAME = 'Tarjetas' AND COLUMN_NAME = 'VariantePlantilla'
)
BEGIN
  ALTER TABLE Tarjetas ADD VariantePlantilla NVARCHAR(50) NULL;
END
