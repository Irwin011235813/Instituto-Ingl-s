import type { Nivel } from '@/types/common';

export interface ProgramaCurso {
  id: 'ninos' | 'adolescentes' | 'adultos';
  titulo: string;
  edad: string;
  nivelesCEFR: Nivel[];
  duracion: string;
  modalidad: string;
  metodologia: string;
  objetivos: string[];
  temario: string[];
}

/**
 * Contenido curricular de cada programa. Los niveles usan la nomenclatura
 * CEFR/MCER real (A1–C2), no etiquetas inventadas — ver bug corregido
 * anteriormente donde B1 aparecía etiquetado como "Avanzado" (en realidad
 * es Intermedio; C1/C2 son los niveles avanzados).
 */
export const PROGRAMAS: ProgramaCurso[] = [
  {
    id: 'ninos',
    titulo: 'Inglés para niños',
    edad: '6 a 12 años',
    nivelesCEFR: ['A1', 'A2'],
    duracion: 'Ciclos bimestrales · 2 clases semanales de 60 minutos',
    modalidad: 'Presencial, grupos reducidos de hasta 8 alumnos por franja de edad',
    metodologia:
      'Enfoque comunicativo con Total Physical Response (TPR): se aprende el idioma haciendo, no memorizando reglas. Canciones, cuentos, juegos de mesa y manualidades sostienen la atención y bajan la ansiedad de hablar en un idioma nuevo.',
    objetivos: [
      'Reconocer y usar vocabulario cotidiano (familia, colores, animales, rutinas)',
      'Comprender consignas simples e instrucciones en inglés',
      'Producir frases cortas con confianza, sin miedo a equivocarse',
      'Familiarizarse con la fonética inglesa desde el oído, antes que con la gramática',
    ],
    temario: [
      'Saludos, presentaciones y la familia',
      'Colores, números y el abecedario',
      'Animales, comida y rutinas diarias',
      'Canciones y storytelling para reforzar estructuras',
    ],
  },
  {
    id: 'adolescentes',
    titulo: 'Inglés para adolescentes',
    edad: '13 a 17 años',
    nivelesCEFR: ['A2', 'B1', 'B2'],
    duracion: 'Ciclos cuatrimestrales · 2 clases semanales de 90 minutos',
    modalidad: 'Presencial, grupos por nivel (evaluación diagnóstica al ingresar)',
    metodologia:
      'Enfoque comunicativo orientado a proyectos: debates, trabajo con series/música y simulacros de conversación real. Se trabaja gramática aplicada al contexto, no aislada en ejercicios sueltos.',
    objetivos: [
      'Sostener una conversación fluida sobre temas cotidianos y de interés personal',
      'Comprender textos y audios de dificultad media (noticias, letras de canciones, videos)',
      'Producir textos escritos con coherencia: mails, opiniones, narraciones breves',
      'Prepararse opcionalmente para certificaciones internacionales (Cambridge, PET/FCE)',
    ],
    temario: [
      'Tiempos verbales en contexto (pasado, presente perfecto, condicionales)',
      'Debates y expresión de opinión',
      'Comprensión de medios: música, series y noticias',
      'Escritura de mails formales e informales',
    ],
  },
  {
    id: 'adultos',
    titulo: 'Inglés para adultos',
    edad: '18 años en adelante',
    nivelesCEFR: ['A1', 'A2', 'B1', 'B2', 'C1'],
    duracion: 'Ciclos modulares flexibles · 1 o 2 clases semanales de 90 minutos, turnos mañana/tarde/noche',
    modalidad: 'Presencial, grupos por nivel; también disponible orientación 1 a 1 para objetivos puntuales',
    metodologia:
      'Enfoque comunicativo orientado a objetivos concretos: viajes, entrevistas laborales, trabajo diario con inglés técnico o de negocios. Se parte de una evaluación de nivel inicial para ubicar a cada alumno correctamente.',
    objetivos: [
      'Comunicarse con fluidez en situaciones cotidianas, laborales o de viaje',
      'Redactar correos, informes y presentaciones profesionales en inglés',
      'Participar de reuniones y negociaciones con vocabulario específico del rubro',
      'Prepararse para entrevistas laborales o certificaciones (IELTS/TOEFL, según objetivo)',
    ],
    temario: [
      'Business English: reuniones, mails y presentaciones',
      'Conversación situacional: viajes, trámites, entrevistas',
      'Gramática funcional según nivel de partida',
      'Práctica de listening con acentos variados (UK/US)',
    ],
  },
];
