import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/services/firebase';
import type { PreInscripcionFormValues, InscripcionPendiente } from '../types';

const preInscripcionesRef = collection(db, 'inscripciones_pendientes');

export async function crearPreInscripcion(valores: PreInscripcionFormValues): Promise<void> {
  const nuevaPreInscripcion: Omit<InscripcionPendiente, 'fechaCreacion'> & {
    fechaCreacion: unknown;
  } = {
    nombre: valores.nombre,
    email: valores.email,
    telefono: valores.telefono,
    nivelInteres: valores.nivelInteres,
    cursoId: valores.cursoId ?? null,
    cursoNombre: valores.cursoNombre ?? null,
    mensaje: valores.mensaje ?? '',
    estado: 'nueva',
    fechaCreacion: serverTimestamp(),
  };
  await addDoc(preInscripcionesRef, nuevaPreInscripcion);
}
