import { useState } from 'react';
import { Plus, CalendarPlus } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Spinner } from '@/components/ui/Spinner';
import { Boton } from '@/components/ui/Boton';
import { Etiqueta } from '@/components/ui/Etiqueta';
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

  if (error) {
    return (
      <PageContainer>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-semibold text-ink">Cursos</h1>
          <Boton
            variante="primario"
            className="flex items-center gap-1.5"
            onClick={() => {
              console.log('¡El botón de Nuevo curso sí funciona!');
              setMostrarModalCurso(true);
            }}
          >
            <Plus size={16} /> Nuevo curso
          </Boton>
        </div>

        <div className="rounded-lg border border-rust/30 bg-rust/5 p-4 text-sm text-rust">
          {error}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink">Cursos</h1>
        <Boton
          variante="primario"
          className="flex items-center gap-1.5"
          onClick={() => {
            console.log('¡El botón de Nuevo curso sí funciona!');
            setMostrarModalCurso(true);
          }}
        >
          <Plus size={16} /> Nuevo curso
        </Boton>
      </div>

      {cursos.length === 0 && (
        <p className="text-ink-light text-sm">Todavía no creaste ningún curso.</p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {cursos.map((curso) => (
          <div key={curso.id} className="bg-white border border-mist rounded-lg p-4 flex flex-col gap-2">
            <div className="flex items-start justify-between">
              <h3 className="font-display font-semibold text-ink">{curso.nombre}</h3>
              <Etiqueta tono="acento">{curso.nivel}</Etiqueta>
            </div>
            <p className="text-sm text-ink-light">{curso.descripcion || 'Sin descripción.'}</p>
            <p className="text-xs font-mono text-ink-light">Profesor/a: {curso.profesor.nombre}</p>
            <p className="text-xs font-mono text-ink-light">
              Matrícula: ${curso.precioMatricula?.toLocaleString('es-AR') ?? '—'} · Cuota: $
              {curso.precioCuotaMensual?.toLocaleString('es-AR') ?? '—'}
            </p>
            <Boton
              variante="fantasma"
              className="text-xs py-1.5 self-start flex items-center gap-1.5 mt-1"
              onClick={() => setCursoParaTurno(curso)}
            >
              <CalendarPlus size={14} /> Agregar turno
            </Boton>
          </div>
        ))}
      </div>

      {mostrarModalCurso && (
        <ModalNuevoCurso
          onCerrar={() => setMostrarModalCurso(false)}
          onCreado={() => {
            setMostrarModalCurso(false);
            // La lista se actualiza automáticamente con onSnapshot
          }}
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
