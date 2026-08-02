import type { Timestamp } from 'firebase/firestore';

export type EstadoInscripcion = 'activa' | 'cancelada';

/** Documento en la colección inscripciones/{inscripcionId} */
export interface Inscripcion {
  turnoId: string;
  cursoId: string;
  alumnoUid: string;
  alumnoNombre: string;
  estado: EstadoInscripcion;
  fechaInscripcion: Timestamp;
  fechaCancelacion: Timestamp | null;
}
