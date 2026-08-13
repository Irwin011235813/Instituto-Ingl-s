import { httpsCallable } from 'firebase/functions';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { db, functions } from '@/services/firebase';
import type { Cuota, CrearPreferenciaInput, CrearPreferenciaOutput } from '../types';
import type { ConId } from '@/types/firestore';

const cuotasRef = collection(db, 'cuotas');

/**
 * Llama a la Cloud Function que crea la preferencia de pago en Mercado Pago.
 * El monto NUNCA se define en el cliente: la función lee el precio real
 * desde el documento del curso en Firestore.
 */
export async function crearPreferenciaPago(
  input: CrearPreferenciaInput
): Promise<CrearPreferenciaOutput> {
  const callable = httpsCallable<CrearPreferenciaInput, CrearPreferenciaOutput>(
    functions,
    'crearPreferenciaPago'
  );
  const resultado = await callable(input);
  return resultado.data;
}

export async function obtenerCuotaPendiente(alumnoUid: string): Promise<ConId<Cuota> | null> {
  const q = query(
    cuotasRef,
    where('alumnoUid', '==', alumnoUid),
    where('estado', '==', 'pendiente'),
    orderBy('fechaCreacion', 'desc'),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...(d.data() as Cuota) };
}

export async function listarCuotasDeAlumno(alumnoUid: string): Promise<ConId<Cuota>[]> {
  const q = query(cuotasRef, where('alumnoUid', '==', alumnoUid), orderBy('fechaCreacion', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Cuota) }));
}
