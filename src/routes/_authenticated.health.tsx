import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { HeartPulse, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/health")({
  component: HealthPage,
});

type Log = {
  id: string;
  log_date: string;
  age: number | null;
  height_cm: number | null;
  weight_kg: number | null;
  bmi: number | null;
};

const fmt = (iso: string) => {
  const d = new Date(iso + "T00:00:00");
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getFullYear()).slice(-2)}`;
};

function HealthPage() {
  const { t } = useI18n();
  const qc = useQueryClient();
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const { data: logs, isLoading } = useQuery({
    queryKey: ["health_logs"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return [];
      const { data, error } = await supabase
        .from("health_logs")
        .select("id, log_date, age, height_cm, weight_kg, bmi")
        .eq("user_id", u.user.id)
        .order("log_date", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Log[];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("No auth");
      const h = Number(height), w = Number(weight);
      const bmi = h > 0 && w > 0 ? Number((w / Math.pow(h / 100, 2)).toFixed(2)) : null;
      const { error } = await supabase.from("health_logs").insert({
        user_id: u.user.id,
        log_date: new Date().toISOString().slice(0, 10),
        age: age ? Number(age) : null,
        height_cm: h || null,
        weight_kg: w || null,
        bmi,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["health_logs"] });
      toast.success("OK");
      setWeight("");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Error"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("health_logs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["health_logs"] }),
  });

  const latest = logs?.[0];
  const currentBmi = latest?.bmi ?? null;
  const category =
    currentBmi == null
      ? null
      : currentBmi < 18.5
        ? "underweight"
        : currentBmi < 25
          ? "normal"
          : currentBmi < 30
            ? "overweight"
            : "obese";

  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold flex items-center gap-1.5">
          <HeartPulse className="h-3.5 w-3.5" /> {t("health")}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold">{t("bmi")}</h1>
        <p className="text-muted-foreground">{t("healthIntro")}</p>
      </section>

      <div className="rounded-2xl border bg-card p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>{t("age")}</Label>
            <Input type="number" min={1} max={120} value={age} onChange={(e) => setAge(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{t("height")}</Label>
            <Input type="number" min={50} max={260} value={height} onChange={(e) => setHeight(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{t("weight")}</Label>
            <Input type="number" min={20} max={400} step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </div>
        </div>
        <Button onClick={() => save.mutate()} disabled={save.isPending || isLoading || !height || !weight} className="w-full sm:w-auto">
          {t("save")}
        </Button>
        {currentBmi != null && (
          <p className="text-sm text-muted-foreground">
            {t("you")}: <span className="font-semibold text-foreground">{currentBmi.toFixed(1)}</span>
            {category && <> — {t(category)}</>}
          </p>
        )}
      </div>

      <BmiEvolutionChart logs={logs ?? []} />

      <div className="rounded-2xl border bg-card p-5 space-y-3">
        <h2 className="font-semibold">Historial</h2>
        {(!logs || logs.length === 0) && (
          <p className="text-sm text-muted-foreground">Aún no hay registros.</p>
        )}
        <ul className="divide-y">
          {logs?.map((l) => (
            <li key={l.id} className="flex items-center justify-between py-2 text-sm">
              <span className="font-mono text-primary">{fmt(l.log_date)}</span>
              <span className="text-muted-foreground">
                {l.weight_kg ?? "-"} kg · {l.height_cm ?? "-"} cm
              </span>
              <span className="font-semibold w-14 text-right">{l.bmi?.toFixed(1) ?? "-"}</span>
              <button
                onClick={() => remove.mutate(l.id)}
                className="ml-2 p-1 text-muted-foreground hover:text-destructive"
                aria-label="Eliminar"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function BmiEvolutionChart({ logs }: { logs: Log[] }) {
  const points = logs
    .filter((l) => l.bmi != null)
    .map((l) => ({ date: l.log_date, bmi: l.bmi as number }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const W = 600, H = 280, padL = 40, padB = 36, padT = 16, padR = 12;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const yMin = 15, yMax = 35;
  const yOf = (b: number) => padT + (1 - (Math.min(yMax, Math.max(yMin, b)) - yMin) / (yMax - yMin)) * plotH;
  const xOf = (i: number) => padL + (points.length <= 1 ? plotW / 2 : (i / (points.length - 1)) * plotW);

  const yTicks = [15, 18.5, 25, 30, 35];
  const idealTop = yOf(18.5);
  const idealBot = yOf(25);

  return (
    <div className="rounded-2xl border bg-card p-5 space-y-3">
      <h2 className="font-semibold">Evolución del IMC</h2>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full block" role="img" aria-label="BMI evolution">
          {/* Ideal band */}
          <rect x={padL} y={idealTop} width={plotW} height={idealBot - idealTop} fill="hsl(210 90% 55% / 0.18)" />
          <line x1={padL} x2={W - padR} y1={idealTop} y2={idealTop} stroke="hsl(210 90% 55%)" strokeDasharray="4 3" strokeWidth={1} />
          <line x1={padL} x2={W - padR} y1={idealBot} y2={idealBot} stroke="hsl(210 90% 55%)" strokeDasharray="4 3" strokeWidth={1} />

          {/* Axes */}
          <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="currentColor" strokeWidth={1} />
          <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="currentColor" strokeWidth={1} />

          {yTicks.map((y) => (
            <g key={y}>
              <line x1={padL} x2={W - padR} y1={yOf(y)} y2={yOf(y)} stroke="hsl(var(--border))" strokeWidth={0.5} />
              <text x={padL - 6} y={yOf(y) + 3} textAnchor="end" fontSize={10} fill="currentColor" opacity={0.7}>{y}</text>
            </g>
          ))}

          {/* Line */}
          {points.length > 1 && (
            <path
              d={"M" + points.map((p, i) => `${xOf(i)},${yOf(p.bmi)}`).join(" L")}
              fill="none"
              stroke="hsl(0 80% 55%)"
              strokeWidth={2.5}
            />
          )}
          {/* Points + date labels */}
          {points.map((p, i) => (
            <g key={p.date + i}>
              <circle cx={xOf(i)} cy={yOf(p.bmi)} r={4} fill="hsl(0 80% 55%)" stroke="white" strokeWidth={1.5} />
              <text x={xOf(i)} y={H - padB + 14} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.7}>
                {fmt(p.date)}
              </text>
            </g>
          ))}

          {points.length === 0 && (
            <text x={W / 2} y={H / 2} textAnchor="middle" fontSize={12} fill="currentColor" opacity={0.6}>
              Añade tu primer registro
            </text>
          )}
        </svg>
      </div>
      <div className="flex flex-wrap gap-3 text-sm pt-2 border-t">
        <div className="flex items-center gap-2">
          <span className="h-3 w-6 rounded" style={{ background: "hsl(210 90% 55% / 0.5)" }} />
          <span className="text-muted-foreground">Rango ideal (18.5 – 25)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-6 rounded" style={{ background: "hsl(0 80% 55%)" }} />
          <span className="text-muted-foreground">Tu IMC</span>
        </div>
      </div>
    </div>
  );
}
