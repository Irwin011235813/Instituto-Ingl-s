import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Boton } from '@/components/ui/Boton';

export function LoginPage() {
  const { usuarioFirebase, cargando, error, iniciarSesionConGoogle } = useAuth();

  if (!cargando && usuarioFirebase) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-login-background">
      <div className="w-full max-w-lg rounded-[32px] border border-charcoal/10 bg-paper/98 p-10 shadow-[0_30px_100px_rgba(30,42,68,0.16)] backdrop-blur-sm login-card">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="w-36 h-36 rounded-full bg-paper-dim/95 flex items-center justify-center shadow-[0_18px_44px_rgba(30,42,68,0.16)]">
            <img src="/sunshineLogo.png" alt="Sunshine Instituto" className="w-28 h-28 object-contain" />
          </div>
          <div>
            <h1 className="font-display text-5xl font-semibold text-ink leading-tight">Sunshine Instituto</h1>
            <p className="text-base text-ink-light mt-3 max-w-xl mx-auto">
              Turn management and course administration for students and teachers.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <p className="mb-5 text-left text-base text-ink-light max-w-xl mx-auto">
            Welcome! Sign in with your Google account to access your schedule and classroom tools.
          </p>
          <Boton
            variante="primario"
            className="w-full justify-center flex items-center gap-3 py-4 rounded-[18px] bg-indigo-950 text-white shadow-[0_18px_30px_rgba(30,35,80,0.2)] hover:shadow-[0_20px_40px_rgba(30,35,80,0.24)] focus:ring-4 focus:ring-indigo-200 active:scale-[0.98] transition-transform duration-200"
            onClick={iniciarSesionConGoogle}
            disabled={cargando}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-[0_6px_18px_rgba(30,35,80,0.16)]">
              <svg viewBox="0 0 46 46" className="h-4 w-4" aria-hidden="true">
                <path fill="#EA4335" d="M23 11.5c3.4 0 5.8 1.5 7.1 2.8l5.2-5.2C32.6 5.1 28.1 3 23 3 14.7 3 7.7 7.9 4.6 14.8l6 4.7C12.3 14.1 17.1 11.5 23 11.5z"/>
                <path fill="#34A853" d="M8.6 25.5c-.3-1.4-.3-2.7 0-4.1l-6-4.7C1.1 20.8 0 23.8 0 27c0 3.2 1.1 6.2 3 8.7l5.6-4.2z"/>
                <path fill="#FBBC05" d="M23 42.5c5.1 0 9.6-1.9 13-5.1l-6.2-5.1c-1.6 1.3-3.6 2.1-6.8 2.1-5.9 0-10.7-2.6-13.4-6.5l-5.6 4.2C7.7 38.6 14.7 42.5 23 42.5z"/>
                <path fill="#4285F4" d="M44.4 23.6c0-1.5-.1-2.8-.4-4.1H23v7.8h12.2c-.5 2.6-2 4.8-4.4 6.2l6.2 5.1c3.6-3.3 5.4-8.2 5.4-14z"/>
              </svg>
            </span>
            Ingresar con Google
          </Boton>
          {error && <p className="mt-4 text-sm text-rust">{error}</p>}
          <div className="mt-4 text-left">
            <a href="#" className="text-sm text-indigo-700 font-medium hover:text-indigo-900">
              ¿Necesitás ayuda?
            </a>
          </div>
        </div>

        <div className="mt-10 text-center text-sm text-charcoal leading-relaxed">
          <p>
            Al iniciar sesión aceptás las{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
              políticas de uso
            </a>{' '}
            del instituto.
          </p>
        </div>
      </div>
    </div>
  );
}
