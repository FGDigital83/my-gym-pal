import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Apple, Utensils, Coffee, Cookie, Moon, Calculator, Sun, Check, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/_authenticated/nutrition")({
  component: NutritionPage,
});

type MealKey = "breakfast" | "breakfast2" | "lunch" | "snack" | "dinner";

type Item = { name: string; kcal: number; ingredients: string[] };

const MEALS: Record<MealKey, Item[]> = {
  breakfast: [
    { name: "Avena con plátano, nueces y miel", kcal: 420, ingredients: ["60 g de avena", "250 ml leche desnatada", "1 plátano (120 g)", "20 g de nueces", "10 g de miel"] },
    { name: "Tostadas integrales con aguacate y huevo", kcal: 450, ingredients: ["2 rebanadas de pan integral (80 g)", "1/2 aguacate (75 g)", "2 huevos M", "1 tomate (100 g)", "5 ml de AOVE"] },
    { name: "Yogur griego con frutos rojos y granola", kcal: 380, ingredients: ["200 g yogur griego 0%", "100 g frutos rojos", "40 g granola sin azúcar", "10 g miel"] },
    { name: "Tortilla francesa con espinacas y queso fresco", kcal: 350, ingredients: ["3 claras + 1 huevo entero", "60 g espinacas frescas", "30 g queso fresco batido", "1 rebanada integral (40 g)"] },
    { name: "Smoothie bowl proteico", kcal: 410, ingredients: ["1 plátano (120 g)", "150 g frutos rojos congelados", "30 g proteína whey", "30 g avena", "10 g semillas de chía"] },
    { name: "Pancakes proteicos de avena y plátano", kcal: 460, ingredients: ["50 g avena", "1 plátano", "2 huevos", "15 g proteína whey", "5 g canela", "10 g miel"] },
    { name: "Bol de skyr, kiwi y almendras", kcal: 340, ingredients: ["200 g skyr natural", "2 kiwis (150 g)", "20 g almendras", "20 g copos de maíz sin azúcar"] },
    { name: "Tostadas con tomate, jamón serrano y AOVE", kcal: 390, ingredients: ["2 rebanadas integrales (80 g)", "1 tomate maduro rallado (120 g)", "40 g jamón serrano", "10 ml AOVE"] },
    { name: "Porridge de avena con manzana y canela", kcal: 400, ingredients: ["60 g avena", "300 ml leche desnatada", "1 manzana (150 g)", "10 g pasas", "5 g canela"] },
    { name: "Wrap integral de huevo y aguacate", kcal: 480, ingredients: ["1 wrap integral (60 g)", "2 huevos revueltos", "1/2 aguacate", "30 g espinacas", "1 cdta de mostaza"] },
    { name: "Sándwich de pavo y queso fresco con tomate", kcal: 360, ingredients: ["2 rebanadas integrales (80 g)", "60 g pavo bajo en sal", "40 g queso fresco", "1 tomate (100 g)"] },
    { name: "Bowl de quinoa dulce con leche y frutos secos", kcal: 430, ingredients: ["70 g quinoa cocida", "250 ml leche desnatada", "20 g nueces", "10 g miel", "100 g fresas"] },
  ],
  breakfast2: [
    { name: "Pieza de fruta y un puñado de almendras", kcal: 180, ingredients: ["1 manzana o pera (150 g)", "15 g almendras crudas"] },
    { name: "Yogur natural con miel", kcal: 140, ingredients: ["1 yogur natural sin azúcar (125 g)", "10 g miel"] },
    { name: "Tostada pequeña con queso fresco y mermelada sin azúcar", kcal: 160, ingredients: ["1 rebanada integral (40 g)", "30 g queso fresco batido", "10 g mermelada sin azúcar"] },
    { name: "Café con leche y galletas de avena caseras", kcal: 200, ingredients: ["200 ml leche desnatada", "café solo", "2 galletas de avena caseras (30 g)"] },
    { name: "Batido suave de plátano y leche", kcal: 220, ingredients: ["1 plátano (120 g)", "250 ml leche desnatada", "5 g cacao puro"] },
    { name: "Mini bowl de frutas con yogur", kcal: 170, ingredients: ["100 g fresas", "1 kiwi", "1/2 plátano", "100 g yogur natural"] },
    { name: "Tostada con aguacate", kcal: 210, ingredients: ["1 rebanada integral (40 g)", "1/2 aguacate (75 g)", "limón y pimienta"] },
    { name: "Infusión + barrita casera de avena y dátiles", kcal: 180, ingredients: ["infusión sin azúcar", "1 barrita casera (40 g): avena, dátiles, almendras"] },
    { name: "Pequeño puñado de frutos secos y pasas", kcal: 190, ingredients: ["15 g almendras", "10 g nueces", "15 g pasas"] },
    { name: "Tortita de maíz con crema de cacahuete", kcal: 170, ingredients: ["2 tortitas de maíz (20 g)", "15 g crema de cacahuete 100%"] },
  ],
  lunch: [
    { name: "Arroz integral con pollo y verduras al wok", kcal: 600, ingredients: ["80 g arroz integral (en crudo)", "150 g pechuga de pollo", "100 g pimiento", "100 g brócoli", "100 g calabacín", "15 ml salsa de soja baja en sal", "5 ml AOVE"] },
    { name: "Salmón al horno con quinoa y espárragos", kcal: 620, ingredients: ["150 g salmón", "70 g quinoa (en crudo)", "150 g espárragos verdes", "10 ml AOVE", "1/2 limón"] },
    { name: "Lentejas estofadas con verduras", kcal: 550, ingredients: ["100 g lentejas (en crudo)", "1 zanahoria (80 g)", "1/2 cebolla (60 g)", "1 tomate (100 g)", "5 g pimentón", "10 ml AOVE"] },
    { name: "Pasta integral con atún y tomate natural", kcal: 580, ingredients: ["80 g pasta integral", "1 lata atún al natural (80 g escurrido)", "150 g tomate triturado natural", "20 g queso parmesano", "5 ml AOVE"] },
    { name: "Bowl de garbanzos, aguacate y huevo", kcal: 560, ingredients: ["150 g garbanzos cocidos", "1/2 aguacate (75 g)", "1 huevo cocido", "60 g espinacas", "80 g tomate cherry", "10 ml AOVE + vinagre"] },
    { name: "Pechuga de pavo con patata asada y ensalada", kcal: 540, ingredients: ["160 g pechuga de pavo", "200 g patata", "80 g lechugas variadas", "50 g zanahoria rallada", "10 ml AOVE"] },
    { name: "Bacalao con garbanzos y espinacas", kcal: 520, ingredients: ["150 g lomo de bacalao", "150 g garbanzos cocidos", "100 g espinacas", "1 diente de ajo", "10 ml AOVE"] },
    { name: "Hamburguesa casera de ternera magra con boniato", kcal: 600, ingredients: ["130 g ternera magra picada", "1 pan integral (60 g)", "200 g boniato asado", "1 hoja lechuga, tomate, cebolla", "5 ml AOVE"] },
    { name: "Arroz salteado con gambas y verduras", kcal: 580, ingredients: ["80 g arroz (en crudo)", "150 g gambas peladas", "1 huevo", "100 g guisantes y zanahoria", "10 ml salsa de soja"] },
    { name: "Ensalada completa de pollo, quinoa y aguacate", kcal: 560, ingredients: ["120 g pechuga de pollo", "60 g quinoa (en crudo)", "1/2 aguacate", "80 g tomate cherry", "60 g rúcula", "10 ml AOVE + limón"] },
    { name: "Tacos blandos integrales de pavo y verduras", kcal: 540, ingredients: ["3 tortitas integrales (90 g)", "130 g pavo picado", "80 g pimiento", "50 g cebolla", "30 g queso fresco", "guacamole 30 g"] },
    { name: "Crema de calabaza + merluza con arroz", kcal: 560, ingredients: ["300 g calabaza", "1 patata pequeña", "150 g merluza", "60 g arroz (en crudo)", "10 ml AOVE"] },
  ],
  snack: [
    { name: "Yogur natural con frutos secos", kcal: 220, ingredients: ["1 yogur natural sin azúcar (125 g)", "20 g almendras o nueces"] },
    { name: "Tostada integral con pavo y queso fresco", kcal: 200, ingredients: ["1 rebanada integral (40 g)", "40 g pavo (2 lonchas)", "30 g queso fresco batido", "1 rodaja de tomate"] },
    { name: "Batido de proteína con plátano", kcal: 250, ingredients: ["30 g proteína whey", "250 ml leche desnatada", "1 plátano (120 g)"] },
    { name: "Manzana con crema de cacahuete", kcal: 230, ingredients: ["1 manzana (180 g)", "15 g crema de cacahuete 100%"] },
    { name: "Hummus con palitos de zanahoria y pepino", kcal: 180, ingredients: ["60 g hummus casero", "1 zanahoria (80 g)", "1/2 pepino (100 g)"] },
    { name: "Bol de skyr con miel y nueces", kcal: 210, ingredients: ["170 g skyr natural", "10 g miel", "15 g nueces"] },
    { name: "Tortita de arroz con atún y tomate", kcal: 170, ingredients: ["2 tortitas de arroz (20 g)", "1 lata pequeña atún al natural (50 g escurrido)", "1/2 tomate"] },
    { name: "Mini bocadillo de pan integral con jamón cocido", kcal: 230, ingredients: ["1 mini pan integral (60 g)", "40 g jamón cocido extra", "20 g queso fresco", "tomate"] },
    { name: "Edamames con sal", kcal: 180, ingredients: ["150 g edamames con vaina", "2 g sal marina"] },
    { name: "Macedonia de frutas con yogur", kcal: 200, ingredients: ["1 manzana", "1 kiwi", "100 g fresas", "1 yogur natural (125 g)"] },
    { name: "Onza de chocolate negro 85% + almendras", kcal: 190, ingredients: ["20 g chocolate negro 85%", "15 g almendras"] },
    { name: "Requesón con miel y arándanos", kcal: 220, ingredients: ["150 g requesón", "10 g miel", "80 g arándanos"] },
  ],
  dinner: [
    { name: "Pechuga de pollo a la plancha con boniato y ensalada", kcal: 500, ingredients: ["150 g pollo", "150 g boniato asado", "80 g lechugas", "1 tomate", "10 ml AOVE"] },
    { name: "Merluza al horno con verduras asadas", kcal: 450, ingredients: ["180 g merluza", "100 g calabacín", "100 g pimiento", "60 g cebolla", "10 ml AOVE", "1/2 limón"] },
    { name: "Crema de calabacín + tortilla de 2 huevos", kcal: 420, ingredients: ["300 g calabacín", "1 patata pequeña (100 g)", "50 g puerro", "2 huevos", "30 g queso fresco"] },
    { name: "Wok de gambas con verduras y fideos de arroz", kcal: 480, ingredients: ["150 g gambas peladas", "50 g fideos de arroz", "100 g pimiento", "80 g zanahoria", "10 ml salsa de soja"] },
    { name: "Tortilla de claras con salmón ahumado", kcal: 380, ingredients: ["4 claras + 1 huevo", "80 g salmón ahumado", "60 g espinacas", "1 rebanada integral (40 g)"] },
    { name: "Dorada al horno con patata panadera", kcal: 470, ingredients: ["200 g dorada", "150 g patata", "60 g cebolla", "10 ml AOVE", "tomillo y limón"] },
    { name: "Ensalada templada de pollo y aguacate", kcal: 440, ingredients: ["120 g pechuga de pollo", "1/2 aguacate", "80 g lechugas", "80 g tomate cherry", "30 g maíz", "10 ml AOVE"] },
    { name: "Pavo al curry con arroz basmati", kcal: 510, ingredients: ["150 g pavo", "60 g arroz basmati (en crudo)", "100 ml leche de coco light", "5 g curry", "100 g verduras"] },
    { name: "Pizza casera integral de pollo y verduras", kcal: 520, ingredients: ["1 base integral fina (120 g)", "60 g tomate natural", "100 g pollo", "60 g mozzarella light", "60 g pimiento y rúcula"] },
    { name: "Crema de verduras + huevos a la plancha con jamón", kcal: 430, ingredients: ["300 g verduras variadas en crema", "2 huevos a la plancha", "30 g jamón serrano", "1 rebanada integral"] },
    { name: "Salmón a la plancha con espárragos y quinoa", kcal: 540, ingredients: ["150 g salmón", "150 g espárragos verdes", "60 g quinoa (en crudo)", "10 ml AOVE"] },
    { name: "Revuelto de champiñones, gambas y huevo", kcal: 400, ingredients: ["150 g champiñones", "100 g gambas peladas", "2 huevos", "1 rebanada integral", "5 ml AOVE"] },
  ],
};

const MEAL_TABS: { key: MealKey; label: string; icon: typeof Coffee }[] = [
  { key: "breakfast", label: "Desayuno", icon: Coffee },
  { key: "breakfast2", label: "Desayuno 2", icon: Sun },
  { key: "lunch", label: "Comida", icon: Utensils },
  { key: "snack", label: "Merienda", icon: Cookie },
  { key: "dinner", label: "Cena", icon: Moon },
];

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
            <Utensils className="h-4 w-4" /> {t("healthyFood")}
          </TabsTrigger>
          <TabsTrigger value="calc" className="gap-1.5">
            <Calculator className="h-4 w-4" /> {t("calorieCounter")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="food"><HealthyFood /></TabsContent>
        <TabsContent value="calc"><CalorieCounter /></TabsContent>
      </Tabs>
    </div>
  );
}

function HealthyFood() {
  // selected[meal] = Set of indices
  const [selected, setSelected] = useState<Record<MealKey, Set<number>>>({
    breakfast: new Set(), breakfast2: new Set(), lunch: new Set(), snack: new Set(), dinner: new Set(),
  });

  const toggle = (meal: MealKey, idx: number) => {
    setSelected((prev) => {
      const next = new Set(prev[meal]);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return { ...prev, [meal]: next };
    });
  };

  const reset = () => setSelected({
    breakfast: new Set(), breakfast2: new Set(), lunch: new Set(), snack: new Set(), dinner: new Set(),
  });

  const total = useMemo(() => {
    let t = 0;
    (Object.keys(MEALS) as MealKey[]).forEach((m) => {
      selected[m].forEach((i) => { t += MEALS[m][i].kcal; });
    });
    return t;
  }, [selected]);

  const totalItems = useMemo(
    () => (Object.keys(selected) as MealKey[]).reduce((acc, m) => acc + selected[m].size, 0),
    [selected],
  );

  return (
    <div className="space-y-4">
      <div className="sticky top-[112px] z-10 rounded-2xl border bg-card/95 backdrop-blur p-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Total seleccionado</p>
          <p className="font-bold text-xl">{total} <span className="text-xs text-muted-foreground">kcal</span> <span className="text-xs text-muted-foreground">· {totalItems} platos</span></p>
        </div>
        <Button variant="outline" size="sm" onClick={reset} disabled={totalItems === 0}>
          <RotateCcw className="h-4 w-4" /> Reiniciar
        </Button>
      </div>

      <Tabs defaultValue="breakfast" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 gap-1 h-auto p-1">
          {MEAL_TABS.map((m) => (
            <TabsTrigger key={m.key} value={m.key} className="text-[10px] sm:text-xs flex flex-col gap-0.5 py-1.5 px-1">
              <m.icon className="h-3.5 w-3.5" />
              <span className="leading-tight text-center">{m.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {MEAL_TABS.map((m) => {
          const items = MEALS[m.key];
          const mealTotal = Array.from(selected[m.key]).reduce((acc, i) => acc + items[i].kcal, 0);
          return (
            <TabsContent key={m.key} value={m.key} className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="font-semibold">{m.label} <span className="text-xs text-muted-foreground">({items.length} opciones)</span></h2>
                <span className="text-xs text-muted-foreground">Subtotal: <span className="font-mono font-semibold text-foreground">{mealTotal} kcal</span></span>
              </div>
              {items.map((item, i) => {
                const isOn = selected[m.key].has(i);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggle(m.key, i)}
                    className={`w-full text-left rounded-2xl border p-4 space-y-2 transition ${
                      isOn ? "border-primary bg-primary/5 ring-1 ring-primary" : "bg-card hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span className={`shrink-0 mt-0.5 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                          isOn ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-muted-foreground"
                        }`}>
                          {isOn ? <Check className="h-3.5 w-3.5" /> : i + 1}
                        </span>
                        <h3 className="font-semibold leading-tight">{item.name}</h3>
                      </div>
                      <span className="shrink-0 rounded-full bg-primary/15 text-primary text-xs font-mono px-2 py-0.5">
                        ~{item.kcal} kcal
                      </span>
                    </div>
                    <ul className="text-sm text-muted-foreground pl-9 list-disc space-y-0.5">
                      {item.ingredients.map((ing, k) => <li key={k}>{ing}</li>)}
                    </ul>
                  </button>
                );
              })}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}

type Sex = "male" | "female";
type Goal = "cut" | "bulk" | "lose" | "maintain";
type Activity = 1 | 2 | 3 | 4 | 5;

const ACTIVITY_FACTOR: Record<Activity, number> = { 1: 1.2, 2: 1.375, 3: 1.55, 4: 1.725, 5: 1.9 };

// Goal-specific profile: % adjust on TDEE, protein/fat per kg, meals/day, water L/kg, training advice
const GOAL_PROFILE: Record<Goal, {
  kcalPct: number; protein: number; fat: number; meals: number; waterMlPerKg: number;
  weeklyKgChange: number; // + or -
}> = {
  cut:      { kcalPct: -0.18, protein: 2.3, fat: 0.8, meals: 5, waterMlPerKg: 40, weeklyKgChange: -0.5 },
  bulk:     { kcalPct: +0.12, protein: 1.9, fat: 1.0, meals: 5, waterMlPerKg: 40, weeklyKgChange: +0.3 },
  lose:     { kcalPct: -0.22, protein: 2.4, fat: 0.7, meals: 4, waterMlPerKg: 45, weeklyKgChange: -0.7 },
  maintain: { kcalPct:  0.00, protein: 1.8, fat: 0.9, meals: 4, waterMlPerKg: 35, weeklyKgChange:  0.0 },
};

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
    bmr: number; tdee: number; kcal: number; p: number; c: number; f: number;
    waterL: number; meals: number; weeksToTarget: number | null; weeklyKg: number;
  }>(null);

  const calc = () => {
    const a = Number(age), h = Number(height), w = Number(weight), tw = Number(target);
    if (!a || !h || !w) return;
    const bmr = sex === "male" ? 10 * w + 6.25 * h - 5 * a + 5 : 10 * w + 6.25 * h - 5 * a - 161;
    const tdee = bmr * ACTIVITY_FACTOR[activity];
    const prof = GOAL_PROFILE[goal];
    const kcal = Math.max(1200, Math.round(tdee * (1 + prof.kcalPct)));
    const p = Math.round(w * prof.protein);
    const f = Math.round(w * prof.fat);
    const c = Math.max(0, Math.round((kcal - (p * 4 + f * 9)) / 4));
    const waterL = Math.round((w * prof.waterMlPerKg) / 100) / 10;
    let weeksToTarget: number | null = null;
    if (tw && prof.weeklyKgChange !== 0) {
      const diff = tw - w;
      // only show when sign matches goal direction
      if (Math.sign(diff) === Math.sign(prof.weeklyKgChange)) {
        weeksToTarget = Math.ceil(Math.abs(diff / prof.weeklyKgChange));
      }
    }
    setResult({ bmr: Math.round(bmr), tdee: Math.round(tdee), kcal, p, c, f, waterL, meals: prof.meals, weeksToTarget, weeklyKg: prof.weeklyKgChange });
  };

  // Meal split depending on number of meals
  const split = (kcal: number, meals: number) => {
    if (meals === 5) return [
      { name: "1. Desayuno", pct: 0.22 },
      { name: "2. Desayuno 2 / Media mañana", pct: 0.12 },
      { name: "3. Comida", pct: 0.30 },
      { name: "4. Merienda", pct: 0.13 },
      { name: "5. Cena", pct: 0.23 },
    ].map((m) => ({ ...m, kcal: Math.round(kcal * m.pct) }));
    return [
      { name: "1. Desayuno", pct: 0.27 },
      { name: "2. Comida", pct: 0.33 },
      { name: "3. Merienda", pct: 0.15 },
      { name: "4. Cena", pct: 0.25 },
    ].map((m) => ({ ...m, kcal: Math.round(kcal * m.pct) }));
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border bg-card p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>{t("sex")}</Label>
            <div className="flex gap-2">
              {(["male", "female"] as Sex[]).map((s) => (
                <button key={s} type="button" onClick={() => setSex(s)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition ${
                    sex === s ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"
                  }`}>{t(s)}</button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5"><Label>{t("age")}</Label><Input type="number" min={10} max={100} value={age} onChange={(e) => setAge(e.target.value)} /></div>
          <div className="space-y-1.5"><Label>{t("height")}</Label><Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} /></div>
          <div className="space-y-1.5"><Label>{t("weight")}</Label><Input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} /></div>
          <div className="space-y-1.5 col-span-2"><Label>{t("targetWeight")}</Label><Input type="number" step="0.1" value={target} onChange={(e) => setTarget(e.target.value)} /></div>
        </div>

        <div className="space-y-1.5">
          <Label>{t("activity")}</Label>
          <select value={activity} onChange={(e) => setActivity(Number(e.target.value) as Activity)}
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option value={1}>{t("act1")}</option><option value={2}>{t("act2")}</option>
            <option value={3}>{t("act3")}</option><option value={4}>{t("act4")}</option>
            <option value={5}>{t("act5")}</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <Label>{t("goal")}</Label>
          <div className="grid grid-cols-2 gap-2">
            {(["cut", "bulk", "lose", "maintain"] as Goal[]).map((g) => (
              <button key={g} type="button" onClick={() => setGoal(g)}
                className={`py-2 rounded-lg text-sm font-medium border transition ${
                  goal === g ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"
                }`}>{t(("goal" + g.charAt(0).toUpperCase() + g.slice(1)) as "goalCut")}</button>
            ))}
          </div>
        </div>

        <Button onClick={calc} className="w-full">
          <Calculator className="h-4 w-4" /> {t("calculate")}
        </Button>
      </div>

      {result && (
        <div className="rounded-2xl border bg-card p-5 space-y-5">
          <div>
            <h3 className="font-semibold text-lg">{t("yourPlan")}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Objetivo: <span className="font-semibold text-foreground">{t(("goal" + goal.charAt(0).toUpperCase() + goal.slice(1)) as "goalCut")}</span>
              {" · "}TMB {result.bmr} kcal · Gasto total {result.tdee} kcal
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat label={t("dailyCalories")} value={`${result.kcal}`} unit="kcal" />
            <Stat label={t("protein")} value={`${result.p}`} unit="g" />
            <Stat label={t("carbs")} value={`${result.c}`} unit="g" />
            <Stat label={t("fats")} value={`${result.f}`} unit="g" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Stat label="Agua diaria" value={`${result.waterL}`} unit="L" />
            <Stat label="Comidas/día" value={`${result.meals}`} unit="" />
            {result.weeksToTarget !== null && (
              <Stat label="Tiempo estimado" value={`${result.weeksToTarget}`} unit={`sem (${result.weeklyKg > 0 ? "+" : ""}${result.weeklyKg} kg/sem)`} />
            )}
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-sm">{t("mealsBreakdown")} ({result.meals} comidas)</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {split(result.kcal, result.meals).map((m, i) => (
                <li key={i} className="flex justify-between border-b border-border/40 py-1">
                  <span>{m.name}</span>
                  <span className="font-mono text-foreground">~{m.kcal} kcal · {Math.round(m.pct * 100)}%</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 pt-2 border-t">
            <h4 className="font-semibold text-sm">{t("tips")} para tu objetivo</h4>
            <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-5">
              {goal === "cut" && <>
                <li><strong>Déficit moderado (~18%)</strong> para perder grasa preservando masa muscular. Pérdida sana: 0,4-0,6 kg/sem.</li>
                <li><strong>Proteína alta (2,3 g/kg):</strong> reparte en 4-5 tomas de 30-45 g cada una para maximizar síntesis proteica.</li>
                <li><strong>Entrenamiento de fuerza 4-5 días</strong> con sobrecarga progresiva + 2-3 sesiones de cardio (LISS 30-40 min o HIIT 15-20 min).</li>
                <li>Verduras en comida y cena (mínimo 400 g/día) para saciedad y micronutrientes.</li>
                <li>Evita líquidos calóricos (refrescos, zumos, alcohol). Café/té sin azúcar libres.</li>
                <li>Refeed o día alto en hidratos cada 7-10 días si el progreso se estanca.</li>
              </>}
              {goal === "bulk" && <>
                <li><strong>Superávit controlado (~12%)</strong>: 200-400 kcal por encima del gasto para ganar músculo minimizando grasa. Subida sana: 0,2-0,4 kg/sem.</li>
                <li><strong>Proteína 1,9 g/kg</strong> repartida en 4-5 tomas. Hidratos altos pre y post entreno (40-80 g cada uno).</li>
                <li><strong>Fuerza 4-5 días/sem</strong> con rangos 6-12 reps, RIR 1-3, progresión semanal en peso o reps.</li>
                <li>Hidratos de calidad: arroz, pasta integral, patata, avena, pan integral, frutas.</li>
                <li>Grasas saludables: AOVE, frutos secos, aguacate, pescado azul 2-3 veces/sem.</li>
                <li>Descanso clave: 7-9 h de sueño y 1-2 días sin entrenar a la semana.</li>
              </>}
              {goal === "lose" && <>
                <li><strong>Déficit agresivo (~22%)</strong>: pensado para pérdida más rápida (0,6-0,8 kg/sem). No mantener &gt; 12 semanas seguidas.</li>
                <li><strong>Proteína muy alta (2,4 g/kg)</strong> para no perder músculo y aumentar saciedad.</li>
                <li>Grasas bajas (0,7 g/kg) priorizando AOVE, aguacate, frutos secos en pequeñas cantidades.</li>
                <li><strong>Cardio 4-5 días</strong> (mezcla LISS + HIIT) + fuerza 3 días para preservar masa muscular.</li>
                <li>Pesa los alimentos al menos las 2 primeras semanas para calibrar porciones.</li>
                <li>10.000 pasos diarios; el NEAT (actividad fuera del gym) marca la diferencia.</li>
                <li>Revisa peso y medidas semanalmente; ajusta -100 kcal si no bajas en 10-14 días.</li>
              </>}
              {goal === "maintain" && <>
                <li><strong>Mantenimiento calórico</strong>: come en torno a tu gasto. Vigila el peso semanalmente y ajusta ±100 kcal si te desvías.</li>
                <li><strong>Proteína 1,8 g/kg</strong> es suficiente para preservar masa muscular con entrenamiento de fuerza 3-4 días/sem.</li>
                <li>Reparto de macros equilibrado: 30% proteína, 40% hidratos, 30% grasas.</li>
                <li>Calidad &gt; cantidad: 80% alimentos frescos / 20% flexibilidad para vida social.</li>
                <li>Hidrátate (35 ml/kg) y duerme 7-9 h para regular hambre y rendimiento.</li>
                <li>Revisa composición corporal cada 4-6 semanas (foto + medidas), no solo el peso.</li>
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
