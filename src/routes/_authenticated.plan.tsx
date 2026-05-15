import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChevronRight, Calendar } from "lucide-react";

export const Route = createFileRoute("/_authenticated/plan")({
  component: PlanPage,
});

type Day = { id: string; day_number: number; title: string; muscles: string[] };

function PlanPage() {
  const { data: days, isLoading } = useQuery({
    queryKey: ["workout_days"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workout_days")
        .select("id, day_number, title, muscles")
        .order("day_number", { ascending: true });
      if (error) throw error;
      return data as Day[];
    },
  });

  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Tu rutina</p>
        <h1 className="text-3xl sm:text-4xl font-bold">Plan semanal</h1>
        <p className="text-muted-foreground">Elige el día que vas a entrenar.</p>
      </section>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-card animate-pulse" />
          ))}
        </div>
      )}

      <div className="space-y-3">
        {days?.map((day) => (
          <Link
            key={day.id}
            to="/day/$dayId"
            params={{ dayId: day.id }}
            className="group block rounded-2xl border bg-card p-5 transition hover:border-primary hover:glow-neon"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs text-primary font-semibold uppercase tracking-wider">
                  <Calendar className="h-3.5 w-3.5" />
                  Día {day.day_number}
                </div>
                <h2 className="mt-1 text-xl font-bold truncate">{day.title}</h2>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {day.muscles.map((m) => (
                    <span key={m} className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">{m}</span>
                  ))}
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
