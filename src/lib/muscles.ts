export const MUSCLES = [
  "Pecho",
  "Espalda",
  "Dorsales",
  "Hombro",
  "Bíceps",
  "Tríceps",
  "Antebrazos",
  "Abdominales",
  "Core",
  "Glúteos",
  "Cuádriceps",
  "Isquiotibiales",
  "Pantorrillas",
  "Cardio",
] as const;

export type Muscle = (typeof MUSCLES)[number];
