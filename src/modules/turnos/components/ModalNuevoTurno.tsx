import { useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { Boton } from '@/components/ui/Boton';
import { DIAS_SEMANA, type DiaSemana } from '@/types/common';
import { crearTurno } from '../services/turnosService';
import type { ConId } from '@/types/firestore';
import type { Curso } from '@/modules/cursos/types';

interface ModalNuevoTurnoProps {
  curso: ConId<Curso>;
  onCerrar: () => void;
  onCreado: () => void;
}

export function ModalNuevoTurno({ curso, onCerrar, onCreado }: ModalNuevoTurnoProps) {
  const [dia, setDia] = useState<DiaSemana>('lunes');
  const [horaInicio, setHoraInicio] = useState('18:00');
  const [horaFin, setHoraFin] = useState('19:30');
  const [aula, setAula] = useState('1');
  const [cupoMaximo, setCupoMaximo] = useState(curso.cupoMaximo);
  const [guardando, setGuardando] = useState(false);

  async function manejarEnvio(e: FormEvent) {
    e.preventDefault();
    setGuardando(true);
    try {
      await crearTurno({ cursoId: curso.id, dia, horaInicio, horaFin, aula, cupoMaximo }, curso.nombre);
      onCreado();
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-ink/40 flex items-center justify-center p-4 z-20">
      <form
        onSubmit={manejarEnvio}
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">
            Nuevo turno · {curso.nombre}
          </h2>
          <button type="button" onClick={onCerrar} className="text-ink-light hover:text-ink">
            <X size={20} />
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-light mb-1">Día</label>
          <select
            value={dia}
            onChange={(e) => setDia(e.target.value as DiaSemana)}
            className="w-full border border-mist rounded-md px-3 py-2 text-sm focus:border-mustard-dark outline-none"
          >
            {DIAS_SEMANA.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-ink-light mb-1">Hora inicio</label>
            <input
              type="time"
              required
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              className="w-full border border-mist rounded-md px-3 py-2 text-sm focus:border-mustard-dark outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-light mb-1">Hora fin</label>
            <input
              type="time"
              required
              value={horaFin}
              onChange={(e) => setHoraFin(e.target.value)}
              className="w-full border border-mist rounded-md px-3 py-2 text-sm focus:border-mustard-dark outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-ink-light mb-1">Aula</label>
            <input
              required
              value={aula}
              onChange={(e) => setAula(e.target.value)}
              className="w-full border border-mist rounded-md px-3 py-2 text-sm focus:border-mustard-dark outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-light mb-1">Cupo máximo</label>
            <input
              type="number"
              min={1}
              required
              value={cupoMaximo}
              onChange={(e) => setCupoMaximo(Number(e.target.value))}
              className="w-full border border-mist rounded-md px-3 py-2 text-sm focus:border-mustard-dark outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Boton type="button" variante="fantasma" onClick={onCerrar}>
            Cancelar
          </Boton>
          <Boton type="submit" variante="primario" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Crear turno'}
          </Boton>
        </div>
      </form>
    </div>
  );
}
