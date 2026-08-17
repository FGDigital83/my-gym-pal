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
          model: "google/gemini-3.7-flash",
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

export type CoachMessage = { role: "user" | "assistant"; content: string };

export const chatWithCoach = createServerFn({ method: "POST" })
  .inputValidator((input: { messages: CoachMessage[]; lang: string; context?: string }) => ({
    messages: (input.messages ?? []).slice(-14).map((m) => ({
      role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: String(m.content).slice(0, 4000),
    })),
    lang: String(input.lang ?? "es"),
    context: String(input.context ?? "").slice(0, 2000),
  }))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { text: "", error: "missing_key" };
    const system = `Eres "Entrenador IA" de la app Training Plan: un entrenador personal certificado y experto en fuerza, hipertrofia y salud.
Responde SIEMPRE en el idioma con código "${data.lang}".
Estilo: cercano, claro y motivador. Respuestas cortas (máx. 200 palabras) con listas cuando ayude.
Siempre que recomiendes un ejercicio explica: POR QUÉ lo recomiendas (músculo trabajado y objetivo), cómo se hace en 1-2 frases (técnica clave), y series x repeticiones + descanso.
Sugiere alternativas si hay lesiones o falta de material. Recuerda progresión y descanso.
No des diagnósticos médicos: ante dolor real, recomienda consultar a un profesional.
${data.context ? `Datos del usuario: ${data.context}` : ""}`;

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "google/gemini-3.7-flash",
          messages: [{ role: "system", content: system }, ...data.messages],
        }),
      });
      if (!res.ok) return { text: "", error: res.status === 429 ? "rate_limited" : res.status === 402 ? "credits" : `error_${res.status}` };
      const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      return { text: json.choices?.[0]?.message?.content ?? "", error: null as string | null };
    } catch {
      return { text: "", error: "network" };
    }
  });
