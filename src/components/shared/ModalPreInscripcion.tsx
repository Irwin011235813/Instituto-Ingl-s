import { useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { NIVELES } from '@/types/common';
import { crearPreInscripcion } from '@/modules/inscripciones/services/preInscripcionService';

interface ModalPreInscripcionProps {
  onCerrar: () => void;
  cursoId?: string;
  cursoNombre?: string;
}

export function ModalPreInscripcion({ onCerrar, cursoId, cursoNombre }: ModalPreInscripcionProps) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [nivelInteres, setNivelInteres] = useState('sin-definir');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  async function manejarEnvio(e: FormEvent) {
    e.preventDefault();
    setEnviando(true);
    try {
      await crearPreInscripcion({ nombre, email, telefono, nivelInteres, cursoId, cursoNombre });
      setEnviado(true);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-ink/40 p-4" onClick={onCerrar}>
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">
            {cursoNombre ? `Quiero inscribirme: ${cursoNombre}` : 'Quiero inscribirme'}
          </h2>
          <button onClick={onCerrar} className="text-ink-light hover:text-ink" aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        {enviado ? (
          <div className="mt-6 rounded-xl bg-sage/10 px-4 py-4 text-sm text-sage-dark">
            ¡Gracias, {nombre.split(' ')[0]}! Recibimos tu consulta — te vamos a contactar a la
            brevedad para coordinar tu inscripción.
          </div>
        ) : (
          <form onSubmit={manejarEnvio} className="mt-4 space-y-3">
            <p className="text-sm text-ink-light">
              Dejanos tus datos y te contactamos para coordinar la inscripción. Si ya tenés
              cuenta, mejor iniciá sesión desde el botón del header.
            </p>

            <div>
              <label className="mb-1 block text-sm font-medium text-ink-light">Nombre</label>
              <input
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full rounded-md border border-mist px-3 py-2 text-sm outline-none focus:border-sage"
                placeholder="Tu nombre completo"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-ink-light">Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-mist px-3 py-2 text-sm outline-none focus:border-sage"
                placeholder="tuemail@ejemplo.com"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-ink-light">Teléfono</label>
              <input
                required
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full rounded-md border border-mist px-3 py-2 text-sm outline-none focus:border-sage"
                placeholder="+54 3757 508363"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-ink-light">
                Nivel de interés
              </label>
              <select
                value={nivelInteres}
                onChange={(e) => setNivelInteres(e.target.value)}
                className="w-full rounded-md border border-mist px-3 py-2 text-sm outline-none focus:border-sage"
              >
                <option value="sin-definir">No estoy seguro / a evaluar</option>
                {NIVELES.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={enviando}
              className="mt-2 w-full rounded-xl bg-sage px-4 py-3 text-sm font-bold text-white transition hover:bg-sage-dark disabled:opacity-60"
            >
              {enviando ? 'Enviando...' : 'Enviar y que me contacten'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
