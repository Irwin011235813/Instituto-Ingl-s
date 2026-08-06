import { X } from 'lucide-react';
import type { ProgramaCurso } from '@/data/programasCurso';

interface ModalProgramaProps {
  programa: ProgramaCurso;
  onCerrar: () => void;
  onQuieroInscribirme: () => void;
}

export function ModalPrograma({ programa, onCerrar, onQuieroInscribirme }: ModalProgramaProps) {
  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-ink/40 p-4"
      onClick={onCerrar}
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-7 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">{programa.titulo}</h2>
            <p className="mt-1 text-sm text-ink-light">{programa.edad}</p>
          </div>
          <button
            onClick={onCerrar}
            className="rounded-full p-1.5 text-ink-light hover:bg-paper-dim hover:text-ink"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {programa.nivelesCEFR.map((nivel) => (
            <span
              key={nivel}
              className="rounded-full bg-sage/15 px-2.5 py-0.5 text-xs font-mono font-semibold text-sage-dark"
            >
              {nivel}
            </span>
          ))}
        </div>

        <dl className="mt-6 space-y-4 text-sm">
          <div>
            <dt className="font-semibold text-ink">Duración y frecuencia</dt>
            <dd className="text-ink-light">{programa.duracion}</dd>
          </div>
          <div>
            <dt className="font-semibold text-ink">Modalidad</dt>
            <dd className="text-ink-light">{programa.modalidad}</dd>
          </div>
          <div>
            <dt className="font-semibold text-ink">Metodología</dt>
            <dd className="text-ink-light">{programa.metodologia}</dd>
          </div>
        </dl>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-ink">Objetivos del programa</h3>
          <ul className="mt-2 space-y-1.5">
            {programa.objetivos.map((obj) => (
              <li key={obj} className="flex gap-2 text-sm text-ink-light">
                <span className="text-sage-dark">✦</span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-ink">Temario orientativo</h3>
          <ul className="mt-2 space-y-1.5">
            {programa.temario.map((tema) => (
              <li key={tema} className="flex gap-2 text-sm text-ink-light">
                <span className="text-mustard-dark">•</span>
                <span>{tema}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={onQuieroInscribirme}
          className="mt-7 w-full rounded-xl bg-sage px-4 py-3 text-sm font-bold text-white transition hover:bg-sage-dark"
        >
          Quiero inscribirme en este programa
        </button>
      </div>
    </div>
  );
}
