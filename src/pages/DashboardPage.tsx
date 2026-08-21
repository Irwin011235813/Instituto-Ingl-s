import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  BookOpen,
  GraduationCap,
  CreditCard,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Spinner } from '@/components/ui/Spinner';
import { Etiqueta } from '@/components/ui/Etiqueta';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatCard } from '@/components/ui/StatCard';
import { useAuth } from '@/context/useAuth';
import { useInscripcionesDeAlumno } from '@/modules/inscripciones/hooks/useInscripcionesDeAlumno';
import { useCursos } from '@/modules/cursos/hooks/useCursos';
import { useTurnos } from '@/modules/turnos/hooks/useTurnos';
import { useEstadoInscripcionAlumno } from '@/modules/pagos/hooks/useEstadoInscripcionAlumno';
import { useCuotasDeAlumno } from '@/modules/pagos/hooks/useCuotasDeAlumno';
import { crearPreferenciaPago } from '@/modules/pagos/services/pagosService';

const ETIQUETA_ROL: Record<string, string> = {
  alumno: 'Panel de alumno/a',
  profesor: 'Panel de profesor/a',
  admin: 'Panel de administración',
};

/**
 * Panel interno del usuario ya logueado. Distinto de PublicHomePage:
 * esto es la herramienta de trabajo real, con datos de Firestore.
 */
export function DashboardPage() {
  const { perfil, usuarioFirebase } = useAuth();

  if (!perfil) return <Spinner />;

  return (
    <PageContainer>
      <PageHeader
        title={`Hola, ${perfil.nombre.split(' ')[0]}`}
        subtitle={
          perfil.rol === 'alumno'
            ? `Nivel actual: ${perfil.nivelActual ?? 'sin asignar'}`
            : ETIQUETA_ROL[perfil.rol]
        }
      />

      {perfil.rol === 'alumno' ? (
        <div className="space-y-10">
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
    <section>
      <div className="flex items-center gap-2 mb-4">
        <GraduationCap size={18} className="text-mustard-dark" />
        <h2 className="font-display font-semibold text-ink text-lg">Mis próximas clases</h2>
      </div>

      {inscripciones.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Todavía no te inscribiste a ningún turno"
          action={
            <Link
              to="/turnos"
              className="text-sm font-semibold text-mustard-dark hover:underline"
            >
              Ver turnos disponibles →
            </Link>
          }
        />
      ) : (
        <ul className="grid gap-2.5 sm:grid-cols-2">
          {inscripciones.map((i) => (
            <li
              key={i.id}
              className="bg-white border border-mist rounded-xl px-4 py-3.5 flex items-center justify-between"
            >
              <span className="text-sm text-ink font-medium">Turno inscripto</span>
              <Etiqueta tono="exito">Activa</Etiqueta>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/**
 * Punto de cobro del alumno: si tiene una cuota pendiente, muestra el
 * monto y un botón que genera el link de pago de Mercado Pago al vuelo
 * y redirige al checkout. Debajo, el historial de cuotas ya generadas.
 */
function PuntoDeCobro({ alumnoUid }: { alumnoUid: string | undefined }) {
  const estadoAlumno = useEstadoInscripcionAlumno(alumnoUid);
  const { cuotas, cargando: cargandoCuotas } = useCuotasDeAlumno(alumnoUid);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pagarCuotaPendiente() {
    if (estadoAlumno.estado !== 'con-cuota-pendiente' && estadoAlumno.estado !== 'al-dia') return;
    setProcesando(true);
    setError(null);
    try {
      if (estadoAlumno.estado === 'con-cuota-pendiente' && estadoAlumno.cuota.mercadoPago.initPoint) {
        window.location.href = estadoAlumno.cuota.mercadoPago.initPoint;
        return;
      }

      const cursoId =
        estadoAlumno.estado === 'con-cuota-pendiente'
          ? estadoAlumno.cuota.cursoId
          : estadoAlumno.inscripcion.cursoId;
      const tipo =
        estadoAlumno.estado === 'con-cuota-pendiente' && estadoAlumno.cuota.tipo === 'matricula'
          ? 'matricula'
          : 'mensual';

      const { initPoint } = await crearPreferenciaPago({ cursoId, tipo });
      window.location.href = initPoint;
    } catch {
      setError('No se pudo generar el link de pago. Intentá de nuevo en unos minutos.');
      setProcesando(false);
    }
  }

  if (estadoAlumno.estado === 'sin-curso') return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <CreditCard size={18} className="text-mustard-dark" />
        <h2 className="font-display font-semibold text-ink text-lg">Mis pagos</h2>
      </div>

      {estadoAlumno.estado === 'cargando' ? (
        <Spinner label="Revisando tu cuenta..." />
      ) : estadoAlumno.estado === 'con-cuota-pendiente' ? (
        <div className="bg-white border border-mustard/40 rounded-2xl p-5 sm:p-6 flex items-center justify-between gap-4 flex-wrap shadow-[0_1px_3px_rgba(30,42,68,0.06)]">
          <div>
            <p className="text-sm text-ink-light">
              {estadoAlumno.cuota.tipo === 'matricula' ? 'Matrícula pendiente' : 'Cuota mensual pendiente'}
            </p>
            <p className="font-display text-3xl font-semibold text-ink mt-0.5">
              ${estadoAlumno.cuota.monto.toLocaleString('es-AR')}
            </p>
            <p className="text-xs text-ink-light mt-1">{estadoAlumno.cuota.cursoNombre}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={pagarCuotaPendiente}
              disabled={procesando}
              className="rounded-full bg-sage px-5 py-2.5 text-sm font-bold text-white transition hover:bg-sage-dark disabled:cursor-not-allowed disabled:opacity-60 flex items-center gap-2 shadow-sm"
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
      ) : estadoAlumno.estado === 'al-dia' ? (
        <div className="bg-white border border-mustard/40 rounded-2xl p-5 sm:p-6 flex items-center justify-between gap-4 flex-wrap shadow-[0_1px_3px_rgba(30,42,68,0.06)]">
          <div>
            <p className="text-sm text-ink-light">Tu inscripción está activa</p>
            <p className="font-display text-xl font-semibold text-ink mt-0.5">Pagar cuota</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={pagarCuotaPendiente}
              disabled={procesando}
              className="rounded-full bg-sage px-5 py-2.5 text-sm font-bold text-white transition hover:bg-sage-dark disabled:cursor-not-allowed disabled:opacity-60 flex items-center gap-2 shadow-sm"
            >
              {procesando ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Generando link...
                </>
              ) : (
                'Pagar cuota'
              )}
            </button>
            {error && <p className="text-xs text-rust">{error}</p>}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-mist rounded-2xl p-5 flex items-center gap-3">
          <CheckCircle2 size={20} className="text-sage-dark shrink-0" />
          <p className="text-sm text-ink-light">Estás al día con tus pagos. ¡Gracias!</p>
        </div>
      )}

      {!cargandoCuotas && cuotas.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-mono uppercase tracking-widest text-ink-light mb-2">
            Historial
          </p>
          <ul className="space-y-1.5">
            {cuotas.map((c) => (
              <li
                key={c.id}
                className="bg-white border border-mist rounded-xl px-4 py-2.5 flex items-center justify-between text-sm"
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
    </section>
  );
}

function ResumenGestion() {
  const { cursos, cargando: cargandoCursos } = useCursos();
  const { turnos, cargando: cargandoTurnos } = useTurnos();

  if (cargandoCursos || cargandoTurnos) return <Spinner label="Cargando panel..." />;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard icon={BookOpen} label="Cursos activos" value={cursos.length} to="/cursos" />
        <StatCard icon={CalendarDays} label="Turnos programados" value={turnos.length} to="/turnos" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          to="/cursos"
          className="bg-white border border-mist rounded-2xl p-5 flex items-start gap-3 transition-all hover:border-mustard-dark/40 hover:shadow-[0_4px_16px_rgba(30,42,68,0.08)]"
        >
          <BookOpen size={20} className="text-mustard-dark shrink-0 mt-0.5" />
          <div>
            <p className="font-display font-semibold text-ink">Gestionar cursos</p>
            <p className="text-sm text-ink-light mt-0.5">Crear cursos, precios y niveles</p>
          </div>
        </Link>
        <Link
          to="/turnos"
          className="bg-white border border-mist rounded-2xl p-5 flex items-start gap-3 transition-all hover:border-mustard-dark/40 hover:shadow-[0_4px_16px_rgba(30,42,68,0.08)]"
        >
          <CalendarDays size={20} className="text-mustard-dark shrink-0 mt-0.5" />
          <div>
            <p className="font-display font-semibold text-ink">Turnos de la semana</p>
            <p className="text-sm text-ink-light mt-0.5">Ver horarios y cupos</p>
          </div>
        </Link>
      </div>
    </div>
  );
}