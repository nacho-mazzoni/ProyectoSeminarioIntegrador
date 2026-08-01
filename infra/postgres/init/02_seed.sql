--
-- PostgreSQL database dump
--

\restrict rxLMJ5B4Zu1eXsXzoxJNOyJwdvI9OtIiYzHrJrxfb2AOiNujkY3x9BwL2RCAPBj

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-07-31 18:54:35

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5205 (class 0 OID 20916)
-- Dependencies: 237
-- Data for Name: adicional; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.adicional (id_adicional, nombre, precio_extra, disponible, created_at, updated_at) FROM stdin;
1	Cremora	200.00	t	2026-07-08 18:01:46.798577-03	2026-07-08 18:01:46.798577-03
2	Salsa de Chocolate	250.00	t	2026-07-08 18:01:46.798577-03	2026-07-08 18:01:46.798577-03
3	Granola	150.00	t	2026-07-08 18:01:46.798577-03	2026-07-08 18:01:46.798577-03
4	No Disponible	0.00	f	2026-07-08 18:01:46.798577-03	2026-07-08 18:01:46.798577-03
\.


--
-- TOC entry 5188 (class 0 OID 20744)
-- Dependencies: 220
-- Data for Name: rol; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rol (id_rol, nombre_rol, created_at, updated_at) FROM stdin;
1	Administrador	2026-07-08 18:01:46.798577-03	2026-07-08 18:01:46.798577-03
2	Cliente	2026-07-08 18:01:46.798577-03	2026-07-08 18:01:46.798577-03
\.


--
-- TOC entry 5190 (class 0 OID 20757)
-- Dependencies: 222
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario (id_usuario, email, clave, activo, id_rol, created_at, updated_at) FROM stdin;
1	admin@heladeria.com	$2a$12$C4SEEWTx7zNjjMDsp.wZKuXzTJHJqcreTK.PAg9ONHpmI6nNQJQVK	t	1	2026-07-08 18:01:46.798577-03	2026-07-08 18:01:46.798577-03
2	cliente@test.com	$2a$12$U.TCGKZeKfFyhRtChxNtqO7BFM83skj6oejDU6.FKzGOA33taM2Pe	t	2	2026-07-08 18:01:46.798577-03	2026-07-08 18:01:46.798577-03
3	cliente@mail.com	$2a$10$ScQqVBQsJQN.RzhwTgAGu.RpK3F3ON/kyw3.uKDzCT7/t3sck0c/u	t	2	2026-07-08 18:05:21.390874-03	2026-07-08 18:05:21.390874-03
4	nacho@mail.com	$2a$10$N.fjVWJZ/tUWNKjYWpRFLechRAwZHD4SOq3CSD025A1SsMOL9kAP.	t	2	2026-07-18 14:51:00.850989-03	2026-07-18 14:51:00.850989-03
\.


--
-- TOC entry 5191 (class 0 OID 20782)
-- Dependencies: 223
-- Data for Name: cliente; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cliente (id_usuario, telefono, created_at, updated_at) FROM stdin;
2	123456789	2026-07-08 18:01:46.798577-03	2026-07-08 18:01:46.798577-03
3	3424144222	2026-07-08 18:05:21.433797-03	2026-07-08 18:05:21.433797-03
4	+5412345678	2026-07-18 14:51:00.913842-03	2026-07-18 14:51:00.913842-03
\.


--
-- TOC entry 5217 (class 0 OID 21076)
-- Dependencies: 249
-- Data for Name: carrito; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carrito (id_carrito, id_cliente, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5195 (class 0 OID 20813)
-- Dependencies: 227
-- Data for Name: categoria; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categoria (id_categoria, nombre, requiere_sabores, created_at, updated_at) FROM stdin;
1	Helado Pote	t	2026-07-08 18:01:46.798577-03	2026-07-08 18:01:46.798577-03
2	Helado Palito	f	2026-07-08 18:01:46.798577-03	2026-07-08 18:01:46.798577-03
3	Postre	t	2026-07-08 18:01:46.798577-03	2026-07-08 18:01:46.798577-03
\.


--
-- TOC entry 5201 (class 0 OID 20875)
-- Dependencies: 233
-- Data for Name: producto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.producto (id_producto, nombre, stock_envases, precio_base, max_sabores, id_categoria, created_at, updated_at) FROM stdin;
5	Postre Especial	8	3200.00	2	3	2026-07-08 18:01:46.798577-03	2026-07-08 18:01:46.798577-03
1	Pote 1/2 Kg	9	2500.00	2	1	2026-07-08 18:01:46.798577-03	2026-07-26 18:08:35.776359-03
2	Pote 1 Kg	4	4500.00	3	1	2026-07-08 18:01:46.798577-03	2026-07-26 18:08:35.776359-03
3	Palito de Crema	19	800.00	0	2	2026-07-08 18:01:46.798577-03	2026-07-26 18:35:41.859836-03
4	Palito de Agua	14	600.00	0	2	2026-07-08 18:01:46.798577-03	2026-07-26 18:35:41.859836-03
\.


--
-- TOC entry 5219 (class 0 OID 21094)
-- Dependencies: 251
-- Data for Name: carrito_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carrito_item (id_item, id_carrito, id_producto, cantidad, created_at) FROM stdin;
\.


--
-- TOC entry 5221 (class 0 OID 21137)
-- Dependencies: 253
-- Data for Name: carrito_item_adicional; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carrito_item_adicional (id_item, id_adicional, created_at) FROM stdin;
\.


--
-- TOC entry 5203 (class 0 OID 20899)
-- Dependencies: 235
-- Data for Name: sabor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sabor (id_sabor, nombre, stock_baldes, disponible, cap_balde, created_at, updated_at) FROM stdin;
1	Chocolate	10	t	5L	2026-07-08 18:01:46.798577-03	2026-07-08 18:01:46.798577-03
2	Vainilla	8	t	5L	2026-07-08 18:01:46.798577-03	2026-07-08 18:01:46.798577-03
3	Frutilla	5	t	5L	2026-07-08 18:01:46.798577-03	2026-07-08 18:01:46.798577-03
4	Dulce de Leche	0	t	5L	2026-07-08 18:01:46.798577-03	2026-07-08 18:01:46.798577-03
5	No Disponible	10	f	5L	2026-07-08 18:01:46.798577-03	2026-07-08 18:01:46.798577-03
\.


--
-- TOC entry 5220 (class 0 OID 21118)
-- Dependencies: 252
-- Data for Name: carrito_item_sabor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carrito_item_sabor (id_item, id_sabor, created_at) FROM stdin;
\.


--
-- TOC entry 5193 (class 0 OID 20798)
-- Dependencies: 225
-- Data for Name: zona_envio; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.zona_envio (id_zona, nombre_zona, costo_envio, created_at, updated_at) FROM stdin;
1	Zona Norte	500.00	2026-07-08 18:01:46.798577-03	2026-07-08 18:01:46.798577-03
2	Zona Sur	600.00	2026-07-08 18:01:46.798577-03	2026-07-08 18:01:46.798577-03
\.


--
-- TOC entry 5199 (class 0 OID 20846)
-- Dependencies: 231
-- Data for Name: direccion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.direccion (id_direccion, calle, numero, ciudad, referencia, id_usuario, id_zona, created_at, updated_at) FROM stdin;
1	Av. Siempre Viva	123	Springfield	Cerca de la plaza	2	1	2026-07-08 18:01:46.798577-03	2026-07-08 18:01:46.798577-03
2	Calle Falsa	456	Springfield	\N	2	2	2026-07-08 18:01:46.798577-03	2026-07-08 18:01:46.798577-03
3	Cordoba	123	San Vicente	Casa Blanca	3	1	2026-07-26 18:08:06.876897-03	2026-07-26 18:08:06.876897-03
\.


--
-- TOC entry 5197 (class 0 OID 20828)
-- Dependencies: 229
-- Data for Name: promocion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promocion (id_promocion, codigo, porc_desc, activa, created_at, updated_at, descripcion, fecha_inicio, fecha_fin) FROM stdin;
1	PROMO10	10.00	t	2026-07-08 18:01:46.798577-03	2026-07-08 18:01:46.798577-03	\N	\N	\N
2	PROMO20	20.00	t	2026-07-08 18:01:46.798577-03	2026-07-08 18:01:46.798577-03	\N	\N	\N
3	EXPIRADA	15.00	f	2026-07-08 18:01:46.798577-03	2026-07-08 18:01:46.798577-03	\N	\N	\N
\.


--
-- TOC entry 5207 (class 0 OID 20933)
-- Dependencies: 239
-- Data for Name: pedido; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pedido (id_pedido, fecha, total, metodo_entrega, id_cliente, id_direccion, id_promocion, created_at, updated_at) FROM stdin;
1	2026-07-06 18:01:46.798577-03	5000.00	delivery	2	1	1	2026-07-08 18:01:46.798577-03	2026-07-08 18:01:46.798577-03
2	2026-07-03 18:01:46.798577-03	2400.00	retiro	2	1	\N	2026-07-08 18:01:46.798577-03	2026-07-08 18:01:46.798577-03
3	2026-07-26 18:08:35.775371-03	7000.00	retiro	3	3	\N	2026-07-26 18:08:35.779892-03	2026-07-26 18:08:35.776359-03
4	2026-07-26 18:35:41.858237-03	1900.00	delivery	3	3	\N	2026-07-26 18:35:41.870198-03	2026-07-26 18:35:41.859836-03
\.


--
-- TOC entry 5213 (class 0 OID 21013)
-- Dependencies: 245
-- Data for Name: detalle_pedido; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.detalle_pedido (id_detalle, cantidad, precio_unit_hist, id_pedido, id_producto, created_at) FROM stdin;
1	2	2500.00	1	1	2026-07-08 18:01:46.798577-03
2	3	800.00	2	3	2026-07-08 18:01:46.798577-03
3	1	2500.00	3	1	2026-07-26 18:08:35.826262-03
4	1	4500.00	3	2	2026-07-26 18:08:35.922006-03
5	1	800.00	4	3	2026-07-26 18:35:41.93508-03
6	1	600.00	4	4	2026-07-26 18:35:41.977302-03
\.


--
-- TOC entry 5215 (class 0 OID 21056)
-- Dependencies: 247
-- Data for Name: detalle_pedido_adicional; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.detalle_pedido_adicional (id_detalle, id_adicional, created_at) FROM stdin;
\.


--
-- TOC entry 5214 (class 0 OID 21037)
-- Dependencies: 246
-- Data for Name: detalle_pedido_sabor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.detalle_pedido_sabor (id_detalle, id_sabor, created_at) FROM stdin;
1	1	2026-07-08 18:01:46.798577-03
1	2	2026-07-08 18:01:46.798577-03
3	1	2026-07-26 18:08:35.897907-03
3	2	2026-07-26 18:08:35.904028-03
4	3	2026-07-26 18:08:35.943637-03
4	2	2026-07-26 18:08:35.944637-03
4	1	2026-07-26 18:08:35.944637-03
\.


--
-- TOC entry 5211 (class 0 OID 20992)
-- Dependencies: 243
-- Data for Name: historial_estado; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historial_estado (id_hist, fecha_hora, estado, notas, id_pedido, created_at) FROM stdin;
1	2026-07-06 18:01:46.798577-03	PENDIENTE	Pedido creado	1	2026-07-08 18:01:46.798577-03
2	2026-07-03 18:01:46.798577-03	PENDIENTE	Pedido creado	2	2026-07-08 18:01:46.798577-03
3	2026-07-04 18:01:46.798577-03	CONFIRMADO	Pago confirmado	2	2026-07-08 18:01:46.798577-03
4	2026-07-05 18:01:46.798577-03	ENTREGADO	Entregado al cliente	2	2026-07-08 18:01:46.798577-03
5	2026-07-26 18:08:35.946636-03	PENDIENTE	\N	3	2026-07-26 18:08:35.949643-03
6	2026-07-26 18:35:42.001197-03	PENDIENTE	\N	4	2026-07-26 18:35:42.002304-03
\.


--
-- TOC entry 5209 (class 0 OID 20966)
-- Dependencies: 241
-- Data for Name: pago; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pago (id_pago, monto, fecha_pago, metodo_pago, estado_pago, id_pedido, created_at, updated_at) FROM stdin;
1	1900.00	2026-07-26 18:35:41.98635-03	mercado_pago	pendiente	4	2026-07-26 18:35:41.987385-03	2026-07-26 18:35:41.987385-03
\.


--
-- TOC entry 5227 (class 0 OID 0)
-- Dependencies: 236
-- Name: adicional_id_adicional_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.adicional_id_adicional_seq', 4, true);


--
-- TOC entry 5228 (class 0 OID 0)
-- Dependencies: 248
-- Name: carrito_id_carrito_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carrito_id_carrito_seq', 1, true);


--
-- TOC entry 5229 (class 0 OID 0)
-- Dependencies: 250
-- Name: carrito_item_id_item_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carrito_item_id_item_seq', 1, true);


--
-- TOC entry 5230 (class 0 OID 0)
-- Dependencies: 226
-- Name: categoria_id_categoria_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categoria_id_categoria_seq', 3, true);


--
-- TOC entry 5231 (class 0 OID 0)
-- Dependencies: 244
-- Name: detalle_pedido_id_detalle_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.detalle_pedido_id_detalle_seq', 6, true);


--
-- TOC entry 5232 (class 0 OID 0)
-- Dependencies: 230
-- Name: direccion_id_direccion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.direccion_id_direccion_seq', 3, true);


--
-- TOC entry 5233 (class 0 OID 0)
-- Dependencies: 242
-- Name: historial_estado_id_hist_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historial_estado_id_hist_seq', 6, true);


--
-- TOC entry 5234 (class 0 OID 0)
-- Dependencies: 240
-- Name: pago_id_pago_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pago_id_pago_seq', 20, true);


--
-- TOC entry 5235 (class 0 OID 0)
-- Dependencies: 238
-- Name: pedido_id_pedido_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pedido_id_pedido_seq', 4, true);


--
-- TOC entry 5236 (class 0 OID 0)
-- Dependencies: 232
-- Name: producto_id_producto_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.producto_id_producto_seq', 5, true);


--
-- TOC entry 5237 (class 0 OID 0)
-- Dependencies: 228
-- Name: promocion_id_promocion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.promocion_id_promocion_seq', 3, true);


--
-- TOC entry 5238 (class 0 OID 0)
-- Dependencies: 219
-- Name: rol_id_rol_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rol_id_rol_seq', 2, true);


--
-- TOC entry 5239 (class 0 OID 0)
-- Dependencies: 234
-- Name: sabor_id_sabor_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sabor_id_sabor_seq', 5, true);


--
-- TOC entry 5240 (class 0 OID 0)
-- Dependencies: 221
-- Name: usuario_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_id_usuario_seq', 4, true);


--
-- TOC entry 5241 (class 0 OID 0)
-- Dependencies: 224
-- Name: zona_envio_id_zona_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.zona_envio_id_zona_seq', 2, true);


-- Completed on 2026-07-31 18:54:36

--
-- PostgreSQL database dump complete
--

\unrestrict rxLMJ5B4Zu1eXsXzoxJNOyJwdvI9OtIiYzHrJrxfb2AOiNujkY3x9BwL2RCAPBj

