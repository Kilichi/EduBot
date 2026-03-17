# EduBot Web (Next.js + TypeScript)

Aplicación unificada que reemplaza el frontend Vite y el backend Express en un solo proyecto Next.js (App Router) con API Routes.

## Requisitos

- Node.js 20+
- Variables de entorno configuradas en `web/.env.local`

## Variables de entorno

Toma como base `web/.env.local.example` y crea `web/.env.local`:

```bash
MONGODB_URI=tu_uri_mongodb_atlas
JWT_SECRET=tu_secreto_jwt_largo_y_seguro
GEMINI_API_KEY=tu_api_key_de_gemini
GEMINI_MODEL=gemini-2.0-flash
```

## Desarrollo

```bash
cd web
npm install
npm run dev
```

Abrir: [http://localhost:3000](http://localhost:3000)

## Rutas principales

- UI:
  - `/login`
  - `/registro`
  - `/dashboard`
  - `/create-agreement`
- API:
  - `/api/auth/login`
  - `/api/auth/register`
  - `/api/auth/status`
  - `/api/auth/me`
  - `/api/auth/logout`
  - `/api/chat/consulta`
  - `/api/chat/registro/preview`
  - `/api/chat/registro/confirm`

## Estado de migración

- La app nueva ya está operativa en `web/`.
- Las carpetas antiguas `frontend/` y `backend/` se mantienen como fallback temporal.
