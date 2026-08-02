import {
  collection,
  doc,
  getDocs,
  increment,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/services/firebase';
import type { Inscripcion } from '../types';
import type { Turno } from '@/modules/turnos/types';
import type { ConId } from '@/types/firestore';

const inscripcionesRef = collection(db, 'inscripciones');

export class CupoCompletoError extends Error {
  constructor() {
    super('No quedan cupos disponibles para este turno.');
  }
}

export class YaInscriptoError extends Error {
  constructor() {
    super('Ya estás inscripto en este turno.');
  }
}

/**
 * Inscribe a un alumno a un turno de forma atómica: valida cupo disponible,
 * evita duplicados, crea la inscripción y actualiza el contador del turno
 * en una única transacción.
 */
export async function inscribirAlumno(
  turnoId: string,
  cursoId: string,
  alumnoUid: string,
  alumnoNombre: string
): Promise<void> {
  const yaInscripto = await obtenerInscripcionActiva(turnoId, alumnoUid);
  if (yaInscripto) throw new YaInscriptoError();

  const turnoRef = doc(db, 'turnos', turnoId);
  const nuevaInscripcionRef = doc(inscripcionesRef);

  await runTransaction(db, async (transaction) => {
    const turnoSnap = await transaction.get(turnoRef);
    if (!turnoSnap.exists()) throw new Error('El turno ya no existe.');

    const turno = turnoSnap.data() as Turno;
    if (turno.inscriptos >= turno.cupoMaximo) throw new CupoCompletoError();

    const nuevaInscripcion: Omit<Inscripcion, 'fechaInscripcion' | 'fechaCancelacion'> & {
      fechaInscripcion: unknown;
      fechaCancelacion: null;
    } = {
      turnoId,
      cursoId,
      alumnoUid,
      alumnoNombre,
      estado: 'activa',
      fechaInscripcion: serverTimestamp(),
      fechaCancelacion: null,
    };

    transaction.set(nuevaInscripcionRef, nuevaInscripcion);
    transaction.update(turnoRef, { inscriptos: increment(1) });
  });
}

export async function cancelarInscripcion(inscripcionId: string, turnoId: string): Promise<void> {
  const turnoRef = doc(db, 'turnos', turnoId);
  const inscripcionRefDoc = doc(db, 'inscripciones', inscripcionId);

  await runTransaction(db, async (transaction) => {
    transaction.update(inscripcionRefDoc, {
      estado: 'cancelada',
      fechaCancelacion: serverTimestamp(),
    });
    transaction.update(turnoRef, { inscriptos: increment(-1) });
  });
}

export async function listarInscripcionesDeAlumno(alumnoUid: string): Promise<ConId<Inscripcion>[]> {
  const q = query(
    inscripcionesRef,
    where('alumnoUid', '==', alumnoUid),
    where('estado', '==', 'activa')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Inscripcion) }));
}

async function obtenerInscripcionActiva(
  turnoId: string,
  alumnoUid: string
): Promise<ConId<Inscripcion> | null> {
  const q = query(
    inscripcionesRef,
    where('turnoId', '==', turnoId),
    where('alumnoUid', '==', alumnoUid),
    where('estado', '==', 'activa')
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...(d.data() as Inscripcion) };
}

// Re-exportado para uso ocasional fuera de transacciones (ej. panel admin)
export async function actualizarEstadoInscripcion(id: string, estado: Inscripcion['estado']) {
  await updateDoc(doc(db, 'inscripciones', id), { estado });
}
