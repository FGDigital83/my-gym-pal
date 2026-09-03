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
