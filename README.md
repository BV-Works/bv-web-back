# BV Backend API

Backend API para la plataforma BV, construida con Node.js, Express y Sequelize.

Este backend implementa una arquitectura REST estructurada con contratos tipados, manejo centralizado de errores y un diseño orientado a escalabilidad.

---

## 🧱 Arquitectura General

El backend sigue una arquitectura en capas:

- **Routes** → Definición de endpoints
- **Controllers** → Lógica de entrada/salida HTTP
- **Services** → Lógica de negocio
- **Models (Sequelize)** → Acceso a base de datos
- **Validators (express-validator)** → Validación de requests
- **Middlewares** → Auth, roles, ownership, error handling

---

## 📦 Convención de Respuestas API

Todas las respuestas siguen un contrato unificado:

### ✔️ Success

{
status: "success",
data: T,
message?: string
}

### ✔️ Paginated Success

{
status: "success",
data: T[],
meta: {
total: number,
page: number,
limit: number,
totalPages: number
}
}

### ❌ Error

{
status: "error",
message: string,
code?: string
}

---

## 🔐 Autenticación y Autorización

JWT Authentication (authenticateJWT)
Role-based access control (authorizeRoles)
Ownership validation (checkProfileOwnership, checkLinkOwnership)

### Roles disponibles:

ADMIN
TEAM
ARTIST
CUSTOMER
👤 Módulo Auth

### Endpoints:

POST /auth/login
POST /auth/logout
GET /auth/me
PUT /auth/change-password
POST /auth/forgot-password
POST /auth/reset-password

## 👥 Módulo Users

### Endpoints:

GET /users
GET /users/:id
POST /users
PUT /users/:id
DELETE /users/:id

Notas:

Listado paginado (PaginatedResponse)
Roles gestionados por ADMIN

## 🧑‍🎤 Módulo Profiles

### Endpoints Públicos

GET /profiles
GET /profiles/public/:slug
Privados
GET /profiles/me
GET /profiles/:id (ADMIN)
GET /profiles/user/:userId (ADMIN o owner)

### Endpoints CRUD

POST /profiles (ADMIN)
PUT /profiles/:id (ADMIN o owner)
DELETE /profiles/:id

## 🔗 Links (subrecurso de Profile)

Los links pertenecen a un profile.

### Endpoints

GET /profiles/:id/links
POST /profiles/:id/links
PUT /profiles/:id/links/:linkId
DELETE /profiles/:id/links/:linkId
Ordenación
El backend ordena automáticamente por position ASC
Reordenación se realiza actualizando position en cada link
order: [['position', 'ASC']]

## 🧾 Validación

Se usa express-validator para validar:

Params (id, slug, linkId)
Query params (page, limit, type, etc.)
Body payloads (create/update profile & links)

## ⚠️ Error Handling

Todos los errores siguen el formato:

class ApiError {
status: "error";
message: string;
code?: string;
}

El frontend utiliza este contrato para mapear errores sin lógica duplicada.

## 🧠 Decisiones de Diseño Importantes

1. Links NO se crean con ID en frontend
   El backend genera todos los IDs
   El frontend solo envía payloads
2. Profiles edit mode (V0 pattern)
   Edición local (optimistic UI)
   Guardado final con saveChanges()
3. Reordenación de links
   Se basa en position
   No existe endpoint específico de bulk reorder (por ahora)
   Se actualiza mediante múltiples PUT /links/:id

## 📊 Paginación

Todos los endpoints de listados usan:

PaginatedResponse<T>

Incluye metadata:

total
page
limit
totalPages

## 🔒 Ownership Rules

Usuarios solo pueden editar sus propios perfiles
Admin puede acceder a todo
Links heredan ownership del profile

## 🚀 Stack

Node.js
Express
Sequelize
JWT
express-validator
MySQL / PostgreSQL (según config)

## 🧭 Estado del Proyecto

Auth → Completo
Users → Completo
Profiles → En evolución
Links → CRUD básico + ordenación por posición
Frontend integration → MVP Desplegado en https://bajovigilancia.com (bv-web-front: https://github.com/BV-Works/bv-web-front/tree/development)

## 🧠 Filosofía del sistema

Contratos estrictos API-first
Frontend desacoplado del backend
Error handling centralizado
Evolución incremental (MVP → scalable system)

## 📌 Próximos pasos (roadmap backend)

Bulk reorder links (optimización)
Profile media management (avatar uploads)
Cloudinary para subir imágenes
Resend/Node mailer para envío de correos
Rate limiting auth
Caching de perfiles públicos
Webhooks o events internos (futuro)

<!-- 2. 🧪 RESET LIMPIO DE BASE DE DATOS (RECOMENDADO)

Para evitar basura previa:

docker compose down -v
docker compose up -d

Verifica:

docker ps

LOCAL: npm run dev-docker
o si quieres tirar de supabase: npm run dev-bbdd
-->

```

```
