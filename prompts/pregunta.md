# Análisis y Plan de Migración (Repo: Lambda-Repo/challenge)

Tras analizar el repositorio `challenge`, he identificado el estado base del proyecto y los pasos necesarios para la migración a Firebase Auth.

## 🔍 Resultado del Análisis
- **Backend (NestJS):** Actualmente solo cuenta con el módulo de `contacts`. No existe lógica de autenticación, controladores de usuario, ni middlewares de validación de JWT en este repositorio.
- **Frontend (Next.js 14):** Estructura básica con `next-themes`. No hay rutas de `/login`, `/register`, ni manejo de sesiones.
- **Base de Datos (Prisma):** La tabla `User` no está definida en el `schema.prisma`. Solo existe el modelo `Contact`.

## 🎯 Estrategia de Migración
Dado que el sistema de autenticación "actual" mencionado en el prompt no está presente en este repo, la estrategia se divide en:

1. **Fase 0: Sincronización o Definición Base**
   - Decidir si se debe importar la lógica de `ReLambda` o si empezamos la implementación de Firebase directamente sobre esta base limpia.
   - Definición del modelo `User` en Prisma.

   Res: No importamos la lógica de ReLambda implementamos directamente Firebase. Luego no definimos el modelo User en Prisma

2. **Fase 1: Configuración de Firebase (Core)**
   - Inicialización de `firebase-admin` en NestJS (vía un módulo global).
   - Configuración de Firebase Client en Next.js.

   Res: Si mandale.

3. **Fase 2: Backend Auth (NestJS)**
   - Creación de un `AuthGuard` que valide `IdTokens` de Firebase.
   - Implementación de **Custom Claims** para manejo de roles (Admin).
   - Inyección de datos de usuario en la `Request` de NestJS.

   Res: Todo si. Por ahora ignora eso de manejo de roles del admin.

4. **Fase 3: Frontend Auth (Next.js)**
   - Creación de `AuthProvider` con Context API.
   - Implementación de pantallas de Login/Register conectadas a Firebase.
   - Protección de rutas y persistencia.

   Res: Hace todo menos lo proteccion de rutas y persistencias para el admin.   

## ⚠️ Requerimientos Críticos
- **Actualización de Node.js:** Es mandatorio subir a **v20+** para soportar el ecosistema moderno de Firebase y Next.js 14.
- **Transparencia en el Guard:** El diseño asegurará que los `query parameters` permanezcan intactos, permitiendo filtros y paginación fluida.

Res: Mandale. Exitos