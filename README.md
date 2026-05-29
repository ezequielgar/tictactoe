# TicTacToe Hub

Plataforma web de gestión de campeonatos y estadísticas para comunidades de jugadores.

**URL:** [tictactoe.lechugasweb.com.ar](https://tictactoe.lechugasweb.com.ar)

---

## Módulos

| Módulo | Descripción |
|--------|-------------|
| **FIFA Manager** | Torneos, partidos 1v1 y 2v2, estadísticas individuales y de equipo, head-to-head |
| **Prode Mundial 2026** | Predicciones para el Mundial FIFA 2026 con sistema de puntuación y ranking |

El acceso requiere autenticación con Google. El administrador aprueba los nuevos usuarios.

---

## Stack

### Frontend
- **React 18** + **Vite 5** — SPA con build rápido
- **TypeScript** — tipado end-to-end
- **Tailwind CSS 3** — utility-first, mobile-first
- **React Router 6** — navegación SPA
- **TanStack Query 5** — server state, cache y refetch automático
- **Zustand 4** — estado de UI (auth, preferencias)
- **Axios** — HTTP client con interceptores
- **Recharts** — gráficos de estadísticas
- **date-fns** — manejo de fechas

### Backend
- **Node.js 20 LTS** + **Express 4**
- **TypeScript**
- **Prisma ORM 5** — migraciones y tipado desde el schema
- **PostgreSQL 16** — base de datos relacional
- **Passport.js** — estrategia Google OAuth 2.0
- **JWT** (access 15min + refresh 7 días) en httpOnly cookies
- **Zod** — validación de entrada
- **Winston** — logging estructurado

### DevOps
- **Docker** + **Docker Compose** — contenedores locales y producción
- **Nginx** — reverse proxy, SSL termination, archivos estáticos
- **pnpm** — gestor de paquetes
- **Let's Encrypt / Certbot** — SSL automático

---

## Arquitectura

```
Browser → Nginx (SSL) → Frontend (React / puerto 3000)
                      → Backend API (Express / puerto 4000)
                                   → PostgreSQL (puerto 5432)
```

Todos los servicios corren en contenedores Docker dentro de una red interna (`ttt_network`). En producción Nginx hace SSL termination y proxy inverso.

---

## Requisitos previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)
- Credenciales de Google OAuth ([console.cloud.google.com](https://console.cloud.google.com))

---

## Levantar en local

```bash
# 1. Clonar el repo
git clone <repo-url>
cd tictactoe-hub

# 2. Copiar y completar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 3. Levantar todos los servicios
docker compose up -d

# 4. Ejecutar migraciones (primera vez)
docker exec ttt_backend pnpm prisma migrate dev
docker exec ttt_backend pnpm prisma db seed
```

Frontend disponible en `http://localhost:3000`  
API disponible en `http://localhost:4000`

---

## Estructura del proyecto

```
tictactoe-hub/
├── docker-compose.yml          # Desarrollo local
├── docker-compose.prod.yml     # Producción
├── .env.example
├── nginx/
│   ├── nginx.conf              # Producción
│   └── nginx.dev.conf          # Desarrollo
├── frontend/
│   └── src/
│       ├── components/         # UI, layout, shared
│       ├── modules/
│       │   ├── auth/
│       │   ├── admin/
│       │   ├── fifa/
│       │   └── prode/
│       ├── store/              # Zustand
│       ├── services/           # Axios (llamadas API)
│       └── hooks/
└── backend/
    ├── prisma/
    │   ├── schema.prisma
    │   └── seed.ts
    └── src/
        ├── modules/
        │   ├── auth/
        │   ├── users/
        │   ├── fifa/
        │   └── prode/
        └── middleware/
```

---

## Roles de usuario

| Rol | Acceso |
|-----|--------|
| `PENDING` | Pantalla de espera (requiere aprobación del admin) |
| `PLAYER` | Torneos, estadísticas, predicciones |
| `ADMIN` | Todo lo anterior + crear torneos, aprobar usuarios, cargar resultados |

> El primer usuario debe ser promovido a ADMIN directamente en la DB tras el primer deploy.

---

## Roadmap

- **Fase 1** — MVP: auth, FIFA 1v1, estadísticas básicas, deploy en VPS
- **Fase 2** — FIFA 2v2, liga y copa con brackets, gráficos
- **Fase 3** — Módulo Prode Mundial 2026
- **Fase 4** — CI/CD, backups automáticos, tests, monitoring
