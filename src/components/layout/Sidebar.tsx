import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, CalendarDays, LayoutGrid, LogOut, Menu, X } from 'lucide-react';
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
  const { perfil, cerrarSesion } = useAuth();
  const [abierto, setAbierto] = useState(false);

  const enlaces = [
    { to: '/panel', label: 'Panel', icon: LayoutGrid, end: true },
    { to: '/turnos', label: 'Turnos', icon: CalendarDays, end: false },
    ...(perfil?.rol === 'admin' || perfil?.rol === 'profesor'
      ? [{ to: '/cursos', label: 'Cursos', icon: BookOpen, end: false }]
      : []),
  ];

  const inicial = perfil?.nombre?.charAt(0).toUpperCase() ?? '?';

  return (
    <>
      {/* Barra superior, solo mobile */}
      <header className="lg:hidden sticky top-0 z-20 flex items-center justify-between border-b border-mist bg-paper/95 backdrop-blur px-4 h-14">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-ink flex items-center justify-center">
            <BookOpen size={15} className="text-mustard" />
          </div>
          <span className="font-display font-semibold text-ink">Sunshine</span>
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
        <div className="h-16 flex items-center justify-between px-5 border-b border-mist">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center shrink-0">
              <BookOpen size={17} className="text-mustard" />
            </div>
            <span className="font-display font-semibold text-lg text-ink leading-tight">
              Sunshine
              <br className="hidden" />
            </span>
          </div>
          <button
            onClick={() => setAbierto(false)}
            className="lg:hidden p-1 text-ink-light hover:text-ink"
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
            <div className="w-9 h-9 rounded-full bg-ink text-paper flex items-center justify-center font-display font-semibold shrink-0">
              {inicial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink truncate">{perfil?.nombre}</p>
              <p className="text-xs text-ink-light truncate">
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