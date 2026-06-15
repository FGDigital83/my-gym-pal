import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useI18n, type LangCode } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Apple, Utensils, Coffee, Cookie, Moon, Calculator, Sun, Check, RotateCcw, ChevronDown,
  Sparkles, ListChecks,
} from "lucide-react";
import {
  POOL, DEFAULT_MEALS, PREF_TAGS, generatePreferredMeals, formatIngredient,
  pickLang, tn, tRecipe, lookupDensity, TIPS,
  type Tag, type Ingredient, type Item, type MealKey, type Lang6, type PrefCategory, type Goal,
} from "@/lib/nutrition";

export const Route = createFileRoute("/_authenticated/nutrition")({
  component: NutritionPage,
});

/* ============================================================================
   Tipos de estado
   ============================================================================ */
type ManualIng = { food: string; qty: number; unit: "g" | "ml" | "pcs"; kcal: number };
type IngState = Ingredient & { manual?: ManualIng };
type ItemState = { name: Item["name"]; ingredients: IngState[]; auto?: boolean };
type MealsState = Record<MealKey, ItemState[]>;
type PrefState = Record<MealKey, Set<Tag>>;

const MEAL_TABS: { key: MealKey; icon: typeof Coffee; pct: number }[] = [
  { key: "breakfast",  icon: Coffee,   pct: 0.22 },
  { key: "breakfast2", icon: Sun,      pct: 0.12 },
  { key: "lunch",      icon: Utensils, pct: 0.32 },
  { key: "snack",      icon: Cookie,   pct: 0.12 },
  { key: "dinner",     icon: Moon,     pct: 0.22 },
];

const MEAL_KEYS: MealKey[] = ["breakfast", "breakfast2", "lunch", "snack", "dinner"];

function ingKcal(ing: IngState): number {
  if (ing.manual) return ing.manual.kcal;
  return POOL[ing.tag][ing.index].kcal;
}
function itemKcal(item: ItemState): number {
  return item.ingredients.reduce((s, i) => s + ingKcal(i), 0);
}

function defaultMealsState(): MealsState {
  return Object.fromEntries(
    MEAL_KEYS.map((k) => [
      k,
      DEFAULT_MEALS[k].map((it) => ({
        name: it.name,
        ingredients: it.ingredients.map((i) => ({ ...i })),
      })),
    ]),
  ) as MealsState;
}
function emptyPrefs(): PrefState {
  return { breakfast: new Set(), breakfast2: new Set(), lunch: new Set(), snack: new Set(), dinner: new Set() };
}
function emptySelection(): Record<MealKey, Set<number>> {
  return { breakfast: new Set(), breakfast2: new Set(), lunch: new Set(), snack: new Set(), dinner: new Set() };
}

function NutritionPage() {
  const { t, lang } = useI18n();
  const L = pickLang(lang as LangCode);
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
          <TabsTrigger value="food" className="gap-1.5"><Utensils className="h-4 w-4" /> {t("healthyFood")}</TabsTrigger>
          <TabsTrigger value="calc" className="gap-1.5"><Calculator className="h-4 w-4" /> {t("calorieCounter")}</TabsTrigger>
        </TabsList>

        <TabsContent value="food"><HealthyFood lang={L} /></TabsContent>
        <TabsContent value="calc"><CalorieCounter lang={L} /></TabsContent>
      </Tabs>
    </div>
  );
}

/* ============================ COMIDA SALUDABLE ============================ */
function HealthyFood({ lang }: { lang: Lang6 }) {
  const [defaults] = useState<MealsState>(() => defaultMealsState());
  const [autos, setAutos] = useState<Record<MealKey, ItemState[]>>(() =>
    Object.fromEntries(MEAL_KEYS.map((k) => [k, []])) as unknown as Record<MealKey, ItemState[]>,
  );
  const [meals, setMeals] = useState<MealsState>(() => defaultMealsState());
  const [prefs, setPrefs] = useState<PrefState>(emptyPrefs);
  const [selected, setSelected] = useState<Record<MealKey, Set<number>>>(emptySelection);

  // 14 = autos (4 if any pref) + 10 defaults — concat per meal
  const composed: MealsState = useMemo(() => {
    return Object.fromEntries(
      MEAL_KEYS.map((k) => [k, [...autos[k], ...meals[k]]]),
    ) as MealsState;
  }, [autos, meals]);

  const togglePref = (meal: MealKey, tag: Tag) => {
    setPrefs((p) => {
      const next = new Set(p[meal]);
      if (next.has(tag)) next.delete(tag); else next.add(tag);
      return { ...p, [meal]: next };
    });
  };

  const applyPrefs = (meal: MealKey) => {
    if (prefs[meal].size === 0) {
      setAutos((a) => ({ ...a, [meal]: [] }));
      // clear selections referencing auto rows
      setSelected((s) => ({ ...s, [meal]: shiftSelected(s[meal], 0, 4) }));
      return;
    }
    const generated = generatePreferredMeals(meal, prefs[meal]).map((it): ItemState => ({
      name: it.name,
      ingredients: it.ingredients.map((i) => ({ ...i })),
      auto: true,
    }));
    setAutos((a) => ({ ...a, [meal]: generated }));
    // remap selected indices (default block shifts by +4)
    setSelected((s) => ({ ...s, [meal]: shiftSelected(s[meal], autos[meal].length, generated.length) }));
  };

  const toggle = (meal: MealKey, idx: number) => {
    setSelected((p) => {
      const next = new Set(p[meal]);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return { ...p, [meal]: next };
    });
  };

  /** Edit an ingredient inside composed[meal][itemIdx] — translate to the right state slice */
  const swap = (meal: MealKey, composedIdx: number, ingIdx: number, action:
    | { type: "pick"; tag: Tag; newIndex: number }
    | { type: "manual"; food: string; original: { tag: Tag; kcal: number } },
  ) => {
    const autoLen = autos[meal].length;
    const inAuto = composedIdx < autoLen;
    const realIdx = inAuto ? composedIdx : composedIdx - autoLen;
    const updater = (list: ItemState[]): ItemState[] => {
      const next = list.map((it) => ({ ...it, ingredients: it.ingredients.map((i) => ({ ...i })) }));
      const ing = next[realIdx].ingredients[ingIdx];
      if (action.type === "pick") {
        ing.tag = action.tag;
        ing.index = action.newIndex;
        delete ing.manual;
      } else {
        // calcular cantidad para igualar las kcal originales del ingrediente
        const density = lookupDensity(action.food);
        const kcalPer100 = density?.kcalPer100g ?? 150;
        const unit: "g" | "ml" | "pcs" = density?.unit ?? "g";
        const targetKcal = action.original.kcal || 100;
        const qty = Math.max(5, Math.round((targetKcal / kcalPer100) * 100));
        ing.manual = { food: action.food.trim(), qty, unit, kcal: Math.round((qty / 100) * kcalPer100) };
      }
      return next;
    };
    if (inAuto) setAutos((a) => ({ ...a, [meal]: updater(a[meal]) }));
    else setMeals((m) => ({ ...m, [meal]: updater(m[meal]) }));
  };

  const reset = () => {
    setMeals(defaultMealsState());
    setAutos(Object.fromEntries(MEAL_KEYS.map((k) => [k, []])) as unknown as Record<MealKey, ItemState[]>);
    setPrefs(emptyPrefs());
    setSelected(emptySelection());
  };

  const total = useMemo(() => {
    let s = 0;
    MEAL_KEYS.forEach((m) => selected[m].forEach((i) => { s += itemKcal(composed[m][i]); }));
    return s;
  }, [composed, selected]);
  const totalItems = MEAL_KEYS.reduce((a, m) => a + selected[m].size, 0);

  return (
    <div className="space-y-4">
      <div className="sticky top-[112px] z-10 rounded-2xl border bg-card/95 backdrop-blur p-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">{tn("totalSelected", lang)}</p>
          <p className="font-bold text-xl">{total} <span className="text-xs text-muted-foreground">kcal · {totalItems} {tn("plates", lang)}</span></p>
        </div>
        <Button variant="outline" size="sm" onClick={reset}>
          <RotateCcw className="h-4 w-4" /> {tn("reset", lang)}
        </Button>
      </div>

      <Tabs defaultValue="breakfast" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 gap-1 h-auto p-1">
          {MEAL_TABS.map((m) => (
            <TabsTrigger key={m.key} value={m.key} className="text-[10px] sm:text-xs flex flex-col gap-0.5 py-1.5 px-1">
              <m.icon className="h-3.5 w-3.5" />
              <span className="leading-tight text-center">{tn(m.key, lang)}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {MEAL_TABS.map((m) => {
          const items = composed[m.key];
          const mealTotal = Array.from(selected[m.key]).reduce((acc, i) => acc + itemKcal(items[i]), 0);
          return (
            <TabsContent key={m.key} value={m.key} className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="font-semibold">{tn(m.key, lang)} <span className="text-xs text-muted-foreground">({items.length} {tn("options", lang)})</span></h2>
                <span className="text-xs text-muted-foreground">{tn("subtotal", lang)}: <span className="font-mono font-semibold text-foreground">{mealTotal} kcal</span></span>
              </div>

              <Tabs defaultValue="recipes" className="space-y-3">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="recipes" className="gap-1.5"><ListChecks className="h-3.5 w-3.5" /> {tn("recipesTab", lang)}</TabsTrigger>
                  <TabsTrigger value="prefs" className="gap-1.5"><Sparkles className="h-3.5 w-3.5" /> {tn("preferred", lang)}</TabsTrigger>
                </TabsList>

                <TabsContent value="recipes" className="space-y-3 mt-0">
                  {items.map((item, i) => (
                    <ItemCard
                      key={`${m.key}-${i}-${item.name}-${item.auto ? "a" : "d"}`}
                      item={item}
                      idx={i}
                      isOn={selected[m.key].has(i)}
                      lang={lang}
                      onToggle={() => toggle(m.key, i)}
                      onSwap={(ingIdx, action) => swap(m.key, i, ingIdx, action)}
                    />
                  ))}
                </TabsContent>

                <TabsContent value="prefs" className="space-y-3 mt-0">
                  <p className="text-xs text-muted-foreground px-1">{tn("preferredHelp", lang)}</p>
                  {(Object.keys(PREF_TAGS) as PrefCategory[]).map((cat) => (
                    <div key={cat} className="rounded-2xl border bg-card p-3 space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{tn(`cat_${cat}` as keyof typeof import("@/lib/nutrition").UI, lang)}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {PREF_TAGS[cat].map((tag) => {
                          const sample = POOL[tag][0];
                          const on = prefs[m.key].has(tag);
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => togglePref(m.key, tag)}
                              className={`text-xs px-2.5 py-1 rounded-full border transition ${on ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:border-primary"}`}
                            >
                              {formatIngredient(sample, lang)}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Button onClick={() => applyPrefs(m.key)} className="flex-1" disabled={prefs[m.key].size === 0 && autos[m.key].length === 0}>
                      <Sparkles className="h-4 w-4" /> {tn("applyPref", lang)}
                    </Button>
                  </div>
                  {prefs[m.key].size === 0 && autos[m.key].length === 0 && (
                    <p className="text-xs text-muted-foreground text-center">{tn("needsPref", lang)}</p>
                  )}
                </TabsContent>
              </Tabs>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}

function shiftSelected(prev: Set<number>, oldAuto: number, newAuto: number): Set<number> {
  // Drop selections inside auto block, re-map default block
  const out = new Set<number>();
  prev.forEach((i) => {
    if (i < oldAuto) return; // discard old auto
    out.add(i - oldAuto + newAuto);
  });
  return out;
}

/* ----------------------- Tarjeta de receta + ingredientes ----------------- */
function ItemCard({
  item, idx, isOn, lang, onToggle, onSwap,
}: {
  item: ItemState; idx: number; isOn: boolean; lang: Lang6;
  onToggle: () => void;
  onSwap: (ingIdx: number, action:
    | { type: "pick"; tag: Tag; newIndex: number }
    | { type: "manual"; food: string; original: { tag: Tag; kcal: number } },
  ) => void;
}) {
  const kcal = itemKcal(item);
  return (
    <div className={`rounded-2xl border p-4 space-y-2 transition ${isOn ? "border-primary bg-primary/5 ring-1 ring-primary" : "bg-card"}`}>
      <button type="button" onClick={onToggle} className="w-full text-left flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <span className={`shrink-0 mt-0.5 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold border ${isOn ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-muted-foreground"}`}>
            {isOn ? <Check className="h-3.5 w-3.5" /> : idx + 1}
          </span>
          <h3 className="font-semibold leading-tight flex items-center gap-1.5">
            {tRecipe(item.name, lang)}
            {item.auto && <span className="text-[9px] uppercase tracking-wide bg-primary/15 text-primary rounded px-1.5 py-0.5">{tn("autoRecipe", lang)}</span>}
          </h3>
        </div>
        <span className="shrink-0 rounded-full bg-primary/15 text-primary text-xs font-mono px-2 py-0.5">{kcal} kcal</span>
      </button>
      <div className="pl-9 space-y-1.5">
        {item.ingredients.map((ing, k) => (
          <IngredientRow
            key={k}
            ing={ing}
            lang={lang}
            onPick={(tag, newIdx) => onSwap(k, { type: "pick", tag, newIndex: newIdx })}
            onManual={(food) => onSwap(k, {
              type: "manual",
              food,
              original: { tag: ing.tag, kcal: POOL[ing.tag][ing.index]?.kcal ?? 100 },
            })}
          />
        ))}
      </div>
    </div>
  );
}

function IngredientRow({
  ing, lang, onPick, onManual,
}: {
  ing: IngState; lang: Lang6;
  onPick: (tag: Tag, newIndex: number) => void;
  onManual: (food: string) => void;
}) {
  const [manualOpen, setManualOpen] = useState(false);
  const [text, setText] = useState("");
  const opts = POOL[ing.tag];
  const currentLabel = ing.manual
    ? `${ing.manual.qty} ${ing.manual.unit} ${ing.manual.food}`
    : formatIngredient(opts[ing.index], lang);
  const currentKcal = ingKcal(ing);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2">
        <div className="relative flex-1 min-w-0">
          <select
            value={ing.manual ? "__manual__" : String(ing.index)}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "__add_manual__") { setManualOpen(true); return; }
              if (v === "__manual__") return;
              onPick(ing.tag, Number(v));
              setManualOpen(false);
            }}
            className="w-full appearance-none bg-background border border-input rounded-md pl-2.5 pr-7 py-1 text-xs sm:text-sm truncate hover:border-primary cursor-pointer"
          >
            {ing.manual && (
              <option value="__manual__">{currentLabel} · {currentKcal} kcal</option>
            )}
            {opts.map((o, idx) => (
              <option key={idx} value={idx}>{formatIngredient(o, lang)} · {o.kcal} kcal</option>
            ))}
            <option value="__add_manual__">{tn("addManual", lang)}</option>
          </select>
          <ChevronDown className="h-3.5 w-3.5 absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>
        <span className="shrink-0 text-[11px] font-mono text-muted-foreground w-14 text-right">{currentKcal} kcal</span>
      </div>
      {manualOpen && (
        <div className="flex gap-1.5">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={tn("manualPh", lang)}
            className="h-8 text-xs"
            onKeyDown={(e) => {
              if (e.key === "Enter" && text.trim()) { onManual(text); setText(""); setManualOpen(false); }
            }}
          />
          <Button size="sm" className="h-8" onClick={() => { if (text.trim()) { onManual(text); setText(""); setManualOpen(false); } }}>
            {tn("manualAdd", lang)}
          </Button>
        </div>
      )}
    </div>
  );
}

/* ============================ CUENTA CALORÍAS ============================ */
type Sex = "male" | "female";
type Activity = 1 | 2 | 3 | 4 | 5;

const ACTIVITY_FACTOR: Record<Activity, number> = { 1: 1.2, 2: 1.375, 3: 1.55, 4: 1.725, 5: 1.9 };

const GOAL_PROFILE: Record<Goal, { kcalPct: number; protein: number; fat: number; meals: number; weeklyPct: number }> = {
  cut:      { kcalPct: -0.15, protein: 2.0, fat: 0.8, meals: 5, weeklyPct: -0.005 },
  bulk:     { kcalPct: +0.10, protein: 1.8, fat: 1.0, meals: 5, weeklyPct: +0.0025 },
  lose:     { kcalPct: -0.22, protein: 2.2, fat: 0.7, meals: 4, weeklyPct: -0.0075 },
  maintain: { kcalPct:  0.00, protein: 1.6, fat: 0.9, meals: 4, weeklyPct: 0 },
};

function CalorieCounter({ lang }: { lang: Lang6 }) {
  const { t } = useI18n();
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [target, setTarget] = useState("");
  const [activity, setActivity] = useState<Activity>(3);
  const [goal, setGoal] = useState<Goal>("maintain");

  const result = useMemo(() => {
    const a = Number(age), h = Number(height), w = Number(weight), tw = Number(target);
    if (!a || !h || !w || a < 10 || h < 100 || w < 30) return null;
    const bmr = sex === "male" ? 10 * w + 6.25 * h - 5 * a + 5 : 10 * w + 6.25 * h - 5 * a - 161;
    const tdee = bmr * ACTIVITY_FACTOR[activity];
    const prof = GOAL_PROFILE[goal];
    let kcal = tdee * (1 + prof.kcalPct);
    const floor = Math.max(sex === "male" ? 1500 : 1200, bmr * 1.1);
    kcal = Math.max(floor, kcal);
    const p = Math.round(w * prof.protein);
    const f = Math.round(w * prof.fat);
    const c = Math.max(0, Math.round((kcal - (p * 4 + f * 9)) / 4));
    const extra = (ACTIVITY_FACTOR[activity] - 1.2) * 1000;
    const waterL = Math.round((w * 30 + extra) / 100) / 10;
    const weeklyKg = +(w * prof.weeklyPct).toFixed(2);
    let weeksToTarget: number | null = null;
    if (tw && weeklyKg !== 0 && Math.sign(tw - w) === Math.sign(weeklyKg)) {
      weeksToTarget = Math.ceil(Math.abs((tw - w) / weeklyKg));
    }
    return { bmr: Math.round(bmr), tdee: Math.round(tdee), kcal: Math.round(kcal), p, c, f, waterL, meals: prof.meals, weeksToTarget, weeklyKg };
  }, [sex, age, height, weight, target, activity, goal]);

  const split = useMemo(() => {
    if (!result) return [];
    const meals = result.meals;
    const tabs = meals === 5
      ? MEAL_TABS
      : MEAL_TABS.filter((m) => m.key !== "breakfast2").map((m) =>
          m.key === "breakfast" ? { ...m, pct: 0.28 } :
          m.key === "lunch"     ? { ...m, pct: 0.35 } :
          m.key === "snack"     ? { ...m, pct: 0.14 } :
          m.key === "dinner"    ? { ...m, pct: 0.23 } : m,
        );
    return tabs.map((tab, idx) => {
      const targetKcal = Math.round(result.kcal * tab.pct);
      const ranked = DEFAULT_MEALS[tab.key]
        .map((it, i) => ({ i: i + 1, k: it.ingredients.reduce((s, ing) => s + POOL[ing.tag][ing.index].kcal, 0), name: it.name }))
        .sort((a, b) => Math.abs(a.k - targetKcal) - Math.abs(b.k - targetKcal))
        .slice(0, 3)
        .sort((a, b) => a.i - b.i);
      return { n: idx + 1, label: tn(tab.key, lang), pct: tab.pct, kcal: targetKcal, picks: ranked };
    });
  }, [result, lang]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border bg-card p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>{t("sex")}</Label>
            <div className="flex gap-2">
              {(["male", "female"] as Sex[]).map((s) => (
                <button key={s} type="button" onClick={() => setSex(s)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition ${sex === s ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"}`}>{t(s)}</button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5"><Label>{t("age")}</Label><Input type="number" min={10} max={100} value={age} onChange={(e) => setAge(e.target.value)} /></div>
          <div className="space-y-1.5"><Label>{t("height")} (cm)</Label><Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} /></div>
          <div className="space-y-1.5"><Label>{t("weight")} (kg)</Label><Input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} /></div>
          <div className="space-y-1.5 col-span-2"><Label>{t("targetWeight")} (kg)</Label><Input type="number" step="0.1" value={target} onChange={(e) => setTarget(e.target.value)} /></div>
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
          <Label>{tn("goalLabel", lang)}</Label>
          <div className="grid grid-cols-2 gap-2">
            {(["cut", "bulk", "lose", "maintain"] as Goal[]).map((g) => (
              <button key={g} type="button" onClick={() => setGoal(g)}
                className={`py-2 rounded-lg text-sm font-medium border transition ${goal === g ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"}`}>{t(("goal" + g.charAt(0).toUpperCase() + g.slice(1)) as "goalCut")}</button>
            ))}
          </div>
        </div>

        {!result && <p className="text-xs text-muted-foreground text-center">{tn("intro", lang)}</p>}
      </div>

      {result && (
        <div className="rounded-2xl border bg-card p-5 space-y-5">
          <div>
            <h3 className="font-semibold text-lg">{t("yourPlan")}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {tn("goalLabel", lang)}: <span className="font-semibold text-foreground">{t(("goal" + goal.charAt(0).toUpperCase() + goal.slice(1)) as "goalCut")}</span>
              {" · "}{tn("bmr", lang)} {result.bmr} kcal · {tn("tdee", lang)} {result.tdee} kcal
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat label={t("dailyCalories")} value={`${result.kcal}`} unit="kcal" />
            <Stat label={t("protein")} value={`${result.p}`} unit="g" />
            <Stat label={t("carbs")} value={`${result.c}`} unit="g" />
            <Stat label={t("fats")} value={`${result.f}`} unit="g" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Stat label={tn("dailyWater", lang)} value={`${result.waterL}`} unit="L" />
            <Stat label={tn("mealsPerDay", lang)} value={`${result.meals}`} unit="" />
            {result.weeksToTarget !== null && (
              <Stat label={tn("timeEst", lang)} value={`${result.weeksToTarget}`} unit={`${tn("weeks", lang)} (${result.weeklyKg > 0 ? "+" : ""}${result.weeklyKg} kg/${tn("weeks", lang)})`} />
            )}
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-sm">{tn("splitTitle", lang)} · {result.meals} {tn("mealsPerDay", lang)}</h4>
            <p className="text-xs text-muted-foreground">{tn("splitHelp", lang)}</p>
            <ul className="text-sm space-y-2">
              {split.map((m) => (
                <li key={m.n} className="rounded-xl border border-border/60 bg-background/60 p-3 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold">{m.n}. {m.label}</span>
                    <span className="font-mono text-xs text-muted-foreground">~{m.kcal} kcal · {Math.round(m.pct * 100)}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {tn("chooseAmong", lang)}: <span className="text-foreground font-semibold">{m.picks.map((p) => `#${p.i}`).join(", ")}</span>
                    <span className="text-muted-foreground/80"> ({m.picks.map((p) => `${p.k} kcal`).join(" · ")})</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 pt-2 border-t">
            <h4 className="font-semibold text-sm">{tn("tipsTitle", lang)}</h4>
            <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-5">
              {TIPS[goal].map((tip, i) => <li key={i}>{tip[lang] ?? tip.en}</li>)}
            </ul>
            <p className="text-[11px] text-muted-foreground pt-2 border-t border-border/40">⚠️ {tn("disclaimer", lang)}</p>
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
