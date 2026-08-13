TRUNCATE TABLE carrito_item_adicional CASCADE;
TRUNCATE TABLE carrito_item_sabor CASCADE;
TRUNCATE TABLE carrito_item CASCADE;
TRUNCATE TABLE carrito CASCADE;
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
TRUNCATE TABLE carrito_item_adicional CASCADE;
TRUNCATE TABLE cliente CASCADE;
TRUNCATE TABLE usuario CASCADE;
TRUNCATE TABLE rol CASCADE;

INSERT INTO rol (id_rol, nombre_rol) VALUES (1, 'Administrador'), (2, 'Cliente'), (3, 'Cajero');

INSERT INTO usuario (id_usuario, email, clave, activo, id_rol) VALUES
    (1, 'admin@heladeria.com', '$2a$10$N9mGcVJ5eX1Y1Y1Y1Y1Y1u1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1e', true, 1),
    (2, 'cliente@test.com', '$2a$10$N9mGcVJ5eX1Y1Y1Y1Y1Y1u1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1Y1e', true, 2);

INSERT INTO cliente (id_usuario, telefono) VALUES (2, '123456789');

INSERT INTO zona_envio (id_zona, nombre_zona, costo_envio) VALUES
    (1, 'Zona Norte', 500.00),
    (2, 'Zona Sur', 600.00);

INSERT INTO categoria (id_categoria, nombre, requiere_sabores) VALUES
    (1, 'Helado Pote', true),
    (2, 'Helado Palito', false),
    (3, 'Postre', true);

INSERT INTO sabor (id_sabor, nombre, stock_baldes, disponible, cap_balde) VALUES
    (1, 'Chocolate', 10, true, '5L'),
    (2, 'Vainilla', 8, true, '5L'),
    (3, 'Frutilla', 5, true, '5L'),
    (4, 'Dulce de Leche', 0, true, '5L'),
    (5, 'No Disponible', 10, false, '5L');

INSERT INTO producto (id_producto, nombre, stock_envases, precio_base, max_sabores, id_categoria) VALUES
    (1, 'Pote 1/2 Kg', 10, 2500.00, 2, 1),
    (2, 'Pote 1 Kg', 5, 4500.00, 3, 1),
    (3, 'Palito de Crema', 20, 800.00, 0, 2),
    (4, 'Palito de Agua', 15, 600.00, 0, 2),
    (5, 'Postre Especial', 8, 3200.00, 2, 3);

INSERT INTO adicional (id_adicional, nombre, precio_extra, disponible) VALUES
    (1, 'Cremora', 200.00, true),
    (2, 'Salsa de Chocolate', 250.00, true),
    (3, 'Granola', 150.00, true),
    (4, 'No Disponible', 0.00, false);

INSERT INTO promocion (id_promocion, codigo, porc_desc, activa) VALUES
    (1, 'PROMO10', 10.00, true),
    (2, 'PROMO20', 20.00, true),
    (3, 'EXPIRADA', 15.00, false);

INSERT INTO direccion (id_direccion, calle, numero, ciudad, referencia, id_usuario, id_zona) VALUES
    (1, 'Av. Siempre Viva', '123', 'Springfield', 'Cerca de la plaza', 2, 1),
    (2, 'Calle Falsa', '456', 'Springfield', NULL, 2, 2);

INSERT INTO pedido (id_pedido, numero_seguimiento, fecha, total, metodo_entrega, id_cliente, id_direccion, id_promocion) VALUES
    (1, 'RH-TEST-0001', now() - interval '2 days', 5000.00, 'delivery', 2, 1, 1),
    (2, 'RH-TEST-0002', now() - interval '5 days', 2400.00, 'retiro', 2, 1, NULL);

INSERT INTO detalle_pedido (id_detalle, cantidad, precio_unit_hist, id_pedido, id_producto) VALUES
    (1, 2, 2500.00, 1, 1),
    (2, 3, 800.00, 2, 3);

INSERT INTO detalle_pedido_sabor (id_detalle, id_sabor) VALUES (1, 1), (1, 2);

INSERT INTO historial_estado (id_hist, fecha_hora, estado, notas, id_pedido) VALUES
    (1, now() - interval '2 days', 'PENDIENTE', 'Pedido creado', 1),
    (2, now() - interval '5 days', 'PENDIENTE', 'Pedido creado', 2),
    (3, now() - interval '4 days', 'PAGADO', 'Pago confirmado', 2),
    (4, now() - interval '3 days', 'ENTREGADO', 'Entregado al cliente', 2);

INSERT INTO carrito (id_carrito, id_cliente) VALUES (1, 2);

INSERT INTO carrito_item (id_item, id_carrito, id_producto, cantidad) VALUES
    (1, 1, 1, 2);

INSERT INTO carrito_item_sabor (id_item, id_sabor) VALUES (1, 1), (1, 2);

INSERT INTO carrito_item_adicional (id_item, id_adicional) VALUES (1, 1);

SELECT setval('rol_id_rol_seq', (SELECT MAX(id_rol) FROM rol));
SELECT setval('usuario_id_usuario_seq', (SELECT MAX(id_usuario) FROM usuario));
SELECT setval('zona_envio_id_zona_seq', (SELECT MAX(id_zona) FROM zona_envio));
SELECT setval('categoria_id_categoria_seq', (SELECT MAX(id_categoria) FROM categoria));
SELECT setval('sabor_id_sabor_seq', (SELECT MAX(id_sabor) FROM sabor));
SELECT setval('producto_id_producto_seq', (SELECT MAX(id_producto) FROM producto));
SELECT setval('adicional_id_adicional_seq', (SELECT MAX(id_adicional) FROM adicional));
SELECT setval('promocion_id_promocion_seq', (SELECT MAX(id_promocion) FROM promocion));
SELECT setval('direccion_id_direccion_seq', (SELECT MAX(id_direccion) FROM direccion));
SELECT setval('pedido_id_pedido_seq', (SELECT MAX(id_pedido) FROM pedido));
SELECT setval('detalle_pedido_id_detalle_seq', (SELECT MAX(id_detalle) FROM detalle_pedido));
SELECT setval('historial_estado_id_hist_seq', (SELECT MAX(id_hist) FROM historial_estado));
SELECT setval('carrito_id_carrito_seq', (SELECT MAX(id_carrito) FROM carrito));
SELECT setval('carrito_item_id_item_seq', (SELECT MAX(id_item) FROM carrito_item));
