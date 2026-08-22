import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { PROGRAMAS } from '@/data/programasCurso';

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
    comentario: 'La atención es excelente y los profesores hacen que cada clase se sienta práctica y motivante. Mejoré mucho mi fluidez en pocos meses.',
  },
  {
    nombre: 'Irwin Morinigo',
    rol: 'Alumno de Business English',
    comentario: 'Me encantó la estructura del curso. Todo está pensado para avanzar rápido y aplicar el inglés en el trabajo real.',
  },
  {
    nombre: 'Lucía Fernández',
    rol: 'Padre de alumno',
    comentario: 'Muy buena experiencia en general. El equipo es muy profesional y el ambiente es cálido, dinámico y ordenado.',
  },
];

export function PublicHomePage() {
  const [formData, setFormData] = useState<FormState>({ nombre: '', email: '', mensaje: '' });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ nombre: '', email: '', mensaje: '' });
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
              Cursos de inglés para niños, adolescentes y adultos con enfoque práctico, clases dinámicas, divertidas y acompañamiento personalizado.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button className="rounded-full bg-paper px-6 py-3 text-center text-sm font-bold text-ink shadow-md transition hover:bg-paper-dim">
                Inscribirme
              </button>
              <a href="#cursos" className="rounded-full border border-white/30 bg-transparent px-6 py-3 text-center text-sm font-bold text-paper transition hover:bg-white/10">
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
                  <span className="rounded-full bg-sage/15 px-3 py-1 text-xs font-bold text-sage-dark">Activo</span>
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
        {/* SECCIÓN CURSOS */}
        <section id="cursos" className="mx-auto max-w-7xl px-6 py-20 lg:px-8 scroll-mt-28">
          <div className="mb-12 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sage-dark">Nuestros cursos</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">Programas pensados para cada etapa</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {PROGRAMAS.map((programa) => (
              <article key={programa.id} className="flex flex-col justify-between rounded-2xl border border-mist bg-white p-6 shadow-xs transition hover:shadow-md">
                <div>
                  <div className="mb-4 inline-flex rounded-full bg-paper-dim p-3">
                    <span className="text-xl text-sage-dark">✦</span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-ink">{programa.titulo}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-light">Clases dinámicas orientadas a objetivos.</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* SECCIÓN TESTIMONIOS */}
        <section id="testimonios" className="bg-paper-dim py-20 scroll-mt-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-12 text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-sage-dark">Comunidad</p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">Qué dicen de nuestra experiencia</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {testimonios.map((testi, i) => (
                <div key={i} className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-xs border border-mist/50">
                  <p className="text-sm italic leading-relaxed text-ink-light">"{testi.comentario}"</p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage/20 text-sm font-bold text-sage-dark uppercase">
                      {testi.nombre.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-ink">{testi.nombre}</h4>
                      <p className="text-xs text-ink-light">{testi.rol}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECCIÓN CONTACTO */}
        <section id="contacto" className="mx-auto max-w-3xl px-6 py-20 lg:px-8 scroll-mt-28">
          <div className="mb-12 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sage-dark">Contacto</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">¿Tenés alguna duda? Escribinos</h2>
          </div>
          {isSubmitted ? (
            <div className="rounded-2xl bg-sage/10 p-6 text-center border border-sage/20">
              <h3 className="font-display text-xl font-bold text-sage-dark">¡Mensaje enviado con éxito!</h3>
              <p className="mt-2 text-sm text-ink-light">Te vamos a responder al correo electrónico provisto a la brevedad.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-mist bg-white p-6 shadow-xs sm:p-8">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-ink-light">Nombre completo</label>
                <input type="text" name="nombre" id="nombre" required value={formData.nombre} onChange={handleChange} className="mt-1.5 w-full rounded-xl border border-mist bg-paper px-4 py-2.5 text-sm focus:border-sage focus:outline-hidden" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-ink-light">Correo electrónico</label>
                <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="mt-1.5 w-full rounded-xl border border-mist bg-paper px-4 py-2.5 text-sm focus:border-sage focus:outline-hidden" />
              </div>
              <div>
                <label htmlFor="mensaje" className="block text-sm font-medium text-ink-light">Tu consulta</label>
                <textarea name="mensaje" id="mensaje" rows={4} required value={formData.mensaje} onChange={handleChange} className="mt-1.5 w-full rounded-xl border border-mist bg-paper px-4 py-2.5 text-sm focus:border-sage focus:outline-hidden resize-none" />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-slate-800 py-3 text-sm font-bold text-white shadow-md transition hover:bg-slate-700 disabled:opacity-60">
                {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
