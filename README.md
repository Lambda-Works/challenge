# � Contact Manager - COMPLETAMENTE FUNCIONAL

Aplicación full-stack de gestión de contactos con NestJS + Prisma + PostgreSQL (backend) y Next.js + React + Tailwind CSS (frontend).

---

## 🚀 COMIENZA EN 3 PASOS

### Paso 1: Levanta PostgreSQL con Docker

```bash
cd /home/nicolas/Documentos/Local/challenge
docker-compose up -d
```

### Paso 2: Inicia Backend (Terminal 1)

```bash
cd /home/nicolas/Documentos/Local/challenge/backend
npm run start:dev
```

Verás: `🚀 Application is running on: http://localhost:3001`

### Paso 3: Inicia Frontend (Terminal 2)

```bash
cd /home/nicolas/Documentos/Local/challenge/frontend
npm run dev
```

Verás: `▲ Next.js 14.2.35 - Local: http://localhost:3000`

---

## 📍 ABRE en el navegador

### 👉 http://localhost:3000

Verás una tabla con:
- ✅ 5 contactos de prueba
- ✅ Buscador en tiempo real
- ✅ Botón "+ Nuevo" para crear
- ✅ Botones "✏️ Editar" y "🗑️ Eliminar"
- ✅ Paginación (10 por página)
- ✅ Toggle Dark/Light Mode

---

## 🎮 FUNCIONALIDADES

### Crear Contacto
1. Click en "+ Nuevo"
2. Rellena: Nombre (máx 20 caracteres), Email, Teléfono Argentina
3. Click "Guardar"

### Editar Contacto
1. Click en "✏️ Editar"
2. Modifica los datos
3. Click "Guardar"

### Eliminar Contacto
1. Click en "🗑️ Eliminar"
2. Confirma en el diálogo

### Buscar
- Escribe en el buscador
- Busca por nombre, email o teléfono en tiempo real

### Dark Mode
- Click en "🌙 Oscuro" o "☀️ Claro" (arriba a la derecha)

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# DATABASE_URL=postgresql://test:test@localhost:5432/test

# Ejecutar migrations + seeder
npx prisma migrate dev --name init
npx prisma db seed

# Iniciar en desarrollo
npm run start:dev
```

### 3️⃣ Frontend (Puerto 3000)

```bash
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" > .env.local

# Iniciar en desarrollo
npm run dev
```

✅ **Listo**: Abre http://localhost:3000

---

## 📋 Requisitos

- **Node.js** 18+
- **Docker** & **Docker Compose**
- **PostgreSQL** 16 (en Docker)

---

## 🏗️ Stack

| Componente | Tecnología |
|-----------|-----------|
| Backend | NestJS 10+ |
| Frontend | Next.js 14+ |
| ORM | Prisma 5+ |
| DB | PostgreSQL 16 |
| Validación | class-validator |
| Styling | TailwindCSS + Shadcn/ui |

---

## ✨ Características

### ✅ Funciones Principales

- **Crear Contacto** → Nombre (MAX 20 chars), Email (único), Teléfono (único, formato ARG)
- **Listar Contactos** → Tabla paginada (10 items/página)
- **Eliminar Contacto** → Con confirmación
- **Editar Contacto** → Modal reutilizable

### ✨ Extras Implementados

- 🔍 **Búsqueda en Tiempo Real** → Por nombre, email, teléfono
- 🌓 **Dark/Light Mode** → Tema con TailwindCSS
- ✅ **Validaciones Backend** → Email y teléfono únicos, formato específico
- 💬 **Toast Notifications** → Feedback de acciones
- 📱 **Responsive Design** → Mobile, tablet, desktop
- 📊 **Paginación** → 10 contactos por página

---

## 📂 Estructura

```
challenge/
├── docker-compose.yml          # PostgreSQL local
├── backend/                    # NestJS + Prisma
│   ├── src/
│   │   ├── contacts/           # Módulo principal
│   │   │   ├── contacts.controller.ts
│   │   │   ├── contacts.service.ts
│   │   │   └── dto/
│   │   └── main.ts
│   ├── prisma/
│   │   ├── schema.prisma       # Modelo Contact
│   │   ├── seed.ts             # 5 contactos de prueba
│   │   └── migrations/
│   ├── test/                   # Unit tests
│   └── package.json
│
├── frontend/                   # Next.js + React
│   ├── src/
│   │   ├── app/
│   │   │   └── page.tsx        # Página principal
│   │   ├── components/         # ContactTable, SearchBar, etc
│   │   ├── hooks/              # useContacts, useSearch
│   │   ├── services/           # API client
│   │   └── types/
│   └── package.json
│
└── prompts/                    # Documentación
    ├── questions.md            # Preguntas respondidas
    ├── plan.md                 # Plan arquitectónico
    └── AGENTS.md               # Contexto para desarrollo
```

---

## 🔌 API Endpoints

```
POST   http://localhost:3001/api/contacts
GET    http://localhost:3001/api/contacts?search=nombre
GET    http://localhost:3001/api/contacts/:id
PUT    http://localhost:3001/api/contacts/:id
DELETE http://localhost:3001/api/contacts/:id
```

---

## 🧪 Testing

```bash
# Backend: Unit tests
cd backend
npm run test                # Ejecutar
npm run test:watch         # Watch mode
npm run test:cov           # Con cobertura
```

---

## 🎨 UI Preview

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 👤 Contactos          │ 🌙 Theme Toggle   ┃
┃ 4 contactos en total                      ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 🔍 Buscar...              │ ✚ Nuevo      ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ Contacto │ Teléfono │ Email │ Acciones   ┃
├──────────────────────────────────────────┤
┃ Juan P.  │ +541111  │ ...@g │ ✏️ 🗑️ │
┃ María G. │ +541112  │ ...@g │ ✏️ 🗑️ │
├──────────────────────────────────────────┤
┃ Pág 1 de 1 │ [◀ Anterior] [Siguiente ▶] ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## 🔒 Validaciones

### Email
- Formato: `usuario@dominio.com`
- Validación básica
- **Único** en BD

### Teléfono
- Formato argentino: `+54 911234567` o `+5491123456789`
- **Único** en BD

### Nombre
- Máximo **20 caracteres**
- Obligatorio

---

## 📊 Datos de Prueba (Seeder)

```
1. Juan Pérez       | juan@gmail.com      | +541112345678
2. María García     | maria@gmail.com     | +541123456789
3. Carlos López     | carlos@gmail.com    | +541134567890
4. Ana Martínez     | ana@gmail.com       | +541145678901
5. Luis Fernández   | luis@gmail.com      | +541156789012
```

Autoinserción con:
```bash
npx prisma db seed
```

---

## 💻 Comandos Útiles

### Backend
```bash
npm run start:dev              # Dev con hot reload
npm run build                  # Build production
npm run test                   # Tests
npm run prisma:studio         # UI Prisma Studio
npx prisma migrate status     # Ver migrations
npx prisma db seed            # Ejecutar seeder
```

### Frontend
```bash
npm run dev                    # Dev server (3000)
npm run build                  # Build
npm run start                  # Ejecutar build
npm run lint                   # Validar código
```

---

## 🐛 Troubleshooting

### **Error: "connect ECONNREFUSED" en backend**
✓ Verifica que Docker esté corriendo: `docker-compose up -d`

### **Error: "Email already exists"**
✓ Email duplicado, usa otro

### **Error: "Invalid phone format"**
✓ Teléfono debe ser formato argentino: `+54XXXXXXXXX`

### **Frontend no conecta a backend**
✓ Check `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:3001/api`

### **Prisma Studio no abre**
```bash
cd backend
npx prisma studio
```

---

## 📖 Documentación Completa

- **plan.md** - Arquitectura detallada
- **AGENTS.md** - Contexto para desarrollo
- **questions.md** - Requisitos respondidos

---

## 🚀 Próximos Pasos (Post-Dev)

- ☐ Deploy frontend en Vercel
- ☐ Deploy backend en Railway/Render
- ☐ PostgreSQL en Neon/Supabase
- ☐ CI/CD pipeline

---

## 📋 Checklist Final

- [ ] Docker corriendo
- [ ] Backend iniciado (3001)
- [ ] Frontend iniciado (3000)
- [ ] Datos seeder cargados
- [ ] Tests pasando
- [ ] Búsqueda funcionando
- [ ] Dark/Light mode operativo
- [ ] Paginación activa
- [ ] UX/UI responsive

---

## 👨‍💻 Arquitecto Responsable

**Rol**: Arquitecto de Software Senior
**Fecha**: 20/04/2026
**Status**: ✅ Ready for Development

---

### 🎯 Objetivo Cumplido

✅ Stack NestJS + Next.js + Prisma + PostgreSQL
✅ CRUD completo de contactos
✅ Búsqueda en tiempo real
✅ Validaciones backend
✅ UX/UI responsiva dark/light
✅ Tests unitarios
✅ Estructura modular limpia
✅ Documentación completa
✅ Listo para ejecución local

**¡A desarrollar!** 🚀
