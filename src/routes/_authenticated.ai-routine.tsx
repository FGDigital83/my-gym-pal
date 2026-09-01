import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dumbbell, Loader2, Play, Sparkles, Timer } from "lucide-react";
import { toast } from "sonner";
import { TrainingTabs } from "@/components/TrainingTabs";
import { CoachChat } from "@/components/CoachChat";
import { ExerciseVideoDialog } from "@/components/ExerciseVideoDialog";
import { generateAiRoutine, type AiRoutinePlan } from "@/lib/ai-routine.functions";
import { exerciseImageFor } from "@/lib/exercise-media";
import { useI18n } from "@/lib/i18n";
import { MUSCLES, type Muscle } from "@/lib/muscles";

export const Route = createFileRoute("/_authenticated/ai-routine")({
  head: () => ({ meta: [
    { title: "Rutina IA — Training Plan" },
    { name: "description", content: "Genera una rutina de entrenamiento personalizada con IA según tu objetivo, nivel y días disponibles." },
    { property: "og:title", content: "Rutina IA — Training Plan" },
    { property: "og:description", content: "Rutinas de gimnasio personalizadas creadas con inteligencia artificial." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: AiRoutinePage,
});

type Option = { value: string; label: string };

const GOAL_KEYS = ["goalBulk", "goalLose", "goalCut", "goalStrength", "goalHealth", "goalEndurance"] as const;
const GOAL_VALUES = ["Ganar músculo", "Perder grasa", "Definir", "Fuerza", "Salud general", "Resistencia"];
const LEVEL_KEYS = ["lvlBeginner", "lvlIntermediate", "lvlAdvanced"] as const;
const LEVEL_VALUES = ["Principiante", "Intermedio", "Avanzado"];
const PLACE_KEYS = ["placeFullGym", "placeBasicGym", "placeHomeDumbbells", "placeHomeNoKit"] as const;
const PLACE_VALUES = ["Gimnasio completo", "Gimnasio básico", "En casa con mancuernas", "En casa sin material"];
const TIMES: Option[] = ["30 min", "45 min", "60 min", "90 min"].map((v) => ({ value: v, label: v }));

function Chips({ options, value, onChange }: { options: Option[]; value: string; onChange: (v: string) => void }) {
  return <div className="flex flex-wrap gap-2">{options.map((o) => <Button key={o.value} type="button" size="sm" variant={value === o.value ? "default" : "outline"} onClick={() => onChange(o.value)}>{o.label}</Button>)}</div>;
}

function AiRoutinePage() {
  const { lang, t } = useI18n();
  const GOALS: Option[] = GOAL_VALUES.map((value, i) => ({ value, label: t(GOAL_KEYS[i]) }));
  const LEVELS: Option[] = LEVEL_VALUES.map((value, i) => ({ value, label: t(LEVEL_KEYS[i]) }));
  const PLACES: Option[] = PLACE_VALUES.map((value, i) => ({ value, label: t(PLACE_KEYS[i]) }));
  const run = useServerFn(generateAiRoutine);
  const [goal, setGoal] = useState(GOAL_VALUES[0]);
  const [level, setLevel] = useState(LEVEL_VALUES[0]);
  const [place, setPlace] = useState(PLACE_VALUES[0]);
  const [time, setTime] = useState(TIMES[1].value);
  const [days, setDays] = useState("4");
  const [focus, setFocus] = useState<string[]>([]);
  const [limits, setLimits] = useState("");
  const [result, setResult] = useState<AiRoutinePlan | null>(null);
  const [videoExercise, setVideoExercise] = useState<{ name: string; muscle: Muscle } | null>(null);

  const mutation = useMutation({
    mutationFn: () => run({ data: { goal, level, days, place, time, focus: focus.join(", "), limits, lang } }),
    onSuccess: (response) => {
      if (response.error) return toast.error(response.message || (response.error === "rate_limited" ? t("aiRateLimited") : t("aiError")));
      setResult(response.routine);
    },
    onError: () => toast.error(t("aiError")),
  });

  return <div className="space-y-6">
    <TrainingTabs />
    <section className="space-y-1">
      <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">{t("aiRoutine")}</p>
      <h1 className="text-3xl sm:text-4xl font-bold">{t("aiRoutineTitle")}</h1>
      <p className="text-muted-foreground">{t("aiRoutineIntro")}</p>
    </section>

    <div className="rounded-lg border bg-card p-5 space-y-5">
      <div className="space-y-2"><Label>{t("goal")}</Label><Chips options={GOALS} value={goal} onChange={setGoal} /></div>
      <div className="space-y-2"><Label>{t("aiLevel")}</Label><Chips options={LEVELS} value={level} onChange={setLevel} /></div>
      <div className="space-y-2"><Label>{t("aiWhere")}</Label><Chips options={PLACES} value={place} onChange={setPlace} /></div>
      <div className="space-y-2"><Label>{t("aiTime")}</Label><Chips options={TIMES} value={time} onChange={setTime} /></div>
      <div className="space-y-2"><Label htmlFor="days">{t("aiDays")}</Label><Input id="days" type="number" min={1} max={7} value={days} onChange={(e) => setDays(e.target.value)} /></div>
      <div className="space-y-2">
        <Label>{t("aiFocus")}</Label>
        <div className="flex flex-wrap gap-2">{MUSCLES.map((m) => <Button key={m} type="button" size="sm" variant={focus.includes(m) ? "default" : "outline"} onClick={() => setFocus((current) => current.includes(m) ? current.filter((x) => x !== m) : [...current, m])}>{m}</Button>)}</div>
      </div>
      <div className="space-y-2"><Label htmlFor="limits">{t("aiLimits")}</Label><Input id="limits" value={limits} onChange={(e) => setLimits(e.target.value)} placeholder={t("aiLimitsPh")} /></div>
      <Button className="w-full" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
        {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        {mutation.isPending ? t("aiGenerating") : t("aiGenerate")}
      </Button>
    </div>

    {result && <section className="space-y-6" aria-live="polite">
      <div className="space-y-2"><h2 className="text-2xl font-bold">{result.title}</h2><p className="text-sm text-muted-foreground leading-relaxed">{result.introduction}</p></div>
      {result.days.map((day, dayIndex) => <section key={`${day.title}-${dayIndex}`} className="space-y-3">
        <div><p className="text-xs font-semibold uppercase tracking-wider text-primary">{day.focus}</p><h3 className="text-xl font-bold">{day.title}</h3><p className="text-sm text-muted-foreground">{day.reason}</p></div>
        <div className="grid gap-3 sm:grid-cols-2">
          {day.exercises.map((exercise, exerciseIndex) => {
            const muscle = MUSCLES.includes(exercise.muscle as Muscle) ? exercise.muscle as Muscle : "Core";
            return <article key={`${exercise.name}-${exerciseIndex}`} className="overflow-hidden rounded-lg border bg-card">
              <div className="relative aspect-[16/9] bg-muted">
                <img src={exerciseImageFor(exercise.name, muscle)} alt={`${exercise.displayName}: ${exercise.muscle}`} loading="lazy" className="h-full w-full object-cover" />
                <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">{exerciseIndex + 1}</span>
                <Button type="button" size="icon" className="absolute bottom-3 right-3" onClick={() => setVideoExercise({ name: exercise.name, muscle })} aria-label={`${result.labels.video}: ${exercise.displayName}`}><Play className="h-4 w-4" /></Button>
              </div>
              <div className="space-y-3 p-4">
                <div><h4 className="font-bold">{exercise.displayName || exercise.name}</h4><p className="text-xs text-primary">{exercise.muscle}</p></div>
                <div className="grid grid-cols-3 divide-x divide-border rounded-md border py-2 text-center">
                  <div><span className="block text-lg font-bold">{exercise.sets}</span><span className="text-[11px] text-muted-foreground">{result.labels.sets}</span></div>
                  <div><span className="block text-lg font-bold">{exercise.reps}</span><span className="text-[11px] text-muted-foreground">{result.labels.reps}</span></div>
                  <div><span className="block text-lg font-bold">{exercise.restSeconds}s</span><span className="text-[11px] text-muted-foreground">{result.labels.rest}</span></div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="flex gap-2"><Dumbbell className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span><strong>{result.labels.technique}:</strong> {exercise.technique}</span></p>
                  <p className="flex gap-2"><Timer className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span><strong>{result.labels.reason}:</strong> {exercise.reason}</span></p>
                </div>
              </div>
            </article>;
          })}
        </div>
      </section>)}
      <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-lg border p-4"><h3 className="font-bold">{result.labels.progression}</h3><p className="mt-1 text-sm text-muted-foreground">{result.progression}</p></div><div className="rounded-lg border p-4"><h3 className="font-bold">{result.labels.recovery}</h3><p className="mt-1 text-sm text-muted-foreground">{result.recovery}</p></div></div>
    </section>}

    <CoachChat context={`Objetivo: ${goal}. Nivel: ${level}. Lugar: ${place}. Tiempo por sesión: ${time}. Días por semana: ${days}. Músculos prioritarios: ${focus.join(", ") || "ninguno"}. Limitaciones: ${limits || "ninguna"}.`} />
    <ExerciseVideoDialog name={videoExercise?.name ?? null} muscle={videoExercise?.muscle} open={!!videoExercise} onOpenChange={(open) => !open && setVideoExercise(null)} />
  </div>;
}
