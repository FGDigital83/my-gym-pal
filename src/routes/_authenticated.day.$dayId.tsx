import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, ChevronRight, Plus, Trash2, Check, Play, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { EXERCISE_CATALOG, MUSCLE_IMAGE } from "@/lib/exercise-catalog";
import { ExerciseVideoDialog } from "@/components/ExerciseVideoDialog";
import type { Muscle } from "@/lib/muscles";

export const Route = createFileRoute("/_authenticated/day/$dayId")({
  component: DayPage,
});

type Day = { id: string; day_number: number; title: string; muscles: string[]; created_at: string };
type Exercise = { id: string; name: string; muscle: string | null; position: number };

function DayPage() {
  const { dayId } = Route.useParams();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [customFor, setCustomFor] = useState<Muscle | null>(null);
  const [customName, setCustomName] = useState("");
  const [videoName, setVideoName] = useState<string | null>(null);
  const [swapTarget, setSwapTarget] = useState<Exercise | null>(null);

  const { data: day } = useQuery({
    queryKey: ["day", dayId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workout_days")
        .select("id, day_number, title, muscles, created_at")
        .eq("id", dayId)
        .single();
      if (error) throw error;
      return data as Day;
    },
  });

  const { data: exercises, isLoading } = useQuery({
    queryKey: ["exercises", dayId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exercises")
        .select("id, name, muscle, position")
        .eq("day_id", dayId)
        .order("position", { ascending: true });
      if (error) throw error;
      return data as Exercise[];
    },
  });

  const addExercise = useMutation({
    mutationFn: async (payload: { name: string; muscle: string }) => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("No auth");
      const next = (exercises?.at(-1)?.position ?? 0) + 1;
      const { error } = await supabase.from("exercises").insert({
        day_id: dayId,
        user_id: u.user.id,
        name: payload.name,
        muscle: payload.muscle,
        position: next,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["exercises", dayId] });
      toast.success("Ejercicio añadido");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Error"),
  });

  const deleteExercise = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("exercise_logs").delete().eq("exercise_id", id);
      const { error } = await supabase.from("exercises").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["exercises", dayId] });
      toast.success("Ejercicio eliminado");
    },
  });

  const renameExercise = useMutation({
    mutationFn: async (payload: { id: string; name: string }) => {
      const { error } = await supabase.from("exercises").update({ name: payload.name }).eq("id", payload.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["exercises", dayId] });
      setSwapTarget(null);
      toast.success("Ejercicio cambiado");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Error"),
  });

  const addedNames = new Set(exercises?.map((e) => e.name) ?? []);
  const dayMuscles = (day?.muscles ?? []) as Muscle[];

  return (
    <div className="space-y-6">
      <Link to="/plan" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Plan
      </Link>

      {day && (
        <section className="space-y-2">
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">
            {(() => { const d = new Date(day.created_at); return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getFullYear()).slice(-2)}`; })()}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
            {day.muscles.length === 0 ? "Sin músculos" : day.muscles.join(" · ")}
          </h1>
        </section>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Ejercicios</h2>
        <Button size="sm" onClick={() => setOpen(true)} disabled={dayMuscles.length === 0}>
          <Plus className="h-4 w-4" /> Añadir
        </Button>
      </div>

      {dayMuscles.length === 0 && (
        <p className="text-sm text-muted-foreground py-4 text-center rounded-xl border border-dashed">
          Añade músculos a este día desde el plan para poder elegir ejercicios.
        </p>
      )}

      {isLoading && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-xl bg-card animate-pulse" />)}
        </div>
      )}

      {!isLoading && exercises?.length === 0 && dayMuscles.length > 0 && (
        <p className="text-sm text-muted-foreground py-8 text-center rounded-xl border border-dashed">
          Aún no hay ejercicios. Pulsa "Añadir" para elegir.
        </p>
      )}

      <div className="space-y-2">
        {exercises?.map((ex, idx) => {
          const img = ex.muscle ? MUSCLE_IMAGE[ex.muscle as Muscle] : undefined;
          return (
            <div key={ex.id} className="relative group">
              <Link
                to="/exercise/$exerciseId"
                params={{ exerciseId: ex.id }}
                className="flex items-center gap-3 rounded-xl border bg-card p-3 transition hover:border-primary"
              >
                <div className="h-14 w-14 rounded-lg overflow-hidden bg-muted flex items-center justify-center shrink-0">
                  {img ? (
                    <img src={img} alt={ex.muscle ?? ""} loading="lazy" width={56} height={56} className="h-full w-full object-cover" />
                  ) : (
                    <span className="font-bold text-primary text-sm">{String(idx + 1).padStart(2, "0")}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0 pr-8">
                  <div className="font-semibold truncate">{ex.name}</div>
                  {ex.muscle && <div className="text-xs text-muted-foreground">{ex.muscle}</div>}
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </Link>
              <div className="absolute bottom-2 right-2 flex items-center gap-1">
                <button
                  onClick={(e) => { e.preventDefault(); setVideoName(ex.name); }}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10"
                  aria-label="Ver vídeo"
                >
                  <Play className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={(e) => { e.preventDefault(); setSwapTarget(ex); }}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10"
                  aria-label="Cambiar ejercicio"
                >
                  <Repeat className="h-3.5 w-3.5" />
                </button>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (confirm(`¿Eliminar "${ex.name}"?`)) deleteExercise.mutate(ex.id);
                }}
                className="absolute top-2 right-2 p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition"
                aria-label="Eliminar"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Elige ejercicios</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {dayMuscles.map((m) => {
              const items = EXERCISE_CATALOG[m] ?? [];
              const img = MUSCLE_IMAGE[m];
              return (
                <section key={m} className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {img && (
                        <img src={img} alt={m} loading="lazy" width={28} height={28} className="h-7 w-7 rounded-md object-cover" />
                      )}
                      <h3 className="text-sm font-bold uppercase tracking-wider text-primary">{m}</h3>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setCustomFor(customFor === m ? null : m);
                        setCustomName("");
                      }}
                    >
                      <Plus className="h-3.5 w-3.5" /> Añadir
                    </Button>
                  </div>
                  {customFor === m && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const name = customName.trim();
                        if (!name) return;
                        if (addedNames.has(name)) {
                          toast.error("Ya está añadido");
                          return;
                        }
                        addExercise.mutate(
                          { name, muscle: m },
                          {
                            onSuccess: () => {
                              setCustomName("");
                              setCustomFor(null);
                            },
                          },
                        );
                      }}
                      className="flex gap-2"
                    >
                      <Input
                        autoFocus
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder={`Nuevo ejercicio de ${m.toLowerCase()}`}
                      />
                      <Button type="submit" size="sm" disabled={!customName.trim() || addExercise.isPending}>
                        <Check className="h-4 w-4" />
                      </Button>
                    </form>
                  )}
                  <div className="grid grid-cols-1 gap-2">
                    {items.map((ex) => {
                      const added = addedNames.has(ex.name);
                      return (
                        <div
                          key={ex.name}
                          className={`flex items-center gap-3 rounded-xl border p-2.5 transition ${
                            added ? "border-primary/40 bg-primary/10" : "bg-card border-border hover:border-primary"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => addExercise.mutate({ name: ex.name, muscle: m })}
                            disabled={added || addExercise.isPending}
                            className="flex flex-1 min-w-0 items-center gap-3 text-left disabled:opacity-60"
                          >
                            <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted shrink-0">
                              {img && (
                                <img src={img} alt="" loading="lazy" width={48} height={48} className="h-full w-full object-cover" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm truncate">{ex.name}</div>
                            </div>
                            {added ? (
                              <Check className="h-4 w-4 text-primary shrink-0" />
                            ) : (
                              <Plus className="h-4 w-4 text-muted-foreground shrink-0" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => setVideoName(ex.name)}
                            className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 shrink-0"
                            aria-label={`Ver vídeo de ${ex.name}`}
                          >
                            <Play className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!swapTarget} onOpenChange={(v) => !v && setSwapTarget(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cambiar ejercicio</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-2">
            {(EXERCISE_CATALOG[(swapTarget?.muscle ?? "Pecho") as Muscle] ?? []).map((alt) => (
              <div
                key={alt.name}
                className={`flex items-center gap-3 rounded-xl border p-2.5 transition ${
                  alt.name === swapTarget?.name ? "border-primary/40 bg-primary/10" : "bg-card border-border hover:border-primary"
                }`}
              >
                <button
                  type="button"
                  className="flex-1 min-w-0 text-left font-semibold text-sm truncate disabled:opacity-60"
                  disabled={alt.name === swapTarget?.name || addedNames.has(alt.name) || renameExercise.isPending}
                  onClick={() => swapTarget && renameExercise.mutate({ id: swapTarget.id, name: alt.name })}
                >
                  {alt.name}
                </button>
                <button
                  type="button"
                  onClick={() => setVideoName(alt.name)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 shrink-0"
                  aria-label={`Ver vídeo de ${alt.name}`}
                >
                  <Play className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <ExerciseVideoDialog name={videoName} open={!!videoName} onOpenChange={(v) => !v && setVideoName(null)} />
    </div>
  );
}
