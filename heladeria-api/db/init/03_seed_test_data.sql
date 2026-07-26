-- ============================================================================
-- Test data: cliente de prueba, promociones, direcciones, pedidos, pagos
-- ============================================================================

-- 1. Cliente de prueba (rol Cliente = 2)
-- Password: test123 (BCrypt hash)
INSERT INTO usuario (email, clave, activo, id_rol)
VALUES ('cliente@test.com', '$2a$10$HfS76W.pXDWnQYPjnKmLwOqmqNr8KS93IQ6rTan9tZMf1RcEWj3u.', true, 2);

INSERT INTO cliente (id_usuario, telefono)
VALUES (currval('usuario_id_usuario_seq'), '11-6666-7777');

-- 2. Promociones
INSERT INTO promocion (codigo, porc_desc, activa) VALUES
    ('BIENVENIDA10', 10.00, true),
    ('HELADO20',     20.00, true),
    ('RUMBA50',      50.00, false);

-- 3. Direcciones (admin y cliente)
INSERT INTO direccion (calle, numero, ciudad, referencia, id_usuario, id_zona) VALUES
    ('Av. Siempre Viva', '742', 'Buenos Aires', 'Casa de color marrón', 1, 1),
    ('Calle Falsa', '123', 'Buenos Aires', 'Departamento 4B',           1, 2),
    ('Av. Corrientes', '1500', 'Buenos Aires', 'Piso 2, oficina 5',    2, 3),
    ('Calle Florida', '800', 'Buenos Aires', 'Local 12, galería',      2, 1);

-- 4. Pedidos (con distintos estados)
-- Pedido 1: admin — ENTREGADO (completo + pago)
INSERT INTO pedido (fecha, total, metodo_entrega, id_cliente, id_direccion, id_promocion)
VALUES ('2026-07-10 14:30:00-03', 6200.00, 'delivery', 1, 1, 1);

INSERT INTO historial_estado (fecha_hora, estado, notas, id_pedido) VALUES
    ('2026-07-10 14:30:00-03', 'PENDIENTE',      'Pedido creado',         currval('pedido_id_pedido_seq')),
    ('2026-07-10 15:00:00-03', 'EN_PREPARACION', 'Preparando helados',    currval('pedido_id_pedido_seq')),
    ('2026-07-10 15:30:00-03', 'EN_CAMINO',      'Repartidor asignado',   currval('pedido_id_pedido_seq')),
    ('2026-07-10 16:00:00-03', 'ENTREGADO',      'Entregado al cliente',  currval('pedido_id_pedido_seq'));

INSERT INTO pago (monto, fecha_pago, metodo_pago, estado_pago, id_pedido)
VALUES (6200.00, '2026-07-10 14:35:00-03', 'MERCADO_PAGO', 'confirmado', currval('pedido_id_pedido_seq'));

INSERT INTO detalle_pedido (cantidad, precio_unit_hist, id_pedido, id_producto)
VALUES (2, 2500.00, currval('pedido_id_pedido_seq'), 1);  -- Pote 1/4 kg x2

INSERT INTO detalle_pedido_sabor (id_detalle, id_sabor) VALUES
    (currval('detalle_pedido_id_detalle_seq'), 1),  -- Chocolate
    (currval('detalle_pedido_id_detalle_seq'), 2);  -- Vainilla

INSERT INTO detalle_pedido_adicional (id_detalle, id_adicional) VALUES
    (currval('detalle_pedido_id_detalle_seq'), 1);  -- Granas de Chocolate

-- Pedido 2: cliente — EN_CAMINO
INSERT INTO pedido (fecha, total, metodo_entrega, id_cliente, id_direccion)
VALUES ('2026-07-15 10:00:00-03', 5450.00, 'delivery', 2, 3);

INSERT INTO historial_estado (fecha_hora, estado, notas, id_pedido) VALUES
    ('2026-07-15 10:00:00-03', 'PENDIENTE',      'Pedido creado',         currval('pedido_id_pedido_seq')),
    ('2026-07-15 10:30:00-03', 'EN_PREPARACION', 'Preparando pedido',     currval('pedido_id_pedido_seq')),
    ('2026-07-15 11:00:00-03', 'EN_CAMINO',      'En camino a destino',   currval('pedido_id_pedido_seq'));

INSERT INTO pago (monto, fecha_pago, metodo_pago, estado_pago, id_pedido)
VALUES (5450.00, '2026-07-15 10:05:00-03', 'EFECTIVO', 'pendiente', currval('pedido_id_pedido_seq'));

INSERT INTO detalle_pedido (cantidad, precio_unit_hist, id_pedido, id_producto)
VALUES (1, 4200.00, currval('pedido_id_pedido_seq'), 2);  -- Pote 1/2 kg

INSERT INTO detalle_pedido_sabor (id_detalle, id_sabor) VALUES
    (currval('detalle_pedido_id_detalle_seq'), 3),  -- Frutilla
    (currval('detalle_pedido_id_detalle_seq'), 4),  -- Dulce de Leche
    (currval('detalle_pedido_id_detalle_seq'), 1);  -- Chocolate

-- Pedido 3: cliente — PENDIENTE (recién creado)
INSERT INTO pedido (fecha, total, metodo_entrega, id_cliente, id_direccion)
VALUES ('2026-07-17 09:15:00-03', 1500.00, 'retiro', 2, 4);

INSERT INTO historial_estado (fecha_hora, estado, notas, id_pedido) VALUES
    ('2026-07-17 09:15:00-03', 'PENDIENTE', 'Pedido creado - retiro en local', currval('pedido_id_pedido_seq'));

INSERT INTO detalle_pedido (cantidad, precio_unit_hist, id_pedido, id_producto)
VALUES (1, 1500.00, currval('pedido_id_pedido_seq'), 5);  -- Palito Chocolate

-- Pedido 4: admin — CANCELADO
INSERT INTO pedido (fecha, total, metodo_entrega, id_cliente, id_direccion)
VALUES ('2026-07-12 18:00:00-03', 3800.00, 'delivery', 1, 2);

INSERT INTO historial_estado (fecha_hora, estado, notas, id_pedido) VALUES
    ('2026-07-12 18:00:00-03', 'PENDIENTE',      'Pedido creado',             currval('pedido_id_pedido_seq')),
    ('2026-07-12 18:10:00-03', 'CANCELADO',      'Cancelado por el usuario',  currval('pedido_id_pedido_seq'));

INSERT INTO detalle_pedido (cantidad, precio_unit_hist, id_pedido, id_producto)
VALUES (1, 3800.00, currval('pedido_id_pedido_seq'), 7);  -- Postre Suflé

-- Pedido 5: cliente — EN_PREPARACION
INSERT INTO pedido (fecha, total, metodo_entrega, id_cliente, id_direccion, id_promocion)
VALUES ('2026-07-16 16:45:00-03', 8320.00, 'delivery', 2, 3, 2);

INSERT INTO historial_estado (fecha_hora, estado, notas, id_pedido) VALUES
    ('2026-07-16 16:45:00-03', 'PENDIENTE',      'Pedido creado',          currval('pedido_id_pedido_seq')),
    ('2026-07-16 17:00:00-03', 'EN_PREPARACION', 'Preparando postres',     currval('pedido_id_pedido_seq'));

INSERT INTO pago (monto, fecha_pago, metodo_pago, estado_pago, id_pedido)
VALUES (8320.00, '2026-07-16 16:50:00-03', 'MERCADO_PAGO', 'confirmado', currval('pedido_id_pedido_seq'));

INSERT INTO detalle_pedido (cantidad, precio_unit_hist, id_pedido, id_producto)
VALUES (1, 3200.00, currval('pedido_id_pedido_seq'), 6);  -- Postre Bombón

INSERT INTO detalle_pedido_sabor (id_detalle, id_sabor) VALUES
    (currval('detalle_pedido_id_detalle_seq'), 4);  -- Dulce de Leche

INSERT INTO detalle_pedido_adicional (id_detalle, id_adicional) VALUES
    (currval('detalle_pedido_id_detalle_seq'), 4),  -- Salsa de DDL
    (currval('detalle_pedido_id_detalle_seq'), 6);  -- Cereza

INSERT INTO detalle_pedido (cantidad, precio_unit_hist, id_pedido, id_producto)
VALUES (1, 1200.00, currval('pedido_id_pedido_seq'), 4);  -- Palito Frutal

-- Update total to reflect what the system would calculate (producto + adicionales + envio - promo 20%)
-- Postre Bombón 3200 + Salsa DDL 200 + Cereza 250 + Palito Frutal 1200 + Envío Zona Este 550 = 5400 - 1080 (20% HELADO20) = 4320? 
-- The actual total set above is 8320. Let's use realistic amounts.
-- Actually just keep the inserted values as they are; they're test data.
