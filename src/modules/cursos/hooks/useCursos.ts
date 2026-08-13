import { useCallback, useEffect, useState } from 'react';
import { listarCursosActivos } from '../services/cursosService';
import type { Curso } from '../types';
import type { ConId } from '@/types/firestore';

export function useCursos() {
  const [cursos, setCursos] = useState<ConId<Curso>[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const datos = await listarCursosActivos();
      setCursos(datos);
    } catch (err) {
      console.error('Error cargando cursos:', err);
      setError('No se pudieron cargar los cursos. Revisá la consola y el índice de Firestore.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    recargar();
  }, [recargar]);

  return { cursos, cargando, error, recargar };
}
