import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut, type User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/services/firebase';
import type { UsuarioAutorizado } from '@/modules/usuarios/types';

interface AuthContextValue {
  usuarioFirebase: User | null;
  perfil: UsuarioAutorizado | null;
  cargando: boolean;
  error: string | null;
  iniciarSesionConGoogle: () => Promise<void>;
  cerrarSesion: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuarioFirebase, setUsuarioFirebase] = useState<User | null>(null);
  const [perfil, setPerfil] = useState<UsuarioAutorizado | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCargando(true);
      setUsuarioFirebase(user);

      if (!user) {
        setPerfil(null);
        setCargando(false);
        return;
      }

      try {
        const ref = doc(db, 'usuarios_autorizados', user.uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          const nuevoUsuario: UsuarioAutorizado = {
            email: user.email ?? '',
            nombre: user.displayName ?? 'Alumno',
            rol: 'alumno',
            activo: true,
            fechaAlta: serverTimestamp() as any,
          };

          await setDoc(ref, nuevoUsuario);
          setPerfil(nuevoUsuario);
          setError(null);
        } else {
          const datos = snap.data() as UsuarioAutorizado;
          if (!datos.activo) {
            setError('Tu cuenta fue desactivada. Contactá a un administrador.');
            setPerfil(null);
          } else {
            setPerfil(datos);
            setError(null);
          }
        }
      } catch {
        setError('No se pudo verificar tu perfil. Intentá de nuevo.');
        setPerfil(null);
      } finally {
        setCargando(false);
      }
    });

    return unsubscribe;
  }, []);

  async function iniciarSesionConGoogle() {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      const err = error as { code?: string; message?: string };
      // eslint-disable-next-line no-console
      console.error('Google sign-in error:', err);

      if (
        err.code === 'auth/popup-blocked' ||
        err.code === 'auth/operation-not-supported-in-this-environment' ||
        err.code === 'auth/cancelled-popup-request'
      ) {
        try {
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch (redirectError) {
          // eslint-disable-next-line no-console
          console.error('Google sign-in redirect error:', redirectError);
        }
      }

      setError(
        'No se pudo iniciar sesión con Google. Verificá que tu navegador permita ventanas emergentes y volvé a intentar.'
      );
    }
  }

  async function cerrarSesion() {
    await signOut(auth);
  }

  return (
    <AuthContext.Provider
      value={{ usuarioFirebase, perfil, cargando, error, iniciarSesionConGoogle, cerrarSesion }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
