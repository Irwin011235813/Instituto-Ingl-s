import { Navigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Boton } from '@/components/ui/Boton';

export function LoginPage() {
  const { usuarioFirebase, cargando, error, iniciarSesionConGoogle } = useAuth();

  if (!cargando && usuarioFirebase) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="w-14 h-14 rounded-xl bg-ink flex items-center justify-center mx-auto mb-5">
          <BookOpen size={26} className="text-mustard" />
        </div>
        <h1 className="font-display text-2xl font-semibold text-ink mb-1">Instituto de Inglés</h1>
        <p className="text-sm text-ink-light mb-8">Gestión de turnos y cursos</p>

        <Boton
          variante="primario"
          className="w-full justify-center flex items-center gap-2"
          onClick={iniciarSesionConGoogle}
          disabled={cargando}
        >
          Ingresar con Google
        </Boton>

        {error && <p className="mt-4 text-sm text-rust">{error}</p>}
      </div>
    </div>
  );
}
