import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, ChevronRight, Activity, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/day/$dayId")({
  component: DayPage,
});

type Day = { id: string; day_number: number; title: string; muscles: string[] };
type Exercise = { id: string; name: string; muscle: string | null; position: number };

function DayPage() {
  const { dayId } = Route.useParams();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [muscle, setMuscle] = useState<string>("");

  const { data: day } = useQuery({
    queryKey: ["day", dayId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workout_days")
        .select("id, day_number, title, muscles")
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
    mutationFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("No auth");
      const next = (exercises?.at(-1)?.position ?? 0) + 1;
      const { error } = await supabase.from("exercises").insert({
        day_id: dayId,
        user_id: u.user.id,
        name: name.trim(),
        muscle: muscle || null,
        position: next,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["exercises", dayId] });
      toast.success("Ejercicio añadido");
      setOpen(false);
      setName("");
      setMuscle("");
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

  return (
    <div className="space-y-6">
      <Link to="/plan" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Plan
      </Link>

      {day && (
        <section className="space-y-2">
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Día {day.day_number}</p>
          <h1 className="text-3xl sm:text-4xl font-bold">{day.title}</h1>
          <div className="flex flex-wrap gap-1.5 pt-2">
            {day.muscles.map((m) => (
              <span key={m} className="text-xs px-2.5 py-1 rounded-md bg-primary/15 text-primary font-medium">{m}</span>
            ))}
          </div>
        </section>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Ejercicios</h2>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> Añadir
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 rounded-xl bg-card animate-pulse" />)}
        </div>
      )}

      {!isLoading && exercises?.length === 0 && (
        <p className="text-sm text-muted-foreground py-8 text-center rounded-xl border border-dashed">
          Aún no hay ejercicios. Añade el primero.
        </p>
      )}

      <div className="space-y-2">
        {exercises?.map((ex, idx) => (
          <div key={ex.id} className="relative group">
            <Link
              to="/exercise/$exerciseId"
              params={{ exerciseId: ex.id }}
              className="flex items-center gap-4 rounded-xl border bg-card p-4 transition hover:border-primary"
            >
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center font-bold text-primary">
                {String(idx + 1).padStart(2, "0")}
              </div>
              <div className="flex-1 min-w-0 pr-8">
                <div className="font-semibold truncate">{ex.name}</div>
                {ex.muscle && <div className="text-xs text-muted-foreground">{ex.muscle}</div>}
              </div>
              <Activity className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </Link>
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
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo ejercicio</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Nombre</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Press de banca" />
            </div>
            <div className="space-y-2">
              <Label>Músculo (opcional)</Label>
              <div className="flex flex-wrap gap-2">
                {(day?.muscles ?? []).map((m) => {
                  const active = muscle === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMuscle(active ? "" : m)}
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
                {(day?.muscles ?? []).length === 0 && (
                  <span className="text-xs text-muted-foreground">Añade músculos al día desde el plan.</span>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={() => addExercise.mutate()} disabled={addExercise.isPending || !name.trim()}>
              Añadir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
