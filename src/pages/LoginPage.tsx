import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function LoginPage() {
  const { usuarioFirebase, cargando, error, iniciarSesionConGoogle } = useAuth();

  if (!cargando && usuarioFirebase) return <Navigate to="/" replace />;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          'radial-gradient(circle at 50% 0%, rgba(217,164,65,0.16), transparent 60%), var(--color-paper)',
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-mist bg-white p-9 shadow-[0_20px_60px_rgba(30,42,68,0.10)]">
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Logo: fondo blanco liso, sin borde ni sombra dura que compita con la imagen */}
          <div className="w-20 h-20 rounded-full bg-white ring-1 ring-mist flex items-center justify-center overflow-hidden">
            <img
              src="/sunshineLogo.png"
              alt="Sunshine Instituto"
              className="w-14 h-14 object-contain"
            />
          </div>
          <div>
            <h1 className="font-display text-3xl font-semibold text-ink leading-tight">
              Sunshine Instituto
            </h1>
            <p className="text-sm text-ink-light mt-2 max-w-xs mx-auto">
              Gestión de turnos y cursos para alumnos y profesores.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={iniciarSesionConGoogle}
            disabled={cargando}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-lg border border-mist bg-white text-sm font-medium text-ink hover:bg-paper-dim/60 hover:border-ink/20 focus-visible:outline-2 focus-visible:outline-mustard-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg viewBox="0 0 46 46" className="h-5 w-5 shrink-0" aria-hidden="true">
              <path fill="#EA4335" d="M23 11.5c3.4 0 5.8 1.5 7.1 2.8l5.2-5.2C32.6 5.1 28.1 3 23 3 14.7 3 7.7 7.9 4.6 14.8l6 4.7C12.3 14.1 17.1 11.5 23 11.5z" />
              <path fill="#34A853" d="M8.6 25.5c-.3-1.4-.3-2.7 0-4.1l-6-4.7C1.1 20.8 0 23.8 0 27c0 3.2 1.1 6.2 3 8.7l5.6-4.2z" />
              <path fill="#FBBC05" d="M23 42.5c5.1 0 9.6-1.9 13-5.1l-6.2-5.1c-1.6 1.3-3.6 2.1-6.8 2.1-5.9 0-10.7-2.6-13.4-6.5l-5.6 4.2C7.7 38.6 14.7 42.5 23 42.5z" />
              <path fill="#4285F4" d="M44.4 23.6c0-1.5-.1-2.8-.4-4.1H23v7.8h12.2c-.5 2.6-2 4.8-4.4 6.2l6.2 5.1c3.6-3.3 5.4-8.2 5.4-14z" />
            </svg>
            {cargando ? 'Verificando sesión...' : 'Ingresar con Google'}
          </button>

          {error && (
            <p className="mt-4 text-sm text-rust text-center">{error}</p>
          )}
        </div>

        <p className="mt-8 text-xs text-ink-light text-center leading-relaxed">
          Al iniciar sesión aceptás las{' '}
          <a href="#" className="text-mustard-dark font-medium hover:underline">
            políticas de uso
          </a>{' '}
          del instituto.
        </p>
      </div>
    </div>
  );
}