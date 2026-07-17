-- ============================================================================
-- DROP existente (para idempotencia)
-- ============================================================================

DROP TABLE IF EXISTS carrito_item_adicional CASCADE;
DROP TABLE IF EXISTS carrito_item_sabor CASCADE;
DROP TABLE IF EXISTS carrito_item CASCADE;
DROP TABLE IF EXISTS carrito CASCADE;
DROP TABLE IF EXISTS detalle_pedido_adicional CASCADE;
DROP TABLE IF EXISTS detalle_pedido_sabor CASCADE;
DROP TABLE IF EXISTS detalle_pedido CASCADE;
DROP TABLE IF EXISTS pago CASCADE;
DROP TABLE IF EXISTS historial_estado CASCADE;
DROP TABLE IF EXISTS pedido CASCADE;
DROP TABLE IF EXISTS direccion CASCADE;
DROP TABLE IF EXISTS producto CASCADE;
DROP TABLE IF EXISTS adicional CASCADE;
DROP TABLE IF EXISTS sabor CASCADE;
DROP TABLE IF EXISTS promocion CASCADE;
DROP TABLE IF EXISTS categoria CASCADE;
DROP TABLE IF EXISTS zona_envio CASCADE;
DROP TABLE IF EXISTS cliente CASCADE;
DROP TABLE IF EXISTS usuario CASCADE;
DROP TABLE IF EXISTS rol CASCADE;

-- ============================================================================
-- CREACIÓN DE TABLAS
-- ============================================================================

-- 1. ROL
CREATE TABLE rol (
    id_rol     BIGSERIAL PRIMARY KEY,
    nombre_rol VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- 2. USUARIO
CREATE TABLE usuario (
    id_usuario BIGSERIAL PRIMARY KEY,
    email      VARCHAR(255) NOT NULL UNIQUE,
    clave      VARCHAR(255) NOT NULL,
    activo     BOOLEAN      NOT NULL DEFAULT true,
    id_rol     BIGINT       NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT fk_usuario_rol FOREIGN KEY (id_rol) REFERENCES rol (id_rol)
);

-- 3. CLIENTE
CREATE TABLE cliente (
    id_usuario BIGINT      PRIMARY KEY,
    telefono   VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_cliente_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
);

-- 4. ZONA_ENVIO
CREATE TABLE zona_envio (
    id_zona     BIGSERIAL    PRIMARY KEY,
    nombre_zona VARCHAR(100) NOT NULL,
    costo_envio NUMERIC(10,2) NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- 5. CATEGORIA
CREATE TABLE categoria (
    id_categoria    BIGSERIAL   PRIMARY KEY,
    nombre          VARCHAR(100) NOT NULL,
    requiere_sabores BOOLEAN    NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. PROMOCION
CREATE TABLE promocion (
    id_promocion BIGSERIAL    PRIMARY KEY,
    codigo       VARCHAR(50)  NOT NULL UNIQUE,
    descripcion  TEXT,
    porc_desc    NUMERIC(5,2) NOT NULL,
    fecha_inicio TIMESTAMPTZ,
    fecha_fin    TIMESTAMPTZ,
    activa       BOOLEAN      NOT NULL DEFAULT true,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- 7. DIRECCION
CREATE TABLE direccion (
    id_direccion BIGSERIAL   PRIMARY KEY,
    calle        VARCHAR(200) NOT NULL,
    numero       VARCHAR(20)  NOT NULL,
    ciudad       VARCHAR(100) NOT NULL,
    referencia   TEXT,
    id_usuario   BIGINT       NOT NULL,
    id_zona      BIGINT       NOT NULL,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT fk_direccion_cliente  FOREIGN KEY (id_usuario) REFERENCES cliente (id_usuario),
    CONSTRAINT fk_direccion_zona     FOREIGN KEY (id_zona)    REFERENCES zona_envio (id_zona)
);

-- 8. PRODUCTO
CREATE TABLE producto (
    id_producto  BIGSERIAL    PRIMARY KEY,
    nombre       VARCHAR(150) NOT NULL,
    stock_envases INTEGER     NOT NULL DEFAULT 0,
    precio_base  NUMERIC(10,2) NOT NULL,
    max_sabores  INTEGER      NOT NULL DEFAULT 0,
    id_categoria BIGINT       NOT NULL,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT fk_producto_categoria FOREIGN KEY (id_categoria) REFERENCES categoria (id_categoria)
);

-- 9. SABOR
CREATE TABLE sabor (
    id_sabor     BIGSERIAL   PRIMARY KEY,
    nombre       VARCHAR(150) NOT NULL,
    stock_baldes INTEGER     NOT NULL DEFAULT 0,
    disponible   BOOLEAN      NOT NULL DEFAULT true,
    cap_balde    VARCHAR(50),
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- 10. ADICIONAL
CREATE TABLE adicional (
    id_adicional BIGSERIAL    PRIMARY KEY,
    nombre       VARCHAR(150) NOT NULL,
    precio_extra NUMERIC(10,2) NOT NULL DEFAULT 0,
    disponible   BOOLEAN      NOT NULL DEFAULT true,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- 11. PEDIDO
CREATE TABLE pedido (
    id_pedido      BIGSERIAL    PRIMARY KEY,
    fecha          TIMESTAMPTZ  NOT NULL DEFAULT now(),
    total          NUMERIC(10,2) NOT NULL,
    metodo_entrega VARCHAR(50)  NOT NULL,
    id_cliente     BIGINT       NOT NULL,
    id_direccion   BIGINT       NOT NULL,
    id_promocion   BIGINT,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT fk_pedido_cliente   FOREIGN KEY (id_cliente)   REFERENCES cliente (id_usuario),
    CONSTRAINT fk_pedido_direccion FOREIGN KEY (id_direccion) REFERENCES direccion (id_direccion),
    CONSTRAINT fk_pedido_promocion FOREIGN KEY (id_promocion) REFERENCES promocion (id_promocion)
);

-- 12. PAGO
CREATE TABLE pago (
    id_pago     BIGSERIAL    PRIMARY KEY,
    monto       NUMERIC(10,2) NOT NULL,
    fecha_pago  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    metodo_pago VARCHAR(50)  NOT NULL,
    estado_pago VARCHAR(50)  NOT NULL DEFAULT 'pendiente',
    id_pedido   BIGINT       NOT NULL UNIQUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT fk_pago_pedido FOREIGN KEY (id_pedido) REFERENCES pedido (id_pedido)
);

-- 13. HISTORIAL_ESTADO
CREATE TABLE historial_estado (
    id_hist    BIGSERIAL   PRIMARY KEY,
    fecha_hora TIMESTAMPTZ NOT NULL DEFAULT now(),
    estado     VARCHAR(50) NOT NULL,
    notas      TEXT,
    id_pedido  BIGINT      NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_historial_pedido FOREIGN KEY (id_pedido) REFERENCES pedido (id_pedido)
);

-- 14. DETALLE_PEDIDO
CREATE TABLE detalle_pedido (
    id_detalle       BIGSERIAL    PRIMARY KEY,
    cantidad         INTEGER      NOT NULL CHECK (cantidad > 0),
    precio_unit_hist NUMERIC(10,2) NOT NULL,
    id_pedido        BIGINT       NOT NULL,
    id_producto      BIGINT       NOT NULL,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT fk_detalle_pedido   FOREIGN KEY (id_pedido)   REFERENCES pedido (id_pedido),
    CONSTRAINT fk_detalle_producto FOREIGN KEY (id_producto) REFERENCES producto (id_producto)
);

-- 15. DETALLE_PEDIDO_SABOR
CREATE TABLE detalle_pedido_sabor (
    id_detalle BIGINT NOT NULL,
    id_sabor   BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT pk_detalle_pedido_sabor PRIMARY KEY (id_detalle, id_sabor),
    CONSTRAINT fk_dps_detalle FOREIGN KEY (id_detalle) REFERENCES detalle_pedido (id_detalle) ON DELETE CASCADE,
    CONSTRAINT fk_dps_sabor   FOREIGN KEY (id_sabor)   REFERENCES sabor (id_sabor)
);

-- 16. DETALLE_PEDIDO_ADICIONAL
CREATE TABLE detalle_pedido_adicional (
    id_detalle   BIGINT NOT NULL,
    id_adicional BIGINT NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT pk_detalle_pedido_adicional PRIMARY KEY (id_detalle, id_adicional),
    CONSTRAINT fk_dpa_detalle   FOREIGN KEY (id_detalle)   REFERENCES detalle_pedido (id_detalle) ON DELETE CASCADE,
    CONSTRAINT fk_dpa_adicional FOREIGN KEY (id_adicional) REFERENCES adicional (id_adicional)
);

-- 17. CARRITO
CREATE TABLE carrito (
    id_carrito BIGSERIAL PRIMARY KEY,
    id_cliente BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_carrito_cliente FOREIGN KEY (id_cliente) REFERENCES cliente (id_usuario)
);

-- 18. CARRITO_ITEM
CREATE TABLE carrito_item (
    id_item     BIGSERIAL PRIMARY KEY,
    id_carrito  BIGINT  NOT NULL,
    id_producto BIGINT  NOT NULL,
    cantidad    INTEGER NOT NULL DEFAULT 1 CHECK (cantidad > 0),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_ci_carrito  FOREIGN KEY (id_carrito)  REFERENCES carrito (id_carrito) ON DELETE CASCADE,
    CONSTRAINT fk_ci_producto FOREIGN KEY (id_producto) REFERENCES producto (id_producto)
);

-- 19. CARRITO_ITEM_SABOR (M:N)
CREATE TABLE carrito_item_sabor (
    id_item  BIGINT NOT NULL,
    id_sabor BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT pk_carrito_item_sabor PRIMARY KEY (id_item, id_sabor),
    CONSTRAINT fk_cis_item  FOREIGN KEY (id_item)  REFERENCES carrito_item (id_item) ON DELETE CASCADE,
    CONSTRAINT fk_cis_sabor FOREIGN KEY (id_sabor) REFERENCES sabor (id_sabor)
);

-- 20. CARRITO_ITEM_ADICIONAL (M:N)
CREATE TABLE carrito_item_adicional (
    id_item     BIGINT NOT NULL,
    id_adicional BIGINT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT pk_carrito_item_adicional PRIMARY KEY (id_item, id_adicional),
    CONSTRAINT fk_cia_item      FOREIGN KEY (id_item)      REFERENCES carrito_item (id_item) ON DELETE CASCADE,
    CONSTRAINT fk_cia_adicional FOREIGN KEY (id_adicional) REFERENCES adicional (id_adicional)
);

-- ÍNDICES
CREATE INDEX idx_usuario_email      ON usuario (email);
CREATE INDEX idx_pedido_cliente     ON pedido (id_cliente);
CREATE INDEX idx_pedido_fecha       ON pedido (fecha);
CREATE INDEX idx_detalle_pedido     ON detalle_pedido (id_pedido);
CREATE INDEX idx_historial_pedido   ON historial_estado (id_pedido);
CREATE INDEX idx_direccion_usuario  ON direccion (id_usuario);
CREATE INDEX idx_direccion_zona     ON direccion (id_zona);
CREATE INDEX idx_producto_categoria ON producto (id_categoria);

-- TRIGGER: actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOR tbl IN
        SELECT unnest(ARRAY[
            'rol', 'usuario', 'cliente', 'zona_envio', 'categoria',
            'promocion', 'direccion', 'producto', 'sabor', 'adicional',
            'pedido', 'pago', 'historial_estado', 'detalle_pedido',
            'carrito', 'carrito_item'
        ])
    LOOP
        EXECUTE format(
            'CREATE TRIGGER trg_%s_updated_at
             BEFORE UPDATE ON %I
             FOR EACH ROW
             WHEN (OLD.* IS DISTINCT FROM NEW.*)
             EXECUTE FUNCTION trigger_set_updated_at()',
            tbl, tbl
        );
    END LOOP;
END;
$$;
