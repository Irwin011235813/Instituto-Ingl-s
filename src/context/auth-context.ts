import { createContext } from 'react';
import type { User } from 'firebase/auth';
import type { UsuarioAutorizado } from '@/modules/usuarios/types';

export interface AuthContextValue {
  usuarioFirebase: User | null;
  perfil: UsuarioAutorizado | null;
  cargando: boolean;
  error: string | null;
  iniciarSesionConGoogle: () => Promise<void>;
  cerrarSesion: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
