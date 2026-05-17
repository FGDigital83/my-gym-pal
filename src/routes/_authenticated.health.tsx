import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { HeartPulse } from "lucide-react";

export const Route = createFileRoute("/_authenticated/health")({
  component: HealthPage,
});

type Profile = { age: number | null; height_cm: number | null; weight_kg: number | null };

function HealthPage() {
  const { t } = useI18n();
  const qc = useQueryClient();
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["health_profile"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return null;
      const { data } = await supabase
        .from("health_profiles")
        .select("age, height_cm, weight_kg")
        .eq("user_id", u.user.id)
        .maybeSingle();
      return (data as Profile) ?? null;
    },
  });

  useEffect(() => {
    if (data) {
      setAge(data.age?.toString() ?? "");
      setHeight(data.height_cm?.toString() ?? "");
      setWeight(data.weight_kg?.toString() ?? "");
    }
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("No auth");
      const { error } = await supabase.from("health_profiles").upsert(
        {
          user_id: u.user.id,
          age: age ? Number(age) : null,
          height_cm: height ? Number(height) : null,
          weight_kg: weight ? Number(weight) : null,
        },
        { onConflict: "user_id" },
      );
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["health_profile"] });
      toast.success("OK");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Error"),
  });

  const h = Number(height);
  const w = Number(weight);
  const bmi = h > 0 && w > 0 ? w / Math.pow(h / 100, 2) : null;
  const category = bmi == null ? null : bmi < 18.5 ? "underweight" : bmi < 25 ? "normal" : bmi < 30 ? "overweight" : "obese";

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
        <Button onClick={() => save.mutate()} disabled={save.isPending || isLoading} className="w-full sm:w-auto">
          {t("save")}
        </Button>
      </div>

      <BmiChart bmi={bmi} t={t} category={category} userH={h} userW={w} />
    </div>
  );
}

function BmiChart({ bmi, t, category, userH, userW }: { bmi: number | null; t: (k: any) => string; category: string | null; userH: number; userW: number }) {
  // Linear plot: X = altura (cm) 140–210, Y = peso (kg) 30–150
  const hMin = 140, hMax = 210, wMin = 30, wMax = 150;
  const W = 360, H = 320, padL = 36, padB = 28, padT = 12, padR = 12;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const xOf = (h: number) => padL + ((h - hMin) / (hMax - hMin)) * plotW;
  const yOf = (w: number) => padT + (1 - (w - wMin) / (wMax - wMin)) * plotH;
  const wAt = (h: number, b: number) => b * Math.pow(h / 100, 2);
  const linePath = (b: number) => {
    const pts: string[] = [];
    for (let h = hMin; h <= hMax; h += 2) pts.push(`${xOf(h)},${yOf(wAt(h, b))}`);
    return "M" + pts.join(" L");
  };
  const areaPath = (bLow: number, bHigh: number) => {
    const top: string[] = [], bot: string[] = [];
    for (let h = hMin; h <= hMax; h += 2) {
      top.push(`${xOf(h)},${yOf(wAt(h, bHigh))}`);
      bot.push(`${xOf(h)},${yOf(wAt(h, bLow))}`);
    }
    return "M" + top.join(" L") + " L" + bot.reverse().join(" L") + " Z";
  };

  const validUser = userH >= hMin && userH <= hMax && userW >= wMin && userW <= wMax;

  const xTicks = [140, 150, 160, 170, 180, 190, 200, 210];
  const yTicks = [30, 50, 70, 90, 110, 130, 150];

  return (
    <div className="rounded-2xl border bg-card p-5 space-y-4">
      <h2 className="font-semibold">{t("bmiChartTitle")}</h2>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl mx-auto block" role="img" aria-label="BMI chart">
          {/* Grid */}
          {xTicks.map((h) => (
            <line key={`gx${h}`} x1={xOf(h)} x2={xOf(h)} y1={padT} y2={H - padB} stroke="hsl(var(--border))" strokeWidth={0.5} />
          ))}
          {yTicks.map((w) => (
            <line key={`gy${w}`} x1={padL} x2={W - padR} y1={yOf(w)} y2={yOf(w)} stroke="hsl(var(--border))" strokeWidth={0.5} />
          ))}
          {/* Axes */}
          <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="currentColor" strokeWidth={1} />
          <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="currentColor" strokeWidth={1} />

          {/* Ideal BMI band (18.5 – 25) in blue */}
          <path d={areaPath(18.5, 25)} fill="hsl(210 90% 55% / 0.25)" />
          <path d={linePath(18.5)} fill="none" stroke="hsl(210 90% 55%)" strokeWidth={1.5} strokeDasharray="4 3" />
          <path d={linePath(25)} fill="none" stroke="hsl(210 90% 55%)" strokeWidth={1.5} strokeDasharray="4 3" />
          <path d={linePath(22)} fill="none" stroke="hsl(210 90% 55%)" strokeWidth={2.5} />

          {/* User line (BMI iso-line) in red */}
          {bmi != null && (
            <path d={linePath(bmi)} fill="none" stroke="hsl(0 80% 55%)" strokeWidth={2.5} />
          )}
          {/* User point */}
          {validUser && (
            <>
              <line x1={xOf(userH)} x2={xOf(userH)} y1={yOf(userW)} y2={H - padB} stroke="hsl(0 80% 55%)" strokeWidth={1} strokeDasharray="3 3" />
              <line x1={padL} x2={xOf(userH)} y1={yOf(userW)} y2={yOf(userW)} stroke="hsl(0 80% 55%)" strokeWidth={1} strokeDasharray="3 3" />
              <circle cx={xOf(userH)} cy={yOf(userW)} r={5} fill="hsl(0 80% 55%)" stroke="white" strokeWidth={1.5} />
            </>
          )}

          {/* Tick labels */}
          {xTicks.map((h) => (
            <text key={`tx${h}`} x={xOf(h)} y={H - padB + 14} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.7}>{h}</text>
          ))}
          {yTicks.map((w) => (
            <text key={`ty${w}`} x={padL - 6} y={yOf(w) + 3} textAnchor="end" fontSize={10} fill="currentColor" opacity={0.7}>{w}</text>
          ))}
          <text x={W - padR} y={H - padB + 14} textAnchor="end" fontSize={10} fill="currentColor" opacity={0.6}>cm</text>
          <text x={padL - 6} y={padT + 4} textAnchor="end" fontSize={10} fill="currentColor" opacity={0.6}>kg</text>
        </svg>
      </div>

      <div className="flex flex-wrap gap-3 pt-2 border-t text-sm">
        <div className="flex items-center gap-2">
          <span className="h-3 w-6 rounded" style={{ background: "hsl(210 90% 55%)" }} />
          <span className="text-muted-foreground">{t("ideal")} (BMI 18.5 – 25)</span>
        </div>
        {bmi != null && (
          <div className="flex items-center gap-2">
            <span className="h-3 w-6 rounded" style={{ background: "hsl(0 80% 55%)" }} />
            <span className="text-muted-foreground">{t("you")}: {bmi.toFixed(1)} — {category && t(category)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

