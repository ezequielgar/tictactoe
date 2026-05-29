# 📋 TicTacToe Hub — Task Tracker

> Registro de tareas completadas y pendientes por fase.
> Actualizar este archivo cada vez que se completa o se inicia una tarea.

---

## ✅ Completado

### 🐳 Setup Docker / Infraestructura
- [x] Inicializar estructura del proyecto (`backend/`, `frontend/`, `nginx/`, `docker-compose.yml`)
- [x] Crear `.dockerignore` en backend y frontend (evitar copiar `node_modules` en build)
- [x] Migrar Dockerfiles de `node:20` → `node:22-alpine` (requerido por pnpm 11)
- [x] Migrar de `pnpm@10` → `pnpm@11`
- [x] Configurar `pnpm-workspace.yaml` con `minimumReleaseAge: 0` (supply chain policy de pnpm 11)
- [x] Configurar `allowBuilds` en `pnpm-workspace.yaml` para `@prisma/engines`, `prisma`, `esbuild`
- [x] Migrar Prisma 5 → Prisma 7 (eliminar `url` del `datasource`, crear `prisma.config.ts`)
- [x] Agregar driver adapter `@prisma/adapter-pg` + `pg` (requerido por Prisma 7)
- [x] `docker compose up -d --build` funciona ✅ — los 3 contenedores levantan correctamente

### 🗄️ Base de Datos
- [x] Definir schema Prisma completo (Users, Tournaments, Teams, Matches, Stats, Prode)
- [x] Crear tablas en DB con `prisma db push` (entorno de desarrollo)

### 🔐 Autenticación
- [x] Google OAuth 2.0 con Passport.js funcional
- [x] Roles implementados: `PENDING`, `PLAYER`, `ADMIN`
- [x] Flujo completo: login → creación de usuario → pantalla "Pendiente de aprobación"
- [x] Primer usuario promovido a ADMIN manualmente vía DB

### 📦 Repositorio
- [x] Inicializar repo Git
- [x] Subir código inicial a GitHub (`https://github.com/ezequielgar/tictactoe.git`)

### ⚽ FIFA — Gestión de Torneos y Partidos
- [x] Form **crear torneo** (Admin) — `/tournaments/new` con nombre, tipo, formato, fechas
- [x] Cambio de estado del torneo (Admin) — DRAFT → OPEN → IN_PROGRESS → FINISHED
- [x] **Inscribirse a torneo** (Player) — botón en detalle del torneo cuando status es OPEN
- [x] Mostrar estado de inscripción del usuario (Pendiente / Inscripto / Rechazado)
- [x] **Aprobar/rechazar inscripciones** (Admin) — panel dentro del detalle del torneo (status OPEN)
- [x] Form **cargar partido** (Admin) — modal en detalle, selecciona 2 jugadores inscriptos
- [x] Form **cargar resultado** (Admin) — modal por partido SCHEDULED, carga goles y determina ganador
- [x] Ranking del torneo — se actualiza automáticamente al cargar resultados

---

## 🚧 En Progreso

_(nada en este momento)_

---

## 📌 Pendiente — Fase 1 (MVP Local)

### Admin
- [ ] Dashboard admin: usuarios activos, torneos activos, últimos partidos
- [ ] Migrar a `prisma migrate dev` con historial de migraciones formal (actualmente usamos `db push`)

### FIFA — Backend
- [ ] CRUD de torneos (editar torneo existente — nombre, descripción, fechas)
- [ ] Soporte Head to Head: listar todos los jugadores activos para selector

### FIFA — Frontend
- [ ] Layout base: Sidebar mejorado, Footer (mobile first)
- [ ] Perfil de jugador con estadísticas individuales
- [ ] Comparador 1v1 mejorado (head to head con historial visual)
- [ ] Pantalla de aprobación de jugadores mejorada (con contadores y filtros)

### Deploy
- [ ] Configurar DNS: registro A `tictactoe.lechugasweb.com.ar` → IP VPS
- [ ] Obtener certificado SSL con Certbot en VPS
- [ ] Subir archivos a VPS con FileZilla
- [ ] Levantar con `docker-compose.prod.yml` en VPS
- [ ] Correr `prisma migrate deploy` en producción

---

## 📌 Pendiente — Fase 2 (Expansión FIFA)

- [ ] Soporte 2v2: equipos, estadísticas de equipo
- [ ] Tipos de torneo: Liga (todos contra todos) y Copa (eliminación directa con brackets)
- [ ] Comparador avanzado (equipos dinámicos 2v2)
- [ ] Gráficos con Recharts (evolución de estadísticas, historial)
- [ ] Notificaciones in-app (nuevo partido cargado, resultados)

---

## 📌 Pendiente — Fase 3 (Módulo Prode)

- [ ] Seed de partidos del Mundial 2026 (`prisma/seed.ts`)
- [ ] Sistema de predicciones por partido (score + ganador)
- [ ] Eventos bonus configurables por partido
- [ ] Cálculo automático de puntos al cargar resultado
- [ ] Ranking en tiempo real del prode
- [ ] Vista admin: cargar resultados oficiales de partidos del Mundial

---

## 📌 Pendiente — Fase 4 (DevOps)

- [ ] CI/CD con GitHub Actions (auto-deploy en push a `main`)
- [ ] Backups automáticos de PostgreSQL en VPS
- [ ] Tests: Vitest (frontend) + Jest/Vitest (backend)
- [ ] Rate limiting avanzado
- [ ] Monitoring y logs centralizados

---

## 📝 Notas Técnicas

- **Primer ADMIN:** el primer usuario que se registra queda como `PENDING`. Promoverlo manualmente:
  ```sql
  UPDATE users SET role = 'ADMIN' WHERE email = 'tu@email.com';
  ```
  O desde el contenedor:
  ```bash
  docker exec ttt_postgres psql -U ttt_user -d tictactoe_db -c "UPDATE users SET role = 'ADMIN' WHERE email = 'tu@email.com';"
  ```

- **Crear tablas en desarrollo:** `docker exec ttt_backend sh -c "node_modules/.bin/prisma db push"`

- **Ver logs del backend:** `docker logs ttt_backend -f`

- **Reiniciar stack:** `docker compose down && docker compose up -d`
