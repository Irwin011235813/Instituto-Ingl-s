import { useState } from 'react';
import { Plus, CalendarPlus, BookOpen, GraduationCap } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Spinner } from '@/components/ui/Spinner';
import { Boton } from '@/components/ui/Boton';
import { Etiqueta } from '@/components/ui/Etiqueta';
import { EmptyState } from '@/components/ui/EmptyState';
import { useCursos } from '@/modules/cursos/hooks/useCursos';
import { ModalNuevoCurso } from '@/modules/cursos/components/ModalNuevoCurso';
import { ModalNuevoTurno } from '@/modules/turnos/components/ModalNuevoTurno';
import type { ConId } from '@/types/firestore';
import type { Curso } from '@/modules/cursos/types';

export function CursosPage() {
  const { cursos, cargando, error } = useCursos();
  const [mostrarModalCurso, setMostrarModalCurso] = useState(false);
  const [cursoParaTurno, setCursoParaTurno] = useState<ConId<Curso> | null>(null);

  if (cargando) return <Spinner label="Cargando cursos..." />;

  const boton = (
    <Boton
      variante="primario"
      className="flex items-center gap-1.5"
      onClick={() => setMostrarModalCurso(true)}
    >
      <Plus size={16} /> Nuevo curso
    </Boton>
  );

  return (
    <PageContainer>
      <PageHeader title="Cursos" subtitle="Gestioná los programas y sus precios" actions={boton} />

      {error && (
        <div className="mb-6 rounded-xl border border-rust/30 bg-rust/5 p-4 text-sm text-rust">
          {error}
        </div>
      )}

      {cursos.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Todavía no creaste ningún curso"
          description="Los cursos son los programas del instituto (nombre, nivel, precio). Después les agregás turnos con día y horario."
          action={
            <Boton
              variante="secundario"
              className="flex items-center gap-1.5"
              onClick={() => setMostrarModalCurso(true)}
            >
              <Plus size={16} /> Crear el primero
            </Boton>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cursos.map((curso) => (
            <div
              key={curso.id}
              className="bg-white border border-mist rounded-2xl p-5 flex flex-col gap-3 shadow-[0_1px_3px_rgba(30,42,68,0.06)] transition-all hover:shadow-[0_8px_20px_rgba(30,42,68,0.08)]"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display font-semibold text-ink leading-tight">
                  {curso.nombre}
                </h3>
                <Etiqueta tono="acento">{curso.nivel}</Etiqueta>
              </div>

              <p className="text-sm text-ink-light line-clamp-2">
                {curso.descripcion || 'Sin descripción.'}
              </p>

              <div className="flex items-center gap-1.5 text-xs text-ink-light">
                <GraduationCap size={14} />
                {curso.profesor.nombre}
              </div>

              <div className="flex gap-2 pt-1">
                <div className="flex-1 rounded-lg bg-paper-dim px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-ink-light">Matrícula</p>
                  <p className="font-mono text-sm font-semibold text-ink">
                    ${curso.precioMatricula?.toLocaleString('es-AR') ?? '—'}
                  </p>
                </div>
                <div className="flex-1 rounded-lg bg-paper-dim px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-ink-light">Cuota</p>
                  <p className="font-mono text-sm font-semibold text-ink">
                    ${curso.precioCuotaMensual?.toLocaleString('es-AR') ?? '—'}
                  </p>
                </div>
              </div>

              <Boton
                variante="fantasma"
                className="text-xs py-1.5 self-start flex items-center gap-1.5"
                onClick={() => setCursoParaTurno(curso)}
              >
                <CalendarPlus size={14} /> Agregar turno
              </Boton>
            </div>
          ))}
        </div>
      )}

      {mostrarModalCurso && (
        <ModalNuevoCurso
          onCerrar={() => setMostrarModalCurso(false)}
          onCreado={() => setMostrarModalCurso(false)}
        />
      )}

      {cursoParaTurno && (
        <ModalNuevoTurno
          curso={cursoParaTurno}
          onCerrar={() => setCursoParaTurno(null)}
          onCreado={() => setCursoParaTurno(null)}
        />
      )}
    </PageContainer>
  );
}