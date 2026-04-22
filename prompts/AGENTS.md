# 🤖 AGENTS.md - Contexto y Guía de Desarrollo

**Última actualización:** 22 de Abril, 2026  
**Estado:** ✅ FRONTEND COMPLETAMENTE GENERADO Y FUNCIONAL  
**Próximo Paso:** Agregar JWT Authentication

---

## 📋 Resumen Ejecutivo

**Contact Manager** es una aplicación full-stack de gestión de contactos completamente funcional con:

### ✅ Implementado
- Backend REST API con NestJS
- Base de datos PostgreSQL con Prisma
- Frontend UI con NextJS + React + Tailwind CSS
- CRUD completo (Create, Read, Update, Delete)
- Búsqueda en tiempo real
- Paginación automática
- Dark/Light mode
- Validaciones frontend y backend
- 5 contactos de prueba precargados

### ⏳ Por Implementar
- JWT Authentication (login/register)
- Protección de rutas
- Tests E2E

---

## 🏗️ Arquitectura General

```
┌─────────────────────────────────────────┐
│         Frontend (http://3000)          │
│  Next.js + React + TailwindCSS          │
│  • SearchBar Component                  │
│  • ContactTable Component               │
│  • ContactModal Component               │
│  • useContacts Hook                     │
└─────────────────────────────────────────┘
                   ↓ (HTTP via Axios)
┌─────────────────────────────────────────┐
│        Backend (http://3001)            │
│  NestJS + Express                       │
│  • ContactsController (5 endpoints)     │
│  • ContactsService (business logic)     │
│  • Validações DTO                       │
└─────────────────────────────────────────┘
                   ↓ (ORM)
┌─────────────────────────────────────────┐
│  Database (localhost:5432)              │
│  PostgreSQL + Prisma Migrations         │
└─────────────────────────────────────────┘
```

---

## 📦 Stack Tecnológico

### Backend
| Librería | Versión | Propósito |
|----------|---------|----------|
| `@nestjs/core` | 10.2+ | Framework |
| `@nestjs/jwt` | 11+ | Tokens JWT |
| `@nestjs/passport` | 10+ | Estrategias auth |
| `@prisma/client` | 5.9+ | ORM |
| `class-validator` | 0.14+ | Validación de DTOs |
| `bcrypt` | 5.1+ | Hash de contraseñas |

### Frontend
| Librería | Versión | Propósito |
|----------|---------|----------|
| `next` | 14+ | Framework React |
| `react` | 18+ | UI |
| `next-themes` | 0.4+ | Dark/Light mode |
| `axios` | 1.6+ | HTTP client |
| `tailwindcss` | 3.4+ | Estilos |

---

## 🎯 Componentes Frontend

### SearchBar.tsx
**Ubicación:** `frontend/src/components/SearchBar/SearchBar.tsx`

```typescript
Props:
  - value: string (búsqueda actual)
  - onChange: (value: string) => void (actualizador de búsqueda)
  - onCreateClick?: () => void (para abrir modal crear)

Comportamiento:
  - Input de búsqueda en tiempo real
  - Botón "+ Nuevo" para crear contacto
  - Estilo responsive y dark mode
```

### ContactTable.tsx
**Ubicación:** `frontend/src/components/ContactTable/ContactTable.tsx`

```typescript
Props:
  - contacts: Contact[] (datos a mostrar)
  - onEdit?: (contact: Contact) => void
  - onDelete?: (id: number) => void
  - currentPage: number
  - totalPages: number
  - onPageChange?: (page: number) => void
  - isLoading?: boolean

Comportamiento:
  - Tabla con 4 columnas: Nombre, Email, Teléfono, Acciones
  - Botones editar/eliminar en cada fila
  - Paginación con botones Anterior/Siguiente
  - Estado de carga
  - Dark mode support
```

### ContactModal.tsx
**Ubicación:** `frontend/src/components/ContactForm/ContactModal.tsx`

```typescript
Props:
  - isOpen: boolean
  - contact?: Contact (undefined = create, poblado = edit)
  - onClose: () => void
  - onSubmit: (data: CreateContactRequest) => Promise<void>
  - isLoading?: boolean

Validaciones:
  - Nombre: required, max 20 caracteres
  - Email: required, formato válido
  - Teléfono: required, formato argentino
  - Errores mostrados bajo cada input
```

---

## 🪝 Hooks

### useContacts.ts
**Ubicación:** `frontend/src/hooks/useContacts.ts`

```typescript
Retorna:
  - contacts: Contact[] (contactos de la página actual)
  - allContacts: Contact[] (todos los contactos)
  - isLoading: boolean
  - error: string | null
  - searchQuery: string
  - setSearchQuery: (q: string) => void
  - currentPage: number
  - setCurrentPage: (p: number) => void
  - totalPages: number
  - fetchContacts: (search?: string) => Promise<void>
  - createContact: (data: CreateContactRequest) => Promise<Contact>
  - updateContact: (id: number, data: UpdateContactRequest) => Promise<Contact>
  - deleteContact: (id: number) => Promise<void>

Características:
  - Debounce de 300ms en búsqueda
  - Paginación automática (10 por página)
  - Manejo de errores
  - Estados de loading
```

---

## 💾 API Service

### api.ts
**Ubicación:** `frontend/src/services/api.ts`

```typescript
Endpoints:
  - contactsApi.getAll(search?: string)
  - contactsApi.getOne(id: number)
  - contactsApi.create(data: CreateContactRequest)
  - contactsApi.update(id: number, data: UpdateContactRequest)
  - contactsApi.delete(id: number)

Configuración:
  - Base URL: http://localhost:3001/api (desde .env.local)
  - Headers: Content-Type: application/json
  - Retorna: data del response
  - Lanza: error si falla
```

---

## 🗄️ Tipos TypeScript

### Archivo: `frontend/src/types/contact.ts`

```typescript
interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateContactRequest {
  name: string;
  email: string;
  phone: string;
}

interface UpdateContactRequest {
  name?: string;
  email?: string;
  phone?: string;
}

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  total?: number;
}
```

---

## 🔌 Backend Endpoints

### GET /api/contacts
```
Descripción: Listar contactos (con búsqueda opcional)

Query Params:
  - search?: string (búsqueda por nombre, email, teléfono)

Response:
  {
    "statusCode": 200,
    "message": "Contactos obtenidos",
    "data": [Contact, ...],
    "total": 5
  }
```

### POST /api/contacts
```
Descripción: Crear contacto

Body:
  {
    "name": "Juan Pérez",
    "email": "juan@gmail.com",
    "phone": "+541112345678"
  }

Response:
  {
    "statusCode": 201,
    "message": "Contacto creado",
    "data": Contact
  }
```

### PUT /api/contacts/:id
```
Descripción: Actualizar contacto

Params:
  - id: number (ID del contacto)

Body:
  {
    "name": "Juan Pérez Actualizado",
    "email": "nuevoemail@gmail.com",
    "phone": "+541112345679"
  }

Response:
  {
    "statusCode": 200,
    "message": "Contacto actualizado",
    "data": Contact
  }
```

### DELETE /api/contacts/:id
```
Descripción: Eliminar contacto

Params:
  - id: number

Response:
  {
    "statusCode": 204,
    "message": "Contacto eliminado"
  }
```

---

## 📝 Base de Datos

### Contacts Table
```
Column      | Type      | Constraints         | Notes
------------|-----------|---------------------|----------
id          | INTEGER   | PRIMARY KEY, AUTO   | Auto increment
name        | VARCHAR   | MAX 20, NOT NULL    | Nombre del contacto
email       | VARCHAR   | UNIQUE, NOT NULL    | Email único
phone       | VARCHAR   | UNIQUE, NOT NULL    | Teléfono único
createdAt   | TIMESTAMP | DEFAULT now(), NOT  | Creación automática
updatedAt   | TIMESTAMP | DEFAULT now()      | Actualización automática
```

### Users Table (próxima fase)
```
Column      | Type      | Constraints         | Notes
------------|-----------|---------------------|----------
id          | INTEGER   | PRIMARY KEY, AUTO   |
email       | VARCHAR   | UNIQUE, NOT NULL    |
password    | VARCHAR   | NOT NULL            | bcrypt hash
createdAt   | TIMESTAMP | DEFAULT now()      |
updatedAt   | TIMESTAMP | DEFAULT now()      |
```

---

## ✅ Validaciones Implementadas

### Frontend (ContactModal.tsx)
- ✅ Nombre required, max 20 chars
- ✅ Email required, regex format
- ✅ Teléfono required, regex argentino
- ✅ Errores bajo cada input

### Backend (DTOs)
- ✅ @IsString() en nombre
- ✅ @MaxLength(20) nombre
- ✅ @IsEmail() email
- ✅ @Matches(/regex/) teléfono
- ✅ @IsUnique() email y teléfono

---

## 🎨 UI/UX Features

### Responsive Design
```
Desktop (1024px+)    → Tabla completa
Tablet (768-1024px) → Tabla con scroll horizontal
Mobile (< 768px)    → Tabla compactada, botones grandes
```

### Dark Mode
- Toggle en header (botón "☀️ Claro" / "🌙 Oscuro")
- Persiste en session storage
- Usa next-themes con clase "dark"
- Colores: bg-white/dark-gray-900, text-gray-900/white

### Interactividad
- Búsqueda en tiempo real (debounce 300ms)
- Hover effects en filas y botones
- Confirmación antes de eliminar
- Modal para crear/editar
- Indicadores de carga

---

## 🔐 Seguridad (Por Implementar)

### JWT Authentication
```
1. Usuario se registra → POST /auth/register
   - Email, password
   - Backend hashea con bcrypt
   - Retorna JWT token

2. Usuario hace login → POST /auth/login
   - Email, password
   - Backend verifica
   - Retorna JWT token

3. Frontend almacena token → localStorage

4. Cada request a /api/contacts → header Authorization: Bearer <token>

5. Backend verifica JwtGuard → si no válido, 401
```

### Hasheado de Contraseñas
```typescript
import * as bcrypt from 'bcrypt';

// Crear
const hash = await bcrypt.hash(password, 10);

// Verificar
const isValid = await bcrypt.compare(password, hash);
```

---

## 🚀 Flujo de Uso Típico

### 1. Usuario abre la app
```
1. Frontend carga http://localhost:3000
2. Page.tsx usa useContacts()
3. useContacts llama contactsApi.getAll()
4. Axios hace GET http://localhost:3001/api/contacts
5. Backend retorna 5 contactos
6. Frontend renderiza table con pagination
```

### 2. Usuario busca
```
1. Escribe en SearchBar
2. onChange → setSearchQuery(value)
3. useEffect detecta cambio
4. Debounce 300ms
5. Llama fetchContacts(searchQuery)
6. API hace GET /contacts?search=juan
7. Tabla se actualiza con resultados
```

### 3. Usuario crea contacto
```
1. Click en "+ Nuevo"
2. Modal se abre con contact = undefined
3. Rellena formulario
4. Click "Guardar"
5. handleSubmitModal llama createContact(data)
6. API hace POST /contacts
7. Nuevo contacto se suma a contacts array
8. Tabla se refresca
9. Modal se cierra
```

### 4. Usuario edita
```
1. Click en "✏️ Editar"
2. Modal se abre con contact poblado
3. Modifica campos
4. Click "Guardar"
5. handleSubmitModal llama updateContact(id, data)
6. API hace PUT /contacts/:id
7. Contacto se actualiza en array
8. Tabla se refresca
```

### 5. Usuario elimina
```
1. Click en "🗑️ Eliminar"
2. confirm() dialogo
3. handleDeleteClick llama deleteContact(id)
4. API hace DELETE /contacts/:id
5. Contacto se remueve del array
6. Tabla se refresca
```

---

## 🧪 Testing (Backend Only)

```bash
# Ejecutar tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov
```

**Archivos:**
- `src/contacts/contacts.service.spec.ts`
- `src/contacts/contacts.controller.spec.ts`

---

## 📋 Checklist para Próxima Fase (Auth)

- [ ] Crear módulo Auth en backend
- [ ] Implementar AuthService con login/register
- [ ] Crear DTOs: LoginDto, RegisterDto
- [ ] Implementar JwtStrategy
- [ ] Crear JwtGuard
- [ ] Proteger ContactsController con @UseGuards(JwtGuard)
- [ ] Crear LoginForm component en frontend
- [ ] Crear RegisterForm component en frontend
- [ ] Crear useAuth hook en frontend
- [ ] Proteger rutas del frontend
- [ ] Almacenar token en localStorage
- [ ] Agregar Logout button

---

## 🎓 Guía de Mantenimiento

### Agregar Validación Nueva

**Backend (DTO):**
```typescript
import { IsPhoneNumber } from 'class-validator';

export class CreateContactDto {
  @IsPhoneNumber('AR') // Argentina
  phone: string;
}
```

**Frontend (Modal):**
```typescript
if (!/^\+?549\d{8,10}$/.test(phone)) {
  newErrors.phone = 'Formato inválido';
}
```

### Agregar Endpoint Nuevo

**Backend:**
```typescript
@Get('search')
search(@Query('q') query: string) {
  return this.contactsService.search(query);
}
```

**Frontend:**
```typescript
const search = async (query: string) => {
  const response = await apiClient.get('/contacts/search', {
    params: { q: query }
  });
  return response.data.data;
};
```

---

## 🔗 Referencias Rápidas

**Frontend Components:**
- Page: `src/app/page.tsx` (tabla principal)
- SearchBar: `src/components/SearchBar/SearchBar.tsx`
- Table: `src/components/ContactTable/ContactTable.tsx`
- Modal: `src/components/ContactForm/ContactModal.tsx`

**Frontend Logic:**
- Hook: `src/hooks/useContacts.ts`
- API: `src/services/api.ts`
- Types: `src/types/contact.ts`

**Backend:**
- Controller: `backend/src/contacts/contacts.controller.ts`
- Service: `backend/src/contacts/contacts.service.ts`
- DTOs: `backend/src/contacts/dto/`

---

## 🚀 Comandos Rápidos

### Development
```bash
# Backend
cd backend && npm run start:dev

# Frontend  
cd frontend && npm run dev

# Database
docker-compose up -d
```

### Production Build
```bash
# Backend
cd backend && npm run build && npm run start

# Frontend
cd frontend && npm run build && npm run start
```

### Database
```bash
# View data
cd backend && npx prisma studio

# Reset (⚠️ deletes all)
cd backend && npx prisma migrate reset

# Seed
cd backend && npx prisma db seed
```

---

## 💡 Consejos de Desarrollo

1. **Siempre valida en ambos lados:** Frontend es para UX, backend para seguridad
2. **Usa tipos TypeScript:** Previene bugs 
3. **Testea manualmente primero:** Luego automatiza
4. **Commits frecuentes:** Cambios pequeños y claros
5. **Documenta cambios:** Actualiza este AGENTS.md

---

## 🐛 Debugging Common Issues

### Error: "EADDRINUSE: address already in use"
```
Significa que el puerto ya está en uso
Solución: Mata el proceso antiguo o cambia de puerto
```

### Error: "connect ECONNREFUSED"  
```
Backend no está corriendo
Solución: npm run start:dev en la carpeta backend
```

### Error: "Cannot GET /"
```
Frontend pidió recurso en backend
Solución: Verifica que NEXT_PUBLIC_API_URL sea correcto
```

### Error: "401 Unauthorized"
```
Falta token JWT (cuando esté implementado)
Solución: Haz login y almacena el token
```

---

## 📞 Stack Overflow Queries Útiles

- "NestJS JWT authentication example"
- "Next.js useEffect best practices"
- "Prisma unique constraints"
- "bcrypt hash password Node.js"
- "Axios interceptors authentication"

---

**Última actualización:** 22 de Abril, 2026  
**Mantén este documento actualizado a medida que desarrolles nuevas features**
| **DB** | PostgreSQL | 16 Alpine |
| **Runtime** | Node.js | 18+ |

### Principios de Diseño

1. **Modularidad**: Estructurados en módulos independientes
   - Backend: ContactsModule con Controller/Service/Repository
   - Frontend: Componentes auto-contenidos reutilizables

2. **Validación en Capas**
   - Frontend: Validación básica para UX
   - Backend: Validación completa (source of truth)

3. **Separación de Responsabilidades**
   - DTOs para validación de entrada
   - Services para lógica de negocio
   - Controllers para manejo de HTTP
   - Componentes para presentación

4. **Error Handling Consistente**
   - Excepciones tipadas en backend
   - Toast notifications en frontend
   - Logs estructurados

---

## 📂 Estructura Acordada

```
challenge/
├── backend/                    # NestJS + Prisma
│   ├── src/contacts/           # Módulo principal
│   ├── prisma/                 # Schema + migrations
│   └── test/                   # Unit tests
│
├── frontend/                   # Next.js + React
│   ├── src/components/         # Componentes Shadcn/ui
│   ├── src/hooks/              # React hooks custom
│   └── src/services/           # Axios client
│
├── prompts/                    # Documentación
│   ├── questions.md            # Preguntas respondidas
│   ├── plan.md                 # Plan arquitectónico
│   └── AGENTS.md               # Este archivo
│
└── README.md                   # Instrucciones setup
```

---

## 🗄️ Modelo de Datos

### Entity: Contact

```typescript
{
  id: number              // Primary Key, auto-increment
  name: string            // MAX 20 chars, required
  email: string           // Unique, valid email, required
  phone: string           // Unique, Argentina format, required
  createdAt: DateTime     // Auto timestamp
  updatedAt: DateTime     // Auto timestamp
}
```

### Formatos Específicos

**Email**
- Validación básica: `usuario@dominio.com`
- Debe ser único en BD
- Usar `class-validator` decorator: `@IsEmail()`

**Teléfono**
- Formato argentino: `+54 911234567` o `+5491123456789`
- Regex: `/^\+?54\d{9,10}$/`
- Debe ser único en BD

**Nombre**
- Máximo 20 caracteres
- No puede estar vacío
- Usar `@MaxLength(20)` y `@MinLength(1)`

---

## 🔌 Endpoints API

### Base: `http://localhost:3001/api/contacts`

```
POST   /             → Crear contacto
GET    /             → Listar todos (+ buscar)
GET    /:id          → Obtener uno
PUT    /:id          → Actualizar
DELETE /:id          → Eliminar
```

### Response Standard

**Success (200, 201)**
```json
{
  "data": { Contact object(s) },
  "message": "Success message"
}
```

**Error (400, 409, 404)**
```json
{
  "statusCode": number,
  "message": "Error message",
  "error": "Error type"
}
```

### Códigos de Error

- `400` - Validación fallida (email, teléfono, nombre)
- `409` - Email/Phone duplicado
- `404` - Contacto no encontrado
- `500` - Error interno

---

## 🎨 Componentes Frontend - Interfaz

### Layout Principal

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 👤 Contactos                  🌙 Theme Toggle   ┃
┃ X contactos en total                             ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 🔍 Buscar...                        [+ Nuevo]    ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ Contacto │ Teléfono │ Email │ Acciones          ┃
├─────────────────────────────────────────────────┤
┃ A. Pérez │ +54...   │ ...@  │ [Editar] [Elim]   ┃
┃ B. García│ +54...   │ ...@  │ [Editar] [Elim]   ┃
┃ ...      │          │       │                   ┃
├─────────────────────────────────────────────────┤
┃ Página 1 de 5 | [◀ Ant] [Sig ▶]               ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

### Componentes Clave

#### SearchBar
- Input en tiempo real (onChange con debounce opcional)
- Busca por nombre, email, teléfono simultáneamente
- Se actualiza la tabla mientras escribes

#### ContactTable
- 10 items por página
- Paginación manual con botones Anterior/Siguiente
- Columnas: Contacto, Teléfono, Email, Acciones
- Botones: Editar (abre modal), Eliminar (con confirmación)

#### CreateModal / EditModal
- Formulario con validaciones en tiempo real
- Campos: Nombre, Email, Teléfono
- Botones: Guardar, Cancelar
- Mensajes de error inline

#### ThemeToggle
- Botón en header arriba a la derecha
- Cambia entre dark y light (Shadcn/ui theme)
- Persiste en localStorage

### Comportamientos UX

✅ Búsqueda en tiempo real → filtra tabla dinámicamente
✅ Modal para crear/editar → los dos usan el mismo componente
✅ Validaciones frontend → feedback inmediato (rojo border, error text)
✅ Validaciones backend → toast error si falla (email/phone duplicado)
✅ Confirmación delete → modal de confirmación antes de eliminar
✅ Toast notifications → "Eliminado", "Creado", "Actualizado"
✅ Responsive → mobile, tablet, desktop

---

## 🛠️ Backend - Patrones

### Módulo ContactsModule

**Structure**
```
contacts/
├── contacts.controller.ts      # HTTP routing
├── contacts.service.ts         # Business logic
├── contacts.module.ts          # Module definition
├── dto/
│   ├── create-contact.dto.ts
│   └── update-contact.dto.ts
├── entities/
│   └── contact.entity.ts       # Response shape
└── __tests__/
    ├── contacts.service.spec.ts
    └── contacts.controller.spec.ts
```

### ContactsController Endpoints

```typescript
@Post()
async create(@Body() createContactDto: CreateContactDto)

@Get()
async findAll(@Query('search') search?: string)

@Get(':id')
async findOne(@Param('id') id: string)

@Put(':id')
async update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto)

@Delete(':id')
async remove(@Param('id') id: string)
```

### ContactsService Methods

```typescript
async create(dto): Promise<Contact>
async findAll(search?): Promise<Contact[]>
async findOne(id): Promise<Contact>
async update(id, dto): Promise<Contact>
async remove(id): Promise<void>
async searchContacts(query): Promise<Contact[]>
```

### DTOs con Validaciones

```typescript
// CreateContactDto
@IsString()
@MaxLength(20)
@MinLength(1)
name: string;

@IsEmail()
email: string;

@Matches(/^\+?54\d{9,10}$/)
phone: string;
```

### Exception Handling

```typescript
// Email duplicado
throw new ConflictException('Email already exists');

// Validación fallida
throw new BadRequestException('Invalid format');

// No encontrado
throw new NotFoundException('Contact not found');
```

---

## 🧪 Testing Strategy

### Backend: Unit Tests

- **ContactsService**: Mock Prisma, test lógica
- **ContactsController**: Mock Service, test routing
- **Validators**: Test custom decorators

### Coverage Mínimo

- Crear contacto válido ✅
- Crear con email duplicado ✅
- Crear con teléfono duplicado ✅
- Crear con nombre > 20 chars ✅
- Listar todos ✅
- Buscar por nombre ✅
- Actualizar existente ✅
- Eliminar existente ✅
- Obtener no existente → 404 ✅

### Ejecución

```bash
npm run test                # Ejecutar todos
npm run test:watch         # Watch mode
npm run test:cov           # Con cobertura
```

---

## 📦 Seeder

### Ubicación: `prisma/seed.ts`

5 contactos de prueba:

```typescript
const contacts = [
  { name: "Juan Pérez", email: "juan@gmail.com", phone: "+541112345678" },
  { name: "María García", email: "maria@gmail.com", phone: "+541123456789" },
  { name: "Carlos López", email: "carlos@gmail.com", phone: "+541134567890" },
  { name: "Ana Martínez", email: "ana@gmail.com", phone: "+541145678901" },
  { name: "Luis Fernández", email: "luis@gmail.com", phone: "+541156789012" },
];
```

### Ejecución

```bash
npx prisma db seed
```

---

## 🐳 Docker & Local Development

### Levantar DB

```bash
docker-compose up -d
```

Database accesible en:
- Host: `localhost`
- Port: `5432`
- User: `test`
- Password: `test`
- Database: `test`

### Environments

**Backend (.env)**
```
DATABASE_URL=postgresql://test:test@localhost:5432/test
NODE_ENV=development
```

**Frontend (.env.local)**
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## 🚀 Scripts Estándar

### Backend

```bash
npm run start           # Production mode
npm run start:dev       # Development con reload
npm run build           # Build para production
npm run test            # Unit tests
npm run prisma:migrate  # Crear migration
npm run prisma:studio   # UI Prisma
```

### Frontend

```bash
npm run dev             # Development server (port 3000)
npm run build           # Build production
npm run start           # Ejecutar build
```

---

## 🎯 Validaciones Críticas

| Regla | Ubicación | Prioridad |
|-------|-----------|-----------|
| Email válido | Backend DTOs | CRÍTICA |
| Email único | Backend Service + DB | CRÍTICA |
| Teléfono único | Backend Service + DB | CRÍTICA |
| Teléfono formato ARG | Backend DTOs | CRÍTICA |
| Nombre MAX 20 | Backend DTOs | MEDIA |
| Campos obligatorios | Backend DTOs | CRÍTICA |

---

## 📝 Convenciones de Código

### Naming

- Controllers: `*Controller`
- Services: `*Service`
- DTOs: `Create*Dto`, `Update*Dto`
- Components React: PascalCase
- Hooks: `use*`
- Utils: camelCase

### File Structure

- `*.module.ts` - Módulos NestJS
- `*.controller.ts` - Controllers NestJS
- `*.service.ts` - Services NestJS
- `*.spec.ts` - Test files
- `*.tsx` - React components
- `*.ts` - Utilities, types, services

### Imports

Backend:
```typescript
import { Module } from '@nestjs/common';
import { PrismaService } from '@nestjs/prisma';
```

Frontend:
```typescript
import { FC } from 'react';
import { Button } from '@/components/ui/button';
```

---

## 🔄 Workflow de Desarrollo

1. **Feature branch**: `git checkout -b feature/nome-feature`
2. **Implementar backend** (controller/service/dto)
3. **Agregar tests** (unit tests)
4. **Implementar frontend** (componentes/hooks)
5. **Probar manualmente** en localhost
6. **Commit semántico**: `feat:`, `fix:`, `test:`, etc.
7. **Merge** a main

---

## ✨ Checklist de Completitud

Antes de marcar un feature como "Done":

- [ ] Código implementado
- [ ] Tests pasan (backend)
- [ ] Validaciones en backend
- [ ] UI responsiva
- [ ] No hay console.errors
- [ ] Documentación en cambios

---

## 📞 Contacto & Soporte

Este documento es la **fuente de verdad** de la arquitectura.
Si durante el desarrollo encuentras inconsistencias, actualiza este AGENTS.md y notifica los cambios.

**Último actualizado**: 20/04/2026
**Versión**: 1.0
**Status**: Ready for Development ✅
