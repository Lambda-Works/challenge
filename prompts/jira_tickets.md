# 🎫 Jira Tickets - Contact Manager / UI Update Sprint

**Proyecto:** CM (Contact Manager)  
**Sprint:** Sprint 1 - UI Update  
**Epic:** CM-100 - UI Update  
**Team Lead:** Nicolas  
**Fecha de creación:** 23 de Abril, 2026

---

## 📌 Epic — CM-100

```
Ticket: CM-100
Título: [EPIC] UI Update - Nuevas funcionalidades de interfaz

Tipo: Epic
Prioridad: Alta
Sprint: Sprint 1

Descripción:
  Epic que agrupa las 4 Stories del sprint UI Update.
  El trabajo se organiza en dos ramas compartidas que luego mergean a main.

Stories incluidas:
  CM-101 — OAuth Google + Firebase       → Dev 1
  CM-102 — Panel de Admin + Rutas        → Dev 2
  CM-103 — Paginación + Loading          → Dev 3
  CM-104 — Filtros + Favoritos           → Dev 4

Flujo de branches:
                          ┌── feature/CM-101-oauth-google     (Dev 1)
  branch/auth-admin ──────┤
                          └── feature/CM-102-admin-panel      (Dev 2)
  main ───────────────────┤
                          ┌── feature/CM-103-pagination       (Dev 3)
  branch/ui-features ─────┤
                          └── feature/CM-104-filters-favs     (Dev 4)

  branch/auth-admin  → main
  branch/ui-features → main
```

---

## 🧩 Story — CM-101 — OAuth Google + Firebase

```
Ticket: CM-101
Título: Como usuario, quiero iniciar sesión con Google para acceder a la app

Tipo: Story
Prioridad: Alta
Asignado a: Dev 1
Branch: feature/CM-101-oauth-google  (desde branch/auth-admin)
Estado: TODO
Epic: CM-100

Criterios de aceptación:
  - [ ] Botón "Continuar con Google" en la página de login
  - [ ] Autenticación exitosa guarda el token de Firebase
  - [ ] El backend valida el token en cada request
  - [ ] Si el usuario no existe en la DB, se crea automáticamente
  - [ ] El usuario puede cerrar sesión (logout limpia el token)
  - [ ] Botón de logout visible en el header para cualquier usuario autenticado

Dependencias:
  - CM-102 depende de este ticket
```

### Tasks de CM-101

```
CM-101-T1: Crear proyecto en Firebase Console y obtener credenciales
CM-101-T2: Instalar y configurar Firebase SDK en el frontend
CM-101-T3: Implementar botón "Continuar con Google" en LoginForm
CM-101-T4: Crear endpoint backend para verificar token de Firebase
CM-101-T5: Crear/actualizar usuario en DB al primer login
CM-101-T6: Implementar función de logout en useAuth + botón en el header
```

---

## 🧩 Story — CM-102 — Panel de Admin + Rutas Protegidas

```
Ticket: CM-102
Título: Como admin, quiero un panel de control y rutas protegidas para gestionar usuarios

Tipo: Story
Prioridad: Alta
Asignado a: Dev 2
Branch: feature/CM-102-admin-panel  (desde branch/auth-admin)
Estado: TODO
Epic: CM-100

Criterios de aceptación:
  - [ ] Rutas protegidas redirigen a /login si no hay sesión
  - [ ] Ruta /admin accesible solo para rol admin (403 si no)
  - [ ] El panel muestra la lista de usuarios registrados

Dependencias:
  - Requiere CM-101 completado (auth + token)
```

### Tasks de CM-102

```
CM-102-T1: Crear middleware/guard de rutas protegidas en el frontend
CM-102-T2: Implementar redirección a /login si no hay sesión activa
CM-102-T3: Crear página /admin con tabla de usuarios
CM-102-T4: Endpoint backend GET /api/admin/users (solo rol admin)
CM-102-T5: Endpoint backend DELETE /api/admin/users/:id
CM-102-T6: Agregar campo "role" al modelo User en Prisma
```

---

## 🧩 Story — CM-103 — Paginación + Loading ✅

```
Ticket: CM-103
Título: Como usuario, quiero ver estados de carga claros y navegar por páginas numeradas

Tipo: Story
Prioridad: Media
Asignado a: Dev 3
Branch: feature/CM-103-pagination  (desde branch/ui-features)
Estado: IN REVIEW ✅
Epic: CM-100

Criterios de aceptación:
  - [x] Carga inicial: spinner + "Cargando contactos..."
  - [x] Búsqueda activa: spinner + "Buscando usuarios..."
  - [x] Al limpiar búsqueda, recarga todos los contactos
  - [x] Números de página clickeables con elipsis inteligente
  - [x] Al buscar, la paginación vuelve a página 1 instantáneamente

Archivos modificados:
  - frontend/src/hooks/useContacts.ts
  - frontend/src/components/ContactTable/ContactTable.tsx
  - frontend/src/app/page.tsx

Nota: Ver cambios.md para detalle de conflictos con CM-104.
```

### Tasks de CM-103

```
CM-103-T1: Fix bug debounce (limpiar búsqueda no recargaba)          ✅
CM-103-T2: Separar isLoading e isSearching en useContacts.ts          ✅
CM-103-T3: Agregar spinner animado CSS en ContactTable.tsx             ✅
CM-103-T4: Fix reset instantáneo de página al buscar                  ✅
CM-103-T5: Optimización doble fetch con useRef                         ✅
CM-103-T6: Implementar números de página con elipsis inteligente       ✅
```

---

## 🧩 Story — CM-104 — Filtros + Favoritos

```
Ticket: CM-104
Título: Como usuario, quiero filtrar contactos y marcar favoritos para acceder rápido

Tipo: Story
Prioridad: Media
Asignado a: Dev 4
Branch: feature/CM-104-filters-favs  (desde branch/ui-features)
Estado: TODO
Epic: CM-100

Criterios de aceptación:
  - [ ] Filtro "Favoritos" muestra solo contactos marcados
  - [ ] Botón/ícono para marcar/desmarcar favorito en cada fila
  - [ ] El estado de favorito persiste al recargar
  - [ ] Filtros y búsqueda funcionan en conjunto
  - [ ] Los filtros resetean la paginación a página 1

Dependencias:
  - Coordinarse con Dev 3 (CM-103): useContacts.ts y page.tsx fueron modificados.
    → Revisar cambios.md antes de tocar esos archivos.
```

### Tasks de CM-104

```
CM-104-T1: Decidir persistencia de favoritos (localStorage vs DB)
CM-104-T2: Agregar campo "isFavorite" al modelo Contact (si es en DB)
CM-104-T3: Crear UI de filtros (chips/tabs) sobre la tabla
CM-104-T4: Agregar ícono de favorito ⭐ en cada fila de la tabla
CM-104-T5: Implementar lógica de favoritos en useContacts.ts
CM-104-T6: Endpoint backend PATCH /api/contacts/:id/favorite (si DB)
```

---

## 📊 Tablero Kanban del Sprint

```
TODO              IN PROGRESS       IN REVIEW         DONE
────────────      ───────────────   ───────────────   ──────────
CM-101            -                 CM-103 ✅          -
CM-102
CM-104
```

---

## 💬 Convención de commits

```bash
# Tasks
git commit -m "CM-101-T3: Agregar botón login con Google"
git commit -m "CM-102-T1: Implementar guard de rutas protegidas"
git commit -m "CM-103-T1: Fix bug debounce al limpiar búsqueda"
git commit -m "CM-104-T3: Crear UI de filtros sobre la tabla"

# Merge a rama compartida
git commit -m "merge: CM-103 → branch/ui-features"

# Merge a main
git commit -m "merge: branch/ui-features → main"
```
# Se hicieron 4 storys grandes. La proxima vez dividir en subtasks.

