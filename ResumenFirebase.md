# 🚀 Resumen de Migración a Firebase Auth & Dockerización

Este documento resume las implementaciones y correcciones realizadas desde el inicio de la Fase 2 para completar el sistema de gestión de contactos con autenticación profesional.

## 🛡️ 1. Sistema de Autenticación (Firebase)

Se ha migrado de un sistema local a una solución robusta basada en **Firebase Authentication**.

### Backend (NestJS)
- **Firebase Admin SDK:** Integrado para la validación de tokens en el servidor.
- **FirebaseAuthGuard:** Un protector global que intercepta cada petición y valida el `Bearer Token` enviado por el frontend.
- **Manejo de Errores:** Sistema de captura de errores de Firebase para evitar filtraciones de información sensible y dar respuestas claras (401/500).

### Frontend (Next.js)
- **Firebase Client SDK:** Configurado para manejar el flujo de sesión del usuario.
- **Proveedores de Acceso:** 
  - Email / Contraseña.
  - **Google Auth:** Botón de inicio de sesión rápido integrado.
- **Interceptor de Axios:** Se configuró para que el token de Firebase se adjunte automáticamente a todas las llamadas de la API de contactos.
- **authStateReady:** Implementado para asegurar que la app no haga peticiones antes de que Firebase esté inicializado.

## 🐳 2. Infraestructura y Docker

Se implementó una arquitectura de microservicios orquestada por Docker.

- **Orquestación:** Un archivo `docker-compose.yml` que levanta la base de datos (PostgreSQL), el Backend y el Frontend de forma coordinada.
- **Optimización de Imágenes:**
  - Se utilizó `node:20-slim` en el backend para resolver incompatibilidades críticas de **Prisma** con librerías de SSL.
  - Multi-stage builds para reducir el tamaño de las imágenes finales.
- **Redes:** Configuración de `0.0.0.0` en NestJS para permitir la comunicación fluida entre contenedores y el host.

## 🔧 3. Ajustes de Reglas de Negocio (Argentina)

Se refinó la validación de contactos para adaptarla al mercado local:
- **Teléfonos:** Ahora permite formatos comunes como `+54 9 11 1234-5678`, espacios y guiones.
- **Límites:** Se estableció un rango estricto de **10 a 13 dígitos** reales para evitar números incompletos o inválidos.

## 🐞 4. Bugs Críticos Resueltos

| Problema | Solución |
| :--- | :--- |
| **Private Key Inválida** | Se corrigió el formato de saltos de línea (`\n`) en el archivo `.env`. |
| **Network Error** | Se forzó la escucha del backend en todas las interfaces de red (`0.0.0.0`). |
| **libssl.so.1.1 not found** | Cambio de imagen base de Alpine a Debian Slim para compatibilidad con Prisma. |
| **401 Unauthorized inicial** | Implementación de `authStateReady()` en el frontend para esperar la carga del usuario. |
| **Table contacts doesn't exist** | Sincronización forzada mediante `prisma db push`. |

---

## 📋 Comandos Útiles para el Futuro

### Levantar todo el sistema
```bash
sudo docker compose up -d --build
```

### Sincronizar Base de Datos (si cambias el schema)
```bash
sudo docker exec -it contact-manager-backend npx prisma db push
```

### Ver Logs de Errores
```bash
sudo docker logs contact-manager-backend
```

## 🧩 Pequeños Obstáculos y Lecciones Aprendidas

Durante el proceso, enfrentamos varios desafíos que requirieron ajustes finos:

1.  **Validación de Teléfonos:** Inicialmente, el sistema era demasiado estricto y rechazaba el formato argentino real (espacios, guiones y el prefijo móvil `9`). Lo ajustamos tanto en Backend como en Frontend para permitir entre 10 y 13 dígitos con formato flexible.
2.  **Sincronización de Sesión (401 Error):** Descubrimos que el Frontend a veces intentaba cargar contactos antes de que Firebase terminara de inicializarse. Se solucionó con `authStateReady()`.
3.  **Conflictos de Puertos:** En varias ocasiones, el puerto `3001` estaba ocupado por procesos locales, lo que impedía que Docker levantara el contenedor. Aprendimos a limpiar puertos antes de iniciar.
4.  **Incompatibilidad de Librerías (Prisma):** La imagen `Alpine` de Docker nos dio guerra con `libssl.so.1.1`. La solución definitiva fue migrar a `node:20-slim`.
5.  **Tablas Fantasma:** Aunque la base de datos estaba arriba, las tablas no siempre se creaban automáticamente por los errores de crash. El comando `npx prisma db push` fue el "salvavidas" para sincronizar todo.

---
**¡Proyecto migrado y funcional!** ✨
