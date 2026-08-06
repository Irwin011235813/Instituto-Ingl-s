import { Link } from 'react-router-dom';
import { CalendarDays, BookOpen, GraduationCap } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Spinner } from '@/components/ui/Spinner';
import { Etiqueta } from '@/components/ui/Etiqueta';
import { useAuth } from '@/context/AuthContext';
import { useInscripcionesDeAlumno } from '@/modules/inscripciones/hooks/useInscripcionesDeAlumno';
import { useCursos } from '@/modules/cursos/hooks/useCursos';

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
        <ResumenAlumno alumnoUid={usuarioFirebase?.uid} />
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
