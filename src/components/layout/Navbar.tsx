import { NavLink } from 'react-router-dom';
import { BookOpen, CalendarDays, LogOut, LayoutGrid } from 'lucide-react';
import { useAuth } from '@/context/useAuth';

/**
 * Navbar del panel interno (usuario ya logueado). A propósito es sobrio
 * y consistente con el sistema de diseño ink/paper/mustard: es la
 * herramienta de trabajo diaria de alumnos/profesores/admin, distinta
 * de la identidad lúdica de la landing pública (ver PublicNavbar).
 */
export function Navbar() {
  const { perfil, cerrarSesion } = useAuth();

  const enlaceClase = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-mustard/20 text-mustard-dark' : 'text-ink-light hover:bg-ink/5'
    }`;

  return (
    <header className="border-b border-mist bg-white/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-ink flex items-center justify-center">
            <BookOpen size={18} className="text-mustard" />
          </div>
          <span className="font-display font-semibold text-lg text-ink">Sunshine Instituto</span>
        </div>

        <nav className="flex items-center gap-1">
          <NavLink to="/panel" end className={enlaceClase}>
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
