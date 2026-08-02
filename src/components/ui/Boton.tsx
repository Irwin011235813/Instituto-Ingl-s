import type { ButtonHTMLAttributes } from 'react';

type Variante = 'primario' | 'secundario' | 'peligro' | 'fantasma';

interface BotonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
}

const estilosPorVariante: Record<Variante, string> = {
  primario: 'bg-ink text-paper hover:bg-ink-light',
  secundario: 'bg-mustard text-ink hover:bg-mustard-dark',
  peligro: 'bg-rust text-paper hover:opacity-90',
  fantasma: 'bg-transparent text-ink border border-ink/20 hover:bg-ink/5',
};

export function Boton({ variante = 'primario', className = '', ...props }: BotonProps) {
  return (
    <button
      className={`px-4 py-2 rounded-md font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${estilosPorVariante[variante]} ${className}`}
      {...props}
    />
  );
}
