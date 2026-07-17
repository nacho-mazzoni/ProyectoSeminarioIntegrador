-- Usuario admin para pruebas
-- Password: admin123 (BCrypt hash)
INSERT INTO usuario (email, clave, activo, id_rol) VALUES
    ('admin@rumbahabana.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', true, 1);

INSERT INTO cliente (id_usuario, telefono) VALUES
    (currval('usuario_id_usuario_seq'), '11-5555-0000');
