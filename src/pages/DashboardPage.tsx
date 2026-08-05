import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

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

export function DashboardPage() {
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
    <div className="bg-slate-50 text-slate-900">
      <header className="bg-linear-to-r from-slate-900 via-indigo-800 to-teal-900 text-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <div className="flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              className="h-10 w-10"
              aria-label="Logo del instituto"
              role="img"
            >
              <g>
                <circle cx="50" cy="50" r="18" fill="#FFD700" />
                <line x1="50" y1="10" x2="50" y2="25" stroke="#FF6B6B" strokeWidth="3" strokeLinecap="round" />
                <line x1="50" y1="75" x2="50" y2="90" stroke="#4ECDC4" strokeWidth="3" strokeLinecap="round" />
                <line x1="10" y1="50" x2="25" y2="50" stroke="#FFE66D" strokeWidth="3" strokeLinecap="round" />
                <line x1="75" y1="50" x2="90" y2="50" stroke="#FF6B6B" strokeWidth="3" strokeLinecap="round" />
                <line x1="22" y1="22" x2="32" y2="32" stroke="#4ECDC4" strokeWidth="3" strokeLinecap="round" />
                <line x1="68" y1="68" x2="78" y2="78" stroke="#FFE66D" strokeWidth="3" strokeLinecap="round" />
                <line x1="22" y1="78" x2="32" y2="68" stroke="#FF6B6B" strokeWidth="3" strokeLinecap="round" />
                <line x1="68" y1="32" x2="78" y2="22" stroke="#4ECDC4" strokeWidth="3" strokeLinecap="round" />
              </g>
              <circle cx="44" cy="46" r="3" fill="#333" />
              <circle cx="56" cy="46" r="3" fill="#333" />
              <path d="M 42 54 Q 50 62 58 54" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </svg>
            <span className="block font-display text-xl font-bold tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-pink-300 via-yellow-200 to-teal-300">
  SUNSHINE INSTITUTE
</span>
          </div>

          <div className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a href="#cursos" className="hover:text-emerald-100">
              Cursos
            </a>
            <a href="#testimonios" className="hover:text-emerald-100">
              Testimonios
            </a>
            <a href="#contacto" className="hover:text-emerald-100">
              Contacto
            </a>
          </div>

          <button className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/20">
            Inscribirme
          </button>
        </nav>

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div>
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-50">
              Aprende inglés con confianza
            </span>

            <h1 className="mt-6 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Sumate a aprender inglés a tu ritmo. Acá nos equivocamos, nos reímos y aprendemos juntos
            </h1>

            <p className="mt-6 max-w-xl text-base text-emerald-50 sm:text-lg">
              Cursos de inglés para niños, adolescentes y adultos con enfoque práctico,
              clases dinámicas. divertidas y acompañamiento personalizado.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#contacto"
                className="rounded-full bg-white px-6 py-3 text-center text-sm font-bold text-emerald-700 shadow-md transition hover:bg-emerald-50"
              >
                Quiero inscribirme
              </a>
              <a
                href="#cursos"
                className="rounded-full border border-white/40 bg-transparent px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-white/10"
              >
                Ver cursos
              </a>
            </div>

            <div className="mt-10 grid max-w-md grid-cols-3 gap-4">
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-2xl font-black">12+</p>
                <p className="mt-1 text-xs text-emerald-100">Años de experiencia</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-2xl font-black">1.2k</p>
                <p className="mt-1 text-xs text-emerald-100">Alumnos</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-2xl font-black">96%</p>
                <p className="mt-1 text-xs text-emerald-100">Satisfacción</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-8 h-24 w-24 rounded-full bg-emerald-300/30 blur-2xl" />
            <div className="absolute -right-10 bottom-6 h-28 w-28 rounded-full bg-teal-200/30 blur-2xl" />

            <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-md">
              <div className="rounded-2xl bg-white p-5 text-slate-900 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Curso actual</p>
                    <h2 className="mt-1 text-xl font-bold">English Intermediate</h2>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                    Activo
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm font-medium">
                      <span>Progreso</span>
                      <span className="text-emerald-700">78%</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full w-[78%] rounded-full bg-linear-to-r from-emerald-500 to-teal-500" />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-emerald-50 p-4">
                      <p className="text-xs uppercase tracking-wide text-emerald-600">Próxima clase</p>
                      <p className="mt-2 text-lg font-bold">Martes</p>
                      <p className="text-sm text-slate-600">18:30 hs</p>
                    </div>
                    <div className="rounded-xl bg-slate-100 p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-500">Nivel</p>
                      <p className="mt-2 text-lg font-bold">B1</p>
                      <p className="text-sm text-slate-600">Avanzado</p>
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
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
              Nuestros cursos
            </p>
            <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
              Programas pensados para cada etapa
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'Inglés para niños',
                description: 'Clases lúdicas y creativas para desarrollar confianza desde el primer nivel.',
                color: 'from-emerald-100 to-white',
              },
              {
                title: 'Inglés para adolescentes',
                description: 'Enfoque en conversación, lectura y preparación para estudios y viajes.',
                color: 'from-teal-100 to-white',
              },
              {
                title: 'Inglés para adultos',
                description: 'Cursos orientados a trabajo, entrevistas, viajes y comunicación profesional.',
                color: 'from-emerald-50 to-white',
              },
            ].map((curso) => (
              <article
                key={curso.title}
                className={`rounded-3xl border border-emerald-100 bg-linear-to-br ${curso.color} p-6 shadow-sm`}
              >
                <div className="mb-4 inline-flex rounded-full bg-white p-3 shadow-sm">
                  <span className="text-2xl">✦</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">{curso.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{curso.description}</p>
                <button className="mt-6 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
                  Más información
                </button>
              </article>
            ))}
          </div>
        </section>

        <section id="testimonios" className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-12 text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
                Testimonios
              </p>
              <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
                Lo que dicen nuestros alumnos
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {testimonios.map((item) => (
                <article
                  key={item.nombre}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 font-bold text-white">
                      {item.nombre.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{item.nombre}</h3>
                      <p className="text-sm text-slate-500">{item.rol}</p>
                    </div>
                  </div>

                  <div className="mb-4 flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span key={index}>★</span>
                    ))}
                  </div>

                  <p className="text-sm leading-6 text-slate-600">“{item.comentario}”</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contacto" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-10 rounded-3xl bg-slate-900 p-8 text-white shadow-xl lg:grid-cols-[1.1fr_1fr] lg:p-12">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">
                Contacto
              </p>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                ¿Querés comenzar tu próximo nivel?
              </h2>
              <p className="mt-4 max-w-lg text-slate-300">
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

              <div className="mt-8 space-y-4 text-sm text-slate-300">
                <p>📍 Puerto Esperanza - Calle Argentina, Villa Nueva.</p>
                <p>📍 Wanda - Frente a la Plaza Central</p>
                <p>📞 +54 3757-508363</p>
                <p>✉️ sunshineinstitute@gmail.com</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 text-slate-900 shadow-lg">
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
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
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
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
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
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    placeholder="Contanos qué te interesa..."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 w-full rounded-xl bg-emerald-600 px-4 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar consulta'}
              </button>

              {isSubmitted && (
                <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                  ¡Tu consulta fue enviada correctamente! Nos pondremos en contacto pronto.
                </p>
              )}
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;
