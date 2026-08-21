import type { ReactNode } from 'react';
import type { Turno } from '../types';
import type { ConId } from '@/types/firestore';
import { Etiqueta } from '@/components/ui/Etiqueta';

const ABREVIATURA_DIA: Record<string, string> = {
  lunes: 'LUN',
  martes: 'MAR',
  miercoles: 'MIE',
  jueves: 'JUE',
  viernes: 'VIE',
  sabado: 'SAB',
};

interface TarjetaTurnoProps {
  turno: ConId<Turno>;
  accion?: ReactNode;
}

/**
 * Tarjeta con estética de "ticket de clase": borde perforado, sello de día
 * en la esquina y datos alineados en fuente mono, como un pasaje impreso.
 */
export function TarjetaTurno({ turno, accion }: TarjetaTurnoProps) {
  const cupoLleno = turno.inscriptos >= turno.cupoMaximo;

  return (
    <div className="ticket-edge flex bg-white border border-mist rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(30,42,68,0.06)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(30,42,68,0.10)]">
      {/* Sello de día */}
      <div className="flex flex-col items-center justify-center bg-ink text-paper px-4 py-3 min-w-[76px]">
        <span className="font-mono text-[10px] tracking-widest opacity-60">DÍA</span>
        <span className="font-display text-xl font-semibold">{ABREVIATURA_DIA[turno.dia]}</span>
      </div>

      {/* Línea punteada tipo "corte de ticket" */}
      <div className="w-px bg-[repeating-linear-gradient(to_bottom,var(--color-mist)_0_6px,transparent_6px_12px)]" aria-hidden="true" />

      {/* Datos del turno */}
      <div className="flex-1 px-4 py-3.5 flex flex-col gap-1.5">
        <p className="font-display font-semibold text-ink leading-tight">{turno.cursoNombre}</p>
        <p className="font-mono text-sm text-ink-light">
          {turno.horaInicio} – {turno.horaFin} · Aula {turno.aula}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <Etiqueta tono={cupoLleno ? 'alerta' : 'exito'}>
            {turno.inscriptos}/{turno.cupoMaximo} cupos
          </Etiqueta>
          {turno.estado === 'cancelado' && <Etiqueta tono="alerta">Cancelado</Etiqueta>}
        </div>
        {accion && <div className="mt-2">{accion}</div>}
      </div>
    </div>
  );
}