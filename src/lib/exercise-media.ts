import type { Muscle } from "./muscles";
import { MUSCLE_IMAGE } from "./exercise-catalog";

import pechoSuperior from "@/assets/zone-pecho-superior.jpg";
import pechoMedio from "@/assets/zone-pecho-medio.jpg";
import pechoInferior from "@/assets/zone-pecho-inferior.jpg";
import dorsal from "@/assets/zone-dorsal.jpg";
import espaldaMedia from "@/assets/zone-espalda-media.jpg";
import trapecio from "@/assets/zone-trapecio.jpg";
import lumbar from "@/assets/zone-lumbar.jpg";
import deltoideAnterior from "@/assets/zone-deltoide-anterior.jpg";
import deltoideLateral from "@/assets/zone-deltoide-lateral.jpg";
import deltoidePosterior from "@/assets/zone-deltoide-posterior.jpg";
import biceps from "@/assets/zone-biceps.jpg";
import braquial from "@/assets/zone-braquial.jpg";
import triceps from "@/assets/zone-triceps.jpg";
import antebrazos from "@/assets/zone-antebrazos.jpg";
import absSuperior from "@/assets/zone-abs-superior.jpg";
import absInferior from "@/assets/zone-abs-inferior.jpg";
import oblicuos from "@/assets/zone-oblicuos.jpg";
import core from "@/assets/zone-core.jpg";
import gluteos from "@/assets/zone-gluteos.jpg";
import cuadriceps from "@/assets/zone-cuadriceps.jpg";
import isquiotibiales from "@/assets/zone-isquiotibiales.jpg";
import aductores from "@/assets/zone-aductores.jpg";
import abductores from "@/assets/zone-abductores.jpg";
import pantorrillas from "@/assets/zone-pantorrillas.jpg";

import pressBancaVideo from "@/assets/video-press-banca.mp4.asset.json";
import pressInclinadoVideo from "@/assets/video-press-inclinado.mp4.asset.json";
import aperturasVideo from "@/assets/video-aperturas.mp4.asset.json";
import flexionesVideo from "@/assets/video-flexiones.mp4.asset.json";
import fondosVideo from "@/assets/video-fondos.mp4.asset.json";
import dominadasVideo from "@/assets/video-dominadas.mp4.asset.json";
import remoVideo from "@/assets/video-remo.mp4.asset.json";
import pesoMuertoVideo from "@/assets/video-peso-muerto.mp4.asset.json";
import pressMilitarVideo from "@/assets/video-press-militar.mp4.asset.json";
import elevacionesLateralesVideo from "@/assets/video-elevaciones-laterales.mp4.asset.json";
import curlBicepsVideo from "@/assets/video-curl-biceps.mp4.asset.json";
import extensionTricepsVideo from "@/assets/video-extension-triceps.mp4.asset.json";
import antebrazosVideo from "@/assets/video-antebrazos.mp4.asset.json";
import abdominalesVideo from "@/assets/video-abdominales.mp4.asset.json";
import coreVideo from "@/assets/video-core.mp4.asset.json";
import hipThrustVideo from "@/assets/video-hip-thrust.mp4.asset.json";
import sentadillaVideo from "@/assets/video-sentadilla.mp4.asset.json";
import curlFemoralVideo from "@/assets/video-curl-femoral.mp4.asset.json";
import elevacionTalonesVideo from "@/assets/video-elevacion-talones.mp4.asset.json";
import cardioVideo from "@/assets/video-cardio.mp4.asset.json";
import estiramientosVideo from "@/assets/video-estiramientos.mp4.asset.json";

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

const has = (name: string, pattern: RegExp) => pattern.test(normalize(name));

/** Ilustración anatómica de la zona principal que trabaja cada ejercicio. */
export function exerciseImageFor(name: string, muscle?: Muscle | null): string {
  switch (muscle) {
    case "Pecho":
      if (has(name, /inclinad|cruce de poleas bajo/)) return pechoSuperior;
      if (has(name, /declinad|cruce de poleas alto|fondos/)) return pechoInferior;
      return pechoMedio;
    case "Espalda":
      if (has(name, /peso muerto|hiperextension|good morning|buenos dias|reverse hyper|superman/)) return lumbar;
      if (has(name, /encogimiento|trapecio|rack pulls/)) return trapecio;
      if (has(name, /remo|face pull|kroc|meadows/)) return espaldaMedia;
      return dorsal;
    case "Hombro":
      if (has(name, /lateral/)) return deltoideLateral;
      if (has(name, /pajaro|posterior|reverse fly|face pull/)) return deltoidePosterior;
      return deltoideAnterior;
    case "Bíceps":
      return has(name, /martillo|zottman|braquial/) ? braquial : biceps;
    case "Tríceps":
      return triceps;
    case "Antebrazos":
      return antebrazos;
    case "Abdominales":
      if (has(name, /bicicleta|woodchopper|torsion/)) return oblicuos;
      if (has(name, /inverso|piernas|rodillas|toes to bar|dragon flag/)) return absInferior;
      return absSuperior;
    case "Core":
      return has(name, /lateral|russian|woodchopper|torsion/) ? oblicuos : core;
    case "Glúteos":
      if (has(name, /abductor|abduccion/)) return abductores;
      if (has(name, /aductor/)) return aductores;
      return gluteos;
    case "Cuádriceps":
      return cuadriceps;
    case "Isquiotibiales":
      return isquiotibiales;
    case "Gemelos":
      return pantorrillas;
    case "Estiramientos":
      if (has(name, /isquiotibial/)) return isquiotibiales;
      if (has(name, /cuadriceps/)) return cuadriceps;
      if (has(name, /gluteo|piriforme|figura 4/)) return gluteos;
      if (has(name, /aductor|mariposa/)) return aductores;
      if (has(name, /gemelo|soleo/)) return pantorrillas;
      if (has(name, /pectoral/)) return pechoMedio;
      if (has(name, /dorsal/)) return dorsal;
      if (has(name, /triceps/)) return triceps;
      if (has(name, /hombro/)) return deltoidePosterior;
      if (has(name, /cuello/)) return trapecio;
      if (has(name, /antebrazo|muneca/)) return antebrazos;
      if (has(name, /lumbar|espinal|gato|camello|perro|cobra/)) return lumbar;
      return MUSCLE_IMAGE.Estiramientos;
    case "Cardio":
      return MUSCLE_IMAGE.Cardio;
    default:
      return muscle ? MUSCLE_IMAGE[muscle] : core;
  }
}

const VIDEO_BY_MUSCLE: Record<Muscle, string> = {
  Pecho: pressBancaVideo.url,
  Espalda: dominadasVideo.url,
  Hombro: pressMilitarVideo.url,
  "Bíceps": curlBicepsVideo.url,
  "Tríceps": extensionTricepsVideo.url,
  Antebrazos: antebrazosVideo.url,
  Abdominales: abdominalesVideo.url,
  Core: coreVideo.url,
  "Glúteos": hipThrustVideo.url,
  "Cuádriceps": sentadillaVideo.url,
  Isquiotibiales: curlFemoralVideo.url,
  Gemelos: elevacionTalonesVideo.url,
  Cardio: cardioVideo.url,
  Estiramientos: estiramientosVideo.url,
};

/**
 * Vídeo IA sin personas reales. Los ejercicios comparten un clip cuando usan
 * el mismo patrón de movimiento, como en una biblioteca profesional de técnica.
 */
export function exerciseVideoFor(name: string, muscle?: Muscle | null): string {
  const n = normalize(name);

  if (/(cinta|bicicleta|eliptica|rower|escaladora|ski erg|assault|hiit|sprint|burpee|jumping jack|battle rope|box jump|sled push)/.test(n)) return cardioVideo.url;
  if (/(estiramiento|postura|gato-camello|perro boca abajo|cobra|torsion espinal|movilidad)/.test(n)) return estiramientosVideo.url;
  if (/(press inclinado|inclinado con barra|inclinado mancuernas|smith inclinado)/.test(n)) return pressInclinadoVideo.url;
  if (/(press de banca|press con mancuernas plano|press en maquina|smith plano|floor press|svend press)/.test(n)) return pressBancaVideo.url;
  if (/(apertura|peck deck|cruce de poleas)/.test(n)) return aperturasVideo.url;
  if (/(push up|flexion)/.test(n)) return flexionesVideo.url;
  if (/fondos/.test(n)) return fondosVideo.url;
  if (/(dominada|chin up|jalon|pull over|pullover)/.test(n)) return dominadasVideo.url;
  if (/(remo|face pull|kroc rows|meadows)/.test(n)) return remoVideo.url;
  if (/(peso muerto|hiperextension|good morning|buenos dias|reverse hyper|kettlebell swing)/.test(n)) return pesoMuertoVideo.url;
  if (/(press militar|press arnold|push press|handstand push up|cuban press|elevaciones frontales|elevacion frontal|remo al menton)/.test(n)) return pressMilitarVideo.url;
  if (/(elevaciones laterales|elevacion lateral|pajaro|reverse fly)/.test(n)) return elevacionesLateralesVideo.url;
  if (/(muneca|wrist|invertido|farmer walk|dead hang|plate pinch|behind-the-back|hammer)/.test(n) && muscle === "Antebrazos") return antebrazosVideo.url;
  if (/(curl|zottman|drag curl)/.test(n) && muscle !== "Isquiotibiales") return curlBicepsVideo.url;
  if (/(triceps|frances|patada de triceps|press cerrado|skull crusher|jm press|tate press)/.test(n)) return extensionTricepsVideo.url;
  if (/(curl femoral|curl nordico|glute ham raise|slider leg curl)/.test(n)) return curlFemoralVideo.url;
  if (/(hip thrust|glute bridge|patada de gluteo|abductor|abduccion|cable pull through|frog pump)/.test(n)) return hipThrustVideo.url;
  if (/(sentadilla|prensa|extension de cuadriceps|extensiones de cuadriceps|extension a una pierna|extensiones a una pierna|zancada|step up|pistol squat|box squat|wall sit|belt squat|hack squat)/.test(n)) return sentadillaVideo.url;
  if (/(talones|pantorrilla|donkey calf|tibial anterior|puntillas)/.test(n)) return elevacionTalonesVideo.url;
  if (/(crunch|sit up|v-up|toes to bar|elevacion de piernas|elevacion de rodillas|dragon flag)/.test(n)) return abdominalesVideo.url;
  if (/(plancha|russian twist|woodchopper|dead bug|bird dog|pallof|hollow|copenhagen|l-sit|suitcase carry|turkish get up|mountain climber|rueda abdominal|ab wheel)/.test(n)) return coreVideo.url;

  return VIDEO_BY_MUSCLE[muscle ?? "Core"];
}
