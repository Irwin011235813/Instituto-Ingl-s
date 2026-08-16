import { useEffect, useState, type ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type User,
} from 'firebase/auth';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/services/firebase';
import type { UsuarioAutorizado } from '@/modules/usuarios/types';
import { AuthContext } from '@/context/auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuarioFirebase, setUsuarioFirebase] = useState<User | null>(null);
  const [perfil, setPerfil] = useState<UsuarioAutorizado | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribePerfil: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCargando(true);
      setUsuarioFirebase(user);

      unsubscribePerfil?.();

      if (!user) {
        setPerfil(null);
        setCargando(false);
        return;
      }

      const ref = doc(db, 'usuarios_autorizados', user.uid);

      unsubscribePerfil = onSnapshot(
        ref,
        async (snap) => {
          try {
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
              return;
            }

            const datos = snap.data() as UsuarioAutorizado;
            if (!datos.activo) {
              setError('Tu cuenta fue desactivada. Contactá a un administrador.');
              setPerfil(null);
            } else {
              setPerfil(datos);
              setError(null);
            }
          } catch {
            setError('No se pudo verificar tu perfil. Intentá de nuevo.');
            setPerfil(null);
          } finally {
            setCargando(false);
          }
        },
        () => {
          setError('No se pudo verificar tu perfil. Intentá de nuevo.');
          setPerfil(null);
          setCargando(false);
        }
      );
    });

    return () => {
      unsubscribePerfil?.();
      unsubscribeAuth();
    };
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

