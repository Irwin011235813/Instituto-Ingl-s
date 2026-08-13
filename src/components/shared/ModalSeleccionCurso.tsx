import { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useCursos } from '@/modules/cursos/hooks/useCursos';
import { listarTurnosPorCurso } from '@/modules/turnos/services/turnosService';
import { crearPreferenciaPago } from '@/modules/pagos/services/pagosService';
import type { Turno } from '@/modules/turnos/types';
import type { ConId } from '@/types/firestore';

interface ModalSeleccionCursoProps {
  onCerrar: () => void;
}

export function ModalSeleccionCurso({ onCerrar }: ModalSeleccionCursoProps) {
  const { cursos, cargando: cargandoCursos } = useCursos();
  const [cursoId, setCursoId] = useState<string>('');
  const [turnos, setTurnos] = useState<ConId<Turno>[]>([]);
  const [turnoId, setTurnoId] = useState<string>('');
  const [cargandoTurnos, setCargandoTurnos] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cursoSeleccionado = cursos.find((c) => c.id === cursoId);

  useEffect(() => {
    if (!cursoId) {
      setTurnos([]);
      setTurnoId('');
      return;
    }
    setCargandoTurnos(true);
    listarTurnosPorCurso(cursoId)
      .then((t) => {
        setTurnos(t);
        setTurnoId('');
      })
      .finally(() => setCargandoTurnos(false));
  }, [cursoId]);

  async function confirmarInscripcion() {
    if (!cursoId || !turnoId) return;
    setProcesando(true);
    setError(null);
    try {
      const { initPoint } = await crearPreferenciaPago({
        cursoId,
        turnoId,
        tipo: 'matricula',
      });
      window.location.href = initPoint;
    } catch {
      setError('No se pudo generar el pago. Intentá de nuevo en unos minutos.');
      setProcesando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-ink/40 p-4" onClick={onCerrar}>
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">Elegí tu curso</h2>
          <button onClick={onCerrar} className="text-ink-light hover:text-ink" aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-light">Curso</label>
            {cargandoCursos ? (
              <p className="text-sm text-ink-light">Cargando cursos...</p>
            ) : (
              <select
                value={cursoId}
                onChange={(e) => setCursoId(e.target.value)}
                className="w-full rounded-md border border-mist px-3 py-2 text-sm outline-none focus:border-sage"
              >
                <option value="">Seleccioná un curso</option>
                {cursos.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} · {c.nivel}
                  </option>
                ))}
              </select>
            )}
          </div>

          {cursoId && (
            <div>
              <label className="mb-1 block text-sm font-medium text-ink-light">
                Turno disponible
              </label>
              {cargandoTurnos ? (
                <p className="flex items-center gap-2 text-sm text-ink-light">
                  <Loader2 size={14} className="animate-spin" /> Buscando turnos...
                </p>
              ) : turnos.length === 0 ? (
                <p className="text-sm text-ink-light">
                  Este curso no tiene turnos programados por ahora.
                </p>
              ) : (
                <select
                  value={turnoId}
                  onChange={(e) => setTurnoId(e.target.value)}
                  className="w-full rounded-md border border-mist px-3 py-2 text-sm outline-none focus:border-sage"
                >
                  <option value="">Seleccioná un turno</option>
                  {turnos.map((t) => (
                    <option key={t.id} value={t.id} disabled={t.inscriptos >= t.cupoMaximo}>
                      {t.dia} {t.horaInicio}–{t.horaFin} · Aula {t.aula}
                      {t.inscriptos >= t.cupoMaximo ? ' (sin cupo)' : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {cursoSeleccionado && (
            <div className="rounded-xl bg-paper-dim p-4 text-sm">
              <p className="flex justify-between text-ink-light">
                <span>Matrícula</span>
                <span className="font-semibold text-ink">
                  ${cursoSeleccionado.precioMatricula?.toLocaleString('es-AR') ?? '—'}
                </span>
              </p>
              <p className="mt-1 flex justify-between text-ink-light">
                <span>Cuota mensual</span>
                <span className="font-semibold text-ink">
                  ${cursoSeleccionado.precioCuotaMensual?.toLocaleString('es-AR') ?? '—'}
                </span>
              </p>
            </div>
          )}

          {error && <p className="text-sm text-rust">{error}</p>}

          <button
            onClick={confirmarInscripcion}
            disabled={!cursoId || !turnoId || procesando}
            className="w-full rounded-xl bg-sage px-4 py-3 text-sm font-bold text-white transition hover:bg-sage-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {procesando ? 'Generando pago...' : 'Pagar matrícula y confirmar cupo'}
          </button>
        </div>
      </div>
    </div>
  );
}
