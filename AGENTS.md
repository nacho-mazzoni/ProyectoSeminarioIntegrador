# AGENTS.md — Proyecto Seminario Integrador (UTN)

## ¿Qué es este proyecto?

Sistema completo de e-commerce para **Rumba Habana**, una heladería artesanal premium.

```
ProyectoSeminarioIntegrador/
├── DER SI.drawio.svg          # Diagrama Entidad-Relación (editar solo en draw.io)
├── docker-compose.yml         # Orquestación: postgres + api + web
├── heladeria-api/             # Backend Spring Boot 3 + JWT + PostgreSQL
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/                   # Java 21, Spring Boot, JPA, Security
├── heladeria-web/             # Frontend Next.js 16 (App Router)
│   ├── .dockerignore
│   ├── .env                   # NEXT_PUBLIC_API_URL=http://localhost:8080/api
│   ├── Dockerfile
│   ├── next.config.ts
│   ├── package.json
│   ├── public/assets/         # hero.jpg + productos/*.jpg
│   └── src/
│       ├── app/               # 11 rutas (App Router)
│       ├── components/        # ui/ (shadcn), layout/, productos/, cart/, etc.
│       ├── context/           # auth-context, cart-context
│       ├── hooks/
│       ├── lib/               # types, utils, cart-utils, product-images
│       └── services/          # api.ts (cliente HTTP con JWT Bearer)
└── AGENTS.md
```

---

## Cómo correr

### Opción 1: Docker (producción)
```bash
docker compose up -d --build
# Frontend: http://localhost:3000
# API:      http://localhost:8080
```

### Opción 2: Desarrollo (más rápido)
```bash
# Terminal 1 - API
cd heladeria-api
mvn spring-boot:run

# Terminal 2 - Frontend
cd heladeria-web
npm install
npm run dev
```

---

## Identidad visual — Rumba Habana

| Rol | Color | HEX |
|---|---|---|
| Primary | Marrón Chocolate | #4A2E1F |
| Secondary | Arena | #D8C3A5 |
| Background | Beige Claro | #F2E8D6 |
| Card/Surface | Crema | #FBF7F2 |
| Texto secundario | Marrón Medio | #6F5443 |
| Bordes | Arena Oscura | #C9B295 |

- **Títulos:** Playfair Display (serif)
- **Texto:** Montserrat (sans-serif)
- **Estilo:** cálido, premium, minimalista, artesanal

Tipografía cargada desde Google Fonts en `layout.tsx`.

---

## Cambios realizados en la sesión actual (11 jul 2026)

### 1. Rebrand completo de "Heladería Rumba" → "Rumba Habana"
- `globals.css`: paleta de colores completa, tipografía, sombras
- `layout.tsx`: Google Fonts (Playfair Display + Montserrat), metadata
- `Navbar.tsx`: nombre, aria-label
- `Footer.tsx`: fondo marrón (#4A2E1F) con texto crema
- `AuthShell.tsx`, `register/page.tsx`, `cart-context.tsx`
- `Hero.tsx`: texto actualizado

### 2. Límite de sabores en producto
- `products/[productId]/page.tsx`: `toggleSabor` valida `maxSabores`, deshabilita botones al llegar al límite, `handleAdd` rechaza si excede o si `requiereSabores` y no hay selección
- `ProductCard.tsx`: quick-add deshabilitado si el producto requiere sabores

### 3. Delivery con dirección inline + verificación de zona
- `checkout/page.tsx`: las direcciones muestran zona + costo de envío, botón "Agregar dirección" con diálogo inline, validación de zona de cobertura (deshabilita confirmar si no hay zona válida)

### 4. Limitación de sabores
- `toggleSabor` en product detail rechaza selección si ya se alcanzó `maxSabores`
- Botones no seleccionados se muestran deshabilitados (`opacity-50 cursor-not-allowed`)
- `handleAdd` valida antes de agregar al carrito

### 5. Infraestructura
- Se creó `.env` con `NEXT_PUBLIC_API_URL`
- Se detuvo el container Docker `web` para usar `npm run dev`

---

## Decisiones técnicas clave

- **API base:** `http://localhost:8080/api` (configurable via `NEXT_PUBLIC_API_URL`)
- **Auth:** JWT en localStorage, validado con `GET /auth/me`
- **Cart:** persistido en localStorage bajo key `rumba-habana-cart`
- **Precios:** formateados en ARS con `formatPrice()` en `cart-utils.ts`
- **Imágenes de productos:** mapeo por keywords en `product-images.ts`
- **Componentes UI:** shadcn/ui (46 componentes copiados a `components/ui/`)
- **Estado:** TanStack Query (React Query) para datos del servidor
- **i18n:** solo español (Argentina)

---

## Assets visuales pendientes

Ver prompts en el historial de la sesión. Hacen falta:
- `public/logo.svg` — logo vectorial con texto "Rumba Habana"
- `public/favicon.ico` — ícono de pestaña
- `public/assets/hero.jpg` — imagen principal del home
- `public/assets/products/*.jpg` — imágenes por producto
- `public/assets/empty-cart.svg` — ilustración para estado vacío
- Íconos de categorías (reemplazar emojis actuales)

---

## Rutas del frontend

| Ruta | Página |
|---|---|
| `/` | Home (Hero, categorías, destacados) |
| `/catalog` | Catálogo con búsqueda y filtros |
| `/products/[productId]` | Detalle de producto (sabores, adicionales) |
| `/cart` | Carrito de compras |
| `/checkout` | Checkout (entrega, dirección, pago) |
| `/login` | Inicio de sesión |
| `/register` | Registro |
| `/account` | Perfil + edición de datos, cambio de contraseña, eliminar cuenta |
| `/addresses` | CRUD de direcciones |
| `/orders` | Historial de pedidos con cancelación y detalle |
| `/admin` | Dashboard |
| `/admin/productos` | CRUD de productos |
| `/admin/productos/new` | Crear producto |
| `/admin/productos/[id]/edit` | Editar producto |
| `/admin/pedidos` | Gestión de pedidos |
| `/admin/pedidos/[id]` | Detalle y cambio de estado |
| `/admin/sabores` | CRUD de sabores |
| `/admin/adicionales` | CRUD de adicionales |
| `/admin/categorias` | CRUD de categorías |
| `/admin/zonas` | CRUD de zonas de envío |
| `/admin/usuarios` | Gestión de usuarios |

---

## Reglas para opencode

- **No editar** `DER SI.drawio.svg` con editor de texto
- **Idioma:** español para textos de UI, inglés para código
- **Estilo:** Tailwind CSS v4 con `@theme inline`, componentes shadcn/ui
- **Colores:** usar siempre variables CSS (`var(--color-primary)`, `bg-card`, `text-muted-foreground`, etc.)
- **No forzar Docker** para frontend en desarrollo — `npm run dev` es más rápido
- **Paleta Rumba Habana** debe mantenerse estrictamente (sin azules, verdes, rojos, neones)
- **Tipografía:** Playfair Display para títulos, Montserrat para cuerpo
