import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Apple, Utensils, Coffee, Cookie, Moon, Calculator } from "lucide-react";

export const Route = createFileRoute("/_authenticated/nutrition")({
  component: NutritionPage,
});

type MealKey = "breakfast" | "lunch" | "snack" | "dinner";

const MEALS: Record<MealKey, { name: string; kcal: number; desc: string }[]> = {
  breakfast: [
    { name: "Avena con plátano, nueces y miel", kcal: 420, desc: "60g de avena cocida con leche desnatada, 1 plátano, 20g de nueces y 1 cda de miel." },
    { name: "Tostadas integrales con aguacate y huevo", kcal: 450, desc: "2 rebanadas integrales, 1/2 aguacate, 2 huevos a la plancha, tomate y aceite de oliva." },
    { name: "Yogur griego con frutos rojos y granola", kcal: 380, desc: "200g de yogur griego 0%, 100g de fresas/arándanos, 40g de granola sin azúcar añadido." },
    { name: "Tortilla francesa con espinacas y queso fresco", kcal: 350, desc: "3 claras + 1 huevo, espinacas salteadas, 30g de queso fresco batido, 1 rebanada integral." },
    { name: "Smoothie bowl proteico", kcal: 410, desc: "1 plátano + 200g de frutos rojos congelados + 1 scoop de proteína + 30g de avena + topping de semillas." },
  ],
  lunch: [
    { name: "Arroz integral con pollo y verduras al wok", kcal: 600, desc: "80g de arroz integral, 150g pechuga de pollo, pimiento, brócoli, calabacín y salsa de soja baja en sal." },
    { name: "Salmón al horno con quinoa y espárragos", kcal: 620, desc: "150g de salmón, 70g de quinoa, espárragos verdes a la plancha, AOVE y limón." },
    { name: "Lentejas estofadas con verduras", kcal: 550, desc: "100g de lentejas (secas), zanahoria, cebolla, tomate, pimentón. Acompañar con ensalada verde." },
    { name: "Pasta integral con atún y tomate natural", kcal: 580, desc: "80g de pasta integral, 1 lata de atún al natural, salsa de tomate casera y un poco de queso parmesano." },
    { name: "Bowl de garbanzos, aguacate y huevo", kcal: 560, desc: "150g de garbanzos cocidos, 1/2 aguacate, 1 huevo cocido, espinacas, tomate cherry y vinagreta." },
  ],
  snack: [
    { name: "Yogur natural con frutos secos", kcal: 220, desc: "1 yogur natural sin azúcar + 20g de almendras o nueces." },
    { name: "Tostada integral con pavo y queso fresco", kcal: 200, desc: "1 rebanada integral, 2 lonchas de pavo, queso fresco y tomate." },
    { name: "Batido de proteína con plátano", kcal: 250, desc: "1 scoop de proteína + 250ml de leche desnatada + 1 plátano." },
    { name: "Manzana con crema de cacahuete", kcal: 230, desc: "1 manzana + 15g de crema de cacahuete 100%." },
    { name: "Hummus con palitos de zanahoria y pepino", kcal: 180, desc: "60g de hummus casero con verduras crudas." },
  ],
  dinner: [
    { name: "Pechuga de pollo a la plancha con boniato y ensalada", kcal: 500, desc: "150g de pollo, 150g de boniato asado, ensalada de hojas verdes con AOVE." },
    { name: "Merluza al horno con verduras asadas", kcal: 450, desc: "180g de merluza, calabacín, pimiento y cebolla al horno con limón y AOVE." },
    { name: "Crema de calabacín + tortilla de 2 huevos", kcal: 420, desc: "Crema casera con calabacín, puerro y patata; tortilla con 2 huevos y queso fresco." },
    { name: "Wok de gambas con verduras y fideos de arroz", kcal: 480, desc: "150g de gambas, 50g de fideos de arroz, pimiento, zanahoria y salsa de soja." },
    { name: "Tortilla de claras con salmón ahumado", kcal: 380, desc: "4 claras + 1 huevo, 80g de salmón ahumado, espinacas y 1 rebanada integral." },
  ],
};

function NutritionPage() {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold flex items-center gap-1.5">
          <Apple className="h-3.5 w-3.5" /> {t("nutrition")}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold">{t("nutrition")}</h1>
      </section>

      <Tabs defaultValue="food" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="food" className="gap-1.5">
            <Utensils className="h-4 w-4" />
            {t("healthyFood")}
          </TabsTrigger>
          <TabsTrigger value="calc" className="gap-1.5">
            <Calculator className="h-4 w-4" />
            {t("calorieCounter")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="food">
          <HealthyFood />
        </TabsContent>
        <TabsContent value="calc">
          <CalorieCounter />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function HealthyFood() {
  const { t } = useI18n();
  const meals: { key: MealKey; icon: typeof Coffee }[] = [
    { key: "breakfast", icon: Coffee },
    { key: "lunch", icon: Utensils },
    { key: "snack", icon: Cookie },
    { key: "dinner", icon: Moon },
  ];
  return (
    <Tabs defaultValue="breakfast" className="space-y-4">
      <TabsList className="grid w-full grid-cols-4">
        {meals.map((m) => (
          <TabsTrigger key={m.key} value={m.key} className="text-xs sm:text-sm gap-1">
            <m.icon className="h-3.5 w-3.5" />
            <span className="hidden xs:inline sm:inline">{t(m.key)}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      {meals.map((m) => (
        <TabsContent key={m.key} value={m.key} className="space-y-3">
          {MEALS[m.key].map((item, i) => (
            <div key={i} className="rounded-2xl border bg-card p-4 space-y-1.5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold leading-tight">{item.name}</h3>
                <span className="shrink-0 rounded-full bg-primary/15 text-primary text-xs font-mono px-2 py-0.5">
                  ~{item.kcal} kcal
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </TabsContent>
      ))}
    </Tabs>
  );
}

type Sex = "male" | "female";
type Goal = "cut" | "bulk" | "lose" | "maintain";
type Activity = 1 | 2 | 3 | 4 | 5;

const ACTIVITY_FACTOR: Record<Activity, number> = { 1: 1.2, 2: 1.375, 3: 1.55, 4: 1.725, 5: 1.9 };
const GOAL_ADJUST: Record<Goal, number> = { cut: -400, bulk: 350, lose: -550, maintain: 0 };
const PROTEIN_PER_KG: Record<Goal, number> = { cut: 2.2, bulk: 2.0, lose: 2.4, maintain: 1.8 };
const FAT_PER_KG: Record<Goal, number> = { cut: 0.8, bulk: 1.0, lose: 0.7, maintain: 0.9 };

function CalorieCounter() {
  const { t } = useI18n();
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [target, setTarget] = useState("");
  const [activity, setActivity] = useState<Activity>(3);
  const [goal, setGoal] = useState<Goal>("maintain");
  const [result, setResult] = useState<null | {
    kcal: number; p: number; c: number; f: number;
  }>(null);

  const calc = () => {
    const a = Number(age), h = Number(height), w = Number(weight);
    if (!a || !h || !w) return;
    // Mifflin-St Jeor
    const bmr = sex === "male" ? 10 * w + 6.25 * h - 5 * a + 5 : 10 * w + 6.25 * h - 5 * a - 161;
    const tdee = bmr * ACTIVITY_FACTOR[activity];
    const kcal = Math.max(1200, Math.round(tdee + GOAL_ADJUST[goal]));
    const p = Math.round(w * PROTEIN_PER_KG[goal]);
    const f = Math.round(w * FAT_PER_KG[goal]);
    const kcalFromPF = p * 4 + f * 9;
    const c = Math.max(0, Math.round((kcal - kcalFromPF) / 4));
    setResult({ kcal, p, c, f });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border bg-card p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>{t("sex")}</Label>
            <div className="flex gap-2">
              {(["male", "female"] as Sex[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSex(s)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition ${
                    sex === s ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"
                  }`}
                >{t(s)}</button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>{t("age")}</Label>
            <Input type="number" min={10} max={100} value={age} onChange={(e) => setAge(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{t("height")}</Label>
            <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{t("weight")}</Label>
            <Input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </div>
          <div className="space-y-1.5 col-span-2">
            <Label>{t("targetWeight")}</Label>
            <Input type="number" step="0.1" value={target} onChange={(e) => setTarget(e.target.value)} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>{t("activity")}</Label>
          <select
            value={activity}
            onChange={(e) => setActivity(Number(e.target.value) as Activity)}
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value={1}>{t("act1")}</option>
            <option value={2}>{t("act2")}</option>
            <option value={3}>{t("act3")}</option>
            <option value={4}>{t("act4")}</option>
            <option value={5}>{t("act5")}</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <Label>{t("goal")}</Label>
          <div className="grid grid-cols-2 gap-2">
            {(["cut", "bulk", "lose", "maintain"] as Goal[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGoal(g)}
                className={`py-2 rounded-lg text-sm font-medium border transition ${
                  goal === g ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"
                }`}
              >{t(("goal" + g.charAt(0).toUpperCase() + g.slice(1)) as "goalCut")}</button>
            ))}
          </div>
        </div>

        <Button onClick={calc} className="w-full">
          <Calculator className="h-4 w-4" />
          {t("calculate")}
        </Button>
      </div>

      {result && (
        <div className="rounded-2xl border bg-card p-5 space-y-4">
          <h3 className="font-semibold text-lg">{t("yourPlan")}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat label={t("dailyCalories")} value={`${result.kcal}`} unit="kcal" />
            <Stat label={t("protein")} value={`${result.p}`} unit="g" />
            <Stat label={t("carbs")} value={`${result.c}`} unit="g" />
            <Stat label={t("fats")} value={`${result.f}`} unit="g" />
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-sm">{t("mealsBreakdown")}</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• {t("breakfast")}: ~{Math.round(result.kcal * 0.25)} kcal</li>
              <li>• {t("lunch")}: ~{Math.round(result.kcal * 0.35)} kcal</li>
              <li>• {t("snack")}: ~{Math.round(result.kcal * 0.15)} kcal</li>
              <li>• {t("dinner")}: ~{Math.round(result.kcal * 0.25)} kcal</li>
            </ul>
          </div>

          <div className="space-y-2 pt-2 border-t">
            <h4 className="font-semibold text-sm">{t("tips")}</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
              {goal === "cut" && <>
                <li>Prioriza proteína magra en cada comida (pollo, pavo, pescado, huevos, tofu).</li>
                <li>Verduras en comida y cena, llena el plato de fibra.</li>
                <li>Hidrátate: 2-3 litros de agua al día.</li>
              </>}
              {goal === "bulk" && <>
                <li>Añade hidratos de calidad: arroz, pasta integral, patata, avena.</li>
                <li>Reparte 4-5 comidas al día para llegar a las calorías sin pesadez.</li>
                <li>Entrena con sobrecarga progresiva 4-5 días/semana.</li>
              </>}
              {goal === "lose" && <>
                <li>Déficit moderado: pierde 0,5-0,8 kg por semana, no más.</li>
                <li>Cardio 3-4 veces/semana + fuerza para mantener masa muscular.</li>
                <li>Evita líquidos calóricos (refrescos, zumos, alcohol).</li>
              </>}
              {goal === "maintain" && <>
                <li>Mantén una rutina constante de comidas y entrenos.</li>
                <li>Vigila el peso semanalmente y ajusta ±100 kcal si hace falta.</li>
                <li>Calidad &gt; cantidad: alimentos frescos y poco procesados.</li>
              </>}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="rounded-xl border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-bold text-xl">{value}<span className="text-xs text-muted-foreground ml-1">{unit}</span></p>
    </div>
  );
}
