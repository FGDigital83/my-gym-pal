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
import benchVideo from "@/assets/video-press-banca.mp4.asset.json";

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function exerciseImageFor(name: string, muscle?: Muscle | null): string {
  const n = normalize(name);
  if (/inclinado|superior/.test(n) && /press|apertura|cruce|pecho/.test(n)) return pechoSuperior;
  if (/declinado|fondos.*pecho|cruce.*alto/.test(n)) return pechoInferior;
  if (muscle === "Pecho") return pechoMedio;
  if (/peso muerto|hiperextension|good morning|buenos dias|reverse hyper|lumbar/.test(n)) return lumbar;
  if (/encogimiento|trapecio|remo al menton/.test(n)) return trapecio;
  if (/remo|face pull/.test(n) && muscle === "Espalda") return espaldaMedia;
  if (muscle === "Espalda") return dorsal;
  if (/lateral/.test(n)) return deltoideLateral;
  if (/pajaro|posterior|reverse fly|face pull/.test(n)) return deltoidePosterior;
  if (muscle === "Hombro") return deltoideAnterior;
  if (/martillo|zottman|braquial/.test(n) && muscle === "Bíceps") return braquial;
  if (muscle === "Bíceps") return biceps;
  if (muscle === "Tríceps") return triceps;
  if (muscle === "Antebrazos") return antebrazos;
  if (/inverso|piernas|rodillas|toes to bar|dragon flag/.test(n) && muscle === "Abdominales") return absInferior;
  if (/bicicleta|woodchopper|russian|torsion|lateral/.test(n)) return oblicuos;
  if (muscle === "Abdominales") return absSuperior;
  if (muscle === "Core") return core;
  if (/abductor|abduccion/.test(n)) return abductores;
  if (/aductor|sumo|mariposa/.test(n)) return aductores;
  if (muscle === "Glúteos") return gluteos;
  if (muscle === "Cuádriceps") return cuadriceps;
  if (muscle === "Isquiotibiales") return isquiotibiales;
  if (muscle === "Pantorrillas") return pantorrillas;
  return muscle ? MUSCLE_IMAGE[muscle] : core;
}

export function exerciseVideoFor(name: string): string | null {
  const n = normalize(name);
  return /press de banca$|press banca normal|press banca plano|flat bench press/.test(n) ? benchVideo.url : null;
}
