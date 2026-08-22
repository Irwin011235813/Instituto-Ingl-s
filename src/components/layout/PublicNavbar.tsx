import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/useAuth';

/**
 * Navbar exclusivo de la landing pública (antes de iniciar sesión).
 * Mantiene la identidad lúdica del instituto (nubes),
 * adaptado con logo gigante de fondo, menú móvil moderno y efecto blur.
 */
export function PublicNavbar() {
  const { usuarioFirebase, cargando, error, iniciarSesionConGoogle } = useAuth();
  const navigate = useNavigate();
  
  // Estado para controlar si el menú móvil está abierto o cerrado
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    if (!cargando && usuarioFirebase) {
      navigate('/panel', { replace: true });
    }
  }, [cargando, usuarioFirebase, navigate]);

  return (
    <>
      <header 
        className="relative w-full overflow-hidden bg-white bg-size-[auto_550px] bg-position-[-20px_center] bg-no-repeat py-4 shadow-lg min-h-30 flex flex-col justify-center"
        style={{ backgroundImage: "url('/newLogoNav.jpg')" }}
      >
        <style>{`
          @keyframes floatLeft {
            0% { transform: translateX(100vw); }
            100% { transform: translateX(-150px); }
          }
          .animate-float-left { animation: floatLeft 35s linear infinite; }
          .animate-float-left-fast { animation: floatLeft 22s linear infinite; }
        `}</style>

        {/* Nubes flotando */}
        <div className="absolute top-4 opacity-90 animate-float-left pointer-events-none" aria-hidden="true">
          <svg className="w-32 h-16 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.42 9.22a6.003 6.003 0 00-11.84 0 4.001 4.001 0 000 7.56h11.84a4.001 4.001 0 000-7.56z" />
          </svg>
        </div>
        <div
          className="absolute top-12 opacity-80 animate-float-left-fast pointer-events-none"
          style={{ animationDelay: '-10s' }}
          aria-hidden="true"
        >
          <svg className="w-20 h-10 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.42 9.22a6.003 6.003 0 00-11.84 0 4.001 4.001 0 000 7.56h11.84a4.001 4.001 0 000-7.56z" />
          </svg>
        </div>

        {/* Contenido de la barra principal */}
        <nav className="relative z-10 flex w-full flex-wrap items-center justify-end px-8">
          
          {/* Zona de clic invisible sobre el logo de fondo */}
          <Link to="/" className="block h-16 w-70 shrink-0 mr-auto" aria-label="Inicio">    
          </Link>

          {/* MENÚ DE ESCRITORIO (Oculto en móviles) */}
          <div className="hidden items-center gap-6 text-sm font-semibold text-slate-700 md:flex mr-6">
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

          {/* Botón de inicio de sesión de Escritorio */}
          <div className="hidden md:block shrink-0">
            <button
              onClick={iniciarSesionConGoogle}
              disabled={cargando}
              className="whitespace-nowrap rounded-full bg-slate-800 px-4 py-2 text-sm font-bold text-white shadow-md transition hover:bg-slate-700 disabled:opacity-60"
            >
              {cargando ? 'Verificando...' : 'Iniciar sesión'}
            </button>
          </div>

          {/* BOTÓN HAMBURGUESA ANIMADO (Móviles) */}
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="relative md:hidden z-20 flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-xl border border-slate-200/60 bg-white/70 backdrop-blur-md shadow-xs transition-all duration-300 ease-out hover:scale-105 active:scale-95 hover:bg-white/90 hover:shadow-sm"
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
          >
            <span 
              className={`h-0.5 w-5 rounded-full bg-slate-700 transition-all duration-300 ease-out ${
                menuAbierto ? 'rotate-45 translate-y-2 bg-amber-600' : ''
              }`}
            />
            <span 
              className={`h-0.5 w-5 rounded-full bg-slate-700 transition-all duration-200 ease-out ${
                menuAbierto ? 'opacity-0 -translate-x-2' : ''
              }`}
            />
            <span 
              className={`h-0.5 w-5 rounded-full bg-slate-700 transition-all duration-300 ease-out ${
                menuAbierto ? '-rotate-45 -translate-y-2 bg-amber-600' : ''
              }`}
            />
          </button>

          {error && (
            <p className="w-full text-right text-xs text-red-500 sm:max-w-55 mt-1">{error}</p>
          )}
        </nav>

        {/* MENÚ MÓVIL DESPLEGABLE (Glassmorphism) */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out relative z-10 bg-white/80 backdrop-blur-md w-full ${
            menuAbierto 
              ? 'max-h-72 opacity-100 mt-4 border-t border-slate-100 shadow-lg py-6' 
              : 'max-h-0 opacity-0 py-0'
          }`}
        >
          <div className="flex flex-col items-center gap-2 font-['Fredoka'] font-semibold text-slate-700">
            <a href="#cursos" onClick={() => setMenuAbierto(false)} className="w-full text-center py-2 text-base tracking-wide hover:text-amber-600 hover:bg-slate-50/50 transition-all rounded-lg max-w-[85%]">
              Cursos
            </a>
            <a href="#testimonios" onClick={() => setMenuAbierto(false)} className="w-full text-center py-2 text-base tracking-wide hover:text-amber-600 hover:bg-slate-50/50 transition-all rounded-lg max-w-[85%]">
              Testimonios
            </a>
            <a href="#contacto" onClick={() => setMenuAbierto(false)} className="w-full text-center py-2 text-base tracking-wide hover:text-amber-600 hover:bg-slate-50/50 transition-all rounded-lg max-w-[85%]">
              Contacto
            </a>
            
            {/* Botón de Google en móvil */}
            <div className="w-full px-8 mt-4">
              <button
                onClick={() => {
                  setMenuAbierto(false);
                  iniciarSesionConGoogle();
                }}
                disabled={cargando}
                className="w-full rounded-full bg-linear-to-r from-slate-800 to-slate-900 py-3 text-center text-sm font-bold text-white shadow-md transition-all duration-200 hover:opacity-95 active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {cargando ? (
                  'Verificando...'
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.12 1 1.16 5.92 1.16 12s4.96 11 11.08 11c6.39 0 10.646-4.414 10.646-10.86 0-.733-.078-1.293-.173-1.855H12.24z"/>
                    </svg>
                    <span>Ingresar con Google</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* CAPA DE ENFOQUE (OVERLAY BLUR) */}
      {menuAbierto && (
        <div 
          onClick={() => setMenuAbierto(false)}
          className="fixed inset-0 top-30 z-0 bg-slate-900/10 backdrop-blur-md transition-all duration-300 md:hidden"
          style={{ height: 'calc(100vh - 120px)' }}
        />
      )}
    </>
  );
}
