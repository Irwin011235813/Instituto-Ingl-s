import type { Timestamp } from 'firebase/firestore';
import type { Nivel, UsuarioRef } from '@/types/common';

/** Documento en la colección cursos/{cursoId} */
export interface Curso {
  nombre: string;
  nivel: Nivel;
  descripcion: string;
  profesor: UsuarioRef;
  cupoMaximo: number;
  activo: boolean;
  fechaCreacion: Timestamp;
}

export interface CursoFormValues {
  nombre: string;
  nivel: Nivel;
  descripcion: string;
  profesorUid: string;
  cupoMaximo: number;
}
