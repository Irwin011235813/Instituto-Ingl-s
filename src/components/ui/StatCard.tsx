import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  to?: string;
}

/**
 * Tarjeta de métrica para el panel (cantidad de cursos activos, turnos
 * programados, etc). Si recibe `to`, es clickeable y navega ahí.
 */
export function StatCard({ icon: Icon, label, value, to }: StatCardProps) {
  const contenido = (
    <>
      <div className="w-10 h-10 rounded-xl bg-mustard/15 flex items-center justify-center shrink-0">
        <Icon size={19} className="text-mustard-dark" />
      </div>
      <div className="min-w-0">
        <p className="font-display text-2xl font-semibold text-ink leading-none">{value}</p>
        <p className="text-sm text-ink-light mt-1.5 truncate">{label}</p>
      </div>
    </>
  );

  const claseBase =
    'flex items-center gap-4 rounded-2xl border border-mist bg-white p-5 shadow-[0_1px_3px_rgba(30,42,68,0.06)]';

  if (to) {
    return (
      <Link
        to={to}
        className={`${claseBase} transition-all hover:border-mustard-dark/40 hover:shadow-[0_4px_16px_rgba(30,42,68,0.08)]`}
      >
        {contenido}
      </Link>
    );
  }

  return <div className={claseBase}>{contenido}</div>;
}