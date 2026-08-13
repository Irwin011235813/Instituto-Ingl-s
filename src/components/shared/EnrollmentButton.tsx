import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/useAuth';
import { useEstadoInscripcionAlumno } from '@/modules/pagos/hooks/useEstadoInscripcionAlumno';
import { crearPreferenciaPago } from '@/modules/pagos/services/pagosService';
import { ModalPreInscripcion } from './ModalPreInscripcion';
import { ModalSeleccionCurso } from './ModalSeleccionCurso';

interface EnrollmentButtonProps {
  cursoId?: string;
  cursoNombre?: string;
  className?: string;
}

/**
 * Botón "Quiero inscribirme" con lógica de 3 escenarios (ver EnrollmentButton
 * README / MERCADOPAGO.md para el detalle completo).
 */
export function EnrollmentButton({ cursoId, cursoNombre, className }: EnrollmentButtonProps) {
  const navigate = useNavigate();
  const { usuarioFirebase, perfil, cargando: cargandoAuth } = useAuth();
  const estadoAlumno = useEstadoInscripcionAlumno(
    perfil?.rol === 'alumno' ? usuarioFirebase?.uid : undefined
  );

  const [mostrarPreInscripcion, setMostrarPreInscripcion] = useState(false);
  const [mostrarSelectorCurso, setMostrarSelectorCurso] = useState(false);
  const [procesandoPago, setProcesandoPago] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const claseBase =
    className ??
    'rounded-full bg-sage px-6 py-3 text-center text-sm font-bold text-white shadow-md transition hover:bg-sage-dark disabled:cursor-not-allowed disabled:opacity-60';

  if (!cargandoAuth && !usuarioFirebase) {
    return (
      <>
        <button onClick={() => setMostrarPreInscripcion(true)} className={claseBase}>
          Quiero inscribirme
        </button>
        {mostrarPreInscripcion && (
          <ModalPreInscripcion
            cursoId={cursoId}
            cursoNombre={cursoNombre}
            onCerrar={() => setMostrarPreInscripcion(false)}
          />
        )}
      </>
    );
  }

  if (cargandoAuth || estadoAlumno.estado === 'cargando') {
    return (
      <button disabled className={claseBase}>
        <span className="flex items-center justify-center gap-2">
          <Loader2 size={16} className="animate-spin" /> Cargando...
        </span>
      </button>
    );
  }

  if (perfil && perfil.rol !== 'alumno') {
    return (
      <button onClick={() => navigate('/panel')} className={claseBase}>
        Ir a mi panel
      </button>
    );
  }

  async function pagarCuotaPendiente() {
    if (estadoAlumno.estado !== 'con-cuota-pendiente') return;
    setProcesandoPago(true);
    setError(null);
    try {
      if (estadoAlumno.cuota.mercadoPago.initPoint) {
        window.location.href = estadoAlumno.cuota.mercadoPago.initPoint;
        return;
      }
      const { initPoint } = await crearPreferenciaPago({
        cursoId: estadoAlumno.cuota.cursoId,
        tipo: 'mensual',
      });
      window.location.href = initPoint;
    } catch {
      setError('No se pudo generar el pago. Intentá de nuevo en unos minutos.');
      setProcesandoPago(false);
    }
  }

  if (estadoAlumno.estado === 'con-cuota-pendiente') {
    return (
      <div>
        <button onClick={pagarCuotaPendiente} disabled={procesandoPago} className={claseBase}>
          {procesandoPago ? 'Generando pago...' : 'Pagar cuota pendiente'}
        </button>
        {error && <p className="mt-2 text-sm text-rust">{error}</p>}
      </div>
    );
  }

  if (estadoAlumno.estado === 'al-dia') {
    return (
      <button onClick={() => navigate('/panel')} className={claseBase}>
        Ver mi progreso
      </button>
    );
  }

  return (
    <>
      <button onClick={() => setMostrarSelectorCurso(true)} className={claseBase}>
        Quiero inscribirme
      </button>
      {mostrarSelectorCurso && (
        <ModalSeleccionCurso onCerrar={() => setMostrarSelectorCurso(false)} />
      )}
    </>
  );
}
