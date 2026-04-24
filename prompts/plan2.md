# Plan de Implementación: Firebase Auth (Fase 2)

Basado en el análisis del repositorio `challenge` y tus respuestas en `pregunta.md`, este es el plan de ejecución detallado para implementar Firebase Auth desde cero.

## 📋 Resumen del Enfoque
- **Directo a Firebase:** No se portará código de otros repositorios.
- **Sin Persistencia en DB (por ahora):** La autenticación se manejará 100% vía Firebase.
- **Foco en Funcionalidad Base:** Login/Register funcional sin lógica de roles (Admin) inicial.
- **Compatibilidad:** Actualización de Node.js a v20 para asegurar estabilidad.

---

## 🛠️ Fase 1: Preparación del Entorno
1.  **Actualización de Motores:**
    - Modificar `package.json` en `frontend` y `backend` para establecer `engines: { "node": ">=20" }`.
2.  **Instalación de Dependencias:**
    - **Backend:** `npm install firebase-admin`
    - **Frontend:** `npm install firebase`

## 🛠️ Fase 2: Configuración de Firebase
1.  **Backend (NestJS):**
    - Crear `FirebaseModule` y `FirebaseService`.
    - Configurar la inicialización de la SDK de Admin usando variables de entorno.
2.  **Frontend (Next.js):**
    - Crear `src/lib/firebase/config.ts` para inicializar la App de Firebase (Client SDK).

## 🛠️ Fase 3: Backend Auth (Guard Transparente)
1.  **Firebase Guard:**
    - Implementar un `Guard` que extraiga el token del header `Authorization: Bearer <token>`.
    - Validar el token con `firebase-admin`.
    - Inyectar el `uid` y `email` en `request.user`.
    - **Importante:** Asegurar que el Guard no interfiera con los `query parameters` (transparencia).

## 🛠️ Fase 4: Frontend Auth (Provider & UI)
1.  **AuthProvider:**
    - Implementar un Context API para manejar el estado del usuario (`user`, `loading`).
    - Escuchar cambios de estado con `onAuthStateChanged`.
2.  **Pantallas de Auth:**
    - Crear rutas `/login` y `/register`.
    - Implementar formularios básicos conectados a `signInWithEmailAndPassword` y `createUserWithEmailAndPassword`.

---

## 🚦 Próximos Pasos (Confirmación)
- [ ] ¿Deseas que proceda con la **Fase 1 (Actualización de Node y dependencias)** ahora mismo?
- [ ] ¿Tienes las credenciales de Firebase a mano para configurar el `.env`? (Solo confírmalo, no las pegues aquí).
