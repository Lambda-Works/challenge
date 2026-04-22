# 📐 Plan Arquitectónico - Contact Manager Challenge

##  Resumen Ejecutivo

Aplicación web simple de gestión de contactos con:
- **Backend**: NestJS + Prisma + PostgreSQL
- **Frontend**: Next.js + React + Shadcn/ui
- **Ejecución**: Local con Docker
- **Estructura**: 2 carpetas independientes (frontend/backend)

---

## 🏗️ Estructura de Carpetas

```
challenge/
├── docker-compose.yml          # Infraestructura PostgreSQL
├── backend/
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── auth/
│   │   │   ├── auth.controller.ts          # Endpoints de autenticación
│   │   │   ├── auth.service.ts             # Lógica de login/registro
│   │   │   ├── auth.module.ts
│   │   │   ├── jwt.strategy.ts             # Estrategia JWT
│   │   │   ├── jwt.guard.ts                # Guard para proteger rutas
│   │   │   └── dto/
│   │   │       ├── login.dto.ts
│   │   │       └── register.dto.ts
│   │   ├── contacts/
│   │   │   ├── contacts.controller.ts      # Endpoints REST
│   │   │   ├── contacts.service.ts         # Lógica de negocio
│   │   │   ├── contacts.module.ts
│   │   │   ├── dto/                        # Validaciones
│   │   │   │   ├── create-contact.dto.ts
│   │   │   │   └── update-contact.dto.ts
│   │   │   └── entities/
│   │   │       └── contact.entity.ts
│   │   ├── common/
│   │   │   ├── decorators/
│   │   │   ├── filters/                    # Exception filters
│   │   │   └── validators/                 # Validadores custom
│   │   └── main.ts
│   ├── prisma/
│   │   ├── schema.prisma                   # Esquema de DB
│   │   └── migrations/                     # Migrations automáticas
│   ├── test/                               # Unit tests
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── nest-cli.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                    # Página principal (protegida)
│   │   │   ├── login/
│   │   │   │   └── page.tsx                # Página de login
│   │   │   ├── register/
│   │   │   │   └── page.tsx                # Página de registro
│   │   │   └── providers.tsx               # Theme provider, Auth provider
│   │   ├── components/
│   │   │   ├── LoginForm/
│   │   │   │   ├── LoginForm.tsx           # Formulario de login
│   │   │   │   └── LoginForm.module.css
│   │   │   ├── RegisterForm/
│   │   │   │   ├── RegisterForm.tsx        # Formulario de registro
│   │   │   │   └── RegisterForm.module.css
│   │   │   ├── ContactTable/
│   │   │   │   ├── ContactTable.tsx
│   │   │   │   └── ContactTable.module.css
│   │   │   ├── SearchBar/
│   │   │   │   ├── SearchBar.tsx
│   │   │   │   └── SearchBar.module.css
│   │   │   ├── ContactForm/
│   │   │   │   ├── ContactForm.tsx
│   │   │   │   └── CreateModal.tsx         # Modal para crear/editar
│   │   │   └── ThemeToggle/
│   │   │       └── ThemeToggle.tsx
│   │   ├── services/
│   │   │   └── api.ts                      # Axios client con endpoints y tokens
│   │   ├── hooks/
│   │   │   ├── useAuth.ts                  # Hook para autenticación
│   │   │   ├── useContacts.ts              # Hook para CRUD
│   │   │   ├── useSearch.ts                # Hook para búsqueda
│   │   │   └── useTheme.ts
│   │   ├── types/
│   │   │   ├── auth.ts                     # Tipos de autenticación
│   │   │   └── contact.ts                  # Tipos TypeScript
│   │   └── utils/
│   │       └── validators.ts               # Validaciones frontend
│   ├── public/
│   ├── .env.local
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   └── tailwind.config.js
│
├── prompts/
│   ├── questions.md                        # Preguntas respondidas
│   ├── plan.md                             # Este archivo
│   ├── AGENTS.md                           # Contexto para Development
│   └── README.md                           # Setup e instrucciones
│
└── README.md                               # Root README
```

---

## 📊 Modelo de Datos - Prisma Schema

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int     @id @default(autoincrement())
  email     String  @unique
  password  String  # bcrypt hash
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

model Contact {
  id        Int     @id @default(autoincrement())
  name      String  @db.VarChar(20)
  email     String  @unique
  phone     String  @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("contacts")
}
```

### Reglas de Negocio en BD:
- `name`: VARCHAR(20), obligatorio
- `email`: VARCHAR único, obligatorio, validación formato
- `phone`: VARCHAR único, obligatorio, formato argentino
- `createdAt` / `updatedAt`: timestamps automáticos

---

## 🔌 API REST Endpoints

### Base URL: `http://localhost:3001/api`

#### 🔐 Autenticación
| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| **POST** | `/auth/register` | Registrar usuario | `{ email, password }` |
| **POST** | `/auth/login` | Login usuario | `{ email, password }` |
| **POST** | `/auth/logout` | Logout (frontend elimina token) | — |

#### 📇 Contactos (requiere token JWT)
| Método | Endpoint | Descripción | Body | Headers |
|--------|----------|-------------|------|----------|
| **POST** | `/contacts` | Crear contacto | `{ name, email, phone }` | Authorization: Bearer `<token>` |
| **GET** | `/contacts` | Listar todos | Query: `?search=` (opcional) | Authorization: Bearer `<token>` |
| **GET** | `/contacts/:id` | Obtener uno | — | Authorization: Bearer `<token>` |
| **PUT** | `/contacts/:id` | Actualizar | `{ name, email, phone }` | Authorization: Bearer `<token>` |
| **DELETE** | `/contacts/:id` | Eliminar | — | Authorization: Bearer `<token>` |

---

## ✅ Validaciones Backend

### Email
- Formato básico: `usuario@dominio.com`
- No duplicados en BD

### Teléfono
- Formato argentino: `+54 9 XX XXXX-XXXX` o `+549XXXXXXXX`
- No duplicados en BD

### Nombre
- Máximo 20 caracteres
- Obligatorio

---

## 🎨 Frontend - Layout & Componentes

### Estructura Visual
```
┌─────────────────────────────────────────────────────┐
│  👤 Contactos                   │ Dark/Light Toggle  │
│  X contactos en total                                │
├─────────────────────────────────────────────────────┤
│  🔍 Buscar...                            │ + Nuevo  │
├─────────────────────────────────────────────────────┤
│  Nombre  │ Teléfono  │ Email  │ Acciones (Editar/Del)│
├─────────────────────────────────────────────────────┤
│  [Contact 1] [+541111]  [mail@gmail.com]  [✏️ 🗑️] │
│  [Contact 2] [+541112]  [mail@gmail.com]  [✏️ 🗑️] │
│  ...
├─────────────────────────────────────────────────────┤
│  Página 1 de 10 | [< Anterior] [Siguiente >]       │
└─────────────────────────────────────────────────────┘
```

### Componentes Key
1. **ContactTable.tsx** - Tabla paginada (10 items/página)
2. **SearchBar.tsx** - Input búsqueda en tiempo real
3. **CreateModal.tsx** - Modal para crear/editar contactos
4. **ThemeToggle.tsx** - Selector Dark/Light Mode
5. **ContactForm.tsx** - Formulario con validaciones

### Funcionalidades Frontend
- ✅ Login/Registro de usuarios
- ✅ Almacenamiento seguro de JWT en localStorage
- ✅ Redirección automática a login si no autenticado
- ✅ Búsqueda en tiempo real (useEffect en onChange)
- ✅ Paginación a partir de 10 contactos
- ✅ Dark/Light mode con Shadcn/ui
- ✅ Formulario modal para crear/editar
- ✅ Confirmación para eliminar
- ✅ Toast notifications para feedback
- ✅ Responsive design (mobile-first)

---

## 🛠️ Backend - Módulos Independientes

### `/auth` Module (NUEVO)
- **AuthController** - Endpoints login/registro
- **AuthService** - Business logic autenticación
- **JwtStrategy** - Estrategia de validación JWT
- **JwtGuard** - Guard para proteger rutas
- **DTOs** - Validación de login/register

### `/contacts` Module
- **ContactsController** - Request handling (protegido con @UseGuards(JwtGuard))
- **ContactsService** - Business logic
- **ContactsRepository** - Data access (Prisma)
- **DTOs** - Validación con `class-validator`
- **Entities** - Response serialization

### Validaciones con Decoradores
```typescript
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
- `BadRequestException` - Validaciones fallidas
- `ConflictException` - Email/Phone duplicados
- `NotFoundException` - Contacto no encontrado

---

## 📦 Seeder - Datos de Prueba

Crear script `prisma/seed.ts` con 5 contactos:

```typescript
const contacts = [
  { name: "Juan Pérez", email: "juan@gmail.com", phone: "+541112345678" },
  { name: "María García", email: "maria@gmail.com", phone: "+541123456789" },
  { name: "Carlos López", email: "carlos@gmail.com", phone: "+541134567890" },
  { name: "Ana Martínez", email: "ana@gmail.com", phone: "+541145678901" },
  { name: "Luis Fernández", email: "luis@gmail.com", phone: "+541156789012" },
];
```

---

## 🧪 Testing - Backend

### Unit Tests con Jest
- **ContactsService.spec.ts** - Lógica de negocio
- **ContactsController.spec.ts** - Endpoints REST
- **Validators.spec.ts** - Validaciones custom

Mínimo:
- ✅ Crear contacto con datos válidos
- ✅ Fallar al crear con email duplicado
- ✅ Fallar al crear con phone duplicado
- ✅ Listar contactos
- ✅ Editar contacto existente
- ✅ Eliminar contacto

---

## 🚀 Stack Tecnológico Final

### Backend
- NestJS 10+
- @nestjs/jwt - JWT authentication
- @nestjs/passport - Passport.js integration
- bcrypt - Password hashing
- TypeORM/Prisma
- PostgreSQL 16
- class-validator
- Jest (testing)
- TypeScript

### Frontend
- Next.js 14+ (App Router)
- React 18+
- Shadcn/ui (+ Radix UI)
- TailwindCSS
- Axios (HTTP client)
- TypeScript

### DevOps
- Docker + Docker Compose
- PostgreSQL 16-alpine
- localhost:5432 (DB)
- localhost:3001 (Backend)
- localhost:3000 (Frontend)

---

## 📝 Archivos de Configuración

### Backend
- `.env.example` - Variables de entorno
- `prisma/.env` - DATABASE_URL
- `package.json` - Dependencies
- `tsconfig.json` - TypeScript config
- `jest.config.js` - Testing config

### Frontend
- `.env.local` - API base URL (http://localhost:3001)
- `next.config.js` - Next.js configuration
- `tsconfig.json` - TypeScript config
- `tailwind.config.js` - Tailwind theme

---

## ✨ Checklist Pre-Desarrollo

- [ ] Estructura de carpetas creada
- [ ] docker-compose.yml validado
- [ ] Backend: NestJS inicializado
- [ ] Backend: Prisma schema definido (con modelo User)
- [ ] Backend: Migration para tabla users
- [ ] Backend: Módulo Auth con login/registro
- [ ] Backend: DTOs con validaciones (LoginDto, RegisterDto)
- [ ] Backend: JwtStrategy y JwtGuard implementados
- [ ] Backend: ContactsController protegido con JWT
- [ ] Backend: ContactsService implementado
- [ ] Backend: Exception handling
- [ ] Backend: Seeder con 5 contactos
- [ ] Backend: Unit tests
- [ ] Frontend: Next.js inicializado
- [ ] Frontend: Shadcn/ui instalado
- [ ] Frontend: Página de login con formulario
- [ ] Frontend: Página de registro
- [ ] Frontend: Hook useAuth para manejar tokens
- [ ] Frontend: Protección de rutas (layout protegido)
- [ ] Frontend: ContactTable componente
- [ ] Frontend: SearchBar componente
- [ ] Frontend: CreateModal componente
- [ ] Frontend: Theme toggle (Dark/Light)
- [ ] Frontend: API services con interceptor de JWT
- [ ] Frontend: Paginación
- [ ] Frontend: Responsive design
- [ ] README.md completado
- [ ] AGENTS.md documentado

---

## 📊 Timeline Estimado

| Fase | Tareas | Tiempo |
|------|--------|--------|
| Setup | Estructura, Docker, NestJS, Next.js, dependencias JWT | 30 min |
| Backend Auth | AuthModule, JwtStrategy, login/registro, DTOs | 40 min |
| Backend Contacts | Proteger endpoints, Prisma, Controllers, Services | 35 min |
| Frontend Auth | LoginForm, RegisterForm, useAuth hook, protección | 45 min |
| Frontend Contacts | ContactTable, SearchBar, CreateModal, API calls | 45 min |
| Polish | Testing, validaciones, documentación, UI/UX | 30 min |
| **Total** | | **3.5 horas** |

---

## 🔗 Dependencias Clave

### Backend
```
nestjs, @nestjs/core, @nestjs/common
@nestjs/jwt, @nestjs/passport, passport-jwt
bcrypt, @types/bcrypt
prisma, @prisma/client
class-validator, class-transformer
jest, @nestjs/testing
```

### Frontend
```
next, react, react-dom
shadcn/ui (instalar componentes)
tailwindcss, postcss, autoprefixer
axios
```

---

**Próximo paso**: Comenzar con la creación de carpetas y scaffolding del proyecto.
