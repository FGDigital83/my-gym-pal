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

      <BmiChart bmi={bmi} t={t} category={category} />
    </div>
  );
}

function BmiChart({ bmi, t, category }: { bmi: number | null; t: (k: any) => string; category: string | null }) {
  // Scale: 12 to 40 BMI
  const min = 12;
  const max = 40;
  const pct = (v: number) => ((Math.max(min, Math.min(max, v)) - min) / (max - min)) * 100;

  const segments = [
    { from: 12, to: 18.5, label: t("underweight"), color: "hsl(45 95% 55%)" },
    { from: 18.5, to: 25, label: t("normal"), color: "hsl(210 90% 55%)" }, // ideal — blue
    { from: 25, to: 30, label: t("overweight"), color: "hsl(30 90% 55%)" },
    { from: 30, to: 40, label: t("obese"), color: "hsl(0 80% 55%)" },
  ];

  return (
    <div className="rounded-2xl border bg-card p-5 space-y-4">
      <h2 className="font-semibold">{t("bmiChartTitle")}</h2>

      <div className="space-y-2">
        <div className="relative h-8 rounded-full overflow-hidden border">
          {segments.map((s) => (
            <div
              key={s.label}
              className="absolute top-0 bottom-0"
              style={{
                left: `${pct(s.from)}%`,
                width: `${pct(s.to) - pct(s.from)}%`,
                background: s.label === t("normal") ? s.color : `${s.color}40`,
              }}
              title={s.label}
            />
          ))}
          {bmi != null && (
            <>
              <div
                className="absolute top-[-4px] bottom-[-4px] w-1 rounded-full bg-red-600 shadow-lg"
                style={{ left: `calc(${pct(bmi)}% - 2px)` }}
              />
              <div
                className="absolute -top-7 text-[10px] font-bold text-red-600 px-1.5 py-0.5 rounded bg-background border border-red-600"
                style={{ left: `calc(${pct(bmi)}% - 16px)` }}
              >
                {bmi.toFixed(1)}
              </div>
            </>
          )}
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>12</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2 p-2 rounded-lg border">
            <span className="h-3 w-3 rounded-full" style={{ background: s.color }} />
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {bmi != null && (
        <div className="flex flex-wrap gap-3 pt-2 border-t">
          <div className="flex items-center gap-2 text-sm">
            <span className="h-3 w-6 rounded" style={{ background: "hsl(210 90% 55%)" }} />
            <span className="text-muted-foreground">{t("ideal")} (18.5 – 25)</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="h-3 w-6 rounded bg-red-600" />
            <span className="text-muted-foreground">{t("you")}: {bmi.toFixed(1)} — {category && t(category)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
