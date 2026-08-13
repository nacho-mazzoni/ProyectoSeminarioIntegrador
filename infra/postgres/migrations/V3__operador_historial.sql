ALTER TABLE public.historial_estado
    ADD COLUMN IF NOT EXISTS id_usuario bigint;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_historial_estado_usuario'
    ) THEN
        ALTER TABLE public.historial_estado
            ADD CONSTRAINT fk_historial_estado_usuario
            FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario);
    END IF;
END $$;
