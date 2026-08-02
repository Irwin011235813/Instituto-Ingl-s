import type { Timestamp } from 'firebase/firestore';
import type { DiaSemana } from '@/types/common';

export type EstadoTurno = 'programado' | 'cancelado' | 'completado';

/** Documento en la colección turnos/{turnoId}. Un turno es una clase puntual de un curso. */
export interface Turno {
  cursoId: string;
  cursoNombre: string; // desnormalizado para listar sin joins
  dia: DiaSemana;
  horaInicio: string; // formato "HH:mm"
  horaFin: string; // formato "HH:mm"
  aula: string;
  cupoMaximo: number;
  inscriptos: number; // contador desnormalizado, se actualiza vía transacción
  estado: EstadoTurno;
  fechaCreacion: Timestamp;
}

export interface TurnoFormValues {
  cursoId: string;
  dia: DiaSemana;
  horaInicio: string;
  horaFin: string;
  aula: string;
  cupoMaximo: number;
}
