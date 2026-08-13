--
-- PostgreSQL database dump
--

\restrict mNRzHN0bI2Udx8uILN1amaGMuD4lpdrT2Vyd5wwZdqMVbdN7aWanwRILFqFHGNc

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-07-31 19:28:04

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
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--



ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 5257 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 254 (class 1255 OID 17857)
-- Name: trigger_set_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.trigger_set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.trigger_set_updated_at() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 237 (class 1259 OID 20916)
-- Name: adicional; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.adicional (
    id_adicional bigint NOT NULL,
    nombre character varying(150) NOT NULL,
    precio_extra numeric(10,2) DEFAULT 0 NOT NULL,
    disponible boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.adicional OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 20915)
-- Name: adicional_id_adicional_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.adicional_id_adicional_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.adicional_id_adicional_seq OWNER TO postgres;

--
-- TOC entry 5258 (class 0 OID 0)
-- Dependencies: 236
-- Name: adicional_id_adicional_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.adicional_id_adicional_seq OWNED BY public.adicional.id_adicional;


--
-- TOC entry 249 (class 1259 OID 21076)
-- Name: carrito; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carrito (
    id_carrito bigint NOT NULL,
    id_cliente bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.carrito OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 21075)
-- Name: carrito_id_carrito_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.carrito_id_carrito_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.carrito_id_carrito_seq OWNER TO postgres;

--
-- TOC entry 5259 (class 0 OID 0)
-- Dependencies: 248
-- Name: carrito_id_carrito_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.carrito_id_carrito_seq OWNED BY public.carrito.id_carrito;


--
-- TOC entry 251 (class 1259 OID 21094)
-- Name: carrito_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carrito_item (
    id_item bigint NOT NULL,
    id_carrito bigint NOT NULL,
    id_producto bigint NOT NULL,
    cantidad integer DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT carrito_item_cantidad_check CHECK ((cantidad > 0))
);


ALTER TABLE public.carrito_item OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 21137)
-- Name: carrito_item_adicional; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carrito_item_adicional (
    id_item bigint NOT NULL,
    id_adicional bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.carrito_item_adicional OWNER TO postgres;

--
-- TOC entry 250 (class 1259 OID 21093)
-- Name: carrito_item_id_item_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.carrito_item_id_item_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.carrito_item_id_item_seq OWNER TO postgres;

--
-- TOC entry 5260 (class 0 OID 0)
-- Dependencies: 250
-- Name: carrito_item_id_item_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.carrito_item_id_item_seq OWNED BY public.carrito_item.id_item;


--
-- TOC entry 252 (class 1259 OID 21118)
-- Name: carrito_item_sabor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carrito_item_sabor (
    id_item bigint NOT NULL,
    id_sabor bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.carrito_item_sabor OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 20813)
-- Name: categoria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categoria (
    id_categoria bigint NOT NULL,
    nombre character varying(100) NOT NULL,
    requiere_sabores boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.categoria OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 20812)
-- Name: categoria_id_categoria_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categoria_id_categoria_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categoria_id_categoria_seq OWNER TO postgres;

--
-- TOC entry 5261 (class 0 OID 0)
-- Dependencies: 226
-- Name: categoria_id_categoria_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categoria_id_categoria_seq OWNED BY public.categoria.id_categoria;


--
-- TOC entry 223 (class 1259 OID 20782)
-- Name: cliente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cliente (
    id_usuario bigint NOT NULL,
    telefono character varying(50),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.cliente OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 21013)
-- Name: detalle_pedido; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.detalle_pedido (
    id_detalle bigint NOT NULL,
    cantidad integer NOT NULL,
    precio_unit_hist numeric(10,2) NOT NULL,
    id_pedido bigint NOT NULL,
    id_producto bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT detalle_pedido_cantidad_check CHECK ((cantidad > 0))
);


ALTER TABLE public.detalle_pedido OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 21056)
-- Name: detalle_pedido_adicional; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.detalle_pedido_adicional (
    id_detalle bigint NOT NULL,
    id_adicional bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.detalle_pedido_adicional OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 21012)
-- Name: detalle_pedido_id_detalle_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.detalle_pedido_id_detalle_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.detalle_pedido_id_detalle_seq OWNER TO postgres;

--
-- TOC entry 5262 (class 0 OID 0)
-- Dependencies: 244
-- Name: detalle_pedido_id_detalle_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.detalle_pedido_id_detalle_seq OWNED BY public.detalle_pedido.id_detalle;


--
-- TOC entry 246 (class 1259 OID 21037)
-- Name: detalle_pedido_sabor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.detalle_pedido_sabor (
    id_detalle bigint NOT NULL,
    id_sabor bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.detalle_pedido_sabor OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 20846)
-- Name: direccion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.direccion (
    id_direccion bigint NOT NULL,
    calle character varying(200) NOT NULL,
    numero character varying(20) NOT NULL,
    ciudad character varying(100) NOT NULL,
    referencia text,
    id_usuario bigint NOT NULL,
    id_zona bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.direccion OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 20845)
-- Name: direccion_id_direccion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.direccion_id_direccion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.direccion_id_direccion_seq OWNER TO postgres;

--
-- TOC entry 5263 (class 0 OID 0)
-- Dependencies: 230
-- Name: direccion_id_direccion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.direccion_id_direccion_seq OWNED BY public.direccion.id_direccion;


--
-- TOC entry 243 (class 1259 OID 20992)
-- Name: historial_estado; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historial_estado (
    id_hist bigint NOT NULL,
    fecha_hora timestamp with time zone DEFAULT now() NOT NULL,
    estado character varying(50) NOT NULL,
    notas text,
    id_pedido bigint NOT NULL,
    id_usuario bigint,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.historial_estado OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 20991)
-- Name: historial_estado_id_hist_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.historial_estado_id_hist_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historial_estado_id_hist_seq OWNER TO postgres;

--
-- TOC entry 5264 (class 0 OID 0)
-- Dependencies: 242
-- Name: historial_estado_id_hist_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.historial_estado_id_hist_seq OWNED BY public.historial_estado.id_hist;


--
-- TOC entry 241 (class 1259 OID 20966)
-- Name: pago; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pago (
    id_pago bigint NOT NULL,
    monto numeric(10,2) NOT NULL,
    fecha_pago timestamp with time zone DEFAULT now() NOT NULL,
    metodo_pago character varying(50) NOT NULL,
    estado_pago character varying(50) DEFAULT 'pendiente'::character varying NOT NULL,
    init_point character varying(500),
    id_pedido bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.pago OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 20965)
-- Name: pago_id_pago_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pago_id_pago_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pago_id_pago_seq OWNER TO postgres;

--
-- TOC entry 5265 (class 0 OID 0)
-- Dependencies: 240
-- Name: pago_id_pago_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pago_id_pago_seq OWNED BY public.pago.id_pago;


--
-- TOC entry 239 (class 1259 OID 20933)
-- Name: pedido; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pedido (
    id_pedido bigint NOT NULL,
    numero_seguimiento character varying(40) NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL,
    total numeric(10,2) NOT NULL,
    metodo_entrega character varying(50) NOT NULL,
    id_cliente bigint NOT NULL,
    id_direccion bigint,
    id_promocion bigint,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.pedido OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 20932)
-- Name: pedido_id_pedido_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pedido_id_pedido_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pedido_id_pedido_seq OWNER TO postgres;

--
-- TOC entry 5266 (class 0 OID 0)
-- Dependencies: 238
-- Name: pedido_id_pedido_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pedido_id_pedido_seq OWNED BY public.pedido.id_pedido;


--
-- TOC entry 233 (class 1259 OID 20875)
-- Name: producto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.producto (
    id_producto bigint NOT NULL,
    nombre character varying(150) NOT NULL,
    stock_envases integer DEFAULT 0 NOT NULL,
    precio_base numeric(10,2) NOT NULL,
    max_sabores integer DEFAULT 0 NOT NULL,
    id_categoria bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.producto OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 20874)
-- Name: producto_id_producto_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.producto_id_producto_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.producto_id_producto_seq OWNER TO postgres;

--
-- TOC entry 5267 (class 0 OID 0)
-- Dependencies: 232
-- Name: producto_id_producto_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.producto_id_producto_seq OWNED BY public.producto.id_producto;


--
-- TOC entry 229 (class 1259 OID 20828)
-- Name: promocion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promocion (
    id_promocion bigint NOT NULL,
    codigo character varying(50) NOT NULL,
    porc_desc numeric(5,2) NOT NULL,
    activa boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    descripcion text,
    fecha_inicio timestamp with time zone,
    fecha_fin timestamp with time zone
);


ALTER TABLE public.promocion OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 20827)
-- Name: promocion_id_promocion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.promocion_id_promocion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.promocion_id_promocion_seq OWNER TO postgres;

--
-- TOC entry 5268 (class 0 OID 0)
-- Dependencies: 228
-- Name: promocion_id_promocion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.promocion_id_promocion_seq OWNED BY public.promocion.id_promocion;


--
-- TOC entry 220 (class 1259 OID 20744)
-- Name: rol; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rol (
    id_rol bigint NOT NULL,
    nombre_rol character varying(100) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.rol OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 20743)
-- Name: rol_id_rol_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rol_id_rol_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rol_id_rol_seq OWNER TO postgres;

--
-- TOC entry 5269 (class 0 OID 0)
-- Dependencies: 219
-- Name: rol_id_rol_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rol_id_rol_seq OWNED BY public.rol.id_rol;


--
-- TOC entry 235 (class 1259 OID 20899)
-- Name: sabor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sabor (
    id_sabor bigint NOT NULL,
    nombre character varying(150) NOT NULL,
    stock_baldes integer DEFAULT 0 NOT NULL,
    disponible boolean DEFAULT true NOT NULL,
    cap_balde character varying(50),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.sabor OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 20898)
-- Name: sabor_id_sabor_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sabor_id_sabor_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sabor_id_sabor_seq OWNER TO postgres;

--
-- TOC entry 5270 (class 0 OID 0)
-- Dependencies: 234
-- Name: sabor_id_sabor_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sabor_id_sabor_seq OWNED BY public.sabor.id_sabor;


--
-- TOC entry 222 (class 1259 OID 20757)
-- Name: usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario (
    id_usuario bigint NOT NULL,
    email character varying(255) NOT NULL,
    clave character varying(255) NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    id_rol bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.usuario OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 20756)
-- Name: usuario_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_id_usuario_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_id_usuario_seq OWNER TO postgres;

--
-- TOC entry 5271 (class 0 OID 0)
-- Dependencies: 221
-- Name: usuario_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_id_usuario_seq OWNED BY public.usuario.id_usuario;


--
-- TOC entry 225 (class 1259 OID 20798)
-- Name: zona_envio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.zona_envio (
    id_zona bigint NOT NULL,
    nombre_zona character varying(100) NOT NULL,
    costo_envio numeric(10,2) DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.zona_envio OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 20797)
-- Name: zona_envio_id_zona_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.zona_envio_id_zona_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.zona_envio_id_zona_seq OWNER TO postgres;

--
-- TOC entry 5272 (class 0 OID 0)
-- Dependencies: 224
-- Name: zona_envio_id_zona_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.zona_envio_id_zona_seq OWNED BY public.zona_envio.id_zona;


--
-- TOC entry 4981 (class 2604 OID 20919)
-- Name: adicional id_adicional; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adicional ALTER COLUMN id_adicional SET DEFAULT nextval('public.adicional_id_adicional_seq'::regclass);


--
-- TOC entry 5002 (class 2604 OID 21079)
-- Name: carrito id_carrito; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrito ALTER COLUMN id_carrito SET DEFAULT nextval('public.carrito_id_carrito_seq'::regclass);


--
-- TOC entry 5005 (class 2604 OID 21097)
-- Name: carrito_item id_item; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrito_item ALTER COLUMN id_item SET DEFAULT nextval('public.carrito_item_id_item_seq'::regclass);


--
-- TOC entry 4960 (class 2604 OID 20816)
-- Name: categoria id_categoria; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria ALTER COLUMN id_categoria SET DEFAULT nextval('public.categoria_id_categoria_seq'::regclass);


--
-- TOC entry 4998 (class 2604 OID 21016)
-- Name: detalle_pedido id_detalle; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_pedido ALTER COLUMN id_detalle SET DEFAULT nextval('public.detalle_pedido_id_detalle_seq'::regclass);


--
-- TOC entry 4968 (class 2604 OID 20849)
-- Name: direccion id_direccion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.direccion ALTER COLUMN id_direccion SET DEFAULT nextval('public.direccion_id_direccion_seq'::regclass);


--
-- TOC entry 4995 (class 2604 OID 20995)
-- Name: historial_estado id_hist; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_estado ALTER COLUMN id_hist SET DEFAULT nextval('public.historial_estado_id_hist_seq'::regclass);


--
-- TOC entry 4990 (class 2604 OID 20969)
-- Name: pago id_pago; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago ALTER COLUMN id_pago SET DEFAULT nextval('public.pago_id_pago_seq'::regclass);


--
-- TOC entry 4986 (class 2604 OID 20936)
-- Name: pedido id_pedido; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido ALTER COLUMN id_pedido SET DEFAULT nextval('public.pedido_id_pedido_seq'::regclass);


--
-- TOC entry 4971 (class 2604 OID 20878)
-- Name: producto id_producto; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto ALTER COLUMN id_producto SET DEFAULT nextval('public.producto_id_producto_seq'::regclass);


--
-- TOC entry 4964 (class 2604 OID 20831)
-- Name: promocion id_promocion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promocion ALTER COLUMN id_promocion SET DEFAULT nextval('public.promocion_id_promocion_seq'::regclass);


--
-- TOC entry 4947 (class 2604 OID 20747)
-- Name: rol id_rol; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol ALTER COLUMN id_rol SET DEFAULT nextval('public.rol_id_rol_seq'::regclass);


--
-- TOC entry 4976 (class 2604 OID 20902)
-- Name: sabor id_sabor; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sabor ALTER COLUMN id_sabor SET DEFAULT nextval('public.sabor_id_sabor_seq'::regclass);


--
-- TOC entry 4950 (class 2604 OID 20760)
-- Name: usuario id_usuario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuario_id_usuario_seq'::regclass);


--
-- TOC entry 4956 (class 2604 OID 20801)
-- Name: zona_envio id_zona; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zona_envio ALTER COLUMN id_zona SET DEFAULT nextval('public.zona_envio_id_zona_seq'::regclass);


--
-- TOC entry 5039 (class 2606 OID 20931)
-- Name: adicional adicional_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adicional
    ADD CONSTRAINT adicional_pkey PRIMARY KEY (id_adicional);


--
-- TOC entry 5061 (class 2606 OID 21107)
-- Name: carrito_item carrito_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrito_item
    ADD CONSTRAINT carrito_item_pkey PRIMARY KEY (id_item);


--
-- TOC entry 5059 (class 2606 OID 21087)
-- Name: carrito carrito_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrito
    ADD CONSTRAINT carrito_pkey PRIMARY KEY (id_carrito);


--
-- TOC entry 5024 (class 2606 OID 20826)
-- Name: categoria categoria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria
    ADD CONSTRAINT categoria_pkey PRIMARY KEY (id_categoria);


--
-- TOC entry 5020 (class 2606 OID 20791)
-- Name: cliente cliente_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_pkey PRIMARY KEY (id_usuario);


--
-- TOC entry 5052 (class 2606 OID 21026)
-- Name: detalle_pedido detalle_pedido_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_pedido
    ADD CONSTRAINT detalle_pedido_pkey PRIMARY KEY (id_detalle);


--
-- TOC entry 5030 (class 2606 OID 20863)
-- Name: direccion direccion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.direccion
    ADD CONSTRAINT direccion_pkey PRIMARY KEY (id_direccion);


--
-- TOC entry 5049 (class 2606 OID 21006)
-- Name: historial_estado historial_estado_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_estado
    ADD CONSTRAINT historial_estado_pkey PRIMARY KEY (id_hist);


--
-- TOC entry 5045 (class 2606 OID 20985)
-- Name: pago pago_id_pedido_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_id_pedido_key UNIQUE (id_pedido);


--
-- TOC entry 5047 (class 2606 OID 20983)
-- Name: pago pago_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_pkey PRIMARY KEY (id_pago);


--
-- TOC entry 5043 (class 2606 OID 20949)
-- Name: pedido pedido_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT pedido_pkey PRIMARY KEY (id_pedido);

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT pedido_numero_seguimiento_key UNIQUE (numero_seguimiento);


--
-- TOC entry 5065 (class 2606 OID 21145)
-- Name: carrito_item_adicional pk_carrito_item_adicional; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrito_item_adicional
    ADD CONSTRAINT pk_carrito_item_adicional PRIMARY KEY (id_item, id_adicional);


--
-- TOC entry 5063 (class 2606 OID 21126)
-- Name: carrito_item_sabor pk_carrito_item_sabor; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrito_item_sabor
    ADD CONSTRAINT pk_carrito_item_sabor PRIMARY KEY (id_item, id_sabor);


--
-- TOC entry 5057 (class 2606 OID 21064)
-- Name: detalle_pedido_adicional pk_detalle_pedido_adicional; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_pedido_adicional
    ADD CONSTRAINT pk_detalle_pedido_adicional PRIMARY KEY (id_detalle, id_adicional);


--
-- TOC entry 5055 (class 2606 OID 21045)
-- Name: detalle_pedido_sabor pk_detalle_pedido_sabor; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_pedido_sabor
    ADD CONSTRAINT pk_detalle_pedido_sabor PRIMARY KEY (id_detalle, id_sabor);


--
-- TOC entry 5035 (class 2606 OID 20892)
-- Name: producto producto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto
    ADD CONSTRAINT producto_pkey PRIMARY KEY (id_producto);


--
-- TOC entry 5026 (class 2606 OID 20844)
-- Name: promocion promocion_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promocion
    ADD CONSTRAINT promocion_codigo_key UNIQUE (codigo);


--
-- TOC entry 5028 (class 2606 OID 20842)
-- Name: promocion promocion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promocion
    ADD CONSTRAINT promocion_pkey PRIMARY KEY (id_promocion);


--
-- TOC entry 5013 (class 2606 OID 20755)
-- Name: rol rol_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol
    ADD CONSTRAINT rol_pkey PRIMARY KEY (id_rol);


--
-- TOC entry 5037 (class 2606 OID 20914)
-- Name: sabor sabor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sabor
    ADD CONSTRAINT sabor_pkey PRIMARY KEY (id_sabor);


--
-- TOC entry 5016 (class 2606 OID 20776)
-- Name: usuario usuario_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_email_key UNIQUE (email);


--
-- TOC entry 5018 (class 2606 OID 20774)
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario);


--
-- TOC entry 5022 (class 2606 OID 20811)
-- Name: zona_envio zona_envio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zona_envio
    ADD CONSTRAINT zona_envio_pkey PRIMARY KEY (id_zona);


--
-- TOC entry 5053 (class 1259 OID 21159)
-- Name: idx_detalle_pedido; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_detalle_pedido ON public.detalle_pedido USING btree (id_pedido);


--
-- TOC entry 5031 (class 1259 OID 21161)
-- Name: idx_direccion_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_direccion_usuario ON public.direccion USING btree (id_usuario);


--
-- TOC entry 5032 (class 1259 OID 21162)
-- Name: idx_direccion_zona; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_direccion_zona ON public.direccion USING btree (id_zona);


--
-- TOC entry 5050 (class 1259 OID 21160)
-- Name: idx_historial_pedido; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_historial_pedido ON public.historial_estado USING btree (id_pedido);


--
-- TOC entry 5040 (class 1259 OID 21157)
-- Name: idx_pedido_cliente; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pedido_cliente ON public.pedido USING btree (id_cliente);


--
-- TOC entry 5041 (class 1259 OID 21158)
-- Name: idx_pedido_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pedido_fecha ON public.pedido USING btree (fecha);


--
-- TOC entry 5033 (class 1259 OID 21163)
-- Name: idx_producto_categoria; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_producto_categoria ON public.producto USING btree (id_categoria);


--
-- TOC entry 5014 (class 1259 OID 21156)
-- Name: idx_usuario_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuario_email ON public.usuario USING btree (email);


--
-- TOC entry 5098 (class 2620 OID 21173)
-- Name: adicional trg_adicional_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_adicional_updated_at BEFORE UPDATE ON public.adicional FOR EACH ROW WHEN ((old.* IS DISTINCT FROM new.*)) EXECUTE FUNCTION public.trigger_set_updated_at();


--
-- TOC entry 5104 (class 2620 OID 21179)
-- Name: carrito_item trg_carrito_item_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_carrito_item_updated_at BEFORE UPDATE ON public.carrito_item FOR EACH ROW WHEN ((old.* IS DISTINCT FROM new.*)) EXECUTE FUNCTION public.trigger_set_updated_at();


--
-- TOC entry 5103 (class 2620 OID 21178)
-- Name: carrito trg_carrito_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_carrito_updated_at BEFORE UPDATE ON public.carrito FOR EACH ROW WHEN ((old.* IS DISTINCT FROM new.*)) EXECUTE FUNCTION public.trigger_set_updated_at();


--
-- TOC entry 5093 (class 2620 OID 21168)
-- Name: categoria trg_categoria_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_categoria_updated_at BEFORE UPDATE ON public.categoria FOR EACH ROW WHEN ((old.* IS DISTINCT FROM new.*)) EXECUTE FUNCTION public.trigger_set_updated_at();


--
-- TOC entry 5091 (class 2620 OID 21166)
-- Name: cliente trg_cliente_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_cliente_updated_at BEFORE UPDATE ON public.cliente FOR EACH ROW WHEN ((old.* IS DISTINCT FROM new.*)) EXECUTE FUNCTION public.trigger_set_updated_at();


--
-- TOC entry 5102 (class 2620 OID 21177)
-- Name: detalle_pedido trg_detalle_pedido_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_detalle_pedido_updated_at BEFORE UPDATE ON public.detalle_pedido FOR EACH ROW WHEN ((old.* IS DISTINCT FROM new.*)) EXECUTE FUNCTION public.trigger_set_updated_at();


--
-- TOC entry 5095 (class 2620 OID 21170)
-- Name: direccion trg_direccion_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_direccion_updated_at BEFORE UPDATE ON public.direccion FOR EACH ROW WHEN ((old.* IS DISTINCT FROM new.*)) EXECUTE FUNCTION public.trigger_set_updated_at();


--
-- TOC entry 5101 (class 2620 OID 21176)
-- Name: historial_estado trg_historial_estado_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_historial_estado_updated_at BEFORE UPDATE ON public.historial_estado FOR EACH ROW WHEN ((old.* IS DISTINCT FROM new.*)) EXECUTE FUNCTION public.trigger_set_updated_at();


--
-- TOC entry 5100 (class 2620 OID 21175)
-- Name: pago trg_pago_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_pago_updated_at BEFORE UPDATE ON public.pago FOR EACH ROW WHEN ((old.* IS DISTINCT FROM new.*)) EXECUTE FUNCTION public.trigger_set_updated_at();


--
-- TOC entry 5099 (class 2620 OID 21174)
-- Name: pedido trg_pedido_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_pedido_updated_at BEFORE UPDATE ON public.pedido FOR EACH ROW WHEN ((old.* IS DISTINCT FROM new.*)) EXECUTE FUNCTION public.trigger_set_updated_at();


--
-- TOC entry 5096 (class 2620 OID 21171)
-- Name: producto trg_producto_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_producto_updated_at BEFORE UPDATE ON public.producto FOR EACH ROW WHEN ((old.* IS DISTINCT FROM new.*)) EXECUTE FUNCTION public.trigger_set_updated_at();


--
-- TOC entry 5094 (class 2620 OID 21169)
-- Name: promocion trg_promocion_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_promocion_updated_at BEFORE UPDATE ON public.promocion FOR EACH ROW WHEN ((old.* IS DISTINCT FROM new.*)) EXECUTE FUNCTION public.trigger_set_updated_at();


--
-- TOC entry 5089 (class 2620 OID 21164)
-- Name: rol trg_rol_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_rol_updated_at BEFORE UPDATE ON public.rol FOR EACH ROW WHEN ((old.* IS DISTINCT FROM new.*)) EXECUTE FUNCTION public.trigger_set_updated_at();


--
-- TOC entry 5097 (class 2620 OID 21172)
-- Name: sabor trg_sabor_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_sabor_updated_at BEFORE UPDATE ON public.sabor FOR EACH ROW WHEN ((old.* IS DISTINCT FROM new.*)) EXECUTE FUNCTION public.trigger_set_updated_at();


--
-- TOC entry 5090 (class 2620 OID 21165)
-- Name: usuario trg_usuario_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_usuario_updated_at BEFORE UPDATE ON public.usuario FOR EACH ROW WHEN ((old.* IS DISTINCT FROM new.*)) EXECUTE FUNCTION public.trigger_set_updated_at();


--
-- TOC entry 5092 (class 2620 OID 21167)
-- Name: zona_envio trg_zona_envio_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_zona_envio_updated_at BEFORE UPDATE ON public.zona_envio FOR EACH ROW WHEN ((old.* IS DISTINCT FROM new.*)) EXECUTE FUNCTION public.trigger_set_updated_at();


--
-- TOC entry 5082 (class 2606 OID 21088)
-- Name: carrito fk_carrito_cliente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrito
    ADD CONSTRAINT fk_carrito_cliente FOREIGN KEY (id_cliente) REFERENCES public.cliente(id_usuario);


--
-- TOC entry 5083 (class 2606 OID 21108)
-- Name: carrito_item fk_ci_carrito; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrito_item
    ADD CONSTRAINT fk_ci_carrito FOREIGN KEY (id_carrito) REFERENCES public.carrito(id_carrito) ON DELETE CASCADE;


--
-- TOC entry 5084 (class 2606 OID 21113)
-- Name: carrito_item fk_ci_producto; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrito_item
    ADD CONSTRAINT fk_ci_producto FOREIGN KEY (id_producto) REFERENCES public.producto(id_producto);


--
-- TOC entry 5087 (class 2606 OID 21151)
-- Name: carrito_item_adicional fk_cia_adicional; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrito_item_adicional
    ADD CONSTRAINT fk_cia_adicional FOREIGN KEY (id_adicional) REFERENCES public.adicional(id_adicional);


--
-- TOC entry 5088 (class 2606 OID 21146)
-- Name: carrito_item_adicional fk_cia_item; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrito_item_adicional
    ADD CONSTRAINT fk_cia_item FOREIGN KEY (id_item) REFERENCES public.carrito_item(id_item) ON DELETE CASCADE;


--
-- TOC entry 5085 (class 2606 OID 21127)
-- Name: carrito_item_sabor fk_cis_item; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrito_item_sabor
    ADD CONSTRAINT fk_cis_item FOREIGN KEY (id_item) REFERENCES public.carrito_item(id_item) ON DELETE CASCADE;


--
-- TOC entry 5086 (class 2606 OID 21132)
-- Name: carrito_item_sabor fk_cis_sabor; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrito_item_sabor
    ADD CONSTRAINT fk_cis_sabor FOREIGN KEY (id_sabor) REFERENCES public.sabor(id_sabor);


--
-- TOC entry 5067 (class 2606 OID 20792)
-- Name: cliente fk_cliente_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT fk_cliente_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario);


--
-- TOC entry 5076 (class 2606 OID 21027)
-- Name: detalle_pedido fk_detalle_pedido; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_pedido
    ADD CONSTRAINT fk_detalle_pedido FOREIGN KEY (id_pedido) REFERENCES public.pedido(id_pedido);


--
-- TOC entry 5077 (class 2606 OID 21032)
-- Name: detalle_pedido fk_detalle_producto; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_pedido
    ADD CONSTRAINT fk_detalle_producto FOREIGN KEY (id_producto) REFERENCES public.producto(id_producto);


--
-- TOC entry 5068 (class 2606 OID 20864)
-- Name: direccion fk_direccion_cliente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.direccion
    ADD CONSTRAINT fk_direccion_cliente FOREIGN KEY (id_usuario) REFERENCES public.cliente(id_usuario);


--
-- TOC entry 5069 (class 2606 OID 20869)
-- Name: direccion fk_direccion_zona; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.direccion
    ADD CONSTRAINT fk_direccion_zona FOREIGN KEY (id_zona) REFERENCES public.zona_envio(id_zona);


--
-- TOC entry 5080 (class 2606 OID 21070)
-- Name: detalle_pedido_adicional fk_dpa_adicional; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_pedido_adicional
    ADD CONSTRAINT fk_dpa_adicional FOREIGN KEY (id_adicional) REFERENCES public.adicional(id_adicional);


--
-- TOC entry 5081 (class 2606 OID 21065)
-- Name: detalle_pedido_adicional fk_dpa_detalle; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_pedido_adicional
    ADD CONSTRAINT fk_dpa_detalle FOREIGN KEY (id_detalle) REFERENCES public.detalle_pedido(id_detalle) ON DELETE CASCADE;


--
-- TOC entry 5078 (class 2606 OID 21046)
-- Name: detalle_pedido_sabor fk_dps_detalle; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_pedido_sabor
    ADD CONSTRAINT fk_dps_detalle FOREIGN KEY (id_detalle) REFERENCES public.detalle_pedido(id_detalle) ON DELETE CASCADE;


--
-- TOC entry 5079 (class 2606 OID 21051)
-- Name: detalle_pedido_sabor fk_dps_sabor; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_pedido_sabor
    ADD CONSTRAINT fk_dps_sabor FOREIGN KEY (id_sabor) REFERENCES public.sabor(id_sabor);


--
-- TOC entry 5075 (class 2606 OID 21007)
-- Name: historial_estado fk_historial_pedido; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_estado
    ADD CONSTRAINT fk_historial_pedido FOREIGN KEY (id_pedido) REFERENCES public.pedido(id_pedido);

ALTER TABLE ONLY public.historial_estado
    ADD CONSTRAINT fk_historial_estado_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario);


--
-- TOC entry 5074 (class 2606 OID 20986)
-- Name: pago fk_pago_pedido; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago
    ADD CONSTRAINT fk_pago_pedido FOREIGN KEY (id_pedido) REFERENCES public.pedido(id_pedido);


--
-- TOC entry 5071 (class 2606 OID 20950)
-- Name: pedido fk_pedido_cliente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT fk_pedido_cliente FOREIGN KEY (id_cliente) REFERENCES public.cliente(id_usuario);


--
-- TOC entry 5072 (class 2606 OID 20955)
-- Name: pedido fk_pedido_direccion; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT fk_pedido_direccion FOREIGN KEY (id_direccion) REFERENCES public.direccion(id_direccion);


--
-- TOC entry 5073 (class 2606 OID 20960)
-- Name: pedido fk_pedido_promocion; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT fk_pedido_promocion FOREIGN KEY (id_promocion) REFERENCES public.promocion(id_promocion);


--
-- TOC entry 5070 (class 2606 OID 20893)
-- Name: producto fk_producto_categoria; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto
    ADD CONSTRAINT fk_producto_categoria FOREIGN KEY (id_categoria) REFERENCES public.categoria(id_categoria);


--
-- TOC entry 5066 (class 2606 OID 20777)
-- Name: usuario fk_usuario_rol; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT fk_usuario_rol FOREIGN KEY (id_rol) REFERENCES public.rol(id_rol);


-- Completed on 2026-07-31 19:28:04

--
-- PostgreSQL database dump complete
--

\unrestrict mNRzHN0bI2Udx8uILN1amaGMuD4lpdrT2Vyd5wwZdqMVbdN7aWanwRILFqFHGNc

-- Invariantes de disponibilidad y estados oficiales.
ALTER TABLE public.producto ADD COLUMN activo boolean DEFAULT true NOT NULL;
ALTER TABLE public.historial_estado ADD CONSTRAINT historial_estado_estado_check
    CHECK (estado IN ('PENDIENTE', 'PAGADO', 'RECHAZADO', 'EN_PREPARACION',
                      'LISTO_PARA_RETIRO', 'EN_CAMINO', 'ENTREGADO', 'CANCELADO'));
