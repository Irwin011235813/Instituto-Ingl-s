import { useCallback, useEffect, useState } from 'react';
import { listarTurnosProgramados } from '../services/turnosService';
import type { Turno } from '../types';
import type { ConId } from '@/types/firestore';

export function useTurnos() {
  const [turnos, setTurnos] = useState<ConId<Turno>[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const datos = await listarTurnosProgramados();
      setTurnos(datos);
    } catch {
      setError('No se pudieron cargar los turnos.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    recargar();
  }, [recargar]);

  return { turnos, cargando, error, recargar };
}
