import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/services/firebase';
import type { Turno, TurnoFormValues } from '../types';
import type { ConId } from '@/types/firestore';

const turnosRef = collection(db, 'turnos');

export async function listarTurnosProgramados(): Promise<ConId<Turno>[]> {
  const q = query(turnosRef, where('estado', '==', 'programado'), orderBy('dia'), orderBy('horaInicio'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Turno) }));
}

export async function listarTurnosPorCurso(cursoId: string): Promise<ConId<Turno>[]> {
  const q = query(turnosRef, where('cursoId', '==', cursoId), where('estado', '==', 'programado'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Turno) }));
}

export async function crearTurno(valores: TurnoFormValues, cursoNombre: string): Promise<string> {
  const nuevoTurno: Omit<Turno, 'fechaCreacion'> & { fechaCreacion: unknown } = {
    cursoId: valores.cursoId,
    cursoNombre,
    dia: valores.dia,
    horaInicio: valores.horaInicio,
    horaFin: valores.horaFin,
    aula: valores.aula,
    cupoMaximo: valores.cupoMaximo,
    inscriptos: 0,
    estado: 'programado',
    fechaCreacion: serverTimestamp(),
  };
  const ref = await addDoc(turnosRef, nuevoTurno);
  return ref.id;
}

export async function cancelarTurno(turnoId: string): Promise<void> {
  await updateDoc(doc(db, 'turnos', turnoId), { estado: 'cancelado' });
}
