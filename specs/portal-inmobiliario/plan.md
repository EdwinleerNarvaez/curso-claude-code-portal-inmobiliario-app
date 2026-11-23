# Plan técnico — Portal Inmobiliario

## 1. Arquitectura

Se utilizan dos aplicaciones Next.js en un monorepo (sección 4): `apps/web` para el frontend y `apps/api` para el backend REST.

```text
apps/web (Next.js + React)
      │
    fetch("/api/...")  →  rewrites  →
      │
      ▼
apps/api: API REST /api/**
      │
      ▼
Capa de servicios
      │
      ▼
Repositorio / ORM
      │
      ▼
PostgreSQL
```

Integraciones externas:

```text
Cloudinary  → imágenes
Google Maps → ubicación
Web3Forms   → contacto
```

## 2. Tecnologías obligatorias

- Next.js
- React
- TypeScript
- PostgreSQL
- API REST con Route Handlers de Next.js
- Cloudinary
- Google Maps
- Web3Forms

## 3. Restricciones

- No utilizar Server Actions.
- No acceder a PostgreSQL directamente desde componentes React.
- No almacenar imágenes binarias en PostgreSQL.
- No exigir latitud/longitud en el formulario ADMIN.
- No implementar funcionalidades especulativas fuera de `spec.md`.

## 4. Estructura: monorepo

El proyecto es un monorepo con **npm workspaces** y **Turborepo**. Frontend y backend son dos aplicaciones Next.js independientes que comparten solo un paquete de tipos y esquemas.

```text
portal-inmobiliario/
├── apps/
│   ├── web/                 @portal/web — frontend Next.js (puerto 3000)
│   │   └── src/
│   │       ├── app/         páginas: /, /properties, /account, /admin, ...
│   │       ├── components/
│   │       ├── hooks/
│   │       └── lib/         cliente REST, formateadores, utilidades de UI
│   └── api/                 @portal/api — backend Next.js (puerto 3001)
│       ├── prisma/          esquema, migraciones y seed
│       ├── scripts/
│       └── src/
│           ├── app/api/     Route Handlers REST (/api/**)
│           ├── services/
│           ├── repositories/
│           └── lib/         respuestas HTTP, errores, integraciones
├── packages/
│   └── shared/              @portal/shared — tipos de dominio y esquemas Zod
├── docker/
├── specs/
├── package.json             workspaces y scripts raíz
└── turbo.json
```

### Reglas del monorepo

- `apps/web` nunca importa código de `apps/api`, y `apps/api` nunca importa código de `apps/web`.
- Ambas aplicaciones pueden importar `@portal/shared`.
- `@portal/shared` no depende de Next.js, React, Prisma ni de variables de entorno: solo TypeScript y Zod.
- PostgreSQL, Prisma, Cloudinary (credenciales), Web3Forms y los secretos de autenticación viven **solo** en `apps/api`.
- `apps/api` no tiene páginas de interfaz: solo expone la API REST.
- `apps/web` no accede a la base de datos ni a secretos del servidor.
- Cada aplicación tiene su propio `.env.local` y su `.env.example`.

### Comunicación entre aplicaciones

- El navegador llama siempre a `/api/...` en el mismo dominio del frontend.
- `apps/web` reenvía `/api/:path*` al backend mediante `rewrites` de Next.js, usando la variable de servidor `API_URL` (por defecto `http://localhost:3001`).
- Así no se requiere CORS y las cookies de sesión `httpOnly` (sección 10) quedan asociadas al dominio del frontend.
- Cuando un componente de servidor de `apps/web` necesite datos (por ejemplo, metadata SEO), consulta el backend directamente con `API_URL`.

### Comandos raíz

Turborepo ejecuta las tareas en todos los workspaces: `npm run dev`, `npm run build`, `npm test`, `npm run lint` y `npm run typecheck`. Los comandos de base de datos (`db:*`) se delegan a `apps/api`.

## 5. Modelo de datos

Entidades:

- User
- Property
- PropertyImage
- Feature
- Favorite
- Inquiry

Relaciones:

```text
User 1 --- * Favorite * --- 1 Property
User 1 --- * Inquiry  * --- 1 Property

Property 1 --- * PropertyImage
Property * --- * Feature
```

`Inquiry.userId` puede ser nulo para permitir consultas de visitantes.

## 6. Persistencia

PostgreSQL es la única base de datos.

Seleccionar un ORM compatible con las versiones actuales de Next.js y PostgreSQL.

Requisitos:

- migraciones;
- claves foráneas;
- restricciones de unicidad;
- índices cuando estén justificados;
- seed para desarrollo.

Restricciones importantes:

- `User.email` único;
- combinación `(userId, propertyId)` única en favoritos.

## 7. API REST

Propiedades públicas:

```text
GET /api/properties
GET /api/properties/{id}
```

Autenticación:

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

Favoritos:

```text
GET    /api/favorites
POST   /api/favorites/{propertyId}
DELETE /api/favorites/{propertyId}
```

Consultas:

```text
POST /api/inquiries
```

Administración:

```text
GET    /api/admin/properties
POST   /api/admin/properties
GET    /api/admin/properties/{id}
PUT    /api/admin/properties/{id}
DELETE /api/admin/properties/{id}
```

Crear recursos REST adicionales cuando sean necesarios para:

- imágenes;
- características;
- usuarios;
- consultas.

## 8. Responsabilidades

### Route Handlers

- recibir y analizar HTTP;
- validar entrada básica;
- invocar servicios;
- devolver respuestas HTTP.

### Servicios

- lógica de aplicación;
- reglas de negocio;
- coordinación de persistencia e integraciones.

### Repositorios / ORM

- persistencia;
- consultas a PostgreSQL;
- sin lógica de presentación.

### React

- interfaz;
- interacción;
- estado visual;
- consumo de REST;
- sin acceso directo a base de datos.

## 9. Búsqueda y filtros

`GET /api/properties` debe soportar parámetros como:

```text
search
operation
type
minPrice
maxPrice
bedrooms
bathrooms
minUsableArea
commune
city
region
sort
```

El filtrado y ordenamiento debe ejecutarse principalmente en PostgreSQL y no cargando todo el catálogo en el navegador.

## 10. Autenticación y autorización

Utilizar un mecanismo seguro compatible con la API REST.

Requisitos:

- hashing de contraseñas;
- almacenamiento seguro de sesión/token;
- autorización en servidor;
- no almacenar tokens sensibles en `localStorage`;
- usuarios inactivos no pueden autenticarse;
- endpoints ADMIN requieren ADMIN;
- endpoints privados USER requieren autenticación.

## 11. Cloudinary

Flujo:

```text
ADMIN
  │
selecciona archivo
  │
  ▼
API REST
  │
  ▼
Cloudinary
  │
 URL + publicId
  │
  ▼
PostgreSQL
```

Validar:

- tipo;
- tamaño;
- autorización.

La eliminación debe mantener sincronizados Cloudinary y PostgreSQL.

## 12. Google Maps

Construir la ubicación utilizando:

- dirección;
- comuna;
- ciudad;
- región;
- país.

No solicitar coordenadas manuales.

Si posteriormente se requiere geocodificación interna, debe ser transparente para ADMIN y no modificar los campos obligatorios del formulario.

## 13. Web3Forms

Flujo:

1. validar datos;
2. identificar propiedad;
3. identificar usuario autenticado cuando exista;
4. persistir consulta;
5. enviar mediante Web3Forms;
6. devolver una respuesta REST consistente.

Definir un comportamiento claro ante fallos para evitar perder silenciosamente una consulta.

## 14. Errores

Utilizar códigos HTTP apropiados:

- 400
- 401
- 403
- 404
- 409
- 500

Formato recomendado:

```json
{
  "message": "Propiedad no encontrada",
  "status": 404
}
```

No exponer stack traces internos.

## 15. Variables de entorno

Utilizar variables de entorno para:

- conexión PostgreSQL;
- secretos de autenticación;
- credenciales Cloudinary;
- configuración Google Maps;
- clave Web3Forms.

Crear `.env.example` sin secretos reales en cada aplicación:

- `apps/api/.env.example`: PostgreSQL, autenticación, Cloudinary y Web3Forms.
- `apps/web/.env.example`: `API_URL` (servidor) y configuración pública de Google Maps (`NEXT_PUBLIC_*`).

## 16. Validación

Como mínimo validar:

- build;
- migraciones;
- endpoints REST;
- autenticación;
- autorización;
- filtros;
- favoritos;
- consultas;
- subida/eliminación Cloudinary;
- CRUD ADMIN;
- comportamiento responsive.

## 17. Definición de terminado

Una tarea está terminada cuando:

- cumple `spec.md`;
- respeta este plan;
- el build pasa;
- las validaciones correspondientes pasan;
- no quedan errores bloqueantes;
- su checkbox se actualiza en `tasks.md`.
