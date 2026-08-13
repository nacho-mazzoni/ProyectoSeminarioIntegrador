-- Aplicar sobre instalaciones existentes una sola vez.
-- Es idempotente para poder ejecutarlo de forma segura durante una actualización.
ALTER TABLE public.producto
    ADD COLUMN IF NOT EXISTS activo boolean DEFAULT true NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'historial_estado_estado_check'
          AND conrelid = 'public.historial_estado'::regclass
    ) THEN
        ALTER TABLE public.historial_estado
            ADD CONSTRAINT historial_estado_estado_check
            CHECK (estado IN ('PENDIENTE', 'PAGADO', 'RECHAZADO', 'EN_PREPARACION',
                              'LISTO_PARA_RETIRO', 'EN_CAMINO', 'ENTREGADO', 'CANCELADO'));
    END IF;
END $$;
