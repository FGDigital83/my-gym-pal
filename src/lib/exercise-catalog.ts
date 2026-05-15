import type { Muscle } from "./muscles";

import pecho from "@/assets/muscle-pecho.jpg";
import espalda from "@/assets/muscle-espalda.jpg";
import hombro from "@/assets/muscle-hombro.jpg";
import biceps from "@/assets/muscle-biceps.jpg";
import triceps from "@/assets/muscle-triceps.jpg";
import antebrazos from "@/assets/muscle-antebrazos.jpg";
import abdominales from "@/assets/muscle-abdominales.jpg";
import gluteos from "@/assets/muscle-gluteos.jpg";
import cuadriceps from "@/assets/muscle-cuadriceps.jpg";
import isquiotibiales from "@/assets/muscle-isquiotibiales.jpg";
import pantorrillas from "@/assets/muscle-pantorrillas.jpg";
import cardio from "@/assets/muscle-cardio.jpg";

export const MUSCLE_IMAGE: Record<Muscle, string> = {
  Pecho: pecho,
  Espalda: espalda,
  Dorsales: espalda,
  Hombro: hombro,
  "Bíceps": biceps,
  "Tríceps": triceps,
  Antebrazos: antebrazos,
  Abdominales: abdominales,
  Core: abdominales,
  "Glúteos": gluteos,
  "Cuádriceps": cuadriceps,
  Isquiotibiales: isquiotibiales,
  Pantorrillas: pantorrillas,
  Cardio: cardio,
};

export type CatalogExercise = { name: string };

export const EXERCISE_CATALOG: Record<Muscle, CatalogExercise[]> = {
  Pecho: [
    { name: "Press de banca" },
    { name: "Press inclinado mancuernas" },
    { name: "Aperturas con mancuernas" },
    { name: "Press declinado" },
    { name: "Fondos en paralelas" },
    { name: "Cruce de poleas" },
    { name: "Push up" },
  ],
  Espalda: [
    { name: "Peso muerto" },
    { name: "Remo con barra" },
    { name: "Remo con mancuerna" },
    { name: "Remo en máquina" },
    { name: "Hiperextensiones" },
    { name: "Face pull" },
  ],
  Dorsales: [
    { name: "Dominadas" },
    { name: "Jalón al pecho" },
    { name: "Jalón agarre cerrado" },
    { name: "Pullover con mancuerna" },
    { name: "Remo en T" },
  ],
  Hombro: [
    { name: "Press militar" },
    { name: "Press Arnold" },
    { name: "Elevaciones laterales" },
    { name: "Elevaciones frontales" },
    { name: "Pájaros (posterior)" },
    { name: "Encogimientos" },
  ],
  "Bíceps": [
    { name: "Curl con barra" },
    { name: "Curl con mancuernas" },
    { name: "Curl martillo" },
    { name: "Curl predicador" },
    { name: "Curl concentrado" },
    { name: "Curl en polea" },
  ],
  "Tríceps": [
    { name: "Press francés" },
    { name: "Extensiones en polea" },
    { name: "Fondos en banco" },
    { name: "Patada de tríceps" },
    { name: "Press cerrado" },
    { name: "Extensiones sobre cabeza" },
  ],
  Antebrazos: [
    { name: "Curl de muñeca" },
    { name: "Curl invertido" },
    { name: "Farmer walk" },
    { name: "Suspensión en barra" },
  ],
  Abdominales: [
    { name: "Crunch" },
    { name: "Elevación de piernas" },
    { name: "Crunch en polea" },
    { name: "Rueda abdominal" },
    { name: "Sit up" },
    { name: "Abs en máquina" },
  ],
  Core: [
    { name: "Plancha" },
    { name: "Plancha lateral" },
    { name: "Russian twist" },
    { name: "Mountain climbers" },
    { name: "Dead bug" },
    { name: "Pallof press" },
  ],
  "Glúteos": [
    { name: "Hip thrust" },
    { name: "Glute bridge" },
    { name: "Patada de glúteo" },
    { name: "Sentadilla búlgara" },
    { name: "Peso muerto rumano" },
    { name: "Abductor en máquina" },
  ],
  "Cuádriceps": [
    { name: "Sentadilla con barra" },
    { name: "Prensa de piernas" },
    { name: "Sentadilla frontal" },
    { name: "Extensiones de cuádriceps" },
    { name: "Zancadas" },
    { name: "Hack squat" },
  ],
  Isquiotibiales: [
    { name: "Curl femoral tumbado" },
    { name: "Curl femoral sentado" },
    { name: "Buenos días" },
    { name: "Peso muerto piernas rígidas" },
    { name: "Nórdico" },
  ],
  Pantorrillas: [
    { name: "Elevación de talones de pie" },
    { name: "Elevación de talones sentado" },
    { name: "Pantorrilla en prensa" },
    { name: "Saltos a la comba" },
  ],
  Cardio: [
    { name: "Cinta de correr" },
    { name: "Bicicleta estática" },
    { name: "Elíptica" },
    { name: "Remo" },
    { name: "Escaladora" },
    { name: "HIIT" },
  ],
};
