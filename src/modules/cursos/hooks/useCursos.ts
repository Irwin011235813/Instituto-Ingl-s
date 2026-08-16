import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { useAuth } from '@/context/useAuth';
import type { Curso } from '../types';
import type { ConId } from '@/types/firestore';

/**
 * Hook reactivo que escucha cambios de cursos en Firestore.
 * Automáticamente filtra según el rol del usuario logueado.
 *
 * - admin: ve todos los cursos activos
 * - profesor: ve solo sus propios cursos
 * - alumno: ve cursos disponibles para inscripción
 */
export function useCursos() {
  const { perfil, usuarioFirebase } = useAuth(); // Reactivo: cambia cuando el rol se actualiza
  const [cursos, setCursos] = useState<ConId<Curso>[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Si no hay perfil o usuario Firebase aún, no hacer nada
    if (!perfil || !usuarioFirebase) {
      setCursos([]);
      setCargando(false);
      return;
    }

    setCargando(true);
    setError(null);

    // Construir query dinámica según el rol
    let q;
    if (perfil.rol === 'admin') {
      // Admins ven TODOS los cursos activos
      q = query(collection(db, 'cursos'), where('activo', '==', true));
    } else if (perfil.rol === 'profesor') {
      // Profesores solo ven sus propios cursos activos
      // NOTA: Asume que 'profesor' es un objeto con 'uid'
      q = query(
        collection(db, 'cursos'),
        where('activo', '==', true),
        where('profesor.uid', '==', usuarioFirebase.uid)
      );
    } else {
      // Alumnos: todos los cursos activos disponibles
      q = query(collection(db, 'cursos'), where('activo', '==', true));
    }

    // Listener en tiempo real: se ejecuta cada vez que hay cambios
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const datos = snap.docs
          .map((d) => ({ id: d.id, ...(d.data() as Curso) }))
          .sort((a, b) => a.nombre.localeCompare(b.nombre));

        setCursos(datos);
        setCargando(false);
        // eslint-disable-next-line no-console
        console.log(`📚 Cursos cargados para rol "${perfil.rol}":`, datos.length);
      },
      (err) => {
        // Error al escuchar (p.ej. índice faltante)
        console.error('❌ Error escuchando cursos:', err);
        setError(
          'No se pudieron cargar los cursos. Revisá la consola y verifica los índices en Firestore.'
        );
        setCargando(false);
      }
    );

    // Limpiar suscripción cuando el componente se desmonta o cambia el rol
    return () => {
      // eslint-disable-next-line no-console
      console.log('🛑 Desuscribiendo listener de cursos');
      unsubscribe();
    };
  }, [perfil, usuarioFirebase]); // Re-suscribir cuando cambia el rol, perfil o usuario

  return { cursos, cargando, error };
}
