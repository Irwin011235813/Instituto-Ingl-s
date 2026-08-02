import { useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { Boton } from '@/components/ui/Boton';
import { NIVELES, type Nivel } from '@/types/common';
import { crearCurso } from '../services/cursosService';
import { useAuth } from '@/context/AuthContext';

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
  const [guardando, setGuardando] = useState(false);

  async function manejarEnvio(e: FormEvent) {
    e.preventDefault();
    if (!perfil || !usuarioFirebase) return;
    setGuardando(true);
    try {
      await crearCurso(
        { nombre, nivel, descripcion, profesorUid: usuarioFirebase.uid, cupoMaximo },
        { uid: usuarioFirebase.uid, nombre: perfil.nombre }
      );
      onCreado();
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
