# 📋 Preguntas de Arquitectura - Contact Manager Challenge

Como tu Arquitecto de Software Senior, necesito aclarar algunos puntos para construir la solución óptima.

---

## 🔐 Autenticación & Seguridad

1. **¿Se requiere autenticación de usuarios?**
   - ¿Es una app multi-usuario donde cada usuario gestiona sus propios contactos?
   - No simplemente es una app con una tabla de contactos en la que se pueden agregar, eliminar, modificar y buscar contactos.

---

## 🎨 Interfaz & User Experience

2. **¿Qué framework de UI prefieres para Next.js?**
   - Material-UI (MUI)
   - TailwindCSS + componentes personalizados
   - Shadcn/ui
   - Chakra UI
   - Otro específico
   -Usa Shadcn/ui, asi que lo vas a tener que instalar vos.

3. **¿Qué tan detallada debe ser la interfaz?**
   - ¿Paginación en el listado de contactos?
   - ¿Modalidades (modal/drawer) para crear/editar?
   - ¿Notificaciones/Toast para feedback de acciones?
   - ¿Dark mode?
    - Si quiero que haga un dark mode y un light mode. Si quiero que haya paginacion a partir del 10 contacto.
---

## 🔍 Búsqueda & Filtrado

4. **Para el buscador de contactos, ¿qué búsquedas necesitas?**
   - ¿Búsqueda por nombre, email, teléfono?
   - ¿Búsqueda en tiempo real (mientras tipeas) o con botón?
   - ¿Búsqueda fuzzy o exacta?
   - Quiero que la busqueda sea por nombre, email y telefono. QUiero que si sea una busqueda en tiempo real, como si fuera un useEffect de react, desconozco como lo harias. 
---

## ✅ Validaciones & Reglas de Negocio

5. **Validaciones en backend, ¿algún detalle específico?**
   - Formato de email: ¿solo validación básica o verificación? SI una validacion basica como que la forma sea @gmail.com o similares.
   - Formato de teléfono: ¿internacional? ¿formato específico por país? El formato del telefono sea el argentino
   - ¿Campos obligatorios solo nombre, email, teléfono? Si los campos son obligatorios
   - ¿Longitud máxima/mínima de campos? SI que la maxima cantidad de caracteres sea de 20.

---

## 📊 Datos & Testing

6. **¿Necesitas datos de ejemplo?**
   - ¿Un seeder de Prisma con contactos de prueba? Si hacelo con 5 contactos de prueba.
   - ¿Fixtures para testing automático?

7. **¿Testing es requerido?**
   - ¿Unit tests en backend? Si hacelo, no hagas tests E2E.
   - ¿Tests E2E?
   - ¿O solo funcionalidad sin tests?

---

## 🚀 Despliegue & DevOps

8. **Para el deploy en Vercel:**
   - ¿Frontend en Vercel también?
   - ¿Backend en Vercel (serverless) o en otro servidor (Railway, Render, etc.)?
   - ¿Base de datos PostgreSQL alojada dónde? (Neon, Supabase, planetscale opcional, etc.)
   -Al final nos dijieron que lo corrieramos de forma local, que no hariamos en deploy para que sea mas rapido, es un tests sencillo.

---

## 📁 Estructura del Proyecto

9. **¿Prefieres estructura de proyectos?**
   - Monorepo (con Turbo, Nx, o yarn workspaces)?
   - Repos separados (frontend y backend independientes)? Quiero que hagas 2 carpetas principales, una para el frontend, otra para el backend. Dentro de la del backend hace una carpeta prisma con la db y la migracion.

---

## ✨ Extras Preferencias

10. **¿Hay algún aspecto específico que consideres crítico para la evaluación?**
    - Código limpio/arquitectura
    - Features completar
    - UX/UI
    - Performance
    - Documentación
    - Si quiero que la arquitectura se lismpia , de la forma rquitectura de Módulos Independientes. Quiero que siga nociones basicas d UX/UI, aunque solo va a ser una pagina responsive con la tabla, el buscador encima, y dentro de la tabla, en los usuarios el boton de eliminar y editar. Al lado del buscador quiero que este el boton de crear nuevo contacto. REvisa la imagen que te voy a mandar en el promt. Documenta lo que hagas en un AGENT.md que crees, y hace un README.md que resuma lo mas posible y que aparezca como compilar y ejecutar todo.
---

## 📝 Notas Finales

Por favor responde estas preguntas para que pueda crear:
- **plan.md** - Plan completo de arquitectura y componentes clave
- **AGENTS.md** - Contexto para futuros prompts durante el desarrollo

Una vez tengas claridad sobre algunas de estas preguntas, comparte tus respuestas y procederé con la arquitectura detallada.
