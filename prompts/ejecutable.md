# 🚀 Guía Ejecutable - Comandos Paso a Paso

## 📍 Estructura Base

```
challenge/
├── docker-compose.yml          # En backend/
├── backend/                    # Node + NestJS
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   ├── .env
│   └── docker-compose.yml
│
├── frontend/                   # Node + Next.js
│   ├── src/
│   ├── package.json
│   └── .env.local
│
└── prompts/                    # Documentación
    ├── ejecutable.md
    ├── plan.md
    └── AGENTS.md
```

---

## 🧹 LIMPIEZA TOTAL (si necesitas resetear)

### Ubicación: `/home/nicolas/Documentos/Local/challenge/backend`

```bash
# Ir a la carpeta backend
cd /home/nicolas/Documentos/Local/challenge/backend

# Borrar dependencias
rm -rf node_modules package-lock.json

# Borrar BD (si quieres resetear todo)
cd /home/nicolas/Documentos/Local/challenge
docker-compose down -v
```

---

## ⚡ PASO 1: Verificar Docker

### Ubicación: **CUALQUIER CARPETA**

```bash
# Ver containers activos
docker ps

# Resultado esperado: (puede estar vacío al inicio)
# CONTAINER ID   IMAGE      STATUS
```

---

## 🐳 PASO 2: Levantar PostgreSQL con Docker

### Ubicación: `/home/nicolas/Documentos/Local/challenge`

```bash
# Ir a la raíz del proyecto
cd /home/nicolas/Documentos/Local/challenge

# Levantar BD en background
docker-compose up -d

# Verificar que está arriba
docker-compose ps

# Resultado esperado:
# NAME           STATUS              PORTS
# test-postgres  Up X minutes        0.0.0.0:5432->5432/tcp
```

✅ **BD lista en**: `postgresql://test:test@localhost:5432/test`

---

## 🔧 PASO 3: Configurar Backend

### 3.1 - Copiar variables de entorno

**Ubicación**: `/home/nicolas/Documentos/Local/challenge/backend`

```bash
# Ir a backend
cd /home/nicolas/Documentos/Local/challenge/backend

# Copiar .env
cp .env.example .env

# Verificar
cat .env

# Resultado:
# DATABASE_URL=postgresql://test:test@localhost:5432/test
# NODE_ENV=development
# PORT=3001
```

---

### 3.2 - Instalar dependencias

**Ubicación**: `/home/nicolas/Documentos/Local/challenge/backend`

```bash
# Limpiar si hay instalación anterior
rm -rf node_modules package-lock.json

# Instalar (TARDA 3-5 MINUTOS)
npm install

# Instalar dependencias de autenticación
npm install @nestjs/jwt @nestjs/passport passport-jwt bcrypt
npm install -D @types/bcrypt

# Resultado esperado:
# added XXX packages in XXs
# npm notice
```

---

### 3.3 - Generar cliente Prisma

**Ubicación**: `/home/nicolas/Documentos/Local/challenge/backend`

```bash
# Generar las herramientas Prisma
npx prisma generate

# Resultado:
# ✔ Generated Prisma Client
```

---

### 3.4 - Crear tabla en BD (Migration)

**Ubicación**: `/home/nicolas/Documentos/Local/challenge/backend`

```bash
# Crear tabla "contacts" en la BD
npx prisma migrate dev

# Te preguntará:
# ? Enter a name for the new migration › init
# 
# Escribe: init
# Presiona Enter

# Resultado:
# ✔ Your database is now in sync with your schema
# ✔ Generated Prisma Client
```

---

### 3.5 - Insertar datos de prueba (Seeder)

**Ubicación**: `/home/nicolas/Documentos/Local/challenge/backend`

```bash
# Insertar 5 contactos de prueba
npx prisma db seed

# Resultado esperado:
# 🌱 Starting seed...
# ✓ Deleted all contacts
# ✓ Created contact: Juan Pérez
# ✓ Created contact: María García
# ✓ Created contact: Carlos López
# ✓ Created contact: Ana Martínez
# ✓ Created contact: Luis Fernández
# ✅ Seed completed!
```

---

### 3.6 - Verificar datos en BD (Opcional)

**Ubicación**: `/home/nicolas/Documentos/Local/challenge/backend`

```bash
# Abrir interfaz gráfica de Prisma
npx prisma studio

# Se abre: http://localhost:5555
# Verifica que ves 5 contactos
# Cierra con Ctrl+C
```

---

### 3.6b - Crear Módulo de Autenticación (NUEVO)

**Ubicación**: `/home/nicolas/Documentos/Local/challenge/backend`

Copiar el siguiente código a `src/auth/auth.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'tu-clave-secreta-cambiar-en-produccion', // TODO: Mover a .env
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
```

Crear `src/auth/auth.service.ts`:

```typescript
import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private prisma = new PrismaClient();

  constructor(private jwtService: JwtService) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya existe');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
      },
    });

    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    return {
      statusCode: 201,
      message: 'Usuario registrado exitosamente',
      data: {
        id: user.id,
        email: user.email,
        token,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    return {
      statusCode: 200,
      message: 'Login exitoso',
      data: {
        id: user.id,
        email: user.email,
        token,
      },
    };
  }
}
```

Crear `src/auth/auth.controller.ts`:

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
```

Crear DTOs:
- `src/auth/dto/login.dto.ts`
- `src/auth/dto/register.dto.ts`

Crear `src/auth/jwt.strategy.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'tu-clave-secreta', // Cambiar a variable .env
    });
  }

  validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
```

Crear `src/auth/jwt.guard.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {}
```

---

---

### 3.7 - Agregar AuthModule a app.module.ts

**Ubicación**: `/home/nicolas/Documentos/Local/challenge/backend`

Editar `src/app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { ContactsModule } from './contacts/contacts.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule, ContactsModule],
})
export class AppModule {}
```

---

### 3.7b - Proteger ContactsController con JWT

**Ubicación**: `/home/nicolas/Documentos/Local/challenge/backend/src/contacts/contacts.controller.ts`

Agregar al inicio:

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';

@UseGuards(JwtGuard)
@Controller('api/contacts')
export class ContactsController {
  // ... resto del código
}
```

---

### 3.8 - Iniciar Backend

**Ubicación**: `/home/nicolas/Documentos/Local/challenge/backend`

```bash
# Iniciar servidor NestJS
npm run start:dev

# Resultado esperado:
# [Nest] 12345  - LOG [NestFactory] Starting Nest application...
# [Nest] 12345  - LOG [InstanceLoader] AuthModule dependencies initialized
# [Nest] 12345  - LOG [InstanceLoader] ContactsModule dependencies initialized
# [Nest] 12345  - LOG [RoutesResolver] AuthController {/api/auth}:
# [Nest] 12345  - LOG [RoutesResolver] ContactsController {/api/contacts}:
# 🚀 Application is running on: http://localhost:3001

# ⚠️  MANTÉN ESTA TERMINAL ABIERTA
# NO CIERRES, SOLO MINIMIZA
```

---

## 💻 PASO 4: Configurar Frontend (NUEVA TERMINAL)

### 4.1 - Copiar variables de entorno

**Ubicación**: `/home/nicolas/Documentos/Local/challenge/frontend`

```bash
# Abre NUEVA terminal (Ctrl+Shift+`)
# Ir a frontend
cd /home/nicolas/Documentos/Local/challenge/frontend

# Copiar .env
cp .env.local.example .env.local

# Verificar
cat .env.local

# Resultado:
# NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

### 4.2 - Instalar dependencias

**Ubicación**: `/home/nicolas/Documentos/Local/challenge/frontend`

```bash
# Instalar (TARDA 3-5 MINUTOS)
npm install

# Resultado esperado:
# added XXX packages in XXs
# npm notice
```

---

### 4.2b - Crear LoginForm Component (NUEVO)

Crear `src/components/LoginForm/LoginForm.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        { email, password }
      );
      
      localStorage.setItem('token', response.data.data.token);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Iniciar Sesión</button>
    </form>
  );
}
```

Crear `src/app/login/page.tsx`:

```typescript
import { LoginForm } from '@/components/LoginForm/LoginForm';

export default function LoginPage() {
  return (
    <div>
      <h1>Iniciar Sesión</h1>
      <LoginForm />
      <p>¿No tienes cuenta? <a href="/register">Regístrate aquí</a></p>
    </div>
  );
}
```

Crear `src/app/register/page.tsx`:

```typescript
import { RegisterForm } from '@/components/RegisterForm/RegisterForm';

export default function RegisterPage() {
  return (
    <div>
      <h1>Registrarse</h1>
      <RegisterForm />
      <p>¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a></p>
    </div>
  );
}
```

Crear `src/components/RegisterForm/RegisterForm.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        { email, password }
      );
      
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse');
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Registrarse</button>
    </form>
  );
}
```

---

### 4.2c - Crear AuthContext y useAuth Hook

Crear `src/hooks/useAuth.ts`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return { isAuthenticated, logout };
}
```

Editar `src/app/layout.tsx`:

```typescript
'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';
  const { isAuthenticated, logout } = !isAuthPage ? useAuth() : { isAuthenticated: false, logout: () => {} };

  return (
    <html>
      <body>
        {!isAuthPage && isAuthenticated && (
          <header>
            <button onClick={logout}>Cerrar Sesión</button>
          </header>
        )}
        {children}
      </body>
    </html>
  );
}
```

---

### 4.3 - Iniciar Frontend

**Ubicación**: `/home/nicolas/Documentos/Local/challenge/frontend`

```bash
# Iniciar Next.js
npm run dev

# Resultado esperado:
# ▲ Next.js 14.0.3
# - Local:        http://localhost:3000
# ✓ Ready in 2.5s

# ⚠️  MANTÉN ESTA TERMINAL ABIERTA
# NO CIERRES, SOLO MINIMIZA
```

---

## 🎉 PASO 5: Verificar que TODO funciona

### 5.1 - Abrir navegador

**Abre**: `http://localhost:3000`

Deberías ver:
- ✅ Redirección automática a login
- ✅ Pantalla de login con email y contraseña
- ✅ Link para registrarse

**Prueba con:**
- Email: `test@example.com`
- Contraseña: `123456`

---

### 5.2 - Probar Flujo de Autenticación

**Abre TERCERA terminal** y ejecuta:

```bash
# 1. Registrar usuario
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@test.com","password":"password123"}'

# 2. Login y obtener token
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@test.com","password":"password123"}' | jq -r '.data.token')

# 3. Acceder a contactos con token
curl http://localhost:3001/api/contacts \
  -H "Authorization: Bearer $TOKEN"

# Resultado: JSON con 5 contactos
```

---

## 📊 Estado Final - 2 Terminales Activas

```
TERMINAL 1 (BACKEND):
📍 /home/nicolas/Documentos/Local/challenge/backend
$ npm run start:dev
🟢 http://localhost:3001


TERMINAL 2 (FRONTEND):
📍 /home/nicolas/Documentos/Local/challenge/frontend
$ npm run dev
🟢 http://localhost:3000
```

**MANTÉN AMBAS ABIERTAS MIENTRAS TRABAJES**

---

## 🧪 Comandos Útiles Posteriores

### Backend (en carpeta `backend/`)

```bash
# Ver BD en interfaz gráfica
npx prisma studio

# Resetear BD
npx prisma migrate reset

# Build para producción
npm run build

# Ejecutar en producción
npm run start:prod
```

### Frontend (en carpeta `frontend/`)

```bash
# Build para producción
npm run build

# Ejecutar build
npm run start
```

---

## 🚨 Troubleshooting

### ❌ "Port 3001 already in use"

```bash
# Cerrar proceso en puerto 3001
lsof -i :3001
kill -9 <PID>

# O reinicia backend: Ctrl+C en terminal backend y npm run start:dev
```

### ❌ "Port 3000 already in use"

```bash
# Cerrar proceso en puerto 3000
lsof -i :3000
kill -9 <PID>

# O reinicia frontend: Ctrl+C en terminal frontend y npm run dev
```

### ❌ "connect ECONNREFUSED"

```bash
# BD no está levantada, verifica:
docker-compose ps

# Si no está, levantala:
cd /home/nicolas/Documentos/Local/challenge
docker-compose up -d
```

### ❌ "Cannot find module"

```bash
# En la carpeta afectada (backend o frontend):
rm -rf node_modules package-lock.json
npm install
```

### ❌ "401 Unauthorized" en /api/contacts

```bash
# Necesitas enviar token JWT en header Authorization
# Asegúrate de:
# 1. Hacer login en /api/auth/login
# 2. Guardar el token devuelto
# 3. Enviar: Authorization: Bearer <token>

# Ejemplo correcto:
TOKEN="tu_token_aqui"
curl http://localhost:3001/api/contacts \
  -H "Authorization: Bearer $TOKEN"
```

### ❌ "Invalid token" o "Token expired"

```bash
# El token JWT tiene expiration (24 horas)
# Solución: Hacer login nuevamente

# Revisa que JWT_SECRET sea el mismo en:
# - src/auth/auth.module.ts
# - src/auth/jwt.strategy.ts
```

### ❌ "Email already exists"

```bash
# Ya hay un usuario con ese email
# Opciones:
# 1. Usar otro email para registro
# 2. Resetear BD: npx prisma migrate reset

# Esto elimina todas las tablas y re-crea
```

---

## ✅ Checklist de Verificación

- [ ] Docker corriendo: `docker ps`
- [ ] BD PostgreSQL activa con tabla users: `docker-compose ps`
- [ ] Backend .env configurado (DATABASE_URL, JWT_SECRET)
- [ ] Backend `npm install` completó (incluyendo @nestjs/jwt, bcrypt)
- [ ] Backend Migration ejecutada (crea tabla users y contacts)
- [ ] Backend Módulo Auth implementado (auth.service.ts, auth.controller.ts)
- [ ] Backend JwtGuard y JwtStrategy configurados
- [ ] Backend ContactsController protegido con @UseGuards(JwtGuard)
- [ ] Backend corriendo en http://localhost:3001
- [ ] Backend /api/auth/register funciona
- [ ] Backend /api/auth/login funciona y devuelve token
- [ ] Frontend .env.local configurado (NEXT_PUBLIC_API_URL)
- [ ] Frontend `npm install` completó
- [ ] Frontend LoginForm component creado
- [ ] Frontend RegisterForm component creado
- [ ] Frontend useAuth hook implementado
- [ ] Frontend Rutas /login y /register funcionan
- [ ] Frontend login redirige a / con token
- [ ] Frontend corriendo en http://localhost:3000
- [ ] Frontend / protegida (redirige a /login sin token)
- [ ] Login funciona desde interfaz (email: test@example.com, password: 123456)
- [ ] Logout borra token y redirige a /login
- [ ] Curl GET /api/contacts sin token falla (401)
- [ ] Curl GET /api/contacts con token devuelve 5 contactos

---

## 📝 Resumen de Carpetas

| Tarea | Carpeta |
|-------|---------|
| Docker BD | `/challenge` |
| Backend setup | `/challenge/backend` |
| Backend instalar | `/challenge/backend` |
| Backend iniciar | `/challenge/backend` |
| Frontend setup | `/challenge/frontend` |
| Frontend instalar | `/challenge/frontend` |
| Frontend iniciar | `/challenge/frontend` |

---

**¡Listo!** Una vez que TODO está verde, podés empezar a desarrollar. 🚀

