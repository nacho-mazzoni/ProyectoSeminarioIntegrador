# Migraciones de PostgreSQL

El proyecto no usa Flyway ni Liquibase. Los scripts de `infra/postgres/init/` solo se
ejecutan al crear el volumen por primera vez, por lo que las instalaciones existentes
deben aplicar manualmente las migraciones versionadas.

Desde el host, con PostgreSQL accesible:

```bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 \
   -f infra/postgres/migrations/V1__estado_y_disponibilidad.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 \
   -f infra/postgres/migrations/V2__seguimiento_pago.sql
```

Con Docker Compose también se puede ejecutar:

```bash
docker compose exec -T postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
   -v ON_ERROR_STOP=1 < infra/postgres/migrations/V1__estado_y_disponibilidad.sql
docker compose exec -T postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
   -v ON_ERROR_STOP=1 < infra/postgres/migrations/V2__seguimiento_pago.sql
docker compose exec -T postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
   -v ON_ERROR_STOP=1 < infra/postgres/migrations/V3__operador_historial.sql
```

Las instalaciones nuevas no necesitan este paso: `01_schema.sql` mantiene la
inicialización completa y no se reemplaza por las migraciones.
