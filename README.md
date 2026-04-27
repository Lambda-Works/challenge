# � Contact Manager - COMPLETAMENTE FUNCIONAL

Aplicación full-stack de gestión de contactos con NestJS + Prisma + PostgreSQL (backend) y Next.js + React + Tailwind CSS (frontend).

---
Cómo correrlo desde 0
1. Base de datos (Docker)
cd /home/nicolas/Documentos/challenge
docker-compose up -d db

2. Backend (localhost:3001)
cd backend
npm install
npx prisma migrate dev     # crea las tablas
npx prisma db seed         # carga 5 contactos de prueba
npx prisma generate        
npm run start:dev

3. Frontend (localhost:3000)
cd frontend
npm install
npm run dev

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
