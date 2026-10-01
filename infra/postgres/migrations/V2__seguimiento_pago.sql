-- Datos persistidos para seguimiento y preferencias de Mercado Pago.
ALTER TABLE public.pedido ADD COLUMN IF NOT EXISTS numero_seguimiento varchar(40);

UPDATE public.pedido
SET numero_seguimiento = 'RH-' || to_char(COALESCE(fecha, now()), 'YYYYMMDD') || '-' || lpad(id_pedido::text, 4, '0')
WHERE numero_seguimiento IS NULL;

ALTER TABLE public.pedido ALTER COLUMN numero_seguimiento SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS ux_pedido_numero_seguimiento
    ON public.pedido (numero_seguimiento);

ALTER TABLE public.pago ADD COLUMN IF NOT EXISTS init_point varchar(500);
