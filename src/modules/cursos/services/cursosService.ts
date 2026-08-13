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
import type { Curso, CursoFormValues } from '../types';
import type { ConId } from '@/types/firestore';
import type { UsuarioRef } from '@/types/common';

const cursosRef = collection(db, 'cursos');

export async function listarCursosActivos(): Promise<ConId<Curso>[]> {
  const q = query(cursosRef, where('activo', '==', true), orderBy('nombre'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Curso) }));
}

export async function crearCurso(valores: CursoFormValues, profesor: UsuarioRef): Promise<string> {
  const nuevoCurso: Omit<Curso, 'fechaCreacion'> & { fechaCreacion: unknown } = {
    nombre: valores.nombre,
    nivel: valores.nivel,
    descripcion: valores.descripcion,
    profesor,
    cupoMaximo: valores.cupoMaximo,
    activo: true,
    precioMatricula: valores.precioMatricula,
    precioCuotaMensual: valores.precioCuotaMensual,
    fechaCreacion: serverTimestamp(),
  };
  const ref = await addDoc(cursosRef, nuevoCurso);
  return ref.id;
}

export async function darDeBajaCurso(cursoId: string): Promise<void> {
  await updateDoc(doc(db, 'cursos', cursoId), { activo: false });
}
