import type { ReactNode } from 'react';

type Tono = 'neutro' | 'exito' | 'alerta' | 'acento';

const estilosPorTono: Record<Tono, string> = {
  neutro: 'bg-mist text-ink-light',
  exito: 'bg-sage/15 text-sage-dark',
  alerta: 'bg-rust/10 text-rust',
  acento: 'bg-mustard/20 text-mustard-dark',
};

export function Etiqueta({ tono = 'neutro', children }: { tono?: Tono; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium ${estilosPorTono[tono]}`}
    >
      {children}
    </span>
  );
}
