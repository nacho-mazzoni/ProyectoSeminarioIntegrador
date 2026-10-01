# Plan de Implementación de Correcciones

Este plan define las tareas necesarias para que el proyecto refleje el comportamiento especificado en `EspecificacionesCU (Joaco).docx`.

## Decisiones funcionales

Antes de implementar los casos de uso se deberán mantener estas decisiones:

- Los estados oficiales serán `PENDIENTE`, `PAGADO`, `RECHAZADO`, `EN_PREPARACION`, `LISTO_PARA_RETIRO`, `EN_CAMINO`, `ENTREGADO` y `CANCELADO`.
- No se utilizará el estado `MODIFICADO`.
- La edición de un pedido se resolverá cancelando el pedido y creando uno nuevo.
- Solo se podrán cancelar pedidos en estado `PENDIENTE` o `EN_PREPARACION`.
- El flujo de estados de un pedido con retiro en local deberá seguir el camino: `PENDIENTE` -> `PAGADO` -> `EN_PREPARACION` -> `LISTO_PARA_RETIRO` -> `ENTREGADO`.
- El flujo de estados de un pedido con envío deberá seguir el camino: `PENDIENTE` -> `PAGADO` -> `EN_PREPARACION` -> `EN_CAMINO` -> `ENTREGADO`.
- Un pago rechazado seguirá el flujo `PENDIENTE` -> `RECHAZADO` y no podrá avanzar a preparación.
- Los pedidos cancelados permanecerán visibles en el historial para conservar trazabilidad.
- `retiro` representa la modalidad Take-away y no genera costo de envío.
- Las promociones actuales se manejarán como códigos porcentuales. Los banners y descuentos de monto fijo quedan fuera de esta implementación.
- Administradores y cajeros gestionarán pedidos.
- Los cajeros podrán acceder únicamente a pedidos, productos y promociones, incluyendo sus operaciones de alta, edición y baja permitidas.
- Solo administradores gestionarán usuarios, roles, categorías, sabores, adicionales, zonas y reportes.
- No se implementarán devoluciones ni reembolsos.
- No se implementará CU-07 porque no está incluido en el documento de especificaciones.
- Un usuario con rol administrador no debe poder crear pedidos.
- Un usuario con rol administrador no debe poder ingresar a la sección "Mis Pedidos".
- Un usuario con rol administrador no debe poder ver en el icono de usuario los accesos directos a las secciones "Mis Pedidos" y "Direcciones".
- Los cajeros tampoco podrán crear pedidos, consultar pedidos propios, gestionar usuarios o modificar roles.


## CU-01 - Realizar Pedido

### Backend

- Validar que el cliente esté autenticado y que el carrito no esté vacío.
- Validar cantidades positivas, productos activos, stock disponible y adicionales disponibles.
- Validar sabores requeridos, sabores permitidos y límite `maxSabores`.
- Rechazar sabores para productos que no los admiten.
- Verificar que la dirección utilizada pertenezca al cliente autenticado.
- Validar `metodoEntrega` y `metodoPago` contra valores permitidos.
- Asociar dirección únicamente cuando la entrega sea `delivery`.
- Calcular el costo de envío exclusivamente para `delivery`.
- Aplicar promociones solo si están activas y dentro de su vigencia.
- Recalcular subtotal, descuento, envío y total exclusivamente en backend.
- Generar y devolver un número de seguimiento.
- Crear el pedido en estado `PENDIENTE` y registrar su historial.
- Corregir el flujo de `metodoPago` para evitar pagos duplicados o inconsistentes.
- Ejecutar la operación de forma transaccional y conservar el carrito si falla la creación o el pago.

### Frontend

- Agregar campo para ingresar código promocional.
- Validar y mostrar el descuento aplicado.
- Mostrar el costo real de envío según la zona seleccionada.
- Mostrar costo cero para la modalidad `retiro`.
- Impedir confirmar `delivery` sin una dirección válida.
- Mostrar el resumen final con productos, sabores, adicionales, descuento, envío y total.
- Limpiar el carrito únicamente después de confirmar correctamente el pedido.
- Redirigir a Mercado Pago solo cuando la preferencia se cree correctamente.
- Mostrar número de pedido y estado al finalizar una compra exitosa.
- Mantener el carrito y mostrar un error si el pago es rechazado.

### Pruebas

- Checkout con carrito vacío.
- Cantidad cero o negativa.
- Producto sin stock.
- Sabores faltantes, excedidos o no permitidos.
- Dirección perteneciente a otro usuario.
- Take-away sin costo de envío.
- Delivery sin dirección.
- Promoción válida, vencida y no vigente.
- Pago en efectivo.
- Pago aprobado y rechazado.
- Fallo durante checkout sin pérdida del carrito.

## CU-02 - Registro de Cuenta

### Backend

- Validar campos obligatorios y formato de email.
- Garantizar unicidad del email.
- Exigir contraseña de al menos 8 caracteres, con letras y números.
- Normalizar email y datos antes de persistirlos.
- Mantener el almacenamiento de contraseñas mediante BCrypt.
- Asignar el rol `CLIENTE` al registrarse.
- Devolver errores diferenciados para campos inválidos y email duplicado.

### Frontend

- Validar usuario, email y contraseña antes del envío.
- Mostrar errores específicos debajo de cada campo.
- Informar claramente cuando el email ya está registrado.
- Iniciar sesión automáticamente después de un registro exitoso.
- Redirigir al inicio luego del registro.

### Pruebas

- Registro exitoso.
- Email duplicado.
- Email inválido.
- Campos incompletos.
- Contraseña menor a 8 caracteres.
- Contraseña sin letras o números.

## CU-03 - Seguimiento de Pedidos

### Backend

- Garantizar que cada cliente solo pueda consultar sus propios pedidos.
- Devolver ID, número de seguimiento, fecha, productos, sabores, estado y total.
- Mantener disponible el detalle ampliado del pedido.
- Devolver pedidos cancelados para conservar el historial.

### Frontend

- Esperar a que finalice la validación de autenticación antes de consultar pedidos.
- Mostrar historial, detalle y línea de tiempo de estados.
- Mostrar el botón de cancelar únicamente para pedidos `PENDIENTE` o `EN_PREPARACION`.
- No mostrar edición de pedidos; para cambiar un pedido el cliente deberá cancelarlo y crear uno nuevo.
- Mostrar un estado vacío cuando no existan pedidos.
- Actualizar el historial mediante React Query, sin usar recargas completas.

### Pruebas

- Cliente con pedidos.
- Cliente sin pedidos.
- Intento de consultar el pedido de otro usuario.
- Visualización de pedidos cancelados.
- Ocultamiento de acciones para pedidos finalizados.

## CU-04 - Cancelar Pedido

### Backend

- Permitir cancelación solo en estado `PENDIENTE` o `EN_PREPARACION`.
- Rechazar cancelación de pedidos `ENTREGADO` o `CANCELADO`.
- Verificar ownership cuando cancela un cliente.
- Restaurar stock de los productos cancelados.
- Registrar estado `CANCELADO` en el historial.
- Incorporar motivo de cancelación para operaciones administrativas.
- Mantener el estado de pago visible cuando corresponda, sin implementar devoluciones.
- Conservar el pedido cancelado en el historial.

### Frontend

- Solicitar confirmación antes de cancelar.
- Mostrar la acción solo cuando el pedido sea cancelable.
- Mostrar el estado cancelado inmediatamente después de la operación.
- Actualizar la lista sin recargar la página completa.

### Pruebas

- Cancelación exitosa de pedido en preparación.
- Cancelación de pedido entregado.
- Cancelación de pedido ya cancelado.
- Cancelación de pedido de otro cliente.
- Restauración de stock.
- Pedido pagado cancelado sin flujo de devolución.
- Pedido en efectivo cancelado sin flujo de devolución.
- Motivo obligatorio para cancelación administrativa.

## CU-05 - Catálogo de Productos

### Backend

- Exponer únicamente productos activos y disponibles para el catálogo público.
- Impedir agregar productos pausados o sin stock.
- Mantener filtros por categoría.
- Mantener validaciones de sabores y adicionales al agregar al carrito.

### Frontend

- Mostrar productos disponibles y filtros por categoría.
- Incrementar cantidad al agregar nuevamente el mismo producto.
- Mantener productos diferentes como ítems separados.
- Impedir agregar productos sin stock.
- Validar stock al agregar y modificar cantidades del carrito.
- Mostrar mini carrito actualizado.
- Ocultar o deshabilitar finalizar compra cuando el carrito esté vacío.
- Mostrar errores de API en vez de representar una respuesta fallida como catálogo vacío.

### Pruebas

- Filtrado por categoría.
- Producto repetido.
- Productos diferentes.
- Producto pausado.
- Producto sin stock.
- Carrito vacío.
- Fallo de carga del catálogo.

## CU-06 - Cambio de Pedido

### Backend

- No implementar edición ni registrar el estado `MODIFICADO`.
- Rechazar el endpoint de edición con un mensaje que indique cancelar el pedido y crear uno nuevo.
- Mantener la cancelación disponible en `PENDIENTE` y `EN_PREPARACION`.

### Frontend

- No mostrar acción `Editar pedido`.
- Permitir cancelar el pedido desde el historial y volver al catálogo para crear uno nuevo.

### Pruebas

- Rechazo del endpoint de edición.
- Cancelación en `PENDIENTE`.
- Cancelación en `EN_PREPARACION`.
- Creación de un nuevo pedido luego de cancelar.

## CU-08 - Gestión de Usuarios y Roles

### Backend

- Implementar alta administrativa de usuarios.
- Implementar edición administrativa de usuarios.
- Validar email único.
- Validar contraseña temporal de mínimo 8 caracteres con letras y números.
- Permitir roles `CLIENTE`, `CAJERO` y `ADMINISTRADOR`.
- Implementar baja lógica mediante `activo = false`.
- Impedir eliminación física de usuarios con historial.
- Evitar que un administrador se quite sus propios permisos accidentalmente.
- Restringir todo el módulo a administradores.
- Devolver DTOs de usuario y rol, no entidades JPA.

### Frontend

- Agregar botón y formulario `Nuevo usuario`.
- Agregar edición de usuarios.
- Agregar búsqueda y filtros.
- Agregar selector de rol.
- Agregar confirmación para desactivar usuarios.
- Mostrar contraseña temporal enmascarada.
- Mostrar errores de validación por campo.
- Actualizar el listado después de crear, editar o desactivar.

### Pruebas

- Alta de usuario.
- Email duplicado.
- Cambio de rol.
- Alta de cajero.
- Desactivación lógica.
- Intento de acceso de usuario inactivo.
- Restricción de acceso para clientes y cajeros.

## CU-09 - Gestión de Productos

### Backend

- Validar nombre, categoría, precio positivo, stock no negativo y `maxSabores`.
- Implementar pausa y reactivación de productos.
- Implementar baja lógica de productos y sabores.
- Impedir eliminación física de productos vinculados con pedidos históricos.
- Mantener disponibles las referencias históricas de productos y sabores.
- Validar disponibilidad de sabores y adicionales.

### Frontend

- Agregar control de disponibilidad.
- Agregar acciones pausar/reactivar.
- Agregar confirmación de baja lógica.
- Mostrar stock y límite de sabores.
- Mostrar errores de validación de formularios.
- Invalidar caches de productos después de modificaciones.
- Mantener la gestión independiente de sabores y adicionales.

### Pruebas

- Alta de producto válida.
- Precio cero o negativo.
- Stock negativo.
- Pausar y reactivar.
- Baja lógica.
- Intento de eliminar producto histórico.
- Edición de sabor utilizado por pedidos.

## CU-10 - Gestión de Pedidos Administrativa

### Backend

- Permitir el módulo a administradores y cajeros.
- Listar pedidos del día ordenados por hora.
- Permitir filtros por estado.
- Definir y validar estas transiciones:
   - `PENDIENTE -> PAGADO`.
   - `PENDIENTE -> RECHAZADO`.
   - `PAGADO -> EN_PREPARACION`.
   - `EN_PREPARACION -> EN_CAMINO`.
   - `EN_PREPARACION -> LISTO_PARA_RETIRO`.
  - `EN_PREPARACION -> CANCELADO`.
  - `EN_CAMINO -> ENTREGADO`.
- Bloquear cambios desde `ENTREGADO` y `CANCELADO`.
- Exigir motivo para cancelar desde Backoffice.
- Registrar usuario, fecha, estado y motivo en el historial.
- Incorporar polling o WebSocket para actualización automática.

### Frontend

- Corregir el filtro `Todos` para que no envíe valores inválidos.
- Mostrar ID, cliente, total, entrega y estado.
- Mostrar detalle de productos, sabores, pago y dirección.
- Solicitar confirmación antes del cambio de estado.
- Solicitar motivo cuando el estado sea `CANCELADO`.
- Mostrar únicamente estados válidos para el estado actual.
- Permitir acceso de cajeros al módulo.
- Invalidar y actualizar las queries después de modificar un pedido.

### Pruebas

- Listado ordenado del día.
- Filtro por estado.
- Transición válida.
- Transición inválida.
- Cancelación sin motivo.
- Cancelación con motivo.
- Acceso de cajero.
- Acceso de cliente rechazado.
- Actualización automática del estado.

## CU-11 - Gestión de Promociones

### Backend

- Validar código obligatorio y único.
- Validar porcentaje mayor que cero y menor o igual a 100.
- Validar que la fecha de fin sea posterior a la fecha de inicio.
- Aplicar promociones únicamente dentro de su vigencia.
- Permitir desactivación lógica.
- Ocultar promociones vencidas del catálogo público.
- Devolver fechas reales de inicio y fin.
- Impedir eliminar físicamente promociones utilizadas en pedidos.

### Frontend

- Reemplazar la página actual por componentes del sistema visual.
- Mostrar promociones activas, programadas y finalizadas.
- Agregar fechas de inicio y fin al formulario.
- Corregir la carga de fechas al editar.
- Agregar validación con Zod y mensajes visibles.
- Agregar loading, errores y estado de guardado.
- Agregar desactivación con confirmación.
- Agregar ingreso de código en checkout.
- Mostrar descuento y total actualizado.

### Pruebas

- Código duplicado.
- Porcentaje inválido.
- Fecha de fin anterior a inicio.
- Promoción futura.
- Promoción vencida.
- Promoción desactivada.
- Aplicación de código válido.
- Código inexistente.

## CU-12 - Reportes Básicos

### Backend

- Contabilizar ingresos únicamente de pedidos `ENTREGADO`.
- Excluir pedidos pendientes, en preparación, en camino y cancelados.
- Implementar ventas del día.
- Implementar filtros por día, semana, mes y rango personalizado.
- Implementar ranking de productos.
- Implementar ranking de sabores.
- Devolver valores cero cuando no existan ventas.
- Agregar tests de estados y rangos de fechas.

### Frontend

- Agregar selector de rango de fechas.
- Actualizar los reportes al cambiar el filtro.
- Mostrar tarjetas de resumen.
- Mostrar gráficos de productos y sabores.
- Mostrar `$0` y mensaje de estado vacío cuando no haya ventas.
- Corregir división por cero en los gráficos.
- Mostrar errores técnicos de carga.

### Pruebas

- Reporte con ventas entregadas.
- Exclusión de pedidos cancelados.
- Exclusión de pedidos pendientes.
- Reporte sin ventas.
- Filtro diario.
- Filtro mensual.
- Ranking de productos.
- Ranking de sabores.

## Seguridad transversal

- Crear una matriz formal de permisos para cliente, cajero y administrador.
- Verificar ownership en pedidos, direcciones, cancelaciones y ediciones.
- Revisar CORS para no permitir cualquier origen en producción.
- Validar firma y payload del webhook de Mercado Pago.
- Agregar tests de autorización para cada rol.
- Mantener invalidación de tokens para usuarios inactivos.
- Evitar exponer entidades internas en las respuestas de API.

## Correcciones transversales del frontend

- Asociar el carrito al usuario o limpiarlo al cambiar de cuenta.
- Evitar consultas autenticadas antes de que `isReady` sea verdadero.
- Mostrar errores de consultas públicas en lugar de listas vacías silenciosas.
- Invalidar caches de React Query luego de cada mutación.
- Eliminar recargas completas mediante `window.location.reload()`.
- Separar correctamente el layout público del layout administrativo.
- Mantener todos los textos de interfaz en español.
- Reemplazar colores fuera de la paleta de Rumba Habana.
- Agregar los assets faltantes, especialmente favicon y estados vacíos.

## Orden de implementación

1. Definir estados, roles, permisos y decisiones funcionales.
2. Actualizar esquema, entidades, DTOs y contratos de API.
3. Corregir validaciones y reglas de negocio de pedidos.
4. Corregir stock, cancelación y pagos.
5. Implementar promociones vigentes y su integración con checkout.
6. Completar gestión de usuarios y roles.
7. Completar gestión de productos, sabores y disponibilidad.
8. Completar gestión administrativa de pedidos.
9. Completar reportes y filtros temporales.
10. Integrar los cambios en las pantallas del frontend.
11. Aplicar seguridad y autorización transversal.
12. Ejecutar y corregir tests backend.
13. Incorporar tests frontend.
14. Validar manualmente cada caso de uso completo.
15. Actualizar seed, README y documentación técnica.

## Criterio de finalización

La implementación se considerará completa cuando:

- Cada caso de uso documentado pueda ejecutarse de principio a fin.
- Los flujos alternativos y excepciones tengan respuesta visible.
- Las reglas de negocio se validen en backend y frontend cuando corresponda.
- Los roles tengan los permisos definidos.
- Los pedidos, pagos, promociones y stock mantengan consistencia transaccional.
- Los tests críticos sean exitosos.
- No existan funcionalidades del documento que estén representadas únicamente de forma visual pero no respaldadas por la API.
