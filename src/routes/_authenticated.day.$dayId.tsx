import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, ChevronRight, Activity } from "lucide-react";

export const Route = createFileRoute("/_authenticated/day/$dayId")({
  component: DayPage,
});

type Day = { id: string; day_number: number; title: string; muscles: string[] };
type Exercise = { id: string; name: string; muscle: string | null; position: number };

function DayPage() {
  const { dayId } = Route.useParams();

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

      <div className="space-y-1">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Ejercicios</h2>
      </div>

      {isLoading && (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-16 rounded-xl bg-card animate-pulse" />)}
        </div>
      )}

      <div className="space-y-2">
        {exercises?.map((ex, idx) => (
          <Link
            key={ex.id}
            to="/exercise/$exerciseId"
            params={{ exerciseId: ex.id }}
            className="group flex items-center gap-4 rounded-xl border bg-card p-4 transition hover:border-primary"
          >
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center font-bold text-primary">
              {String(idx + 1).padStart(2, "0")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{ex.name}</div>
              {ex.muscle && <div className="text-xs text-muted-foreground">{ex.muscle}</div>}
            </div>
            <Activity className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
          </Link>
        ))}
      </div>
    </div>
  );
}
