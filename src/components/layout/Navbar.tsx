import { NavLink } from 'react-router-dom';
import { BookOpen, CalendarDays, LogOut, LayoutGrid } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const { perfil, cerrarSesion } = useAuth();

  const enlaceClase = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-mustard/20 text-mustard-dark' : 'text-ink-light hover:bg-ink/5'
    }`;

  return (
    <header className="border-b border-mist bg-white/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/70 bg-white shadow-[0_6px_18px_rgba(30,42,68,0.12)] ring-2 ring-[#f4d9a6]">
            <div className="absolute inset-0 bg-[conic-gradient(from_180deg,#ff5f6d,#f9c74f,#7ad6b6,#4da3ff,#8d77ff,#ff5f6d)]" />
            <div className="absolute inset-0.75 rounded-full bg-white/85" />
            <span className="relative text-[11px] font-black tracking-[-0.08em] text-ink">S</span>
          </div>
          <div className="leading-none">
            <span className="block font-display text-xl font-bold tracking-tighter text-ink">Sunshine</span>
            <span className="mt-0.5 block text-[9px] uppercase tracking-[0.28em] text-ink-light">English</span>
          </div>
        </div>

        <nav className="flex items-center gap-1">
          <NavLink to="/" end className={enlaceClase}>
            <LayoutGrid size={16} /> Panel
          </NavLink>
          <NavLink to="/turnos" className={enlaceClase}>
            <CalendarDays size={16} /> Turnos
          </NavLink>
          {(perfil?.rol === 'admin' || perfil?.rol === 'profesor') && (
            <NavLink to="/cursos" className={enlaceClase}>
              <BookOpen size={16} /> Cursos
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <span className="text-sm text-ink-light hidden sm:inline">{perfil?.nombre}</span>
          <button
            onClick={cerrarSesion}
            className="p-2 rounded-md text-ink-light hover:bg-ink/5 hover:text-rust transition-colors"
            aria-label="Cerrar sesión"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
