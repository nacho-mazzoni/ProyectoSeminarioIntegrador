# Rumba Habana — Plataforma de E-commerce

Sistema completo de e-commerce para **Rumba Habana**, una heladería artesanal premium.
Incluye catálogo de productos, carrito, checkout con envío por zonas, gestión de pedidos,
panel de administración, autenticación con JWT e integración con Mercado Pago.

> **Requisito único:** tener instalados **Docker** y **Docker Compose**. No hace falta
> instalar Java, Maven, Node.js, npm, PostgreSQL ni pgAdmin en la máquina.

---

## Tabla de contenidos

1. [Arquitectura](#arquitectura)
2. [Puesta en marcha (primer arranque)](#puesta-en-marcha-primer-arranque)
3. [Acceso a los servicios](#acceso-a-los-servicios)
4. [Variables de entorno](#variables-de-entorno)
5. [Credenciales de prueba](#credenciales-de-prueba)
6. [Inicialización de la base de datos](#inicialización-de-la-base-de-datos)
7. [Comandos útiles](#comandos-útiles)
8. [Desarrollo sin Docker](#desarrollo-sin-docker)
9. [Estructura del proyecto](#estructura-del-proyecto)
10. [Perfiles de configuración del backend](#perfiles-de-configuración-del-backend)
11. [Solución de problemas](#solución-de-problemas)

---

## Arquitectura

El proyecto se orquesta con un único `docker-compose.yml` que levanta 4 contenedores:

```text
                    +---------------------------+
   Navegador        |  PostgreSQL 18 (:5432)    |
      |             +------------+--------------+
      |                          ^
      |                          | red interna (servicio "postgres")
      v                          |
+-----+--------+     +-----------+-----------+
| Next.js 16   |     | Spring Boot 3 / Java 21|
| (:3000)      |     | (:8080)                |
+-----+--------+     +-----------+-----------+
      |                          ^
      |  http://localhost:8080   |
      +--------------------------+
                    ^
                    | red interna (servicio "backend")
   pgAdmin (:5050) | (capa de administración de la DB)
```

| Servicio  | Imagen / Base          | Puerto host | Descripción                              |
|-----------|------------------------|-------------|-------------------------------------------|
| `postgres`| `postgres:18`          | `5432`      | Base de datos (volumen persistente)       |
| `pgadmin` | `dpage/pgadmin4`       | `5050`      | Administración gráfica de la base         |
| `backend` | Maven 3.9 + Java 21    | `8080`      | API REST de Spring Boot (JWT + JPA)       |
| `frontend`| Node 22 + Next.js 16   | `3000`      | Aplicación web (App Router)               |

El navegador accede al frontend y a la API a través de `localhost`; el backend se conecta
a PostgreSQL por el nombre interno del servicio Docker `postgres`.

---

## Puesta en marcha (primer arranque)

En una máquina nueva, con Docker instalado:

```bash
git clone <URL-del-repositorio> Proyecto
cd Proyecto

# 1. Crear el archivo de entorno a partir de la plantilla
cp .env.example .env

# 2. Completar las variables obligatorias (al menos POSTGRES_PASSWORD,
#    PGADMIN_DEFAULT_PASSWORD y JWT_SECRET) en .env

# 3. Construir y levantar todo el stack
docker compose up --build
```

> El **primer build puede tardar varios minutos**: Maven descarga las dependencias de
> Java y npm instala las del frontend. El resultado queda cacheado en volúmenes Docker,
> por lo que los arranques posteriores son mucho más rápidos.

Para ejecutarlo en segundo plano:

```bash
docker compose up -d --build
```

Una vez levantado, el sistema queda disponible en:

- Frontend: <http://localhost:3000>
- API: <http://localhost:8080/api>
- pgAdmin: <http://localhost:5050>

---

## Acceso a los servicios

### Frontend — http://localhost:3000

La aplicación web. El home muestra el hero, las categorías y los productos destacados.
Rutas principales: `/catalog`, `/products/[id]`, `/cart`, `/checkout`, `/login`,
`/register`, `/account`, `/orders` y `/admin` (panel de administración).

### API — http://localhost:8080/api

Endpoints públicos de ejemplo:

```bash
curl http://localhost:8080/api/productos
curl http://localhost:8080/api/categorias
curl http://localhost:8080/api/sabores
curl http://localhost:8080/api/zonas-envio
```

Login de prueba:

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@heladeria.com","password":"admin123"}'
```

### pgAdmin — http://localhost:5050

Ingresá con `PGADMIN_DEFAULT_EMAIL` / `PGADMIN_DEFAULT_PASSWORD` definidos en `.env`.
Para conectar al servidor PostgreSQL dentro de pgAdmin:

| Campo        | Valor                |
|--------------|----------------------|
| Host         | `postgres`           |
| Port         | `5432`               |
| Database     | `heladeria`          |
| Username     | `postgres`           |
| Password     | `POSTGRES_PASSWORD`  |

> Desde la máquina host también podés conectar al puerto publicado `localhost:5432`
> con las mismas credenciales.

---

## Variables de entorno

Todos los secretos se administran desde `.env` (archivo local, ignorado por Git).
`.env.example` es la plantilla versionada que se copia como `.env`.

| Variable                | Requerida (local) | Descripción                                                              |
|-------------------------|-------------------|--------------------------------------------------------------------------|
| `POSTGRES_DB`           | Si                | Nombre de la base de datos (`heladeria`)                                 |
| `POSTGRES_USER`         | Si                | Usuario de PostgreSQL (`postgres`)                                       |
| `POSTGRES_PASSWORD`     | **Si**            | Contraseña de PostgreSQL. Elegí una propia.                              |
| `PGADMIN_DEFAULT_EMAIL` | Si                | Email de acceso a pgAdmin                                                |
| `PGADMIN_DEFAULT_PASSWORD` | **Si**         | Contraseña de acceso a pgAdmin                                           |
| `JWT_SECRET`            | **Si**            | Clave para firmar tokens JWT. Generar con `openssl rand -hex 32`.        |
| `JWT_EXPIRATION`        | No                | Expiración del token en milisegundos (por defecto `86400000` = 1 día).   |
| `MP_ACCESS_TOKEN`       | No*               | Access Token de Mercado Pago (solo para pagos con Mercado Pago).         |
| `MP_NOTIFICATION_URL`   | No                | URL de notificaciones de pago de Mercado Pago.                           |
| `MP_WEBHOOK_SECRET`     | Si con MP         | Secreto para validar la firma HMAC de las notificaciones.                |
| `MP_WEBHOOK_SIGNATURE_ENABLED` | No           | Variable legacy; la firma se exige automáticamente cuando hay token MP. |
| `DB_URL` / `DB_USERNAME` / `DB_PASSWORD` | No | Solo para el perfil `prod` (producción).                   |

\* Sin `MP_ACCESS_TOKEN` el sistema funciona con pagos en **efectivo**; la creación de
preferencias de pago de Mercado Pago requiere un token válido.

---

## Credenciales de prueba

El script de seed carga datos de demostración (usuarios con contraseña encriptada BCrypt):

| Rol          | Email                 | Contraseña     |
|--------------|-----------------------|----------------|
| Administrador| `admin@heladeria.com` | `admin123`     |
| Cliente      | `cliente@test.com`    | `password123`  |

El rol `Cajero` se crea en el seed y puede acceder al Backoffice de pedidos,
productos y promociones. No tiene acceso a usuarios, roles, reportes ni al checkout.

---

## Inicialización de la base de datos

En una instalación limpia, PostgreSQL se inicializa automáticamente con los scripts de
`infra/postgres/init/`, montados en `/docker-entrypoint-initdb.d`:

- `01_schema.sql` — esquema completo (tablas, secuencias, funciones y constraints).
- `02_seed.sql` — datos de demostración (productos, sabores, zonas, usuarios, pedidos…).

Las bases existentes deben aplicar también las migraciones versionadas en
`infra/postgres/migrations/` en orden (`V1`, `V2` y `V3`).

> **Importante:** los scripts de init solo se ejecutan **cuando el volumen se crea por
> primera vez**. Si ya existe un volumen `postgres_data` con datos, no se vuelven a correr.

Para reiniciar la base desde cero (borra **todos** los datos del volumen):

```bash
docker compose down -v          # elimina contenedores y volúmenes
docker compose up -d --build    # recrea el volumen y re-ejecuta los scripts de init
```

---

## Comandos útiles

```bash
# Levantar el stack (construyendo imágenes)
docker compose up -d --build

# Ver logs de un servicio
docker compose logs -f backend
docker compose logs -f frontend

# Estado de los servicios
docker compose ps

# Detener el stack (conserva los volúmenes con los datos)
docker compose down

# Detener el stack y eliminar volúmenes (destructivo)
docker compose down -v

# Reconstruir solo un servicio
docker compose up -d --build backend
```

---

## Desarrollo sin Docker

Si preferís ejecutar la API y el frontend directamente en tu máquina (iteración más
rápida), necesitás **Java 21 + Maven** para el backend y **Node 22 + npm** para el
frontend. Para la base de datos podés usar el mismo contenedor de PostgreSQL:

```bash
# 1. Levantar solo PostgreSQL (y opcionalmente pgAdmin)
docker compose up -d postgres
```

### Backend (Spring Boot)

```bash
cd heladeria-api
export JWT_SECRET="una-clave-de-32-bytes-o-mas"
export MP_ACCESS_TOKEN=""            # opcional
mvn spring-boot:run
```

El perfil activo por defecto es `local`, que conecta a `jdbc:postgresql://localhost:5432/heladeria`
con usuario `postgres` / `postgres`. La API queda en `http://localhost:8080`.

### Frontend (Next.js)

```bash
cd heladeria-web
npm ci
npm run dev
```

El frontend queda en `http://localhost:3000` y apunta a la API vía
`NEXT_PUBLIC_API_URL` (configurada en `heladeria-web/.env.local` como
`http://localhost:8080/api`).

Verificaciones disponibles:

```bash
npm run lint    # ESLint
npm run build   # build de producción
```

---

## Estructura del proyecto

```text
Proyecto/
├── docker-compose.yml          # Orquestación: postgres + pgadmin + backend + frontend
├── .env.example                # Plantilla de variables de entorno (versionada)
├── infra/
│   └── postgres/init/          # Scripts de init de PostgreSQL (schema + seed)
├── heladeria-api/              # Backend Spring Boot 3 (Java 21, JWT, JPA)
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/resources/     # application*.yml (perfiles local / docker / prod)
└── heladeria-web/              # Frontend Next.js 16 (App Router, shadcn/ui, Tailwind)
    ├── Dockerfile
    ├── package.json
    └── src/
        ├── app/                # Rutas (home, catálogo, carrito, checkout, admin…)
        ├── components/         # Componentes UI y de dominio
        ├── context/            # Auth y carrito (React Context)
        ├── services/           # Cliente HTTP de la API (JWT Bearer)
        └── lib/                # Tipos, utilidades y helpers
```

Diagramas de referencia (no editables a mano): `DER SI.drawio.svg`, `Diagrama de Clase.png`, `DCU.png`.

---

## Perfiles de configuración del backend

| Perfil  | Cuándo se usa        | Base de datos                     | Observaciones                              |
|---------|----------------------|-----------------------------------|--------------------------------------------|
| `local` | Desarrollo en el host| `localhost:5432/heladeria`        | Credenciales `postgres/postgres`, `ddl-auto: none` |
| `docker`| Dentro de Docker     | `postgres:5432/heladeria`         | Credenciales desde variables de entorno, `ddl-auto: none` |
| `prod`  | Producción           | `DB_URL` / `DB_USERNAME` / `DB_PASSWORD` | `ddl-auto: validate`                |

El perfil activo se define con `SPRING_PROFILES_ACTIVE` (por defecto `local`).
Docker Compose lo fija en `docker` para el contenedor `backend`.

---

## Solución de problemas

| Problema                                  | Solución                                                                                          |
|-------------------------------------------|---------------------------------------------------------------------------------------------------|
| `permission denied ... docker.sock`       | Agregá tu usuario al grupo `docker`: `sudo usermod -aG docker $USER` y volvé a iniciar sesión.     |
| Puerto 5432/8080/3000/5050 ocupado        | Detené el proceso que lo usa o cambiá el mapeo de puertos en `docker-compose.yml`.                 |
| El backend no arranca y muestra `Could not resolve placeholder ... JWT_SECRET` | `JWT_SECRET` está vacío en `.env`; cargá una clave válida.                          |
| `WeakKeyException` al iniciar el backend  | `JWT_SECRET` debe tener al menos 32 bytes; generala con `openssl rand -hex 32`.                    |
| La base no tiene datos de demostración    | El volumen ya existía y los scripts de init no se ejecutaron. Usá `docker compose down -v` y volvé a levantar. |
| El frontend no encuentra la API           | Verificá que `NEXT_PUBLIC_API_URL` apunte a `http://localhost:8080/api` (desde el navegador, no `backend`). |
| `npm ci` falla al construir el frontend   | Confirmá que `package-lock.json` esté actualizado y que usás npm (no pnpm).                       |

---

## Notas finales

- Los secretos **nunca** se versionan: `.env`, `.env.local`, `.next/` y `node_modules/`
  están ignorados por Git. Solo `.env.example` (sin valores reales) se entrega.
- El proyecto no depende de servicios externos para funcionar con pagos en efectivo;
  Mercado Pago solo se usa si se configura un `MP_ACCESS_TOKEN`.
