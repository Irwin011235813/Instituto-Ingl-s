import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/ui/Spinner';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { usuarioFirebase, perfil, cargando, error } = useAuth();

  if (cargando) return <Spinner label="Verificando sesión..." />;
  if (!usuarioFirebase) return <Navigate to="/login" replace />;

  if (error || !perfil) {
    return (
      <div className="max-w-md mx-auto mt-24 text-center px-4">
        <p className="font-display text-lg text-ink mb-2">Acceso pendiente</p>
        <p className="text-sm text-ink-light">
          {error ?? 'Tu cuenta todavía no fue habilitada.'}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
