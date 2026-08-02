import { useCallback, useEffect, useState } from 'react';
import { listarInscripcionesDeAlumno } from '../services/inscripcionesService';
import type { Inscripcion } from '../types';
import type { ConId } from '@/types/firestore';

export function useInscripcionesDeAlumno(alumnoUid: string | undefined) {
  const [inscripciones, setInscripciones] = useState<ConId<Inscripcion>[]>([]);
  const [cargando, setCargando] = useState(true);

  const recargar = useCallback(async () => {
    if (!alumnoUid) {
      setInscripciones([]);
      setCargando(false);
      return;
    }
    setCargando(true);
    const datos = await listarInscripcionesDeAlumno(alumnoUid);
    setInscripciones(datos);
    setCargando(false);
  }, [alumnoUid]);

  useEffect(() => {
    recargar();
  }, [recargar]);

  return { inscripciones, cargando, recargar };
}
