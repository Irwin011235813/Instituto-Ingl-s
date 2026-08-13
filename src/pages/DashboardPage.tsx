import { Link } from 'react-router-dom';
import { CalendarDays, BookOpen, GraduationCap, CreditCard, Loader2, CheckCircle2 } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Spinner } from '@/components/ui/Spinner';
import { Etiqueta } from '@/components/ui/Etiqueta';
import { useAuth } from '@/context/useAuth';
import { useInscripcionesDeAlumno } from '@/modules/inscripciones/hooks/useInscripcionesDeAlumno';
import { useCursos } from '@/modules/cursos/hooks/useCursos';
import { useEstadoInscripcionAlumno } from '@/modules/pagos/hooks/useEstadoInscripcionAlumno';
import { useCuotasDeAlumno } from '@/modules/pagos/hooks/useCuotasDeAlumno';
import { crearPreferenciaPago } from '@/modules/pagos/services/pagosService';
import { useState } from 'react';

/**
 * Panel interno del usuario ya logueado. Distinto de PublicHomePage:
 * esto es la herramienta de trabajo real, con datos de Firestore.
 */
export function DashboardPage() {
  const { perfil, usuarioFirebase } = useAuth();

  if (!perfil) return <Spinner />;

  return (
    <PageContainer>
      <h1 className="font-display text-2xl font-semibold text-ink mb-1">
        Hola, {perfil.nombre.split(' ')[0]}
      </h1>
      <p className="text-sm text-ink-light mb-8">
        {perfil.rol === 'alumno' && `Nivel actual: ${perfil.nivelActual ?? 'sin asignar'}`}
        {perfil.rol === 'profesor' && 'Panel de profesor/a'}
        {perfil.rol === 'admin' && 'Panel de administración'}
      </p>

      {perfil.rol === 'alumno' ? (
        <div className="space-y-8">
          <ResumenAlumno alumnoUid={usuarioFirebase?.uid} />
          <PuntoDeCobro alumnoUid={usuarioFirebase?.uid} />
        </div>
      ) : (
        <ResumenGestion />
      )}
    </PageContainer>
  );
}

function ResumenAlumno({ alumnoUid }: { alumnoUid: string | undefined }) {
  const { inscripciones, cargando } = useInscripcionesDeAlumno(alumnoUid);

  if (cargando) return <Spinner label="Cargando tus clases..." />;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <GraduationCap size={18} className="text-mustard-dark" />
        <h2 className="font-display font-semibold text-ink">Mis próximas clases</h2>
      </div>

      {inscripciones.length === 0 ? (
        <div className="bg-white border border-dashed border-mist rounded-lg p-6 text-center">
          <p className="text-sm text-ink-light mb-3">Todavía no te inscribiste a ningún turno.</p>
          <Link to="/turnos" className="text-sm font-medium text-mustard-dark hover:underline">
            Ver turnos disponibles →
          </Link>
        </div>
      ) : (
        <ul className="space-y-2">
          {inscripciones.map((i) => (
            <li
              key={i.id}
              className="bg-white border border-mist rounded-md px-4 py-3 flex items-center justify-between"
            >
              <span className="text-sm text-ink">Turno inscripto</span>
              <Etiqueta tono="exito">Activa</Etiqueta>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Punto de cobro del alumno: si tiene una cuota pendiente, muestra el
 * monto y un botón que genera el link de pago de Mercado Pago al vuelo
 * (mismo mecanismo que un link de pago dinámico) y redirige al checkout.
 * Debajo, el historial de cuotas ya generadas (pagadas o no).
 */
function PuntoDeCobro({ alumnoUid }: { alumnoUid: string | undefined }) {
  const estadoAlumno = useEstadoInscripcionAlumno(alumnoUid);
  const { cuotas, cargando: cargandoCuotas } = useCuotasDeAlumno(alumnoUid);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pagarCuotaPendiente() {
    if (estadoAlumno.estado !== 'con-cuota-pendiente') return;
    setProcesando(true);
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
      setError('No se pudo generar el link de pago. Intentá de nuevo en unos minutos.');
      setProcesando(false);
    }
  }

  if (estadoAlumno.estado === 'sin-curso') return null; // sin curso, no hay nada que cobrar todavía

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <CreditCard size={18} className="text-mustard-dark" />
        <h2 className="font-display font-semibold text-ink">Mis pagos</h2>
      </div>

      {/* Estado actual: cuota pendiente o al día */}
      {estadoAlumno.estado === 'cargando' ? (
        <Spinner label="Revisando tu cuenta..." />
      ) : estadoAlumno.estado === 'con-cuota-pendiente' ? (
        <div className="bg-white border border-mustard/40 rounded-lg p-5 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm text-ink-light">
              {estadoAlumno.cuota.tipo === 'matricula' ? 'Matrícula pendiente' : 'Cuota mensual pendiente'}
            </p>
            <p className="font-display text-2xl font-semibold text-ink">
              ${estadoAlumno.cuota.monto.toLocaleString('es-AR')}
            </p>
            <p className="text-xs text-ink-light mt-1">{estadoAlumno.cuota.cursoNombre}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={pagarCuotaPendiente}
              disabled={procesando}
              className="rounded-full bg-sage px-5 py-2.5 text-sm font-bold text-white transition hover:bg-sage-dark disabled:cursor-not-allowed disabled:opacity-60 flex items-center gap-2"
            >
              {procesando ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Generando link...
                </>
              ) : (
                'Pagar con Mercado Pago'
              )}
            </button>
            {error && <p className="text-xs text-rust">{error}</p>}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-mist rounded-lg p-5 flex items-center gap-3">
          <CheckCircle2 size={20} className="text-sage-dark shrink-0" />
          <p className="text-sm text-ink-light">Estás al día con tus pagos. ¡Gracias!</p>
        </div>
      )}

      {/* Historial */}
      {!cargandoCuotas && cuotas.length > 0 && (
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-ink-light mb-2">
            Historial
          </p>
          <ul className="space-y-1.5">
            {cuotas.map((c) => (
              <li
                key={c.id}
                className="bg-white border border-mist rounded-md px-4 py-2.5 flex items-center justify-between text-sm"
              >
                <span className="text-ink-light">
                  {c.tipo === 'matricula' ? 'Matrícula' : `Cuota ${c.periodo ?? ''}`} ·{' '}
                  {c.cursoNombre}
                </span>
                <span className="flex items-center gap-2">
                  <span className="font-mono text-ink">${c.monto.toLocaleString('es-AR')}</span>
                  <Etiqueta
                    tono={
                      c.estado === 'pagada' ? 'exito' : c.estado === 'pendiente' ? 'acento' : 'alerta'
                    }
                  >
                    {c.estado}
                  </Etiqueta>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ResumenGestion() {
  const { cursos, cargando } = useCursos();

  if (cargando) return <Spinner label="Cargando cursos..." />;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Link
        to="/cursos"
        className="bg-white border border-mist rounded-lg p-5 flex items-start gap-3 hover:border-mustard-dark transition-colors"
      >
        <BookOpen size={20} className="text-mustard-dark shrink-0" />
        <div>
          <p className="font-display font-semibold text-ink">{cursos.length} cursos activos</p>
          <p className="text-sm text-ink-light">Gestionar cursos y niveles</p>
        </div>
      </Link>
      <Link
        to="/turnos"
        className="bg-white border border-mist rounded-lg p-5 flex items-start gap-3 hover:border-mustard-dark transition-colors"
      >
        <CalendarDays size={20} className="text-mustard-dark shrink-0" />
        <div>
          <p className="font-display font-semibold text-ink">Turnos de la semana</p>
          <p className="text-sm text-ink-light">Ver horarios y cupos</p>
        </div>
      </Link>
    </div>
  );
}
