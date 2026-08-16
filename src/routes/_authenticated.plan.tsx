import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChevronRight, Calendar, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { MUSCLES, type Muscle } from "@/lib/muscles";
import { defaultExercisesFor } from "@/lib/exercise-catalog";
import { TrainingTabs } from "@/components/TrainingTabs";

export const Route = createFileRoute("/_authenticated/plan")({
  component: PlanPage,
});

type Day = { id: string; day_number: number; title: string; muscles: string[]; created_at: string };

function PlanPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const { data: days, isLoading } = useQuery({
    queryKey: ["workout_days"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workout_days")
        .select("id, day_number, title, muscles, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Day[];
    },
  });

  const createDay = useMutation({
    mutationFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("No auth");
      const next = ((days?.[0]?.day_number) ?? 0) + 1;
      const d = new Date();
      const today = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getFullYear()).slice(-2)}`;
      const { data: created, error } = await supabase
        .from("workout_days")
        .insert({
          user_id: u.user.id,
          day_number: next,
          title: title.trim() || today,
          muscles: selected,
        })
        .select("id")
        .single();
      if (error) throw error;
      // Ejercicios recomendados automáticamente para cada músculo elegido
      const rows: { day_id: string; user_id: string; name: string; muscle: string; position: number }[] = [];
      let pos = 1;
      for (const m of selected) {
        for (const name of defaultExercisesFor(m as Muscle)) {
          rows.push({ day_id: created.id, user_id: u.user.id, name, muscle: m, position: pos++ });
        }
      }
      if (rows.length) await supabase.from("exercises").insert(rows);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["workout_days"] });
      toast.success("Día creado");
      setOpen(false);
      setTitle("");
      setSelected([]);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Error"),
  });

  const deleteDay = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("exercise_logs").delete().in(
        "exercise_id",
        (await supabase.from("exercises").select("id").eq("day_id", id)).data?.map((e) => e.id) ?? [],
      );
      await supabase.from("exercises").delete().eq("day_id", id);
      const { error } = await supabase.from("workout_days").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["workout_days"] });
      toast.success("Día eliminado");
    },
  });

  const toggleMuscle = (m: string) =>
    setSelected((s) => (s.includes(m) ? s.filter((x) => x !== m) : [...s, m]));

  return (
    <div className="space-y-6">
      <TrainingTabs />
      <section className="space-y-1">
        <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Tu rutina</p>
        <h1 className="text-3xl sm:text-4xl font-bold">Plan semanal</h1>
        <p className="text-muted-foreground">Crea tus días y elige los músculos a entrenar.</p>
      </section>

      <Button onClick={() => setOpen(true)} className="w-full">
        <Plus className="h-4 w-4" /> Nuevo día
      </Button>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-card animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && days?.length === 0 && (
        <p className="text-sm text-muted-foreground py-8 text-center rounded-xl border border-dashed">
          Aún no tienes días. Crea el primero para empezar.
        </p>
      )}

      <div className="space-y-3">
        {days?.map((day) => (
          <div key={day.id} className="relative group">
            <Link
              to="/day/$dayId"
              params={{ dayId: day.id }}
              className="block rounded-2xl border bg-card p-5 transition hover:border-primary hover:glow-neon"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0 pr-8">
                  <div className="flex items-center gap-2 text-xs text-primary font-semibold uppercase tracking-wider">
                    <Calendar className="h-3.5 w-3.5" />
                    {(() => { const d = new Date(day.created_at); return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getFullYear()).slice(-2)}`; })()}
                  </div>
                  <h2 className="mt-1 text-xl font-bold leading-tight">
                    {day.muscles.length === 0 ? "Sin músculos" : day.muscles.join(" · ")}
                  </h2>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition shrink-0" />
              </div>
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                if (confirm(`¿Eliminar "${day.title}" y todos sus ejercicios?`)) deleteDay.mutate(day.id);
              }}
              className="absolute top-3 right-3 p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              aria-label="Eliminar día"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo día</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Nombre</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej. Empuje, Pierna..." />
            </div>
            <div className="space-y-2">
              <Label>Músculos a entrenar</Label>
              <div className="flex flex-wrap gap-2">
                {MUSCLES.map((m) => {
                  const active = selected.includes(m);
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => toggleMuscle(m)}
                      className={`text-xs px-3 py-1.5 rounded-md border transition ${
                        active
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card text-foreground border-border hover:border-primary"
                      }`}
                    >
                      {active && <X className="inline h-3 w-3 mr-1" />}
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={() => createDay.mutate()} disabled={createDay.isPending}>
              Crear día
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
