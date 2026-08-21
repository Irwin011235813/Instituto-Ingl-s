import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

/**
 * Encabezado consistente para las páginas del panel: título + subtítulo
 * opcional a la izquierda, acciones (botones) a la derecha. Antes cada
 * página repetía su propio `flex items-center justify-between` a mano.
 */
export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-ink-light mt-1.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}