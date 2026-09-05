/**
 * Registro de vídeos únicos por ejercicio.
 *
 * Cada clip está generado con IA (maniquí anatómico, nunca personas reales) y
 * muestra EXACTAMENTE el material del título del ejercicio: si el ejercicio es
 * con mancuernas, el vídeo es con mancuernas; si es en máquina, en máquina.
 *
 * Los ficheros viven en `src/assets/ex-<slug>.mp4.asset.json` y se cargan
 * automáticamente, así que para añadir un vídeo nuevo basta con generarlo con
 * ese nombre y añadir la entrada nombre -> slug en EXERCISE_VIDEO_SLUG.
 */

const modules = import.meta.glob<{ default: { url: string } }>(
  "../assets/ex-*.mp4.asset.json",
  { eager: true },
);

const VIDEO_URL_BY_SLUG: Record<string, string> = {};
for (const [path, mod] of Object.entries(modules)) {
  const slug = path.split("/").pop()!.replace(/^ex-/, "").replace(/\.mp4\.asset\.json$/, "");
  VIDEO_URL_BY_SLUG[slug] = mod.default.url;
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Nombre exacto del catálogo -> slug del clip. */
const EXERCISE_VIDEO_SLUG: Record<string, string> = {
  // ---------------- Pecho ----------------
  "Press de banca": "press-banca",
  "Press inclinado con barra": "press-inclinado-barra",
  "Fondos en paralelas (pecho)": "fondos-paralelas",
  "Press con mancuernas plano": "press-mancuernas-plano",
  "Press inclinado mancuernas": "press-inclinado-mancuernas",
  "Press declinado mancuernas": "press-declinado-mancuernas",
  "Press declinado con barra": "press-declinado-barra",
  "Press de banca agarre cerrado": "press-banca-cerrado",
  "Press en máquina": "press-maquina-pecho",
  "Press Smith plano": "press-smith-plano",
  "Press Smith inclinado": "press-smith-inclinado",
  "Aperturas con mancuernas": "aperturas-mancuernas",
  "Aperturas inclinadas con mancuernas": "aperturas-inclinadas",
  "Aperturas declinadas": "aperturas-declinadas",
  "Aperturas en máquina (peck deck)": "peck-deck",
  "Cruce de poleas alto": "cruce-poleas-alto",
  "Cruce de poleas medio": "cruce-poleas-medio",
  "Cruce de poleas bajo": "cruce-poleas-bajo",
  "Fondos asistidos en máquina": "fondos-asistidos",
  "Push up declinado": "push-up-declinado",
  "Push up inclinado": "push-up-inclinado",
  "Push up diamante": "push-up-diamante",
  "Diamond push up": "push-up-diamante",
  "Push up con palmada": "push-up-palmada",
  "Pullover con mancuerna": "pullover-mancuerna",
  "Pullover en polea": "pullover-polea",
  "Pullover en polea (straight arm)": "pullover-polea",
  "Press en suelo (floor press)": "floor-press",
  "Svend press": "svend-press",

  // ---------------- Espalda ----------------
  "Peso muerto convencional": "peso-muerto-convencional",
  "Peso muerto sumo": "peso-muerto-sumo",
  "Peso muerto con trap bar": "peso-muerto-trap-bar",
  "Remo con barra": "remo-barra",
  "Remo Pendlay": "remo-pendlay",
  "Remo Yates (agarre supino)": "remo-yates",
  "Remo con mancuerna a una mano": "remo-mancuerna-una-mano",
  "Remo en máquina": "remo-maquina",
  "Remo en T": "remo-en-t",
  "Remo con barra apoyado en banco": "remo-apoyado-banco",
  "Remo invertido": "remo-invertido",
  "Remo en polea baja": "remo-polea-baja",
  "Dominadas pronas": "dominadas-pronas",
  "Dominadas neutras": "dominadas",
  "Dominadas supinas (chin up)": "dominadas-supinas",
  "Jalón al pecho agarre ancho": "jalon-pecho-ancho",
  "Encogimientos con barra": "encogimientos-barra",
  "Encogimientos con mancuernas": "encogimientos-mancuernas",
  "Face pull": "face-pull",
  "Hiperextensiones": "hiperextensiones",

  // ---------------- Hombro ----------------
  "Press militar sentado": "press-militar",
  "Press militar con barra de pie": "press-militar-barra",
  "Press con mancuernas sentado": "press-mancuernas-sentado",
  "Elevaciones laterales con mancuernas": "elevaciones-laterales-mancuernas",
  "Elevaciones frontales con mancuernas": "elevaciones-frontales-mancuernas",
  "Pájaros con mancuernas": "pajaros-mancuernas",

  // ---------------- Bíceps ----------------
  "Curl con barra recta": "curl-barra-recta",
  "Curl con mancuernas": "curl-mancuernas",
  "Curl alterno con mancuernas": "curl-alterno-mancuernas",

  // ---------------- Tríceps ----------------
  "Extensiones en polea con cuerda": "extension-triceps-cuerda",

  // ---------------- Cuádriceps ----------------
  "Sentadilla con barra": "sentadilla-barra",
  "Curl martillo": "curl-martillo",
  "Press francés con barra": "press-frances-barra",
  "Prensa de piernas": "prensa-piernas",
  "Extensiones de cuádriceps": "extensiones-cuadriceps",
  "Curl femoral tumbado": "curl-femoral-tumbado",
  "Peso muerto rumano": "peso-muerto-rumano",
  "Hip thrust con barra": "hip-thrust-barra",
  "Elevación de talones de pie en máquina": "talones-pie-maquina",
  "Plancha frontal": "plancha",
  "Crunch": "crunch-abdominal",
  "Elevación de piernas colgado": "elevacion-piernas-colgado",
  "Curl de muñeca con barra": "curl-muneca-barra",
  "Push up (flexiones)": "push-up",
  "Jalón al pecho agarre cerrado": "jalon-cerrado",
  "Curl con barra Z": "curl-barra-z",
  "Curl predicador con barra": "curl-predicador-barra",
  "Press francés con mancuernas": "press-frances-mancuernas",
  "Extensiones en polea con barra": "extension-polea-barra",
  "Fondos en banco": "fondos-banco",
  "Press Arnold": "press-arnold",
  "Jalón agarre supino": "jalon-supino",
  "Remo en polea con agarre ancho": "remo-polea-ancho",
  "Elevaciones laterales en polea": "elevaciones-laterales-polea",
  "Curl concentrado": "curl-concentrado",
  "Patada de tríceps con mancuerna": "patada-triceps-mancuerna",
  "Sentadilla búlgara": "sentadilla-bulgara",
  "Glute bridge": "glute-bridge",
  "Plancha lateral": "plancha-lateral",
  "Sentadilla frontal": "sentadilla-frontal",
  "Sentadilla goblet": "sentadilla-goblet",
  "Zancadas con mancuernas": "zancadas-mancuernas",
  "Zancadas caminando": "zancadas-mancuernas",
  "Curl femoral sentado": "curl-femoral-sentado",
  "Buenos días con barra": "buenos-dias",
  "Good morning": "buenos-dias",
  "Hip thrust en máquina": "hip-thrust-maquina",
  "Rueda abdominal (ab wheel)": "rueda-abdominal",
  "Elevación de talones sentado": "talones-sentado",
  "Skull crushers": "skull-crushers",
  "Extensiones sobre cabeza con mancuerna": "extension-sobre-cabeza-mancuerna",
  "Curl predicador con mancuerna": "curl-predicador-mancuerna",
  "Curl en polea baja": "curl-polea-baja",
  "Dominadas con peso": "dominadas-con-peso",
  "Dominadas asistidas": "dominadas-asistidas",
  "Jalón a una mano": "jalon-una-mano",
  "Patada de glúteo en polea": "patada-gluteo-polea",
  "Cinta de correr": "cinta-correr",
  "Cinta inclinada (caminata)": "cinta-correr",
  "Bicicleta estática": "bicicleta-estatica",
  "Bicicleta de spinning": "bicicleta-estatica",
  "Bicicleta reclinada": "bicicleta-estatica",
  "Elíptica": "eliptica",
  "Remo (rower)": "remo-rower",
  "Escaladora (stair master)": "escaladora",
  "Jumping jacks": "jumping-jacks",
  "Burpees": "burpees",
  "Mountain climbers": "mountain-climbers",
  "Estiramiento de isquiotibiales de pie": "estir-isquios-pie",
  "Estiramiento de isquiotibiales sentado": "estir-isquios-pie",
  "Estiramiento de cuádriceps de pie": "estir-cuadriceps",
  "Estiramiento de flexores de cadera (zancada)": "estir-flexores-cadera",
  "Estiramiento de aductores (mariposa)": "estir-mariposa",
  "Estiramiento de gemelos en pared": "estir-gemelos-pared",
  "Estiramiento de sóleo": "estir-gemelos-pared",
  "Estiramiento de pectoral en marco de puerta": "estir-pectoral-puerta",
  "Postura del niño (child pose)": "postura-nino",
  "Gato-camello (cat-cow)": "gato-camello",
};

const SLUG_BY_NORMALIZED_NAME: Record<string, string> = {};
for (const [name, slug] of Object.entries(EXERCISE_VIDEO_SLUG)) {
  SLUG_BY_NORMALIZED_NAME[normalize(name)] = slug;
}

/**
 * Nombres que existen en varios grupos musculares: el clip específico solo
 * aplica al grupo indicado.
 */
const MUSCLE_RESTRICTED: Record<string, string> = {
  "press en maquina": "Pecho",
  "pullover con mancuerna": "Pecho",
};

/** Devuelve el vídeo específico del ejercicio, o null si aún no existe. */
export function specificVideoFor(name: string, muscle?: string | null): string | null {
  const key = normalize(name);
  const restricted = MUSCLE_RESTRICTED[key];
  if (restricted && muscle && muscle !== restricted) return null;
  const slug = SLUG_BY_NORMALIZED_NAME[key];
  if (!slug) return null;
  return VIDEO_URL_BY_SLUG[slug] ?? null;
}
