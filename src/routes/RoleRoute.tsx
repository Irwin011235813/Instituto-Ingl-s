import type { ReactNode } from 'react';
import { useAuth } from '@/context/useAuth';
import type { Rol } from '@/types/common';

export function RoleRoute({ rolesPermitidos, children }: { rolesPermitidos: Rol[]; children: ReactNode }) {
  const { perfil } = useAuth();

  if (!perfil || !rolesPermitidos.includes(perfil.rol)) {
    return (
      <div className="max-w-md mx-auto mt-24 text-center px-4">
        <p className="font-display text-lg text-ink mb-2">No tenés acceso a esta sección</p>
        <p className="text-sm text-ink-light">Esta página es solo para {rolesPermitidos.join(' / ')}.</p>
      </div>
    );
  }

  return <>{children}</>;
}
