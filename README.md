# Portal Inmobiliario — SDD

Proyecto base para desarrollar un portal inmobiliario utilizando **Spec-Driven Development (SDD)** con Claude Code.

## Estructura

Monorepo con **npm workspaces** y **Turborepo**:

```text
.
├── apps/
│   ├── web/          @portal/web — frontend Next.js (http://localhost:3000)
│   └── api/          @portal/api — backend Next.js, API REST + Prisma (http://localhost:3001)
├── packages/
│   └── shared/       @portal/shared — tipos de dominio y esquemas Zod
├── docker/           configuración de pgAdmin
├── specs/
│   └── portal-inmobiliario/
│       ├── spec.md
│       ├── plan.md
│       └── tasks.md
├── CLAUDE.md
├── package.json      workspaces y scripts raíz
└── turbo.json
```

El navegador siempre llama a `/api/...` en el frontend, que lo reenvía al backend (`rewrites` con `API_URL`).

## Entorno local

### Puesta en marcha

```bash
cp apps/api/.env.example apps/api/.env.local   # DATABASE_URL y secretos del servidor
cp apps/web/.env.example apps/web/.env.local   # API_URL y configuración pública
npm install                                    # instala todo y genera el cliente de Prisma
npm run dev                                    # levanta web (3000) y api (3001)
```

Otros comandos desde la raíz: `npm test`, `npm run lint`, `npm run typecheck` y `npm run build`. Para un solo workspace: `npm test -w @portal/web`.

### Base de datos

- PostgreSQL 16 corre en el contenedor Docker `postgres`, publicado en el puerto **5433** (el 5432 lo usa un PostgreSQL nativo de Windows).
- La aplicación usa la base `portal_inmobiliario` con el usuario `portal_inmobiliario`.
- ORM: Prisma 7 con el adaptador `@prisma/adapter-pg`, solo en `apps/api`. El esquema está en `apps/api/prisma/schema.prisma` y la configuración en `apps/api/prisma.config.ts`.

```bash
npm run db:check             # valida la conexión a PostgreSQL
npm run db:migrate           # crea y aplica migraciones en desarrollo
npm run db:migrate:status    # muestra el estado de las migraciones
npm run db:seed              # carga datos de desarrollo (idempotente)
```

El seed (`apps/api/prisma/seed.ts`) crea 13 características y 20 propiedades de venta y arriendo en distintas comunas de Chile, 2 de ellas como borrador sin publicar. Puede ejecutarse varias veces sin duplicar datos.

### pgAdmin

pgAdmin corre en el contenedor `pgadmin` en http://localhost:5050, conectado al contenedor `postgres` mediante la red Docker `portal-inmobiliario`. El servidor "Portal Inmobiliario" aparece ya registrado (`docker/pgadmin/servers.json`). Las credenciales de acceso están en `.env.pgadmin`, que git ignora (plantilla en `.env.pgadmin.example`).

```bash
docker network create portal-inmobiliario
docker network connect portal-inmobiliario postgres
docker run -d --name pgadmin --restart always --network portal-inmobiliario \
  -p 127.0.0.1:5050:80 --env-file .env.pgadmin \
  -e PGADMIN_SERVER_JSON_FILE=/pgadmin4/servers.json \
  -v pgadmin-data:/var/lib/pgadmin \
  -v "$(pwd)/docker/pgadmin/servers.json:/pgadmin4/servers.json:ro" \
  dpage/pgadmin4:9.19.0
```

## Documentos

### `CLAUDE.md`

Contiene las instrucciones permanentes que Claude Code debe seguir durante el desarrollo.

### `spec.md`

Define **qué debe hacer la aplicación**: funcionalidades, usuarios, propiedades, filtros, imágenes, ubicación, contacto, administración y criterios de aceptación.

### `plan.md`

Define **cómo se construirá técnicamente**: arquitectura, PostgreSQL, API REST, autenticación, Cloudinary, Google Maps, Web3Forms y separación de responsabilidades.

### `tasks.md`

Divide la implementación en una secuencia incremental de tareas.

## Comenzar con Claude Code

Abre Claude Code desde la raíz del repositorio y utiliza:

```text
Lee CLAUDE.md y todos los documentos del directorio
specs/portal-inmobiliario/.

Analiza la especificación, el plan técnico y la lista de tareas.

Comienza únicamente con la primera tarea pendiente de tasks.md.
No avances a la siguiente tarea hasta que te lo indique.
```

Para continuar posteriormente:

```text
Continúa con la siguiente tarea pendiente de tasks.md.

Consulta spec.md y plan.md cuando sea necesario.
Implementa únicamente esa tarea, valida los cambios y márcala
como completada cuando esté correctamente terminada.

No avances a la siguiente tarea.
```
