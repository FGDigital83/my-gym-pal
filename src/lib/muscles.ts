export const MUSCLES = [
  "Pecho",
  "Espalda",
  "Hombro",
  "Bíceps",
  "Tríceps",
  "Antebrazos",
  "Abdominales",
  "Core",
  "Glúteos",
  "Cuádriceps",
  "Isquiotibiales",
  "Gemelos",
  "Cardio",
  "Estiramientos",
] as const;

export type Muscle = (typeof MUSCLES)[number];
