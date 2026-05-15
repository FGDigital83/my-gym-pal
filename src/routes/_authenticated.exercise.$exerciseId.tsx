import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Plus, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useMemo } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/exercise/$exerciseId")({
  component: ExercisePage,
});

type Exercise = { id: string; name: string; muscle: string | null; day_id: string };
type Log = {
  id: string;
  log_date: string;
  set_number: number;
  reps: number | null;
  weight: number | null;
  duration_seconds: number | null;
  notes: string | null;
};

function ExercisePage() {
  const { exerciseId } = Route.useParams();
  const qc = useQueryClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data: exercise } = useQuery({
    queryKey: ["exercise", exerciseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exercises").select("id, name, muscle, day_id").eq("id", exerciseId).single();
      if (error) throw error;
      return data as Exercise;
    },
  });

  const { data: logs } = useQuery({
    queryKey: ["logs", exerciseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exercise_logs")
        .select("id, log_date, set_number, reps, weight, duration_seconds, notes")
        .eq("exercise_id", exerciseId)
        .order("log_date", { ascending: false })
        .order("set_number", { ascending: true });
      if (error) throw error;
      return data as Log[];
    },
  });

  const todayLogs = useMemo(() => logs?.filter((l) => l.log_date === today) ?? [], [logs, today]);
  const history = useMemo(() => {
    const grouped: Record<string, Log[]> = {};
    logs?.filter((l) => l.log_date !== today).forEach((l) => {
      grouped[l.log_date] = grouped[l.log_date] ?? [];
      grouped[l.log_date].push(l);
    });
    return Object.entries(grouped).slice(0, 10);
  }, [logs, today]);

  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [duration, setDuration] = useState("");

  const addSet = useMutation({
    mutationFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("No auth");
      const next = (todayLogs.at(-1)?.set_number ?? 0) + 1;
      const { error } = await supabase.from("exercise_logs").insert({
        exercise_id: exerciseId,
        user_id: u.user.id,
        log_date: today,
        set_number: next,
        reps: reps ? parseInt(reps) : null,
        weight: weight ? parseFloat(weight) : null,
        duration_seconds: duration ? parseInt(duration) : null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["logs", exerciseId] });
      toast.success("Serie registrada");
      setReps(""); setWeight(""); setDuration("");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Error"),
  });

  const deleteSet = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("exercise_logs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["logs", exerciseId] }),
  });

  return (
    <div className="space-y-6">
      {exercise && (
        <Link to="/day/$dayId" params={{ dayId: exercise.day_id }} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Volver
        </Link>
      )}

      {exercise && (
        <section className="space-y-2">
          {exercise.muscle && <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">{exercise.muscle}</p>}
          <h1 className="text-3xl sm:text-4xl font-bold">{exercise.name}</h1>
        </section>
      )}

      {/* Add set form */}
      <section className="rounded-2xl border bg-card p-5 space-y-4 glow-neon">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary" /> Nueva serie
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Reps</Label>
            <Input inputMode="numeric" value={reps} onChange={(e) => setReps(e.target.value)} placeholder="12" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Peso (kg)</Label>
            <Input inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="40" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Tiempo (s)</Label>
            <Input inputMode="numeric" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="60" />
          </div>
        </div>
        <Button
          className="w-full"
          onClick={() => addSet.mutate()}
          disabled={addSet.isPending || (!reps && !weight && !duration)}
        >
          <Check className="h-4 w-4" /> Guardar serie
        </Button>
      </section>

      {/* Today's sets */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Hoy · {todayLogs.length} {todayLogs.length === 1 ? "serie" : "series"}</h2>
        {todayLogs.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center rounded-xl border border-dashed">
            Aún no has registrado nada hoy.
          </p>
        )}
        <div className="space-y-2">
          {todayLogs.map((l) => (
            <div key={l.id} className="flex items-center gap-3 rounded-xl border bg-card p-3">
              <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                {l.set_number}
              </div>
              <div className="flex-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {l.reps != null && <span><strong>{l.reps}</strong> reps</span>}
                {l.weight != null && <span><strong>{l.weight}</strong> kg</span>}
                {l.duration_seconds != null && <span><strong>{l.duration_seconds}</strong> s</span>}
              </div>
              <button onClick={() => deleteSet.mutate(l.id)} className="p-2 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* History */}
      {history.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Historial</h2>
          <div className="space-y-3">
            {history.map(([date, sets]) => (
              <div key={date} className="rounded-xl border bg-card p-4">
                <div className="text-xs text-muted-foreground mb-2">
                  {new Date(date).toLocaleDateString("es", { weekday: "long", day: "numeric", month: "short" })}
                </div>
                <div className="space-y-1">
                  {sets.map((s) => (
                    <div key={s.id} className="text-sm flex gap-3">
                      <span className="text-primary font-semibold w-8">#{s.set_number}</span>
                      {s.reps != null && <span>{s.reps} reps</span>}
                      {s.weight != null && <span>· {s.weight} kg</span>}
                      {s.duration_seconds != null && <span>· {s.duration_seconds}s</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
