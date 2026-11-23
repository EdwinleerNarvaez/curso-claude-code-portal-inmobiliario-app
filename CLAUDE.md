# CLAUDE.md

## Instrucciones del proyecto

Este proyecto utiliza **Spec-Driven Development (SDD)**.

Antes de implementar cualquier funcionalidad, lee:

- `specs/portal-inmobiliario/spec.md`
- `specs/portal-inmobiliario/plan.md`
- `specs/portal-inmobiliario/tasks.md`

La especificación es la fuente de verdad del proyecto.

## Flujo de desarrollo

1. Lee la especificación y el plan técnico.
2. Revisa `tasks.md`.
3. Identifica la primera tarea pendiente.
4. Implementa únicamente esa tarea.
5. Ejecuta las validaciones y pruebas necesarias.
6. Corrige los errores antes de continuar.
7. Marca la tarea como completada en `tasks.md`.
8. No implementes tareas futuras salvo que el usuario lo solicite explícitamente.

## Reglas de arquitectura

- Utiliza Next.js (version más reciente disponible) + React + TypeScript.
- Utiliza PostgreSQL como única base de datos de la aplicación.
- Utiliza API REST mediante Route Handlers de Next.js.
- No utilices Server Actions.
- Los componentes del frontend no deben acceder directamente a la base de datos.
- Mantén separadas las responsabilidades de API, lógica de negocio y persistencia.
- Utiliza Cloudinary para las imágenes de las propiedades.
- Utiliza Google Maps para mostrar la ubicación de las propiedades.
- Utiliza Web3Forms para el formulario de contacto.
- No expongas secretos al navegador.
- Utiliza variables de entorno para credenciales y claves.

## Estructura del monorepo (plan.md, sección 4)

- npm workspaces + Turborepo.
- `apps/web` (`@portal/web`, puerto 3000): frontend Next.js. Páginas, componentes, hooks y cliente REST. Sin acceso a base de datos ni secretos.
- `apps/api` (`@portal/api`, puerto 3001): backend Next.js. Solo Route Handlers en `/api/**`, servicios, repositorios, Prisma e integraciones con secretos. Sin páginas de interfaz.
- `packages/shared` (`@portal/shared`): tipos de dominio y esquemas Zod. Sin dependencias de Next.js, React, Prisma ni variables de entorno. Se importa como `@portal/shared/types/...` y `@portal/shared/schemas/...`.
- `apps/web` y `apps/api` nunca se importan entre sí.
- El navegador llama a `/api/...` en el dominio del frontend; `apps/web` lo reenvía a `apps/api` con `rewrites` usando `API_URL`.
- Cada aplicación tiene su propio `.env.local` y `.env.example`.
- Instala dependencias en el workspace que las usa: `npm install <paquete> -w @portal/web`.

## Reglas de implementación

- Analiza el código existente antes de modificarlo.
- Prefiere cambios pequeños e incrementales.
- No agregues funcionalidades fuera de la tarea actual.
- Mantén TypeScript estricto y evita `any` salvo que sea realmente necesario.
- Valida los datos recibidos por el backend.
- Protege los recursos USER y ADMIN también en el backend.
- Utiliza respuestas REST y códigos HTTP consistentes.
- Mantén la aplicación responsive.
- Respeta la arquitectura existente.

## Regla de finalización

Una tarea solo está terminada cuando:

- su implementación está completa;
- el proyecto compila correctamente;
- las pruebas o validaciones correspondientes pasan;
- no quedan errores bloqueantes conocidos;
- la casilla correspondiente de `tasks.md` está marcada como completada.

## Protocolo SDD (ESTRICTO)
1. ANTES de modificar o crear cualquier código fuente, DEBES leer `specs/portal-inmobiliario/spec.md`.
2. No escribas código sin un plan aprobado en `specs/portal-inmobiliario/plan.md`.
3. Sigue tu progreso línea por línea en `specs/portal-inmobiliario/tasks.md`. Marca las tareas como [x] solo después de que las pruebas (tests) hayan pasado con éxito.

## Comandos de Construcción y Pruebas
Desde la raíz (Turborepo los ejecuta en todos los workspaces):

- Instalar dependencias: `npm install`
- Ejecutar pruebas: `npm test`
- Ejecutar linter: `npm run lint`
- Servidor de desarrollo (web en 3000 y api en 3001): `npm run dev`
- Verificar tipos: `npm run typecheck`
- Compilar: `npm run build`
- Un solo workspace: `npm test -w @portal/web` (o `@portal/api`, `@portal/shared`)

Base de datos (se delegan a `apps/api`):

- Validar conexión a PostgreSQL: `npm run db:check`
- Crear y aplicar migraciones: `npm run db:migrate -- --name nombre_descriptivo`
- Estado de migraciones: `npm run db:migrate:status`
- Cargar datos de desarrollo: `npm run db:seed`

## Estilo de Código y Arquitectura
- Seguir los principios de Arquitectura Limpia (Clean Architecture).
- Usar nombres de variables explícitos. No usar abreviaturas.
- Cada nueva funcionalidad debe tener su prueba unitaria correspondiente.

## Available Skills

| Skill | Path | Description |
|---|---|---|
| `react-rules` | `.claude/skills/react-rules/SKILL.md` | Estándares de desarrollo y reglas de arquitectura para proyectos y componentes de React con TypeScript, Tailwind CSS, Zustand, Zod, React Hook Form y React Query / SWR. |
| `prisma-rules` | `.claude/skills/prisma-rules/SKILL.md` | Convenciones de persistencia con Prisma 7 y PostgreSQL: esquema, migraciones, seed, repositorios, consultas y manejo de errores. |

---

## Skill Trigger Rules

### `react-rules`
- **Activación**: Activar esta habilidad cuando el usuario pida:
  - Crear una nueva aplicación React o generar su estructura con TypeScript.
  - Crear, agregar o modificar componentes de React y maquetación con Tailwind CSS.
  - Diseñar e implementar Custom Hooks (`useAuth`, `useFetch`, etc.).
  - Gestionar estado global utilizando Zustand (`create()`).
  - Crear esquemas de validación de datos utilizando Zod (`z.object`, `z.string`, `parse`, `safeParse`).
  - Implementar formularios utilizando React Hook Form con resolver de Zod.
  - Implementar lógica de UI o fetching de APIs utilizando TanStack Query (React Query) o SWR.
  - Refactorizar código React para cumplir con principios de inmutabilidad, pureza y correcto uso de `useEffect`.

### `prisma-rules`
- **Activación**: Activar esta habilidad cuando el usuario o la tarea actual pida:
  - Crear, modificar o eliminar modelos, enums o relaciones en `prisma/schema.prisma`.
  - Crear o aplicar migraciones de base de datos.
  - Crear o modificar el seed de desarrollo.
  - Crear o modificar repositorios en `src/repositories/`.
  - Escribir consultas, filtros, ordenamientos o transacciones contra PostgreSQL.
