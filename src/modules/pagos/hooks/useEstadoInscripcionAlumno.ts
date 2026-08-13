import { useCallback, useEffect, useState } from 'react';
import { listarInscripcionesDeAlumno } from '@/modules/inscripciones/services/inscripcionesService';
import { obtenerCuotaPendiente } from '../services/pagosService';
import type { Inscripcion } from '@/modules/inscripciones/types';
import type { Cuota } from '../types';
import type { ConId } from '@/types/firestore';

export type EstadoInscripcionAlumno =
  | { estado: 'cargando' }
  | { estado: 'sin-curso' }
  | { estado: 'con-cuota-pendiente'; inscripcion: ConId<Inscripcion>; cuota: ConId<Cuota> }
  | { estado: 'al-dia'; inscripcion: ConId<Inscripcion> };

export function useEstadoInscripcionAlumno(alumnoUid: string | undefined) {
  const [resultado, setResultado] = useState<EstadoInscripcionAlumno>({ estado: 'cargando' });

  const recargar = useCallback(async () => {
    if (!alumnoUid) {
      setResultado({ estado: 'sin-curso' });
      return;
    }
    setResultado({ estado: 'cargando' });

    const inscripciones = await listarInscripcionesDeAlumno(alumnoUid);
    if (inscripciones.length === 0) {
      setResultado({ estado: 'sin-curso' });
      return;
    }

    const inscripcion = inscripciones[0];
    const cuotaPendiente = await obtenerCuotaPendiente(alumnoUid);

    if (cuotaPendiente) {
      setResultado({ estado: 'con-cuota-pendiente', inscripcion, cuota: cuotaPendiente });
    } else {
      setResultado({ estado: 'al-dia', inscripcion });
    }
  }, [alumnoUid]);

  useEffect(() => {
    recargar();
  }, [recargar]);

  return { ...resultado, recargar };
}
