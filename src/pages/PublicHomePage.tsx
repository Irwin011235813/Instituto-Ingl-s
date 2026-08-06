import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PROGRAMAS, type ProgramaCurso } from '@/data/programasCurso';
import { ModalPrograma } from '@/components/shared/ModalPrograma';

interface Testimonio {
  nombre: string;
  rol: string;
  comentario: string;
}

interface FormState {
  nombre: string;
  email: string;
  mensaje: string;
}

const testimonios: Testimonio[] = [
  {
    nombre: 'María López',
    rol: 'Estudiante de Conversación',
    comentario:
      'La atención es excelente y los profesores hacen que cada clase se sienta práctica y motivante. Mejoré mucho mi fluidez en pocos meses.',
  },
  {
    nombre: 'Irwin Morinigo',
    rol: 'Alumno de Business English',
    comentario:
      'Me encantó la estructura del curso. Todo está pensado para avanzar rápido y aplicar el inglés en el trabajo real.',
  },
  {
    nombre: 'Lucía Fernández',
    rol: 'Padre de alumno',
    comentario:
      'Muy buena experiencia en general. El equipo es muy profesional y el ambiente es cálido, dinámico y ordenado.',
  },
];

/**
 * Landing pública. Usa los mismos tokens de diseño que el panel interno
 * (ink/paper/mustard/sage/mist, tipografía Fraunces para títulos) para que
 * no se sienta como un sitio distinto al pasar de acá al panel logueado.
 * El acento principal acá es "sage" (verde institucional); el panel usa
 * "mustard" como su acento — misma familia de tokens, distinto énfasis.
 */
export function PublicHomePage() {
  const { iniciarSesionConGoogle } = useAuth();
  const [programaSeleccionado, setProgramaSeleccionado] = useState<ProgramaCurso | null>(null);
  const [formData, setFormData] = useState<FormState>({
    nombre: '',
    email: '',
    mensaje: '',
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 900));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({
      nombre: '',
      email: '',
      mensaje: '',
    });
  };

  return (
    <div className="bg-paper text-ink">
      <header className="bg-linear-to-r from-ink to-ink-light text-paper">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div>
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-paper/80">
              Aprende inglés con confianza
            </span>

            <h1 className="mt-6 font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Sumate a aprender inglés a tu ritmo. Acá nos equivocamos, nos reímos y aprendemos juntos
            </h1>

            <p className="mt-6 max-w-xl text-base text-paper/80 sm:text-lg">
              Cursos de inglés para niños, adolescentes y adultos con enfoque práctico,
              clases dinámicas, divertidas y acompañamiento personalizado.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={iniciarSesionConGoogle}
                className="rounded-full bg-paper px-6 py-3 text-center text-sm font-bold text-ink shadow-md transition hover:bg-paper-dim"
              >
                Quiero inscribirme
              </button>
              <a
                href="#cursos"
                className="rounded-full border border-white/30 bg-transparent px-6 py-3 text-center text-sm font-bold text-paper transition hover:bg-white/10"
              >
                Ver cursos
              </a>
            </div>

            <div className="mt-10 grid max-w-md grid-cols-3 gap-4">
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-2xl font-display font-semibold">12+</p>
                <p className="mt-1 text-xs text-paper/70">Años de experiencia</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-2xl font-display font-semibold">1.2k</p>
                <p className="mt-1 text-xs text-paper/70">Alumnos</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-2xl font-display font-semibold">96%</p>
                <p className="mt-1 text-xs text-paper/70">Satisfacción</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-8 h-24 w-24 rounded-full bg-sage/30 blur-2xl" />
            <div className="absolute -right-10 bottom-6 h-28 w-28 rounded-full bg-mustard/20 blur-2xl" />

            <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-md">
              <div className="rounded-2xl bg-white p-5 text-ink shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-ink-light">Curso actual</p>
                    <h2 className="mt-1 font-display text-xl font-semibold">English Intermediate</h2>
                  </div>
                  <span className="rounded-full bg-sage/15 px-3 py-1 text-xs font-bold text-sage-dark">
                    Activo
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm font-medium">
                      <span>Progreso</span>
                      <span className="text-sage-dark">78%</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-mist">
                      <div className="h-full w-[78%] rounded-full bg-sage" />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-sage/10 p-4">
                      <p className="text-xs uppercase tracking-wide text-sage-dark">Próxima clase</p>
                      <p className="mt-2 text-lg font-display font-semibold">Martes</p>
                      <p className="text-sm text-ink-light">18:30 hs</p>
                    </div>
                    <div className="rounded-xl bg-paper-dim p-4">
                      <p className="text-xs uppercase tracking-wide text-ink-light">Nivel (MCER)</p>
                      <p className="mt-2 text-lg font-display font-semibold">B1</p>
                      <p className="text-sm text-ink-light">Intermedio</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section id="cursos" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sage-dark">
              Nuestros cursos
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
              Programas pensados para cada etapa
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {PROGRAMAS.map((programa) => (
              <article
                key={programa.id}
                className="rounded-2xl border border-mist bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="mb-4 inline-flex rounded-full bg-paper-dim p-3">
                  <span className="text-2xl text-sage-dark">✦</span>
                </div>
                <h3 className="font-display text-xl font-semibold text-ink">{programa.titulo}</h3>
                <p className="mt-1 text-xs font-mono text-ink-light">{programa.edad}</p>
                <p className="mt-3 text-sm leading-6 text-ink-light">
                  {programa.objetivos[0]}.
                </p>
                <button
                  onClick={() => setProgramaSeleccionado(programa)}
                  className="mt-6 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper transition hover:bg-ink-light"
                >
                  Más información
                </button>
              </article>
            ))}
          </div>
        </section>

        <section id="testimonios" className="bg-paper-dim/60 py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-12 text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-sage-dark">
                Testimonios
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
                Lo que dicen nuestros alumnos
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {testimonios.map((item) => (
                <article
                  key={item.nombre}
                  className="rounded-2xl border border-mist bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink font-display font-semibold text-paper">
                      {item.nombre.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-ink">{item.nombre}</h3>
                      <p className="text-sm text-ink-light">{item.rol}</p>
                    </div>
                  </div>

                  <div className="mb-4 flex text-mustard">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span key={index}>★</span>
                    ))}
                  </div>

                  <p className="text-sm leading-6 text-ink-light">“{item.comentario}”</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contacto" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-10 rounded-3xl bg-ink p-8 text-paper shadow-xl lg:grid-cols-[1.1fr_1fr] lg:p-12">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-sage">
                Contacto
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
                ¿Querés comenzar tu próximo nivel?
              </h2>
              <p className="mt-4 max-w-lg text-paper/70">
                Dejanos tu consulta y te responderemos con información sobre horarios,
                niveles y promociones disponibles.
              </p>

              <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
                <iframe
                  title="Mapa de Sunshine Instituto"
                  src="https://maps.google.com/maps?q=-26.023548,-54.608206&z=17&output=embed"
                  className="h-64 w-full border-0"
                  allowFullScreen
                  loading="lazy"
                />
              </div>

              <div className="mt-8 space-y-4 text-sm text-paper/70">
                <p>📍 Puerto Esperanza - Calle Argentina, Villa Nueva.</p>
                <p>📍 Wanda - Frente a la Plaza Central</p>
                <p>📞 +54 3757-508363</p>
                <p>✉️ sunshineinstitute@gmail.com</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 text-ink shadow-lg">
              <div className="space-y-4">
                <div>
                  <label htmlFor="nombre" className="mb-1 block text-sm font-semibold">
                    Nombre
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-mist bg-paper-dim px-4 py-3 outline-none transition focus:border-sage focus:ring-2 focus:ring-sage/20"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-semibold">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-mist bg-paper-dim px-4 py-3 outline-none transition focus:border-sage focus:ring-2 focus:ring-sage/20"
                    placeholder="tuemail@ejemplo.com"
                  />
                </div>

                <div>
                  <label htmlFor="mensaje" className="mb-1 block text-sm font-semibold">
                    Mensaje
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full rounded-xl border border-mist bg-paper-dim px-4 py-3 outline-none transition focus:border-sage focus:ring-2 focus:ring-sage/20"
                    placeholder="Contanos qué te interesa..."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 w-full rounded-xl bg-sage px-4 py-3 font-bold text-white transition hover:bg-sage-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar consulta'}
              </button>

              {isSubmitted && (
                <p className="mt-4 rounded-xl bg-sage/10 px-3 py-2 text-sm font-medium text-sage-dark">
                  ¡Tu consulta fue enviada correctamente! Nos pondremos en contacto pronto.
                </p>
              )}
            </form>
          </div>
        </section>
      </main>

      {programaSeleccionado && (
        <ModalPrograma
          programa={programaSeleccionado}
          onCerrar={() => setProgramaSeleccionado(null)}
          onQuieroInscribirme={() => {
            setProgramaSeleccionado(null);
            iniciarSesionConGoogle();
          }}
        />
      )}
    </div>
  );
}

export default PublicHomePage;
