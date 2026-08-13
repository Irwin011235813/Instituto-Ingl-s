import { useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { Boton } from '@/components/ui/Boton';
import { NIVELES, type Nivel } from '@/types/common';
import { crearCurso } from '../services/cursosService';
import { useAuth } from '@/context/useAuth';

interface ModalNuevoCursoProps {
  onCerrar: () => void;
  onCreado: () => void;
}

export function ModalNuevoCurso({ onCerrar, onCreado }: ModalNuevoCursoProps) {
  const { perfil, usuarioFirebase } = useAuth();
  const [nombre, setNombre] = useState('');
  const [nivel, setNivel] = useState<Nivel>('A1');
  const [descripcion, setDescripcion] = useState('');
  const [cupoMaximo, setCupoMaximo] = useState(10);
  const [precioMatricula, setPrecioMatricula] = useState(0);
  const [precioCuotaMensual, setPrecioCuotaMensual] = useState(0);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function manejarEnvio(e: FormEvent) {
    e.preventDefault();
    if (!perfil || !usuarioFirebase) return;

    setGuardando(true);
    setError(null);

    try {
      await crearCurso(
        {
          nombre,
          nivel,
          descripcion,
          profesorUid: usuarioFirebase.uid,
          cupoMaximo,
          precioMatricula,
          precioCuotaMensual,
        },
        { uid: usuarioFirebase.uid, nombre: perfil.nombre }
      );
      onCreado();
    } catch (e) {
      const mensaje = e instanceof Error ? e.message : 'No se pudo crear el curso.';
      setError(mensaje);
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
          <h2 className="font-display text-lg font-semibold text-ink">Nuevo curso</h2>
          <button type="button" onClick={onCerrar} className="text-ink-light hover:text-ink">
            <X size={20} />
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-light mb-1">Nombre del curso</label>
          <input
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border border-mist rounded-md px-3 py-2 text-sm focus:border-mustard-dark outline-none"
            placeholder="Inglés conversacional"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-light mb-1">Nivel (MCER)</label>
          <select
            value={nivel}
            onChange={(e) => setNivel(e.target.value as Nivel)}
            className="w-full border border-mist rounded-md px-3 py-2 text-sm focus:border-mustard-dark outline-none"
          >
            {NIVELES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-light mb-1">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full border border-mist rounded-md px-3 py-2 text-sm focus:border-mustard-dark outline-none"
            rows={2}
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

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-ink-light mb-1">
              Matrícula (ARS)
            </label>
            <input
              type="number"
              min={0}
              required
              value={precioMatricula}
              onChange={(e) => setPrecioMatricula(Number(e.target.value))}
              className="w-full border border-mist rounded-md px-3 py-2 text-sm focus:border-mustard-dark outline-none"
              placeholder="15000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-light mb-1">
              Cuota mensual (ARS)
            </label>
            <input
              type="number"
              min={0}
              required
              value={precioCuotaMensual}
              onChange={(e) => setPrecioCuotaMensual(Number(e.target.value))}
              className="w-full border border-mist rounded-md px-3 py-2 text-sm focus:border-mustard-dark outline-none"
              placeholder="20000"
            />
          </div>
        </div>

        {error && (
          <p className="rounded-md border border-rust/30 bg-rust/5 px-3 py-2 text-sm text-rust">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Boton type="button" variante="fantasma" onClick={onCerrar}>
            Cancelar
          </Boton>
          <Boton type="submit" variante="primario" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Crear curso'}
          </Boton>
        </div>
      </form>
    </div>
  );
}
