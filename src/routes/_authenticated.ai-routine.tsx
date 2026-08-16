import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { TrainingTabs } from "@/components/TrainingTabs";
import { generateAiRoutine } from "@/lib/ai-routine.functions";
import { useI18n } from "@/lib/i18n";
import { MUSCLES } from "@/lib/muscles";

export const Route = createFileRoute("/_authenticated/ai-routine")({
  head: () => ({
    meta: [
      { title: "Rutina IA — Training Plan" },
      { name: "description", content: "Genera una rutina de entrenamiento personalizada con IA según tu objetivo, nivel y días disponibles." },
      { property: "og:title", content: "Rutina IA — Training Plan" },
      { property: "og:description", content: "Rutinas de gimnasio personalizadas creadas con inteligencia artificial." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AiRoutinePage,
});

const GOALS = ["Ganar músculo", "Perder grasa", "Definir", "Fuerza", "Salud general", "Resistencia"];
const LEVELS = ["Principiante", "Intermedio", "Avanzado"];
const PLACES = ["Gimnasio completo", "Gimnasio básico", "En casa con mancuernas", "En casa sin material"];
const TIMES = ["30 min", "45 min", "60 min", "90 min"];

function Chips({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={`text-xs px-3 py-1.5 rounded-md border transition ${
            value === o
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-foreground border-border hover:border-primary"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function AiRoutinePage() {
  const { lang } = useI18n();
  const run = useServerFn(generateAiRoutine);
  const [goal, setGoal] = useState(GOALS[0]);
  const [level, setLevel] = useState(LEVELS[0]);
  const [place, setPlace] = useState(PLACES[0]);
  const [time, setTime] = useState(TIMES[1]);
  const [days, setDays] = useState("4");
  const [focus, setFocus] = useState<string[]>([]);
  const [limits, setLimits] = useState("");
  const [result, setResult] = useState("");

  const mutation = useMutation({
    mutationFn: async () =>
      run({
        data: { goal, level, days, place, time, focus: focus.join(", "), limits, lang },
      }),
    onSuccess: (r) => {
      if (r.error === "rate_limited") return toast.error("Demasiadas peticiones, prueba en un minuto.");
      if (r.error) return toast.error("No se pudo generar la rutina. Inténtalo de nuevo.");
      setResult(r.text);
    },
    onError: () => toast.error("No se pudo generar la rutina."),
  });

  return (
    <div className="space-y-6">
      <TrainingTabs />

      <section className="space-y-1">
        <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Rutina IA</p>
        <h1 className="text-3xl sm:text-4xl font-bold">Tu entrenador inteligente</h1>
        <p className="text-muted-foreground">Responde el cuestionario y la IA te aconsejará qué músculos y ejercicios entrenar.</p>
      </section>

      <div className="rounded-2xl border bg-card p-5 space-y-5">
        <div className="space-y-2">
          <Label>Objetivo</Label>
          <Chips options={GOALS} value={goal} onChange={setGoal} />
        </div>
        <div className="space-y-2">
          <Label>Nivel</Label>
          <Chips options={LEVELS} value={level} onChange={setLevel} />
        </div>
        <div className="space-y-2">
          <Label>¿Dónde entrenas?</Label>
          <Chips options={PLACES} value={place} onChange={setPlace} />
        </div>
        <div className="space-y-2">
          <Label>Tiempo por sesión</Label>
          <Chips options={TIMES} value={time} onChange={setTime} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="days">Días por semana</Label>
          <Input id="days" type="number" min={1} max={7} value={days} onChange={(e) => setDays(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Músculos prioritarios (opcional)</Label>
          <div className="flex flex-wrap gap-2">
            {MUSCLES.map((m) => {
              const active = focus.includes(m);
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setFocus((s) => (active ? s.filter((x) => x !== m) : [...s, m]))}
                  className={`text-xs px-3 py-1.5 rounded-md border transition ${
                    active
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-foreground border-border hover:border-primary"
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="limits">Lesiones o limitaciones (opcional)</Label>
          <Input id="limits" value={limits} onChange={(e) => setLimits(e.target.value)} placeholder="Ej. molestia en hombro derecho" />
        </div>
        <Button className="w-full" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {mutation.isPending ? "Generando rutina..." : "Generar rutina con IA"}
        </Button>
      </div>

      {result && (
        <article className="rounded-2xl border bg-card p-5 whitespace-pre-wrap text-sm leading-relaxed">
          {result}
        </article>
      )}
    </div>
  );
}
