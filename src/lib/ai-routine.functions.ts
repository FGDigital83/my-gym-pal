import { createServerFn } from "@tanstack/react-start";

export type RoutineInput = {
  goal: string;
  level: string;
  days: string;
  place: string;
  time: string;
  focus: string;
  limits: string;
  lang: string;
};

export const generateAiRoutine = createServerFn({ method: "POST" })
  .inputValidator((input: RoutineInput) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { text: "", error: "missing_key" };
    const prompt = `Eres un entrenador personal profesional. Responde SIEMPRE en el idioma con código "${data.lang}".
Datos del usuario:
- Objetivo: ${data.goal}
- Nivel: ${data.level}
- Días por semana: ${data.days}
- Dónde entrena: ${data.place}
- Tiempo por sesión: ${data.time}
- Músculos prioritarios: ${data.focus || "ninguno en concreto"}
- Lesiones/limitaciones: ${data.limits || "ninguna"}

Diseña una rutina semanal realista y detallada:
1) Reparto de días (qué músculos cada día y por qué).
2) Para cada día: 5-7 ejercicios con series x repeticiones, descanso en segundos y RIR.
3) Progresión semanal y consejos de técnica.
4) Cardio y estiramientos recomendados.
Usa Markdown claro con títulos y listas. Sé conciso pero completo.`;

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!res.ok) {
        return { text: "", error: res.status === 429 ? "rate_limited" : `error_${res.status}` };
      }
      const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      return { text: json.choices?.[0]?.message?.content ?? "", error: null as string | null };
    } catch {
      return { text: "", error: "network" };
    }
  });
