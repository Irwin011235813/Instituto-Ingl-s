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

export type EstadoPreInscripcion = 'nueva' | 'contactada' | 'descartada';

/**
 * Documento en inscripciones_pendientes/{id}. Captura el interés de un
 * visitante NO autenticado (landing pública) para que el instituto lo
 * contacte manualmente.
 */
export interface InscripcionPendiente {
  nombre: string;
  email: string;
  telefono: string;
  nivelInteres: string;
  cursoId: string | null;
  cursoNombre: string | null;
  mensaje: string;
  estado: EstadoPreInscripcion;
  fechaCreacion: Timestamp;
}

export interface PreInscripcionFormValues {
  nombre: string;
  email: string;
  telefono: string;
  nivelInteres: string;
  cursoId?: string;
  cursoNombre?: string;
  mensaje?: string;
}
