import type { Timestamp } from 'firebase/firestore';
import type { Rol, Nivel } from '@/types/common';

/** Documento en la colección usuarios_autorizados/{uid} */
export interface UsuarioAutorizado {
  email: string;
  nombre: string;
  rol: Rol;
  activo: boolean;
  nivelActual?: Nivel; // solo aplica a rol 'alumno'
  fechaAlta: Timestamp;
}
