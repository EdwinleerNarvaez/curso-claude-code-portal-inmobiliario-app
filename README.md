# Portal Inmobiliario — SDD

Proyecto base para desarrollar un portal inmobiliario utilizando **Spec-Driven Development (SDD)** con Claude Code.

## Estructura

```text
.
├── CLAUDE.md
└── specs/
    └── portal-inmobiliario/
        ├── spec.md
        ├── plan.md
        └── tasks.md
```

## Entorno local

### Base de datos

- PostgreSQL 16 corre en el contenedor Docker `postgres`, publicado en el puerto **5433** (el 5432 lo usa un PostgreSQL nativo de Windows).
- La aplicación usa la base `portal_inmobiliario` con el usuario `portal_inmobiliario`.
- ORM: Prisma 7 con el adaptador `@prisma/adapter-pg`. El esquema está en `prisma/schema.prisma` y la configuración en `prisma.config.ts`.

```bash
cp .env.example .env.local   # completar DATABASE_URL y el resto de variables
npm install                  # también genera el cliente de Prisma
npm run db:check             # valida la conexión a PostgreSQL
npm run db:migrate           # crea y aplica migraciones en desarrollo
npm run db:migrate:status    # muestra el estado de las migraciones
npm run db:seed              # carga datos de desarrollo (idempotente)
```

El seed (`prisma/seed.ts`) crea 13 características y 20 propiedades de venta y arriendo en distintas comunas de Chile, 2 de ellas como borrador sin publicar. Puede ejecutarse varias veces sin duplicar datos.

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
