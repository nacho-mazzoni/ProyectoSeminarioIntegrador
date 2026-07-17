-- ============================================================================
-- Migración: Agrega campos faltantes a la tabla promocion
-- - descripcion: texto libre para describir la promoción
-- - fecha_inicio / fecha_fin: periodo de vigencia (opcional, null = sin límite)
-- ============================================================================

ALTER TABLE promocion
  ADD COLUMN IF NOT EXISTS descripcion  TEXT,
  ADD COLUMN IF NOT EXISTS fecha_inicio TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS fecha_fin    TIMESTAMPTZ;