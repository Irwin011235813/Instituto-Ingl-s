# Guía: Sincronización en Tiempo Real de Roles en Firestore + React

## 📋 Resumen del Problema y Solución

**Problema:** El rol se cambia en Firestore pero la UI no lo refleja, o la consulta de datos queda bloqueada en un solo rol.

**Raíz:** Los hooks usan `getDocs()` (una sola lectura) en lugar de `onSnapshot()` (listener en tiempo real).

---

## ✅ 1. AuthContext: Ya Está Correcto

Tu `AuthContext.tsx` ya implementa el patrón correcto:

```typescript
// ✅ CORRECTO: Usa onSnapshot para escuchar cambios
const unsubscribePerfil = onSnapshot(
  doc(db, 'usuarios_autorizados', user.uid),
  (snap) => {
    const datos = snap.data() as UsuarioAutorizado;
    setPerfil(datos); // Actualiza cuando Firestore cambia
  }
);
```

**Por qué funciona:**
- `onSnapshot` abre una conexión permanente a Firestore
- Cada vez que el documento cambia, se ejecuta el callback
- `setPerfil()` dispara re-renders en componentes que usan `useAuth()`

---

## ⚠️ 2. El Problema: useCursos No Es Reactivo

Tu hook actual:

```typescript
// ❌ INCORRECTO: Solo carga una vez
export function useCursos() {
  useEffect(() => {
    recargar(); // Se ejecuta solo al montar
  }, [recargar]);
  // ...
}
```

**Problema:** Si el rol cambia (alumno → profesor), los cursos visibles no se actualizan.

---

## ✅ 3. Solución: useCursos Reactivo al Rol

### Opción A: Listener en Tiempo Real (Recomendado)

```typescript
import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { useAuth } from '@/context/useAuth';
import type { Curso } from '../types';
import type { ConId } from '@/types/firestore';

export function useCursos() {
  const { perfil } = useAuth(); // Reactivo: cambia cuando AuthContext actualiza
  const [cursos, setCursos] = useState<ConId<Curso>[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Si no hay perfil, no hacer nada
    if (!perfil) {
      setCursos([]);
      setCargando(false);
      return;
    }

    setCargando(true);
    setError(null);

    // Construir query según el rol
    let q;
    if (perfil.rol === 'admin') {
      // Admins ven TODOS los cursos activos
      q = query(
        collection(db, 'cursos'),
        where('activo', '==', true)
      );
    } else if (perfil.rol === 'profesor') {
      // Profesores solo ven sus propios cursos
      q = query(
        collection(db, 'cursos'),
        where('activo', '==', true),
        where('profesor.uid', '==', perfil.uid) // Asume que el profesor es una ref
      );
    } else {
      // Alumnos: cursos disponibles para inscripción
      q = query(
        collection(db, 'cursos'),
        where('activo', '==', true)
      );
    }

    // CLAVE: onSnapshot + unsubscribe
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const datos = snap.docs
          .map((d) => ({ id: d.id, ...(d.data() as Curso) }))
          .sort((a, b) => a.nombre.localeCompare(b.nombre));
        setCursos(datos);
        setCargando(false);
      },
      (err) => {
        console.error('Error escuchando cursos:', err);
        setError('No se pudieron cargar los cursos.');
        setCargando(false);
      }
    );

    // Limpiar suscripción al desmontar o cambiar rol
    return () => unsubscribe();
  }, [perfil]); // Re-suscribirse cuando cambia el rol

  return { cursos, cargando, error };
}
```

**Ventajas:**
- ✅ Automático: cambias el rol en Firestore → la UI se actualiza al instante
- ✅ Reactivo: depende de `perfil` en el dependency array
- ✅ Limpio: `unsubscribe()` en return previene memory leaks
- ✅ Filtrado correcto: cada rol ve solo lo que le corresponde

---

### Opción B: Refetch Manual (Si no quieres listener permanente)

```typescript
export function useCursos() {
  const { perfil } = useAuth();
  const [cursos, setCursos] = useState<ConId<Curso>[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    if (!perfil) return;

    setCargando(true);
    setError(null);

    try {
      const datos = await listarCursosPorRol(perfil.rol, perfil.uid);
      setCursos(datos);
    } catch (err) {
      setError('No se pudieron cargar los cursos.');
    } finally {
      setCargando(false);
    }
  }, [perfil]);

  useEffect(() => {
    recargar();
  }, [recargar, perfil]); // Re-fetch cuando cambia el rol

  return { cursos, cargando, error, recargar };
}
```

Y en `cursosService.ts`:

```typescript
export async function listarCursosPorRol(
  rol: string,
  uid: string
): Promise<ConId<Curso>[]> {
  let q;

  if (rol === 'admin') {
    q = query(cursosRef, where('activo', '==', true));
  } else if (rol === 'profesor') {
    q = query(
      cursosRef,
      where('activo', '==', true),
      where('profesor.uid', '==', uid)
    );
  } else {
    q = query(cursosRef, where('activo', '==', true));
  }

  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Curso) }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre));
}
```

---

## 📊 Comparación de Patrones

| Aspecto | onSnapshot | getDocs + useCallback |
|--------|-----------|----------------------|
| **Latencia** | Inmediata | Pequeño delay (query) |
| **Uso de datos** | Posible alto (listener permanente) | Bajo (solo cuando user hace acciones) |
| **Complejidad** | Fácil | Media |
| **Ideal para** | Dashboards, datos críticos | Listados que cambian poco |

**Recomendación:** Para roles y permisos, usa `onSnapshot`.

---

## 🔍 4. Verificación: Cómo Saber Que Funciona

### Test en Navegador

1. Abre DevTools (`F12`)
2. Vé a la pestaña **Network**
3. Abre la app y logueate
4. Ve a Firebase Console y cambia el `rol` en `usuarios_autorizados/{uid}`
5. **Si está correctamente implementado:**
   - Verás 1-2 llamadas a Firestore (listeners)
   - La UI se actualiza sin recargar la página
   - Los cursos mostrados cambian según el nuevo rol

### Console Logs (Debug)

Agrega logs temporales:

```typescript
useEffect(() => {
  console.log('🔄 Rol cambió a:', perfil?.rol);
  // ... rest of the effect
}, [perfil]);
```

---

## 🚀 5. Orden Recomendado de Implementación

1. ✅ **AuthContext** → Ya tiene `onSnapshot`
2. 🔧 **useCursos** → Reemplaza con versión reactiva (Opción A)
3. ✅ **RoleRoute.tsx** → Ya valida según `perfil.rol`
4. ✅ **DashboardPage.tsx** → Ya muestra rol según `perfil.rol`

---

## 📌 Resumen de la Arquitectura Completa

```
Firestore: usuarios_autorizados/{uid}
           └─ rol: "admin|profesor|alumno"
           └─ nombre, email, etc.
                    ↓ onSnapshot
         AuthContext.tsx
              ↓ setPerfil(datos)
         useAuth() → perfil
              ↓ dependency array
         useCursos() [reactive]
              ↓ filtra según perfil.rol
         <CursosPage />
              ↓ onSnapshot en listener
         <Navbar /> muestra Cursos link solo si admin/profesor
```

---

## ⚠️ Casos Comunes y Soluciones

### Caso 1: "Cambié el rol pero sigue igual"
**Causa:** useCursos no reacciona al rol.
**Solución:** Agrega `perfil` en dependency array de useEffect.

### Caso 2: "Veo el rol correcto en el badge pero no los cursos"
**Causa:** La query de cursos está mal filtrada.
**Solución:** Verifica que `profesor.uid` en el documento cursos sea igual al `perfil.uid`.

### Caso 3: "Cambio de rol pero toma 5 segundos"
**Causa:** Usando `getDocs` + useCallback (Opción B).
**Solución:** Cambia a `onSnapshot` (Opción A).

### Caso 4: "Veo error 'Missing index' en Firestore"
**Causa:** Composite query necesita índice (múltiples `where`).
**Solución:** Firestore te dará un link para crear el índice. Hacé clic.

---

## 🎯 Checklist Final

- [ ] AuthContext usa `onSnapshot` ✅
- [ ] useCursos tiene `perfil` en dependency array
- [ ] useCursos usa `onSnapshot` o `getDocs` + recargar en `perfil` change
- [ ] RoleRoute valida correctamente el rol
- [ ] Badge de debug muestra el rol actual
- [ ] Cambias rol en Firestore → se refleja en UI instantáneamente
