# 📇 Contact Manager

Aplicación full-stack de gestión de contactos con NestJS + Prisma + PostgreSQL (backend) y Next.js + React + Tailwind CSS (frontend).

---

## 🚀 Cómo correr el proyecto

### 1️⃣ Levanta PostgreSQL con Docker

```bash
docker-compose up -d
```

### 2️⃣ Inicia Backend (Puerto 3001)

En una terminal:

```bash
cd backend
npm install
cp .env.example .env
# Configura DATABASE_URL en .env si es necesario
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev
```

Verás: `🚀 Application is running on: http://localhost:3001`

### 3️⃣ Inicia Frontend (Puerto 3000)

En otra terminal:

```bash
cd frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" > .env.local
npm run dev
```

Verás: `▲ Next.js 14.2.35 - Local: http://localhost:3000`

✅ **Listo**: Abre http://localhost:3000

---

## 📋 Requisitos

- **Node.js** 18+
- **Docker** & **Docker Compose**
- **PostgreSQL** 16 (en Docker)

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

## 🧪 Testing

```bash
# Backend: Unit tests
cd backend
npm run test               # Ejecutar
npm run test:watch         # Watch mode
npm run test:cov           # Con cobertura
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
cd backend
npx prisma db seed
```

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

## 🔌 API Endpoints

```
POST   http://localhost:3001/api/contacts
GET    http://localhost:3001/api/contacts?search=nombre
GET    http://localhost:3001/api/contacts/:id
PUT    http://localhost:3001/api/contacts/:id
DELETE http://localhost:3001/api/contacts/:id
```

---

## 💻 Comandos Útiles

### Backend
```bash
cd backend
npm run start:dev             # Dev con hot reload
npm run build                 # Build production
npm run test                  # Tests
npx prisma studio             # UI Prisma Studio
npx prisma migrate status     # Ver migrations
npx prisma db seed            # Ejecutar seeder
```

### Frontend
```bash
cd frontend
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
