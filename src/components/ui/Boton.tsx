import type { ButtonHTMLAttributes } from 'react';

type Variante = 'primario' | 'secundario' | 'peligro' | 'fantasma';

interface BotonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
}

const estilosPorVariante: Record<Variante, string> = {
  primario: 'bg-ink text-paper hover:bg-ink-light shadow-sm',
  secundario: 'bg-mustard text-ink hover:bg-mustard-dark shadow-sm',
  peligro: 'bg-rust text-paper hover:opacity-90 shadow-sm',
  fantasma: 'bg-transparent text-ink border border-mist hover:bg-paper-dim',
};

export function Boton({ variante = 'primario', className = '', ...props }: BotonProps) {
  return (
    <button
      className={`px-4 py-2 rounded-xl font-medium text-sm transition-all active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mustard-dark disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${estilosPorVariante[variante]} ${className}`}
      {...props}
    />
  );
}