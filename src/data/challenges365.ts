import { ChallengeCategory, DailyChallenge365 } from '../types';

/**
 * Curated master pools for each of the 4 wellness pillars.
 * Every day of the 365-day year combines specific prompts, exercises, and reflections.
 */

interface ChallengeTemplate {
  title: string;
  description: string;
  duration: string;
  points: number;
  actionIcon: string;
  reflectionPrompt: string;
}

const AUTOCUIDADO_TEMPLATES: ChallengeTemplate[] = [
  {
    title: 'Regla 20-20-20 para descanso visual',
    description: 'Cada 20 minutos de pantalla, mira un punto a 20 pies (6 metros) de distancia durante 20 segundos para relajar tus músculos oculares.',
    duration: '2 min',
    points: 45,
    actionIcon: 'visibility',
    reflectionPrompt: '¿Cómo sintieron tus ojos este respiro de la luz azul?',
  },
  {
    title: 'Pausa de hidratación consciente',
    description: 'Bebe un vaso completo de agua tibia o fresca despacio, sintiendo la temperatura y permitiendo que tu cuerpo se renueve.',
    duration: '3 min',
    points: 40,
    actionIcon: 'water_drop',
    reflectionPrompt: '¿Cuántos vasos de agua has tomado hoy para cuidar tu energía?',
  },
  {
    title: 'Estiramiento suave de cuello y hombros',
    description: 'Inclina la cabeza lentamente hacia el hombro derecho por 10 segundos, repite hacia la izquierda y gira suavemente los hombros hacia atrás.',
    duration: '4 min',
    points: 50,
    actionIcon: 'fitness_center',
    reflectionPrompt: '¿Qué parte de tu espalda alta sentía mayor tensión?',
  },
  {
    title: 'Micro-caminata de desconexión sin pantalla',
    description: 'Levántate de tu silla y camina unos pasos por tu oficina o casa sin llevar el teléfono móvil, sintiendo el contacto de tus pies con el suelo.',
    duration: '5 min',
    points: 55,
    actionIcon: 'directions_walk',
    reflectionPrompt: '¿Notaste algún sonido o detalle en tu entorno durante la caminata?',
  },
  {
    title: 'Respiración diafragmática 4-4-6',
    description: 'Coloca una mano en tu abdomen. Inhala en 4 tiempos inflando suavemente el vientre, sostén 4 y exhala vaciando en 6 tiempos.',
    duration: '3 min',
    points: 50,
    actionIcon: 'air',
    reflectionPrompt: '¿Qué cambio sentiste en tu ritmo cardíaco al exhalar en 6?',
  },
  {
    title: 'Reajuste ergonómico del puesto de trabajo',
    description: 'Alinea la parte superior de tu monitor con el nivel de tus ojos, apoya los pies planos y acerca la silla para cuidar tu postura lumbar.',
    duration: '5 min',
    points: 60,
    actionIcon: 'chair',
    reflectionPrompt: '¿Tu espalda se siente más apoyada y relajada ahora?',
  },
  {
    title: 'Masaje de palmas y dedos anti-fatiga',
    description: 'Entrelaza los dedos, presiona suavemente el músculo entre el pulgar y el índice, y estira las muñecas para prevenir el túnel carpiano.',
    duration: '3 min',
    points: 45,
    actionIcon: 'pan_tool',
    reflectionPrompt: '¿Sentiste alivio en tus manos después de horas en el teclado?',
  },
  {
    title: 'Baño de luz natural y aire fresco',
    description: 'Acércate a una ventana abierta o sal al aire libre un par de minutos. Respira hondo y permite que la luz solar active tu ritmo circadiano.',
    duration: '5 min',
    points: 50,
    actionIcon: 'wb_sunny',
    reflectionPrompt: '¿Cómo impactó la luz natural en tu nivel de alerta?',
  },
];

const MOTIVACION_TEMPLATES: ChallengeTemplate[] = [
  {
    title: 'Define tu "Única Gran Victoria" del día',
    description: 'Elige una sola tarea prioritaria que, al terminarla hoy, te haga sentir satisfecha y en control. Enfréntala en tu siguiente bloque.',
    duration: '3 min',
    points: 55,
    actionIcon: 'emoji_events',
    reflectionPrompt: '¿Cuál es esa tarea clave que te brindará mayor tranquilidad?',
  },
  {
    title: 'Honra una meta pequeña superada',
    description: 'Haz memoria de una dificultad que resolviste esta semana y felicítate por tu capacidad de respuesta y creatividad.',
    duration: '3 min',
    points: 50,
    actionIcon: 'workspace_premium',
    reflectionPrompt: '¿Qué habilidad tuya te permitió resolver ese obstáculo?',
  },
  {
    title: 'Técnica Pomodoro de foco compasivo',
    description: 'Trabaja 25 minutos continuos sin abrir redes ni notificaciones, sabiendo que al sonar la campana tendrás un premio de descanso absoluto.',
    duration: '25 min',
    points: 75,
    actionIcon: 'timer',
    reflectionPrompt: '¿Qué tan profundo fue tu nivel de concentración al apagar las alertas?',
  },
  {
    title: 'Adopta una mentalidad de curiosidad',
    description: 'Frente a una tarea desafiante o aburrida, pregúntate: "¿Qué puedo aprender o descubrir de nuevo en este proceso hoy?"',
    duration: '4 min',
    points: 60,
    actionIcon: 'lightbulb',
    reflectionPrompt: '¿Qué perspectiva distinta encontraste al abordar el reto con curiosidad?',
  },
  {
    title: 'Organiza un micro-espacio inspirador',
    description: 'Despeja tazas vacías, papeles innecesarios o cables sueltos de tu escritorio. Un entorno limpio despeja la mente para crear.',
    duration: '5 min',
    points: 50,
    actionIcon: 'cleaning_services',
    reflectionPrompt: '¿Cómo cambió tu sensación de calma al ver tu espacio ordenado?',
  },
  {
    title: 'Conecta con el propósito de tu labor',
    description: 'Recuerda a una persona, cliente o compañera que se beneficia directamente de tu trabajo bien hecho y con cariño.',
    duration: '4 min',
    points: 65,
    actionIcon: 'psychology',
    reflectionPrompt: '¿De qué manera tu esfuerzo aporta valor real al equipo?',
  },
  {
    title: 'Permítete ser aprendiz en algo nuevo',
    description: 'Identifica una duda técnica o conceptual que tengas y atrévete a investigar o pedir una explicación sin sentir vergüenza.',
    duration: '6 min',
    points: 55,
    actionIcon: 'school',
    reflectionPrompt: '¿Qué nuevo conocimiento sumaste hoy a tu caja de herramientas?',
  },
];

const PENSAMIENTO_POSITIVO_TEMPLATES: ChallengeTemplate[] = [
  {
    title: 'Trilogía de Gratitud en el Trabajo',
    description: 'Escribe mentalmente o en una nota 3 cosas concretas de tu jornada laboral por las que te sientes agradecida hoy.',
    duration: '3 min',
    points: 50,
    actionIcon: 'favorite',
    reflectionPrompt: '¿Cuáles fueron tus 3 motivos de gratitud de hoy?',
  },
  {
    title: 'Reencuadre de un pensamiento autocrítico',
    description: 'Detecta una frase dura que te dijiste hoy ("no soy suficientemente rápida", "me equivoqué") y cámbiala por una afirmación realista y compasiva.',
    duration: '4 min',
    points: 60,
    actionIcon: 'self_improvement',
    reflectionPrompt: '¿Cómo suena tu nueva frase constructiva y amable?',
  },
  {
    title: 'Enfócate en lo que sí está bajo tu control',
    description: 'Separa mentalmente las circunstancias externas inmutables de las acciones directas que tú sí puedes ejecutar hoy con serenidad.',
    duration: '5 min',
    points: 65,
    actionIcon: 'balance',
    reflectionPrompt: '¿Qué preocupación ajena a tu control decidiste soltar hoy?',
  },
  {
    title: 'Sembrar optimismo en la próxima reunión',
    description: 'Inicia tu próxima llamada o intercambio con un saludo afectuoso y una actitud constructiva ante el objetivo común.',
    duration: '3 min',
    points: 55,
    actionIcon: 'sentiment_satisfied',
    reflectionPrompt: '¿Cómo reaccionaron tus interlocutores a tu tono cálido?',
  },
  {
    title: 'Afirmación de suficiencia y presencia',
    description: 'Repite para ti misma en silencio: "Hago lo mejor que puedo con las herramientas que tengo, y eso es suficiente por hoy".',
    duration: '2 min',
    points: 40,
    actionIcon: 'spa',
    reflectionPrompt: '¿Qué sensación física te produjo aceptar tu propio ritmo?',
  },
  {
    title: 'Celebra un error como oportunidad de maestría',
    description: 'Identifica un fallo reciente y escribe la valiosa lección que te dejó para futuros proyectos.',
    duration: '5 min',
    points: 60,
    actionIcon: 'auto_awesome',
    reflectionPrompt: '¿Qué fortaleza descubriste gracias a esa experiencia?',
  },
];

const RECONOCIMIENTO_TEMPLATES: ChallengeTemplate[] = [
  {
    title: 'Envía un mensaje de gratitud a una compañera',
    description: 'Escribe un mensaje breve por chat o correo a una colega destacando un gesto amable o un trabajo bien hecho esta semana.',
    duration: '3 min',
    points: 70,
    actionIcon: 'diversity_1',
    reflectionPrompt: '¿A quién le escribiste y qué cualidad suya destacaste?',
  },
  {
    title: 'Escucha activa sin interrumpir en una conversación',
    description: 'En tu próxima charla laboral, escucha el mensaje completo de la otra persona prestando 100% de atención antes de responder.',
    duration: '5 min',
    points: 65,
    actionIcon: 'hearing',
    reflectionPrompt: '¿Qué comprendiste mejor al escuchar con pausa y empatía?',
  },
  {
    title: 'Reconocimiento público o elogio espontáneo',
    description: 'En una reunión de equipo o canal general, menciona con nombre propio el aporte valioso de alguien que suele trabajar tras bambalinas.',
    duration: '4 min',
    points: 75,
    actionIcon: 'campaign',
    reflectionPrompt: '¿Cómo se sintió esa persona al ser visibilizada?',
  },
  {
    title: 'Ofrece una micro-ayuda desinteresada',
    description: 'Pregúntale a una compañera con alta carga: "¿Hay alguna tarea sencilla en la que pueda apoyarte hoy 10 minutos?"',
    duration: '5 min',
    points: 70,
    actionIcon: 'handshake',
    reflectionPrompt: '¿De qué forma colaboraste para aliviar la carga del equipo?',
  },
  {
    title: 'Celebra la diversidad de opiniones en tu equipo',
    description: 'Valora una perspectiva diferente a la tuya en una discusión técnica, reconociendo que la pluralidad enriquece las soluciones.',
    duration: '4 min',
    points: 60,
    actionIcon: 'groups',
    reflectionPrompt: '¿Qué aprendiste de un punto de vista opuesto al tuyo?',
  },
  {
    title: 'Envía un emoji de apoyo o felicitación sincera',
    description: 'Reacciona en el chat grupal con palabras de aliento o un mensaje personalizado a quien haya culminado una entrega difícil.',
    duration: '2 min',
    points: 50,
    actionIcon: 'celebration',
    reflectionPrompt: '¿A quién acompañaste hoy con tu optimismo?',
  },
];

const CATEGORIES: ChallengeCategory[] = [
  'Autocuidado',
  'Motivación Personal',
  'Pensamiento Positivo',
  'Reconocimiento entre Compañeras',
];

const CATEGORY_STYLES: Record<ChallengeCategory, { bg: string; text: string }> = {
  Autocuidado: {
    bg: 'bg-emerald-100/80',
    text: 'text-emerald-900',
  },
  'Motivación Personal': {
    bg: 'bg-amber-100/80',
    text: 'text-amber-900',
  },
  'Pensamiento Positivo': {
    bg: 'bg-purple-100/80',
    text: 'text-purple-900',
  },
  'Reconocimiento entre Compañeras': {
    bg: 'bg-sky-100/80',
    text: 'text-sky-900',
  },
};

/**
 * Builds deterministic yet varied 365 daily challenges covering every day of the calendar year.
 */
function generate365DailyChallenges(): DailyChallenge365[] {
  const challenges: DailyChallenge365[] = [];

  for (let day = 1; day <= 365; day++) {
    const categoryIndex = (day - 1) % CATEGORIES.length;
    const category = CATEGORIES[categoryIndex];

    let template: ChallengeTemplate;
    if (category === 'Autocuidado') {
      const idx = (Math.floor((day - 1) / 4) + (day % 3)) % AUTOCUIDADO_TEMPLATES.length;
      template = AUTOCUIDADO_TEMPLATES[idx];
    } else if (category === 'Motivación Personal') {
      const idx = (Math.floor((day - 1) / 4) + (day % 2)) % MOTIVACION_TEMPLATES.length;
      template = MOTIVACION_TEMPLATES[idx];
    } else if (category === 'Pensamiento Positivo') {
      const idx = (Math.floor((day - 1) / 4) + (day % 3)) % PENSAMIENTO_POSITIVO_TEMPLATES.length;
      template = PENSAMIENTO_POSITIVO_TEMPLATES[idx];
    } else {
      const idx = (Math.floor((day - 1) / 4) + (day % 2)) % RECONOCIMIENTO_TEMPLATES.length;
      template = RECONOCIMIENTO_TEMPLATES[idx];
    }

    const styles = CATEGORY_STYLES[category];

    challenges.push({
      dayOfYear: day,
      title: `${template.title}`,
      description: template.description,
      category,
      duration: template.duration,
      points: template.points,
      actionIcon: template.actionIcon,
      categoryBg: styles.bg,
      categoryText: styles.text,
      reflectionPrompt: template.reflectionPrompt,
      completed: false,
    });
  }

  return challenges;
}

export const ALL_365_CHALLENGES: DailyChallenge365[] = generate365DailyChallenges();

/**
 * Calculate the day of the year (1 - 365)
 */
export function getDayOfYear(date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);
  return Math.max(1, Math.min(day, 365));
}

/**
 * Retrieves the challenge for today's calendar date
 */
export function getTodayChallenge(date = new Date()): DailyChallenge365 {
  const dayNum = getDayOfYear(date);
  return getChallengeForDay(dayNum);
}

/**
 * Retrieves the challenge by specific day number (1 - 365)
 */
export function getChallengeForDay(dayNumber: number): DailyChallenge365 {
  const normalized = Math.max(1, Math.min(dayNumber, 365));
  const base = ALL_365_CHALLENGES[normalized - 1];

  // Check if user completed it in localStorage
  const completedMap = getCompletedDaysMap();
  const isCompleted = Boolean(completedMap[normalized]);

  return {
    ...base,
    completed: isCompleted,
    completedAt: isCompleted ? completedMap[normalized] : undefined,
  };
}

const STORAGE_KEY_COMPLETED_DAYS = 'conecta_completed_days_map';

/**
 * Get map of all completed days: { [dayNumber]: timestamp }
 */
export function getCompletedDaysMap(): Record<number, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMPLETED_DAYS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Mark a day as completed or uncompleted
 */
export function setDayChallengeCompleted(dayNumber: number, completed: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    const map = getCompletedDaysMap();
    if (completed) {
      map[dayNumber] = new Date().toISOString();
    } else {
      delete map[dayNumber];
    }
    localStorage.setItem(STORAGE_KEY_COMPLETED_DAYS, JSON.stringify(map));
  } catch (err) {
    console.error('Failed to update completed challenge:', err);
  }
}

/**
 * Total count of completed daily challenges
 */
export function getCompletedDaysCount(): number {
  const map = getCompletedDaysMap();
  return Object.keys(map).length;
}
