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

export type AiRoutineExercise = {
  name: string;
  displayName: string;
  muscle: string;
  sets: number;
  reps: string;
  restSeconds: number;
  technique: string;
  reason: string;
};

export type AiRoutinePlan = {
  title: string;
  introduction: string;
  labels: { sets: string; reps: string; rest: string; seconds: string; technique: string; reason: string; video: string };
  days: { title: string; focus: string; reason: string; exercises: AiRoutineExercise[] }[];
  progression: string;
  recovery: string;
};

export const generateAiRoutine = createServerFn({ method: "POST" })
  .inputValidator((input: RoutineInput) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { routine: null as AiRoutinePlan | null, error: "missing_key", message: "AI configuration is unavailable." };
    const prompt = `You are a certified personal trainer. Build a safe, realistic weekly routine from these answers:
Goal: ${data.goal}; Level: ${data.level}; Days: ${data.days}; Place: ${data.place}; Session: ${data.time}; Priority muscles: ${data.focus || "none"}; Limitations: ${data.limits || "none"}.
Return ONLY valid JSON. All human-readable text MUST be in language code "${data.lang}". Exercise field "name" MUST remain the canonical Spanish gym name so the app can match its media; "displayName" is its translation into the requested language.
Use exactly this shape: {"title":"","introduction":"","labels":{"sets":"","reps":"","rest":"","seconds":"","technique":"","reason":"","video":""},"days":[{"title":"","focus":"Pecho","reason":"","exercises":[{"name":"Press de banca","displayName":"","muscle":"Pecho","sets":4,"reps":"8-10","restSeconds":90,"technique":"","reason":""}]}],"progression":"","recovery":""}.
Use only these muscle values: Pecho, Espalda, Hombro, Bíceps, Tríceps, Antebrazos, Abdominales, Core, Glúteos, Cuádriceps, Isquiotibiales, Pantorrillas, Cardio, Estiramientos. Include 4-7 exercises per day. Give direct sets and repetitions, never use vague terms such as dose. Explain briefly why every exercise is selected and one key technique cue.`;

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "google/gemini-3.7-flash",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
        }),
      });
      if (!res.ok) {
        const details = await res.text().catch(() => "");
        return { routine: null as AiRoutinePlan | null, error: res.status === 429 ? "rate_limited" : `error_${res.status}`, message: details || "Routine generation failed." };
      }
      const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      const content = json.choices?.[0]?.message?.content;
      if (!content) return { routine: null as AiRoutinePlan | null, error: "empty", message: "The AI returned an empty routine." };
      return { routine: JSON.parse(content) as AiRoutinePlan, error: null as string | null, message: null as string | null };
    } catch (error) {
      return { routine: null as AiRoutinePlan | null, error: "network", message: error instanceof Error ? error.message : "Network error." };
    }
  });

export type CoachMessage = { role: "user" | "assistant"; content: string };

export const chatWithCoach = createServerFn({ method: "POST" })
  .inputValidator((input: { messages: CoachMessage[]; lang: string; context?: string }) => ({
    messages: (input.messages ?? []).slice(-14).map((m) => ({ role: m.role === "assistant" ? ("assistant" as const) : ("user" as const), content: String(m.content).slice(0, 4000) })),
    lang: String(input.lang ?? "es"),
    context: String(input.context ?? "").slice(0, 2000),
  }))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { text: "", error: "missing_key" };
    const system = `You are Training Plan's certified AI trainer. Always answer in language code "${data.lang}". Be clear, motivating and concise (maximum 200 words). For every recommended exercise explain why, one key technique cue, sets x repetitions and rest. Offer safe alternatives for injuries or missing equipment. Never diagnose medical conditions. ${data.context ? `User context: ${data.context}` : ""}`;
    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model: "google/gemini-3.7-flash", messages: [{ role: "system", content: system }, ...data.messages] }),
      });
      if (!res.ok) return { text: "", error: res.status === 429 ? "rate_limited" : res.status === 402 ? "credits" : `error_${res.status}` };
      const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      return { text: json.choices?.[0]?.message?.content ?? "", error: null as string | null };
    } catch {
      return { text: "", error: "network" };
    }
  });
