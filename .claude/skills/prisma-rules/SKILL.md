---
name: prisma-rules
description: Convenciones de persistencia del Portal Inmobiliario con Prisma 7 y PostgreSQL. Usar al crear o modificar modelos en apps/api/prisma/schema.prisma, migraciones, el seed, repositorios en apps/api/src/repositories o cualquier código que consulte la base de datos.
---

# Skill: prisma-rules

Reglas para trabajar con la base de datos del proyecto. Complementan `spec.md`, `plan.md` y `CLAUDE.md`; ante una contradicción, manda la especificación.

## Activation Triggers

Usar este skill cuando el usuario o la tarea actual:
- Cree, modifique o elimine modelos, enums o relaciones en `apps/api/prisma/schema.prisma`.
- Cree o aplique migraciones.
- Cree o modifique el seed de desarrollo.
- Cree o modifique repositorios en `apps/api/src/repositories/`.
- Escriba consultas, filtros, ordenamientos o transacciones contra PostgreSQL.

---

## Stack y configuración (no cambiar sin aprobación)

- **Prisma 7.10.x** con PostgreSQL 16 (contenedor Docker en el puerto 5433).
- Configuración en `apps/api/prisma.config.ts`: ruta del esquema, carpeta de migraciones y `datasource.url`. Carga `apps/api/.env.local` con `@next/env`.
- El bloque `datasource` de `schema.prisma` **no** lleva `url`; la URL vive en `apps/api/prisma.config.ts`.
- Generador `prisma-client` con salida en `apps/api/src/generated/prisma` (ignorado por git y ESLint; se regenera con `npm install` o `npm run db:generate`).
- Conexión mediante el adaptador `@prisma/adapter-pg`.
- Importar el cliente generado desde `@/generated/prisma/client`.
- Antes de usar una API de Prisma que no aparezca en este proyecto, verificar su firma en `node_modules/@prisma/` o en el cliente generado: Prisma 7 tiene cambios incompatibles con versiones anteriores.

## Arquitectura

```text
Route Handler (apps/api/src/app/api/**) → Servicio (apps/api/src/services) → Repositorio (apps/api/src/repositories) → Prisma → PostgreSQL
```

- **Prisma vive solo en `apps/api`.** `apps/web` y `packages/shared` nunca lo importan.
- **Dentro de `apps/api`, solo `apps/api/src/repositories/` usa Prisma.** Route Handlers, servicios y componentes no importan `@/generated/prisma` ni `prisma-client`.
- Obtener el cliente con `getPrismaClient()` de `apps/api/src/repositories/prisma-client.ts`. No crear otras instancias de `PrismaClient`.
- Todo archivo que use el cliente importa `server-only` (directamente o a través de `prisma-client.ts`).
- Prohibido usar Prisma en componentes de React (cliente o servidor) y en Server Actions.
- Los repositorios devuelven tipos de dominio definidos en `@portal/shared/types` (`packages/shared/src/types/`), no tipos generados por Prisma. Convertir `Decimal` y otros tipos especiales en el repositorio.
- Los repositorios no contienen reglas de negocio ni lógica de presentación: solo persistencia y mapeo.
- Para poder probarlos, los repositorios reciben el cliente como dependencia (o un tipo mínimo, como `DatabaseQueryClient` en `database-health-repository.ts`) en lugar de importarlo de forma fija cuando la lógica lo justifique.

## Convenciones del esquema

- **Modelos** en PascalCase y singular (`Property`, `PropertyImage`). **Campos** en camelCase y sin abreviaturas.
- **Tablas y columnas** en snake_case, con `@@map` y `@map`:
  ```prisma
  model PropertyImage {
    id         String   @id @default(uuid(7)) @db.Uuid
    propertyId String   @map("property_id") @db.Uuid
    isMain     Boolean  @default(false) @map("is_main")
    createdAt  DateTime @default(now()) @map("created_at")
    updatedAt  DateTime @updatedAt @map("updated_at")

    @@map("property_images")
  }
  ```
- **Identificadores:** `String @id @default(uuid(7)) @db.Uuid`.
- **Fechas de auditoría:** `createdAt` con `@default(now())` y `updatedAt` con `@updatedAt` en todas las entidades principales.
- **Valores cerrados** como enums de PostgreSQL: `OperationType` (`SALE`, `RENT`), `PropertyType` (`HOUSE`, `APARTMENT`, `LAND`, `OFFICE`, `COMMERCIAL`, `OTHER`), `Currency` (`USD`) y `Role` (`USER`, `ADMIN`). Los valores deben coincidir exactamente con `spec.md`.
- **Dinero:** `Decimal` con `@db.Decimal(14, 2)`. Nunca `Float` para precios.
- **Superficies:** `Decimal` con `@db.Decimal(10, 2)`. **Conteos** (dormitorios, baños, estacionamientos, antigüedad): `Int`.
- **Campos opcionales** (`?`) solo cuando la especificación lo permita (por ejemplo, superficie en terrenos o `Inquiry.userId`).
- **Sin latitud ni longitud obligatorias:** la ubicación se modela con dirección, comuna, ciudad y región.
- **Características** con una relación muchos a muchos entre `Property` y `Feature`; nunca columnas booleanas por característica en `Property`.
- **Imágenes:** guardar solo URL, `publicId` de Cloudinary, posición e indicador de principal. Nunca datos binarios.

## Restricciones e índices

- Restricciones obligatorias del plan:
  - `User.email` único.
  - `@@unique([userId, propertyId])` en `Favorite`.
  - `Inquiry.userId` opcional, para permitir consultas de visitantes.
- Declarar `onDelete` explícitamente en cada relación (`Cascade`, `SetNull` o `Restrict`) y justificar la elección según la especificación.
- Agregar `@@index` solo cuando una consulta real lo justifique: filtros del catálogo (operación, tipo, estado de publicación, comuna, ciudad, región, precio), claves foráneas consultadas con frecuencia y ordenamientos.

## Migraciones

- Toda modificación del esquema se hace con migraciones. **No usar `prisma db push`.**
- Crear y aplicar en desarrollo: `npm run db:migrate -- --name nombre_descriptivo_en_snake_case`.
- Estado: `npm run db:migrate:status`. Producción o CI: `npm run db:migrate:deploy`.
- Versionar la carpeta `apps/api/prisma/migrations/` completa, incluido `migration_lock.toml`.
- No editar ni eliminar migraciones ya aplicadas; corregir con una migración nueva.
- Revisar el SQL generado antes de dar por terminada la tarea, en especial si elimina columnas o tablas.
- El usuario `portal_inmobiliario` tiene permiso `CREATEDB` porque `migrate dev` necesita crear una base temporal (shadow database).

## Consultas

- Filtrar, ordenar y paginar en PostgreSQL (`where`, `orderBy`, `take`, `skip`); nunca cargar todo el catálogo para filtrar en memoria.
- Usar `select` o `include` con solo los campos necesarios.
- Las consultas públicas filtran siempre por propiedades publicadas.
- Búsqueda textual con `contains` y `mode: "insensitive"` sobre los campos que indique la especificación.
- Operaciones de varios pasos que deban ser atómicas: `$transaction`.
- SQL crudo solo con plantillas etiquetadas (`$queryRaw\`...\``). **Prohibido `$queryRawUnsafe` y `$executeRawUnsafe` con datos del usuario.**

## Errores

- Traducir los errores conocidos de Prisma en el servicio o en el Route Handler, sin exponer mensajes internos:
  - `P2002` (restricción única violada) → `409`.
  - `P2025` (registro no encontrado) → `404`.
  - `P2003` (clave foránea inválida) → `400` o `409`, según el caso.
- Respuesta con el formato del plan: `{ "message": "...", "status": 409 }`.

## Seed

- Archivo `apps/api/prisma/seed.ts`, ejecutado con `tsx` y registrado en `migrations.seed` de `apps/api/prisma.config.ts`.
- Debe ser idempotente (`upsert` o limpieza previa controlada) y usar datos realistas del mercado chileno.
- Nunca incluir contraseñas reales; las de usuarios de prueba se guardan con hash.

## Pruebas

- Cada repositorio nuevo tiene pruebas unitarias con un cliente falso que cumpla el tipo mínimo que recibe.
- Probar el mapeo a tipos de dominio, los filtros construidos y el manejo de errores.
- Validar la conexión real con `npm run db:check` y las migraciones con `npm run db:migrate:status` (desde la raíz se delegan a `apps/api`).
