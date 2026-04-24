# 🎫 Jira Tickets - Contact Manager / UI Update Sprint

**Proyecto:** CM (Contact Manager)  
**Sprint:** Sprint 1 - UI Update  
**Epic:** CM-100 - UI Update (branch `ui-update`)  
**Team Lead:** Nicolas  
**Fecha de creación:** 23 de Abril, 2026

---

## 📌 Epic Principal

```
Ticket: CM-100
Título: [EPIC] UI Update - Nuevas funcionalidades de interfaz

Tipo: Epic
Prioridad: Alta
Sprint: Sprint 1
Etiquetas: epic, ui, frontend, backend

Descripción:
  Epic que agrupa las 4 features del sprint UI Update.
  Cada feature tiene su propia branch individual que se mergea
  a la branch ui-update antes de ir a main.

Flujo de branches:
  feature/CM-101-oauth-google  ─┐
  feature/CM-102-admin-panel   ─┤→ ui-update → main
  feature/CM-103-pagination    ─┤
  feature/CM-104-filters-favs  ─┘

Notas de dependencias:
  - CM-101 y CM-102 deben mergearse juntos (auth + rutas protegidas)
  - CM-103 y CM-104 pueden mergearse independientemente entre sí
  - CM-103 + CM-104 no funcionarán completamente hasta el merge a ui-update
```

---

## 🎫 CM-101 — OAuth Google + Firebase

```
Ticket: CM-101
Título: Implementar autenticación con Google OAuth via Firebase

Tipo: Feature
Prioridad: Alta
Asignado a: Dev 1
Sprint: Sprint 1
Etiquetas: authentication, oauth, firebase, frontend, backend
Branch: feature/CM-101-oauth-google
Estado: TODO

Descripción:
  Como usuario, quiero poder iniciar sesión con mi cuenta de Google
  para acceder a la aplicación sin crear credenciales nuevas.
  Se usará Firebase Authentication como proveedor de OAuth.

Criterios de aceptación:
  - [ ] Botón "Continuar con Google" visible en la página de login
  - [ ] Al hacer clic, se abre el popup/redirect de Google OAuth
  - [ ] Tras autenticación exitosa, el usuario queda registrado en Firebase
  - [ ] El token de Firebase se almacena de forma segura (localStorage o cookie)
  - [ ] El backend valida el token de Firebase en cada request
  - [ ] Si el usuario no existe en la DB, se crea automáticamente
  - [ ] Si el usuario ya existe, hace login directamente
  - [ ] Manejo de errores: cuenta cancelada, popup bloqueado, red caída
  - [ ] El usuario puede cerrar sesión (logout limpia el token)

Subtareas:
  - [ ] CM-101a: Crear proyecto en Firebase Console y obtener credenciales
  - [ ] CM-101b: Instalar y configurar Firebase SDK en el frontend
  - [ ] CM-101c: Implementar botón "Continuar con Google" (LoginForm)
  - [ ] CM-101d: Crear endpoint backend para verificar token de Firebase
  - [ ] CM-101e: Crear/actualizar usuario en DB al primer login
  - [ ] CM-101f: Agregar variables de entorno de Firebase a .env.local y .env.example
  - [ ] CM-101g: Testear flujo completo (login, logout, re-login)

Dependencias:
  - CM-102 depende de este ticket (necesita saber si hay usuario autenticado)

Archivos que probablemente modifica:
  - frontend/src/components/LoginForm/LoginForm.tsx
  - frontend/src/hooks/useAuth.ts
  - frontend/src/services/api.ts (agregar token a headers)
  - backend/src/auth/auth.controller.ts
  - backend/src/auth/auth.service.ts
  - .env.local / .env.example

Riesgos de merge:
  - api.ts: Dev 4 también podría tocarlo para filtros
  - useAuth.ts: coordinarse con Dev 2 (Admin Panel)
```

---

## 🎫 CM-102 — User Admin + Panel + Ruta Protegida

```
Ticket: CM-102
Título: Implementar panel de administración y protección de rutas

Tipo: Feature
Prioridad: Alta
Asignado a: Dev 2
Sprint: Sprint 1
Etiquetas: admin, auth, protected-routes, frontend, backend
Branch: feature/CM-102-admin-panel
Estado: TODO

Descripción:
  Como administrador, quiero acceder a un panel de control donde
  pueda gestionar usuarios. Las rutas de la app deben estar
  protegidas y redirigir al login si no hay sesión activa.

Criterios de aceptación:
  - [ ] La ruta "/" (página principal) redirige a "/login" si no hay sesión
  - [ ] Después de login exitoso, redirige automáticamente a "/"
  - [ ] Existe una ruta "/admin" accesible solo para usuarios con rol admin
  - [ ] El panel de admin muestra la lista de usuarios registrados
  - [ ] El admin puede eliminar o modificar usuarios desde el panel
  - [ ] Un usuario sin rol admin que intente acceder a "/admin" recibe 403
  - [ ] El botón de logout está visible en el header cuando hay sesión activa
  - [ ] La sesión persiste al recargar la página (no se pierde el token)

Subtareas:
  - [ ] CM-102a: Crear middleware/guard de rutas protegidas en frontend
  - [ ] CM-102b: Crear página /admin con tabla de usuarios
  - [ ] CM-102c: Endpoint backend GET /api/admin/users (solo admin)
  - [ ] CM-102d: Endpoint backend DELETE /api/admin/users/:id
  - [ ] CM-102e: Agregar rol "admin" al modelo User en Prisma
  - [ ] CM-102f: Agregar botón Logout al header en page.tsx layout
  - [ ] CM-102g: Testear redirección sin sesión y con sesión

Dependencias:
  - Requiere CM-101 para saber si hay usuario autenticado y su rol

Archivos que probablemente modifica:
  - frontend/src/app/layout.tsx (protección global de rutas)
  - frontend/src/app/page.tsx (redirección si no autenticado)
  - frontend/src/app/admin/page.tsx (NUEVO)
  - frontend/src/hooks/useAuth.ts (compartido con CM-101)
  - backend/src/auth/jwt.guard.ts
  - backend/src/admin/ (módulo nuevo)
  - backend/prisma/schema.prisma (campo role en User)

Riesgos de merge:
  - layout.tsx: archivo de alto riesgo, coordinar con Dev 1
  - page.tsx: archivo compartido con Dev 3 y Dev 4
  - useAuth.ts: coordinar con Dev 1
  - schema.prisma: si Dev 1 también modifica el modelo User

Nota importante para el merge:
  CM-101 y CM-102 deben mergearse juntos o en secuencia
  (primero CM-101, luego CM-102) porque CM-102 depende del
  sistema de autenticación que implementa CM-101.
```

---

## 🎫 CM-103 — Paginación + Loading ✅

```
Ticket: CM-103
Título: Implementar paginación con números y estados de loading diferenciados

Tipo: Feature
Prioridad: Media
Asignado a: Dev 3 (Nicolas)
Sprint: Sprint 1
Etiquetas: pagination, loading, ux, frontend
Branch: feature/CM-103-pagination-loading
Estado: IN REVIEW ✅ (implementado, pendiente merge a ui-update)

Descripción:
  Como usuario, quiero ver indicadores claros de carga mientras
  la app busca contactos, y navegar entre páginas usando números
  de página en vez de solo botones Anterior/Siguiente.

Criterios de aceptación:
  - [x] Al cargar la app por primera vez: spinner + "Cargando contactos..."
  - [x] Al escribir en el buscador: spinner + "Buscando usuarios..."
  - [x] Al no encontrar resultados: "No se encontraron contactos para 'X'"
  - [x] Al limpiar la búsqueda: recarga todos los contactos correctamente
  - [x] Los números de página son clickeables (1, 2, 3...)
  - [x] La página activa se resalta visualmente (azul)
  - [x] Con muchas páginas aparece elipsis inteligente: [1] … [4][5][6] … [20]
  - [x] Al buscar, la paginación vuelve a página 1 instantáneamente
  - [x] No hay doble request al iniciar la app (optimización useRef)

Subtareas:
  - [x] CM-103a: Fix bug debounce (limpiar búsqueda no recargaba)
  - [x] CM-103b: Separar isLoading vs isSearching en useContacts.ts
  - [x] CM-103c: Agregar spinner animado CSS a ContactTable.tsx
  - [x] CM-103d: Fix reset instantáneo de página al buscar (Bug 3)
  - [x] CM-103e: Optimización doble fetch con useRef
  - [x] CM-103f: Implementar números de página con elipsis inteligente

Archivos modificados:
  - frontend/src/hooks/useContacts.ts
  - frontend/src/components/ContactTable/ContactTable.tsx
  - frontend/src/app/page.tsx (+2 líneas: isSearching, searchQuery)

Riesgos de merge conocidos:
  - page.tsx: agregadas 2 líneas. Dev 4 (CM-104) también toca este archivo.
    → Coordinar con Dev 4: ContactTable ahora recibe isSearching y searchQuery.
  - useContacts.ts: Dev 4 también lo modificará para filtros.
    → Ver cambios.md para detalle de resolución de conflictos.

Ver: cambios.md para documentación detallada de todos los cambios.
```

---

## 🎫 CM-104 — Filtros + Favoritos

```
Ticket: CM-104
Título: Implementar filtros de búsqueda y sistema de contactos favoritos

Tipo: Feature
Prioridad: Media
Asignado a: Dev 4
Sprint: Sprint 1
Etiquetas: filters, favorites, ux, frontend, backend
Branch: feature/CM-104-filters-favs
Estado: TODO

Descripción:
  Como usuario, quiero poder filtrar mis contactos por criterios
  específicos y marcar contactos como favoritos para acceder
  a ellos rápidamente.

Criterios de aceptación:
  - [ ] Existe un selector/chips de filtros sobre la tabla (ej: "Todos", "Favoritos")
  - [ ] Al seleccionar "Favoritos", la tabla muestra solo contactos marcados
  - [ ] Cada contacto tiene un botón/ícono para marcar/desmarcar como favorito
  - [ ] El estado de favorito persiste (no se pierde al recargar)
  - [ ] Los filtros y la búsqueda funcionan en conjunto (buscar dentro de favoritos)
  - [ ] Los filtros resetean la paginación a página 1
  - [ ] Indicador visual claro del filtro activo

Subtareas:
  - [ ] CM-104a: Decidir persistencia de favoritos (localStorage vs DB)
  - [ ] CM-104b: Agregar campo "isFavorite" al modelo Contact (si es en DB)
  - [ ] CM-104c: Crear UI de filtros (chips/tabs) en/sobre la tabla
  - [ ] CM-104d: Implementar lógica de favoritos en useContacts.ts
  - [ ] CM-104e: Agregar ícono de estrella ⭐ en cada fila de la tabla
  - [ ] CM-104f: Endpoint backend PATCH /api/contacts/:id/favorite (si es en DB)
  - [ ] CM-104g: Testear filtros + búsqueda + paginación en conjunto

Dependencias:
  - Coordinarse con Dev 3 (CM-103) antes del merge a ui-update:
    → ContactTable ahora recibe props: isSearching, searchQuery (no pisar)
    → useContacts.ts fue modificado: revisar cambios.md antes de tocar

Archivos que probablemente modifica:
  - frontend/src/hooks/useContacts.ts ⚠️ (Dev 3 también lo modificó)
  - frontend/src/components/ContactTable/ContactTable.tsx ⚠️
  - frontend/src/app/page.tsx ⚠️ (Dev 3 agregó 2 props a ContactTable)
  - backend/src/contacts/contacts.service.ts (si favoritos van a DB)
  - backend/prisma/schema.prisma (si agrega campo isFavorite)

Riesgos de merge:
  - useContacts.ts: HIGH - Dev 3 modificó el hook, necesita merge manual
  - ContactTable.tsx: MEDIUM - Dev 3 modificó props e interfaz
  - page.tsx: HIGH - archivo compartido con múltiples devs
  → Usar cambios.md de Dev 3 como referencia antes de mergear
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

## 🔗 Dependencias y Orden de Merge

```
FASE 1 (pueden ir en paralelo):
  CM-101 + CM-102 → mergear juntos o CM-101 antes que CM-102
  CM-103 + CM-104 → mergear juntos o en cualquier orden

FASE 2:
  Ambos grupos → ui-update

FASE 3:
  ui-update → main
```

---

## 💬 Convención de commits para este sprint

```bash
# Features
git commit -m "CM-101: Agregar botón login con Google"
git commit -m "CM-102: Implementar guard de rutas protegidas"
git commit -m "CM-103: Fix bug debounce al limpiar búsqueda"
git commit -m "CM-104: Agregar sistema de favoritos"

# Fixes dentro del ticket
git commit -m "CM-103: Fix reset de página al buscar"

# Merge
git commit -m "merge: CM-103 paginacion-loading → ui-update"
```
