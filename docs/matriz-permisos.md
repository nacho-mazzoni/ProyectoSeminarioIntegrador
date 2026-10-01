# Matriz de Permisos

| Módulo/acción | Cliente | Cajero | Administrador |
|---|---:|---:|---:|
| Catálogo público | Sí | Sí | Sí |
| Carrito y checkout | Sí | No | No |
| Mis pedidos y direcciones | Sí | No | No |
| Crear/cancelar pedidos propios | Sí | No | No |
| Gestionar estados de pedidos | No | Sí | Sí |
| Gestionar productos | No | Sí | Sí |
| Gestionar promociones | No | Sí | Sí |
| Gestionar sabores y adicionales | No | No | Sí |
| Gestionar categorías y zonas | No | No | Sí |
| Gestionar usuarios y roles | No | No | Sí |
| Dashboard y reportes | No | No | Sí |

Las restricciones se aplican en backend mediante las reglas de Spring Security y en frontend mediante `AdminGate` y la navegación por rol. La autorización del backend es la fuente efectiva de seguridad.
