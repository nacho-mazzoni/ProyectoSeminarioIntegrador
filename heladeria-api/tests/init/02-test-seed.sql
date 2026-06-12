-- ============================================================================
-- TEST SEED — Datos controlados para tests de integración
-- ============================================================================

-- Limpiar datos previos
TRUNCATE TABLE detalle_pedido_adicional CASCADE;
TRUNCATE TABLE detalle_pedido_sabor CASCADE;
TRUNCATE TABLE detalle_pedido CASCADE;
TRUNCATE TABLE pago CASCADE;
TRUNCATE TABLE historial_estado CASCADE;
TRUNCATE TABLE pedido CASCADE;
TRUNCATE TABLE direccion CASCADE;
TRUNCATE TABLE producto CASCADE;
TRUNCATE TABLE adicional CASCADE;
TRUNCATE TABLE sabor CASCADE;
TRUNCATE TABLE promocion CASCADE;
TRUNCATE TABLE categoria CASCADE;
TRUNCATE TABLE zona_envio CASCADE;
TRUNCATE TABLE cliente CASCADE;
TRUNCATE TABLE usuario CASCADE;
TRUNCATE TABLE rol CASCADE;

-- Roles
INSERT INTO rol (nombre_rol) VALUES ('Administrador'), ('Cliente');

-- Zonas de envío
INSERT INTO zona_envio (nombre_zona, costo_envio) VALUES
    ('Zona Norte', 500.00),
    ('Zona Sur',   600.00);

-- Categorías
INSERT INTO categoria (nombre, requiere_sabores) VALUES
    ('Helado Pote',   true),
    ('Helado Palito', false),
    ('Postre',        true);

-- Sabores
INSERT INTO sabor (nombre, stock_baldes, disponible, cap_balde) VALUES
    ('Chocolate',       10, true,  '5L'),
    ('Vainilla',         8, true,  '5L'),
    ('Frutilla',         5, true,  '5L'),
    ('Dulce de Leche',   0, true,  '5L'),
    ('No Disponible',   10, false, '5L');

-- Productos
INSERT INTO producto (nombre, stock_envases, precio_base, max_sabores, id_categoria) VALUES
    ('Pote 1/2 Kg',    10,  2500.00, 2, 1),
    ('Pote 1 Kg',       5,  4500.00, 3, 1),
    ('Palito de Crema', 20,  800.00,  0, 2),
    ('Palito de Agua',  15,  600.00,  0, 2),
    ('Postre Especial',  8, 3200.00, 2, 3);

-- Adicionales
INSERT INTO adicional (nombre, precio_extra, disponible) VALUES
    ('Cremora',             200.00, true),
    ('Salsa de Chocolate',  250.00, true),
    ('Granola',             150.00, true),
    ('No Disponible',         0.00, false);

-- Promociones
INSERT INTO promocion (codigo, porc_desc, activa) VALUES
    ('PROMO10',  10.00, true),
    ('PROMO20',  20.00, true),
    ('EXPIRADA', 15.00, false);

-- Usuarios (sin trigger de auth.users — insertamos directo)
INSERT INTO usuario (email, clave, activo, id_rol) VALUES
    ('admin@heladeria.com', 'admin123',    true, 1),
    ('cliente@test.com',    'password123', true, 2);

-- Cliente
INSERT INTO cliente (id_usuario, telefono) VALUES (2, '123456789');

-- Direcciones
INSERT INTO direccion (calle, numero, ciudad, referencia, id_usuario, id_zona) VALUES
    ('Av. Siempre Viva',  '123', 'Springfield', 'Cerca de la plaza',   2, 1),
    ('Calle Falsa',       '456', 'Springfield', NULL,                  2, 2);

-- Pedido 1: delivery + promoción → estado PENDIENTE
INSERT INTO pedido (fecha, total, metodo_entrega, id_cliente, id_direccion, id_promocion)
VALUES (now() - interval '2 days', 0, 'delivery', 2, 1, 1);

-- Pedido 2: retiro, sin promoción → estado ENTREGADO
INSERT INTO pedido (fecha, total, metodo_entrega, id_cliente, id_direccion, id_promocion)
VALUES (now() - interval '5 days', 0, 'retiro', 2, 1, NULL);

-- Detalle Pedido 1: 2 × Pote 1/2 Kg
INSERT INTO detalle_pedido (cantidad, precio_unit_hist, id_pedido, id_producto)
VALUES (2, 2500.00, 1, 1);

INSERT INTO detalle_pedido_sabor (id_detalle, id_sabor) VALUES (1, 1), (1, 2);

-- Detalle Pedido 2: 3 × Palito de Crema
INSERT INTO detalle_pedido (cantidad, precio_unit_hist, id_pedido, id_producto)
VALUES (3, 800.00, 2, 3);

-- Actualizar totales
-- Pedido 1: (2 × 2500) = 5000, desc 10 % = 500, subtotal = 4500, delivery Zona Norte = 500 → total = 5000
UPDATE pedido SET total = 5000.00 WHERE id_pedido = 1;
-- Pedido 2: 3 × 800 = 2400, retiro, sin promo → total = 2400
UPDATE pedido SET total = 2400.00 WHERE id_pedido = 2;

-- Historial estados — Pedido 1
INSERT INTO historial_estado (fecha_hora, estado, notas, id_pedido)
VALUES (now() - interval '2 days', 'PENDIENTE', 'Pedido creado', 1);

-- Historial estados — Pedido 2 (flujo completo)
INSERT INTO historial_estado (fecha_hora, estado, notas, id_pedido) VALUES
    (now() - interval '5 days', 'PENDIENTE',  'Pedido creado',          2),
    (now() - interval '4 days', 'CONFIRMADO', 'Pago confirmado',        2),
    (now() - interval '3 days', 'ENTREGADO',  'Entregado al cliente',   2);
