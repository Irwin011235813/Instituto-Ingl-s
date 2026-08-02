import { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Spinner } from '@/components/ui/Spinner';
import { Boton } from '@/components/ui/Boton';
import { Etiqueta } from '@/components/ui/Etiqueta';
import { TarjetaTurno } from '@/modules/turnos/components/TarjetaTurno';
import { useTurnos } from '@/modules/turnos/hooks/useTurnos';
import { useAuth } from '@/context/AuthContext';
import {
  inscribirAlumno,
  cancelarInscripcion,
  CupoCompletoError,
  YaInscriptoError,
} from '@/modules/inscripciones/services/inscripcionesService';
import { cancelarTurno } from '@/modules/turnos/services/turnosService';
import { useInscripcionesDeAlumno } from '@/modules/inscripciones/hooks/useInscripcionesDeAlumno';
import { DIAS_SEMANA } from '@/types/common';

export function TurnosPage() {
  const { perfil, usuarioFirebase } = useAuth();
  const { turnos, cargando, recargar } = useTurnos();
  const { inscripciones, recargar: recargarInscripciones } = useInscripcionesDeAlumno(
    usuarioFirebase?.uid
  );
  const [procesando, setProcesando] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const esAlumno = perfil?.rol === 'alumno';
  const puedeGestionar = perfil?.rol === 'admin' || perfil?.rol === 'profesor';

  function inscripcionDelTurno(turnoId: string) {
    return inscripciones.find((i) => i.turnoId === turnoId);
  }

  async function manejarInscripcion(turnoId: string, cursoId: string) {
    if (!usuarioFirebase || !perfil) return;
    setProcesando(turnoId);
    setMensaje(null);
    try {
      await inscribirAlumno(turnoId, cursoId, usuarioFirebase.uid, perfil.nombre);
      await Promise.all([recargar(), recargarInscripciones()]);
      setMensaje('¡Inscripción confirmada!');
    } catch (e) {
      if (e instanceof CupoCompletoError || e instanceof YaInscriptoError) {
        setMensaje(e.message);
      } else {
        setMensaje('No se pudo completar la inscripción.');
      }
    } finally {
      setProcesando(null);
    }
  }

  async function manejarCancelacionInscripcion(inscripcionId: string, turnoId: string) {
    setProcesando(turnoId);
    try {
      await cancelarInscripcion(inscripcionId, turnoId);
      await Promise.all([recargar(), recargarInscripciones()]);
    } finally {
      setProcesando(null);
    }
  }

  async function manejarCancelacionTurno(turnoId: string) {
    setProcesando(turnoId);
    try {
      await cancelarTurno(turnoId);
      await recargar();
    } finally {
      setProcesando(null);
    }
  }

  if (cargando) return <Spinner label="Cargando turnos..." />;

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink">Turnos de clase</h1>
        {mensaje && <Etiqueta tono="acento">{mensaje}</Etiqueta>}
      </div>

      {turnos.length === 0 && (
        <p className="text-ink-light text-sm">Todavía no hay turnos programados.</p>
      )}

      <div className="space-y-8">
        {DIAS_SEMANA.map((dia) => {
          const turnosDelDia = turnos.filter((t) => t.dia === dia);
          if (turnosDelDia.length === 0) return null;

          return (
            <section key={dia}>
              <h2 className="font-mono text-xs uppercase tracking-widest text-ink-light mb-3">
                {dia}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {turnosDelDia.map((turno) => {
                  const inscripcion = inscripcionDelTurno(turno.id);
                  const cupoLleno = turno.inscriptos >= turno.cupoMaximo;

                  return (
                    <TarjetaTurno
                      key={turno.id}
                      turno={turno}
                      accion={
                        esAlumno ? (
                          inscripcion ? (
                            <Boton
                              variante="fantasma"
                              className="text-xs py-1.5"
                              disabled={procesando === turno.id}
                              onClick={() => manejarCancelacionInscripcion(inscripcion.id, turno.id)}
                            >
                              Cancelar inscripción
                            </Boton>
                          ) : (
                            <Boton
                              variante="secundario"
                              className="text-xs py-1.5"
                              disabled={cupoLleno || procesando === turno.id}
                              onClick={() => manejarInscripcion(turno.id, turno.cursoId)}
                            >
                              {cupoLleno ? 'Sin cupo' : 'Inscribirme'}
                            </Boton>
                          )
                        ) : puedeGestionar ? (
                          <Boton
                            variante="fantasma"
                            className="text-xs py-1.5"
                            disabled={procesando === turno.id}
                            onClick={() => manejarCancelacionTurno(turno.id)}
                          >
                            Cancelar turno
                          </Boton>
                        ) : null
                      }
                    />
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </PageContainer>
  );
}
