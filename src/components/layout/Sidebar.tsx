import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, CalendarDays, LayoutGrid, LogOut, Menu, User, X } from 'lucide-react';
import { useAuth } from '@/context/useAuth';

const ETIQUETA_ROL: Record<string, string> = {
  admin: 'Administración',
  profesor: 'Profesor/a',
  alumno: 'Alumno/a',
};

/**
 * Sidebar del panel interno. Reemplaza al Navbar horizontal: patrón de
 * dashboard moderno (persistente en desktop, drawer deslizable en mobile).
 * A propósito sigue siendo sobrio (ink/paper/mustard) — es la herramienta
 * de trabajo diaria, distinta de la identidad lúdica de la landing pública.
 */
export function Sidebar() {
  const { perfil, usuarioFirebase, cerrarSesion } = useAuth();
  const [abierto, setAbierto] = useState(false);
  const [fotoConError, setFotoConError] = useState(false);

  const enlaces = [
    { to: '/panel', label: 'Panel', icon: LayoutGrid, end: true },
    { to: '/turnos', label: 'Turnos', icon: CalendarDays, end: false },
    ...(perfil?.rol === 'admin' || perfil?.rol === 'profesor'
      ? [{ to: '/cursos', label: 'Cursos', icon: BookOpen, end: false }]
      : []),
  ];

  const inicial = perfil?.nombre?.charAt(0).toUpperCase() ?? '?';
  // Google siempre provee photoURL en usuarioFirebase; si algún día se suma
  // otro proveedor de login sin foto, cae al círculo con inicial.
  const mostrarFoto = !!usuarioFirebase?.photoURL && !fotoConError;

  const avatar = (tamaño: number) =>
    mostrarFoto ? (
      <img
        src={usuarioFirebase!.photoURL!}
        alt={perfil?.nombre ?? 'Foto de perfil'}
        referrerPolicy="no-referrer"
        onError={() => setFotoConError(true)}
        className="rounded-full object-cover shrink-0 ring-2 ring-white shadow-sm"
        style={{ width: tamaño, height: tamaño }}
      />
    ) : (
      <div
        className="rounded-full bg-ink text-paper flex items-center justify-center font-display font-semibold shrink-0"
        style={{ width: tamaño, height: tamaño }}
      >
        {inicial}
      </div>
    );

  return (
    <>
      {/* Barra superior, solo mobile */}
      <header className="lg:hidden sticky top-0 z-20 flex items-center justify-between border-b border-mist bg-paper/95 backdrop-blur px-4 h-14">
        <div className="flex items-center gap-2">
          <img src="/shine-on-64x64.png" alt="" className="w-7 h-7 rounded-lg shrink-0" />
          <span className="font-display font-semibold text-ink">Sunshine Instituto</span>
        </div>
        <button
          onClick={() => setAbierto(true)}
          className="p-2 -mr-2 text-ink-light hover:text-ink"
          aria-label="Abrir menú"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* Backdrop del drawer mobile */}
      {abierto && (
        <div
          className="fixed inset-0 z-30 bg-ink/40 lg:hidden"
          onClick={() => setAbierto(false)}
        />
      )}

      {/* Sidebar: fijo en desktop, drawer deslizable en mobile */}
      <aside
        className={`fixed z-40 inset-y-0 left-0 w-64 bg-white border-r border-mist flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          abierto ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-mist">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src="/shine-on-64x64.png"
              alt="Sunshine Instituto"
              className="w-9 h-9 rounded-xl shrink-0 shadow-sm"
            />
            <span className="font-display font-semibold text-ink leading-tight text-[15px]">
              Sunshine
              <br />
              Instituto
            </span>
          </div>
          <button
            onClick={() => setAbierto(false)}
            className="lg:hidden p-1 text-ink-light hover:text-ink shrink-0"
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {enlaces.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setAbierto(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-mustard/15 text-mustard-dark'
                    : 'text-ink-light hover:bg-paper-dim hover:text-ink'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-mist p-3">
          <div className="flex items-center gap-3 rounded-xl px-2 py-2">
            {avatar(36)}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink truncate">{perfil?.nombre}</p>
              <p className="text-xs text-ink-light truncate flex items-center gap-1">
                {!mostrarFoto && <User size={11} className="shrink-0" />}
                {perfil ? ETIQUETA_ROL[perfil.rol] : ''}
              </p>
            </div>
            <button
              onClick={cerrarSesion}
              className="p-2 rounded-lg text-ink-light hover:bg-rust/10 hover:text-rust transition-colors shrink-0"
              aria-label="Cerrar sesión"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}