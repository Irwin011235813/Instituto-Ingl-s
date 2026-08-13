import { useCallback, useEffect, useState } from 'react';
import { listarCuotasDeAlumno } from '../services/pagosService';
import type { Cuota } from '../types';
import type { ConId } from '@/types/firestore';

export function useCuotasDeAlumno(alumnoUid: string | undefined) {
  const [cuotas, setCuotas] = useState<ConId<Cuota>[]>([]);
  const [cargando, setCargando] = useState(true);

  const recargar = useCallback(async () => {
    if (!alumnoUid) {
      setCuotas([]);
      setCargando(false);
      return;
    }
    setCargando(true);
    const datos = await listarCuotasDeAlumno(alumnoUid);
    setCuotas(datos);
    setCargando(false);
  }, [alumnoUid]);

  useEffect(() => {
    recargar();
  }, [recargar]);

  return { cuotas, cargando, recargar };
}
