import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Boton } from '@/components/ui/Boton';

export function LoginPage() {
  const { usuarioFirebase, cargando, error, iniciarSesionConGoogle } = useAuth();

  if (!cargando && usuarioFirebase) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-login-background">
      <div className="w-full max-w-md rounded-[32px] border border-mist/80 bg-paper/95 p-8 shadow-[0_24px_80px_rgba(30,42,68,0.12)] backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-24 h-24 rounded-full bg-paper-dim/90 flex items-center justify-center shadow-[0_16px_40px_rgba(30,42,68,0.08)]">
            <img src="/sunshineLogo.png" alt="Instituto de Inglés" className="w-16 h-16 object-contain" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-semibold text-ink">Instituto de Inglés</h1>
            <p className="text-sm text-ink-light mt-2">Gestión de turnos y cursos para alumnos y profesores</p>
          </div>
        </div>

        <div className="mt-10">
          <p className="mb-4 text-left text-sm text-ink-light">Ingresá con tu cuenta de Google para continuar.</p>
          <Boton
            variante="primario"
            className="w-full justify-center flex items-center gap-2 py-3"
            onClick={iniciarSesionConGoogle}
            disabled={cargando}
          >
            Ingresar con Google
          </Boton>
          {error && <p className="mt-4 text-sm text-rust">{error}</p>}
        </div>

        <div className="mt-10 text-center text-xs text-ink-light">
          <p>Al iniciar sesión aceptás las políticas de uso del instituto.</p>
        </div>
      </div>
    </div>
  );
}
