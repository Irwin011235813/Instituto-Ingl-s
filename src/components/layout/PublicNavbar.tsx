import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

/**
 * Navbar exclusivo de la landing pública (antes de iniciar sesión).
 * Mantiene la identidad lúdica del instituto (sol, arcoíris, nubes),
 * separada a propósito del Navbar interno (que es sobrio, para el
 * panel de trabajo real de alumnos/profesores/admin).
 */
export function PublicNavbar() {
  const { usuarioFirebase, cargando, error, iniciarSesionConGoogle } = useAuth();
  const navigate = useNavigate();

  // Una vez que la sesión de Google resuelve (con o sin perfil habilitado),
  // pasamos al panel. Si el perfil todavía no está habilitado, ProtectedRoute
  // se encarga de mostrar el mensaje de "Acceso pendiente" ahí mismo.
  useEffect(() => {
    if (!cargando && usuarioFirebase) {
      navigate('/panel', { replace: true });
    }
  }, [cargando, usuarioFirebase, navigate]);

  return (
    <header className="relative w-full overflow-hidden bg-linear-to-b from-sky-300 via-blue-200 to-white py-4 shadow-lg">
      <style>{`
        @keyframes floatLeft {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-150px); }
        }
        .animate-float-left { animation: floatLeft 35s linear infinite; }
        .animate-float-left-fast { animation: floatLeft 22s linear infinite; }
      `}</style>

      {/* Arcoíris de fondo */}
      <div className="absolute bottom-0 left-0 right-0 h-24 opacity-80 pointer-events-none">
        <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,100 Q300,0 600,100 T1200,100" fill="none" stroke="#FFB3B3" strokeWidth="15" />
          <path d="M0,100 Q300,15 600,100 T1200,100" fill="none" stroke="#FFD999" strokeWidth="15" />
          <path d="M0,100 Q300,30 600,100 T1200,100" fill="none" stroke="#FFFFCC" strokeWidth="15" />
          <path d="M0,100 Q300,45 600,100 T1200,100" fill="none" stroke="#CCFFCC" strokeWidth="15" />
          <path d="M0,100 Q300,60 600,100 T1200,100" fill="none" stroke="#99CCFF" strokeWidth="15" />
          <path d="M0,100 Q300,75 600,100 T1200,100" fill="none" stroke="#CC99FF" strokeWidth="15" />
        </svg>
      </div>

      {/* Nubes flotando */}
      <div className="absolute top-4 opacity-90 animate-float-left" aria-hidden="true">
        <svg className="w-32 h-16 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.42 9.22a6.003 6.003 0 00-11.84 0 4.001 4.001 0 000 7.56h11.84a4.001 4.001 0 000-7.56z" />
        </svg>
      </div>
      <div
        className="absolute top-12 opacity-80 animate-float-left-fast"
        style={{ animationDelay: '-10s' }}
        aria-hidden="true"
      >
        <svg className="w-20 h-10 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.42 9.22a6.003 6.003 0 00-11.84 0 4.001 4.001 0 000 7.56h11.84a4.001 4.001 0 000-7.56z" />
        </svg>
      </div>

      {/* Sol girando */}
      <div
        className="absolute -top-8 -right-8 opacity-90 animate-spin"
        style={{ animationDuration: '30s' }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 100 100" className="w-36 h-36">
          <g>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
              <line
                key={deg}
                x1="50"
                y1="50"
                x2="50"
                y2="5"
                stroke={i % 2 === 0 ? '#FF6B6B' : '#4ECDC4'}
                strokeWidth="4"
                strokeLinecap="round"
                transform={`rotate(${deg} 50 50)`}
              />
            ))}
            <circle cx="50" cy="50" r="28" fill="#FFD700" />
            <circle cx="40" cy="45" r="3" fill="#333" />
            <circle cx="60" cy="45" r="3" fill="#333" />
            <path d="M 38 55 Q 50 68 62 55" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      {/* Contenido real de la barra: un único <nav>, sin anidar */}
      <nav className="relative z-10 mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-y-2 px-4">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <svg viewBox="0 0 100 100" className="h-8 w-8 shrink-0 sm:h-9 sm:w-9" aria-hidden="true">
            <circle cx="50" cy="50" r="18" fill="#FFD700" />
            <line x1="50" y1="10" x2="50" y2="25" stroke="#FF6B6B" strokeWidth="3" strokeLinecap="round" />
            <line x1="50" y1="75" x2="50" y2="90" stroke="#4ECDC4" strokeWidth="3" strokeLinecap="round" />
            <line x1="10" y1="50" x2="25" y2="50" stroke="#FFE66D" strokeWidth="3" strokeLinecap="round" />
            <line x1="75" y1="50" x2="90" y2="50" stroke="#FF6B6B" strokeWidth="3" strokeLinecap="round" />
            <circle cx="44" cy="46" r="3" fill="#333" />
            <circle cx="56" cy="46" r="3" fill="#333" />
            <path d="M 42 54 Q 50 62 58 54" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </svg>
          <span
            className="truncate font-['Fredoka'] text-base font-bold uppercase tracking-wide text-white sm:text-xl sm:tracking-widest"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.35)' }}
          >
            Sunshine Instituto
          </span>
        </Link>

        <div className="hidden items-center gap-6 text-sm font-semibold text-slate-700 md:flex">
          <a href="#cursos" className="transition hover:text-amber-600">
            Cursos
          </a>
          <a href="#testimonios" className="transition hover:text-amber-600">
            Testimonios
          </a>
          <a href="#contacto" className="transition hover:text-amber-600">
            Contacto
          </a>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1">
          <button
            onClick={iniciarSesionConGoogle}
            disabled={cargando}
            className="whitespace-nowrap rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-white disabled:opacity-60"
          >
            {cargando ? 'Verificando...' : 'Iniciar sesión'}
          </button>
        </div>

        {error && (
          <p className="w-full text-right text-xs text-white/90 sm:max-w-[220px]">{error}</p>
        )}
      </nav>
    </header>
  );
}
