# 📝 Cambios Implementados - Branch: Paginación + Loading

**Autor:** Nicolas  
**Fecha:** 23 de Abril, 2026  
**Branch:** paginacion-loading (rama individual) → merge a `ui-update` junto con Dev 4 (Filtros + Favs)

---

## 🎯 Contexto de la Tarea

Trabajo en equipo de 4 devs, cada uno con su propia branch:

| Dev | Tarea | Branch relacionada |
|-----|-------|--------------------|
| Dev 1 | OAuth Google + Firebase | individual → ui-update |
| Dev 2 | User Admin + Panel + Ruta Protegida | individual → ui-update |
| **Dev 3 (yo)** | **Paginación + Loading** | **individual → ui-update** |
| Dev 4 | Filtros + Favs | individual → ui-update |

> ⚠️ Se nos informó que las ramas de Dev 3 y Dev 4 no van a funcionar completamente hasta que se mergeen en `ui-update`. Esto es esperado.

---

## ✅ Bugs Corregidos

### Bug 1 — Debounce de búsqueda no recargaba al limpiar el campo

**Archivo:** `frontend/src/hooks/useContacts.ts`

**Problema:** El `useEffect` del debounce tenía una condición `if (searchQuery)` que impedía llamar a `fetchContacts` cuando el usuario borraba todo el texto. La lista quedaba congelada en los resultados anteriores.

**Fix:**
```diff
- if (searchQuery) {
-   fetchContacts(searchQuery);
- }
+ fetchContacts(searchQuery || undefined);
```

**Cómo funciona ahora:**
- Si hay texto → pasa el texto: `GET /contacts?search=juan`
- Si el campo está vacío → pasa `undefined`: `GET /contacts` (trae todos)

---

### Bug 2 — Loading no diferenciaba carga inicial de búsqueda

**Archivos:** `useContacts.ts`, `ContactTable.tsx`, `page.tsx`

**Problema:** El estado `isLoading` era uno solo para todo. No había forma de mostrar "Cargando contactos..." vs "Buscando usuarios..." con mensajes distintos.

**Fix en `useContacts.ts`:**
- Agregado estado `isSearching: boolean`
- `fetchContacts` activa `isSearching` si recibe texto, `isLoading` si no
- Ambos se apagan en el `finally`

```typescript
const [isSearching, setIsSearching] = useState(false);

const fetchContacts = async (search?: string) => {
  if (search) {
    setIsSearching(true);  // vino de la búsqueda
  } else {
    setIsLoading(true);    // carga inicial o reset
  }
  // ... finally: setIsLoading(false); setIsSearching(false);
};
```

**Fix en `ContactTable.tsx`:**
- Nuevas props: `isSearching?: boolean`, `searchQuery?: string`
- Spinner CSS animado (sin dependencias externas) reemplaza el texto plano
- 3 estados visuales distintos:
  1. `isLoading` → spinner + "Cargando contactos..."
  2. `isSearching` → spinner + "Buscando usuarios..."
  3. `contacts.length === 0` → "No se encontraron contactos para 'X'" | "No hay contactos para mostrar"

**Fix en `page.tsx` (2 líneas):**
```diff
  const {
    contacts,
    isLoading,
+   isSearching,
    // ...
  } = useContacts();

  <ContactTable
    // ...
    isLoading={isLoading}
+   isSearching={isSearching}
+   searchQuery={searchQuery}
  />
```

---

### Bug 3 — Flash de página incorrecta al buscar + doble fetch al montar

**Archivo:** `frontend/src/hooks/useContacts.ts`

**Problema A (Bug 3):** El usuario estaba en la página 3, escribía en el buscador, y durante los 300ms del debounce la tabla seguía mostrando la página 3 del estado anterior. La página no se reseteaba hasta que llegaba la respuesta del backend.

**Problema B (optimización pendiente):** Al montar el componente se disparaban DOS requests a la API: uno del `useEffect` del debounce (que corría aunque `searchQuery` no había cambiado) y otro del `useEffect` de fetch inicial.

**Fix (ambos resueltos juntos):**
```typescript
const isFirstRender = useRef(true);

useEffect(() => {
  // Optimización: saltear el debounce en el primer render.
  // El initial fetch lo maneja el segundo useEffect.
  if (isFirstRender.current) {
    isFirstRender.current = false;
    return;
  }

  setCurrentPage(1); // Bug 3: reset INSTANTÁNEO antes del fetch

  const debounceTimer = setTimeout(() => {
    fetchContacts(searchQuery || undefined);
  }, 300);

  return () => clearTimeout(debounceTimer);
}, [searchQuery]);

// Initial fetch (único, sin colisionar con el debounce)
useEffect(() => {
  fetchContacts();
}, []);
```

**Resultado:**
- Al montar → solo 1 request (el initial fetch)
- Al buscar → página se resetea a 1 inmediatamente, spinner aparece tras 300ms
- Al limpiar búsqueda → página a 1 instantáneo, recarga todos los contactos

---

## ⚠️ Riesgos de Merge en `page.tsx`

El archivo `page.tsx` fue modificado con **2 líneas agregadas**. Es el archivo más compartido del frontend y donde existe mayor riesgo de conflicto.

### Cambios exactos realizados:

**1. Destructuración del hook (zona ~línea 14):**
```typescript
const { isSearching, ... } = useContacts();
```

**2. Props de `<ContactTable />` (zona ~línea 119):**
```typescript
<ContactTable
  isSearching={isSearching}
  searchQuery={searchQuery}
  // ... resto de props existentes
/>
```

### Probabilidad de conflicto por dev:

| Dev | Zona que tocan | Riesgo |
|-----|---------------|--------|
| Dev 1 (OAuth) | Wraps de auth, header, redirección | 🟡 Bajo |
| Dev 2 (Admin) | Rutas protegidas, nuevo layout | 🟡 Bajo |
| **Dev 4 (Filtros)** | **Misma destructuración + mismas props de ContactTable** | 🔴 **Medio** |

### Cómo resolver si hay conflicto con Dev 4:

Git va a marcar algo así:
```
<<<<<<< paginacion-loading
  isLoading={isLoading}
  isSearching={isSearching}
  searchQuery={searchQuery}
=======
  isLoading={isLoading}
  activeFilter={activeFilter}
  showFavs={showFavs}
>>>>>>> ui-update
```

**Resolución:** simplemente juntar todas las props:
```tsx
isLoading={isLoading}
isSearching={isSearching}
searchQuery={searchQuery}
activeFilter={activeFilter}
showFavs={showFavs}
```

> 💬 **Avisarle a Dev 4** que `ContactTable` ahora recibe `isSearching` y `searchQuery`, para que no las pise al mergear.

---

## 📂 Archivos Modificados

| Archivo | Tipo de cambio | Riesgo de conflicto |
|---------|---------------|---------------------|
| `frontend/src/hooks/useContacts.ts` | Modificado | 🟡 Medio (Dev 4 también lo toca) |
| `frontend/src/components/ContactTable/ContactTable.tsx` | Modificado | 🟢 Bajo |
| `frontend/src/app/page.tsx` | Modificado (2 líneas) | 🔴 Medio (archivo compartido) |

---

## 🔮 Pendientes / Mejoras Futuras

### Mejora visual: números de página
La paginación actual solo tiene `← Anterior / Siguiente →`. Se podría agregar botones numéricos (1, 2, 3...) directamente en `ContactTable.tsx` sin afectar otros archivos:

```tsx
// En ContactTable.tsx, dentro del bloque de paginación:
{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
  <button
    key={page}
    onClick={() => onPageChange?.(page)}
    className={`px-3 py-1 rounded ${
      page === currentPage
        ? 'bg-blue-500 text-white'
        : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300'
    }`}
  >
    {page}
  </button>
))}
```

> ⚠️ Si hay muchas páginas (ej: 50), habría que agregar lógica de "window" (mostrar solo páginas cercanas a la actual). Para el volumen esperado de la app (pocas decenas de contactos), no es urgente.

---

## 🧪 Cómo Probar

```bash
# Terminal 1: DB
docker-compose up -d

# Terminal 2: Backend
cd backend && npm run start:dev

# Terminal 3: Frontend
cd frontend && npm run dev
```

Abrir `http://localhost:3000`

### Checklist de pruebas manuales:

- [ ] Al abrir la app → aparece spinner + "Cargando contactos..."
- [ ] Al escribir en el buscador → aparece spinner + "Buscando usuarios..."
- [ ] Al borrar la búsqueda → se recargan todos los contactos
- [ ] Búsqueda sin resultados → "No se encontraron contactos para 'X'"
- [ ] Con 11+ contactos → aparecen botones de paginación
- [ ] Estando en página 2+, al escribir → vuelve a página 1 instantáneamente

### Crear contactos de prueba para testear paginación (necesitás 11+):
```bash
for i in {1..15}; do
  curl -s -X POST http://localhost:3001/api/contacts \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"Contacto $i\",\"email\":\"contact$i@test.com\",\"phone\":\"+5411000000$i\"}" > /dev/null
done
echo "✅ 15 contactos creados"
```
