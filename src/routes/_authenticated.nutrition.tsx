import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Apple, Utensils, Coffee, Cookie, Moon, Calculator, Sun, Check, RotateCcw, ChevronDown } from "lucide-react";

export const Route = createFileRoute("/_authenticated/nutrition")({
  component: NutritionPage,
});

/* =========================================================================
   POOL DE INGREDIENTES INTERCAMBIABLES
   Cada "tag" agrupa alimentos similares (misma función nutricional).
   Cantidades realistas y kcal según USDA / BEDCA.
   ========================================================================= */
type PoolItem = { label: string; kcal: number };
const POOL = {
  // ---- HIDRATOS / CEREALES ----
  oats:        [{ label: "60 g de avena en copos", kcal: 220 }, { label: "60 g de muesli sin azúcar", kcal: 230 }, { label: "50 g de copos de maíz integral", kcal: 185 }, { label: "60 g de quinoa (en crudo)", kcal: 220 }],
  rice:        [{ label: "70 g de arroz integral (crudo)", kcal: 245 }, { label: "70 g de arroz basmati (crudo)", kcal: 250 }, { label: "70 g de quinoa (crudo)", kcal: 255 }, { label: "70 g de cuscús integral (crudo)", kcal: 260 }],
  pasta:       [{ label: "80 g de pasta integral (crudo)", kcal: 295 }, { label: "80 g de pasta de trigo (crudo)", kcal: 285 }, { label: "80 g de pasta de lentejas (crudo)", kcal: 280 }, { label: "80 g de fideos de arroz (crudo)", kcal: 285 }],
  potato:      [{ label: "200 g de patata cocida", kcal: 170 }, { label: "200 g de boniato asado", kcal: 180 }, { label: "200 g de yuca cocida", kcal: 320 }, { label: "200 g de calabaza asada", kcal: 80 }],
  bread:       [{ label: "2 rebanadas de pan integral (80 g)", kcal: 200 }, { label: "1 mollete integral (70 g)", kcal: 180 }, { label: "2 tortitas de maíz (20 g)", kcal: 80 }, { label: "1 wrap integral (60 g)", kcal: 170 }],
  bread_small: [{ label: "1 rebanada de pan integral (40 g)", kcal: 100 }, { label: "2 tortitas de arroz (20 g)", kcal: 75 }, { label: "1 biscote integral (12 g)", kcal: 45 }],
  // ---- PROTEÍNAS ----
  poultry:     [{ label: "150 g de pechuga de pollo", kcal: 165 }, { label: "150 g de pechuga de pavo", kcal: 155 }, { label: "150 g de muslo de pollo sin piel", kcal: 200 }, { label: "150 g de conejo", kcal: 180 }],
  white_fish:  [{ label: "180 g de merluza", kcal: 145 }, { label: "180 g de bacalao fresco", kcal: 150 }, { label: "180 g de dorada", kcal: 175 }, { label: "180 g de lubina", kcal: 170 }, { label: "180 g de rape", kcal: 130 }],
  fat_fish:    [{ label: "150 g de salmón", kcal: 310 }, { label: "150 g de atún fresco", kcal: 220 }, { label: "150 g de caballa", kcal: 280 }, { label: "150 g de sardinas", kcal: 250 }],
  shellfish:   [{ label: "150 g de gambas peladas", kcal: 150 }, { label: "150 g de mejillones (carne)", kcal: 130 }, { label: "150 g de calamar", kcal: 140 }, { label: "150 g de langostinos", kcal: 145 }],
  red_meat:    [{ label: "130 g de ternera magra", kcal: 200 }, { label: "130 g de solomillo de cerdo", kcal: 195 }, { label: "130 g de carne picada 5% MG", kcal: 175 }],
  eggs2:       [{ label: "2 huevos M enteros", kcal: 145 }, { label: "3 claras + 1 yema", kcal: 125 }, { label: "4 claras de huevo", kcal: 70 }],
  eggs1:       [{ label: "1 huevo M", kcal: 72 }, { label: "2 claras de huevo", kcal: 35 }],
  legumes:     [{ label: "150 g de garbanzos cocidos", kcal: 240 }, { label: "150 g de lentejas cocidas", kcal: 175 }, { label: "150 g de alubias blancas cocidas", kcal: 195 }, { label: "150 g de edamame sin vaina", kcal: 180 }],
  legumes_dry: [{ label: "80 g de lentejas (crudo)", kcal: 280 }, { label: "80 g de garbanzos (crudo)", kcal: 290 }, { label: "80 g de alubias (crudo)", kcal: 270 }],
  cured_meat:  [{ label: "40 g de jamón serrano", kcal: 95 }, { label: "40 g de pavo bajo en sal", kcal: 45 }, { label: "40 g de jamón cocido extra", kcal: 50 }, { label: "40 g de cecina", kcal: 75 }],
  canned_fish: [{ label: "1 lata de atún al natural (50 g esc.)", kcal: 60 }, { label: "1 lata de caballa al natural (50 g)", kcal: 75 }, { label: "1 lata de sardinas en AOVE (50 g esc.)", kcal: 130 }],
  smoked_fish: [{ label: "80 g de salmón ahumado", kcal: 115 }, { label: "80 g de trucha ahumada", kcal: 110 }, { label: "80 g de bonito en conserva", kcal: 95 }],
  // ---- LÁCTEOS ----
  milk:        [{ label: "250 ml de leche desnatada", kcal: 90 }, { label: "250 ml de leche semi", kcal: 115 }, { label: "250 ml de bebida de avena sin azúcar", kcal: 100 }, { label: "250 ml de bebida de soja sin azúcar", kcal: 80 }],
  milk_small:  [{ label: "200 ml de leche desnatada", kcal: 70 }, { label: "200 ml de bebida de soja sin azúcar", kcal: 65 }, { label: "200 ml de bebida de almendra sin azúcar", kcal: 30 }],
  yogurt:      [{ label: "125 g de yogur natural sin azúcar", kcal: 75 }, { label: "125 g de kéfir natural", kcal: 80 }, { label: "125 g de yogur de soja sin azúcar", kcal: 60 }],
  greek_yog:   [{ label: "200 g de yogur griego 0%", kcal: 120 }, { label: "200 g de skyr natural", kcal: 130 }, { label: "200 g de queso quark 0%", kcal: 145 }, { label: "200 g de requesón", kcal: 195 }],
  fresh_cheese:[{ label: "30 g de queso fresco batido 0%", kcal: 22 }, { label: "30 g de queso burgos", kcal: 50 }, { label: "30 g de mozzarella light", kcal: 60 }, { label: "30 g de feta", kcal: 80 }],
  hard_cheese: [{ label: "20 g de queso parmesano", kcal: 80 }, { label: "20 g de queso curado", kcal: 80 }, { label: "20 g de queso semicurado", kcal: 70 }],
  // ---- FRUTAS ----
  fruit_med:   [{ label: "1 plátano (120 g)", kcal: 105 }, { label: "1 manzana (180 g)", kcal: 95 }, { label: "1 pera (180 g)", kcal: 100 }, { label: "2 kiwis (150 g)", kcal: 90 }, { label: "1 naranja (200 g)", kcal: 85 }, { label: "1 melocotón (150 g)", kcal: 60 }],
  fruit_small: [{ label: "1 manzana pequeña (130 g)", kcal: 70 }, { label: "1 mandarina (90 g)", kcal: 45 }, { label: "1 kiwi (80 g)", kcal: 50 }, { label: "120 g de uvas", kcal: 85 }, { label: "1 plátano pequeño (90 g)", kcal: 80 }],
  berries:     [{ label: "100 g de frutos rojos", kcal: 45 }, { label: "100 g de fresas", kcal: 32 }, { label: "100 g de arándanos", kcal: 57 }, { label: "100 g de frambuesas", kcal: 52 }],
  // ---- GRASAS ----
  nuts:        [{ label: "20 g de nueces", kcal: 130 }, { label: "20 g de almendras", kcal: 120 }, { label: "20 g de avellanas", kcal: 125 }, { label: "20 g de anacardos", kcal: 115 }, { label: "20 g de pistachos", kcal: 115 }],
  nuts_small:  [{ label: "15 g de almendras", kcal: 90 }, { label: "15 g de nueces", kcal: 100 }, { label: "15 g de pistachos", kcal: 85 }, { label: "15 g de avellanas", kcal: 95 }],
  seeds:       [{ label: "10 g de semillas de chía", kcal: 50 }, { label: "10 g de semillas de lino", kcal: 53 }, { label: "10 g de semillas de calabaza", kcal: 55 }, { label: "10 g de sésamo", kcal: 57 }],
  avocado:     [{ label: "1/2 aguacate (75 g)", kcal: 120 }, { label: "1/4 aguacate (40 g)", kcal: 65 }, { label: "60 g guacamole casero", kcal: 100 }],
  aove:        [{ label: "10 ml de AOVE", kcal: 90 }, { label: "5 ml de AOVE", kcal: 45 }, { label: "15 ml de AOVE", kcal: 135 }, { label: "10 g de mantequilla de cacahuete 100%", kcal: 60 }],
  // ---- VERDURAS / HORTALIZAS ----
  veggies_low: [{ label: "150 g de verduras al vapor", kcal: 40 }, { label: "150 g de brócoli", kcal: 50 }, { label: "150 g de espárragos verdes", kcal: 30 }, { label: "150 g de calabacín", kcal: 25 }, { label: "150 g de espinacas salteadas", kcal: 35 }],
  salad:       [{ label: "100 g de ensalada variada + tomate", kcal: 30 }, { label: "100 g de canónigos y rúcula", kcal: 25 }, { label: "100 g de tomate + cebolla", kcal: 35 }, { label: "100 g de pepino + zanahoria", kcal: 30 }],
  tomato:      [{ label: "1 tomate (100 g)", kcal: 18 }, { label: "100 g tomate cherry", kcal: 20 }, { label: "100 g tomate triturado natural", kcal: 22 }],
  // ---- EXTRAS ----
  sweet:       [{ label: "10 g de miel", kcal: 30 }, { label: "10 g de mermelada sin azúcar", kcal: 15 }, { label: "5 g de cacao puro", kcal: 15 }, { label: "20 g de chocolate negro 85%", kcal: 110 }],
  hummus:      [{ label: "60 g de hummus casero", kcal: 100 }, { label: "60 g de babaganoush", kcal: 90 }, { label: "60 g de guacamole", kcal: 95 }],
  protein_pw:  [{ label: "30 g de proteína whey", kcal: 115 }, { label: "30 g de proteína vegana de guisante", kcal: 110 }, { label: "0 g (sin proteína en polvo)", kcal: 0 }],
} as const;

type Tag = keyof typeof POOL;
type Ingredient = { tag: Tag; index: number };
type Item = { name: string; ingredients: Ingredient[] };
type MealKey = "breakfast" | "breakfast2" | "lunch" | "snack" | "dinner";

const MEALS: Record<MealKey, Item[]> = {
  breakfast: [
    { name: "Avena con leche, fruta y frutos secos", ingredients: [{ tag: "oats", index: 0 }, { tag: "milk", index: 0 }, { tag: "fruit_med", index: 0 }, { tag: "nuts", index: 0 }, { tag: "sweet", index: 0 }] },
    { name: "Tostadas con aguacate y huevos", ingredients: [{ tag: "bread", index: 0 }, { tag: "avocado", index: 0 }, { tag: "eggs2", index: 0 }, { tag: "tomato", index: 0 }, { tag: "aove", index: 1 }] },
    { name: "Yogur griego con frutos rojos y granola", ingredients: [{ tag: "greek_yog", index: 0 }, { tag: "berries", index: 0 }, { tag: "oats", index: 1 }, { tag: "sweet", index: 0 }] },
    { name: "Tortilla con espinacas y queso fresco", ingredients: [{ tag: "eggs2", index: 1 }, { tag: "veggies_low", index: 4 }, { tag: "fresh_cheese", index: 0 }, { tag: "bread_small", index: 0 }] },
    { name: "Smoothie bowl proteico", ingredients: [{ tag: "fruit_med", index: 0 }, { tag: "berries", index: 0 }, { tag: "protein_pw", index: 0 }, { tag: "oats", index: 0 }, { tag: "seeds", index: 0 }] },
    { name: "Skyr con kiwi y almendras", ingredients: [{ tag: "greek_yog", index: 1 }, { tag: "fruit_med", index: 3 }, { tag: "nuts", index: 1 }] },
    { name: "Tostadas con tomate y jamón serrano", ingredients: [{ tag: "bread", index: 0 }, { tag: "tomato", index: 0 }, { tag: "cured_meat", index: 0 }, { tag: "aove", index: 0 }] },
    { name: "Porridge con manzana y canela", ingredients: [{ tag: "oats", index: 0 }, { tag: "milk", index: 0 }, { tag: "fruit_med", index: 1 }, { tag: "nuts_small", index: 0 }] },
    { name: "Wrap de huevo y aguacate", ingredients: [{ tag: "bread", index: 3 }, { tag: "eggs2", index: 0 }, { tag: "avocado", index: 0 }, { tag: "veggies_low", index: 4 }] },
    { name: "Sándwich de pavo y queso fresco", ingredients: [{ tag: "bread", index: 0 }, { tag: "cured_meat", index: 1 }, { tag: "fresh_cheese", index: 0 }, { tag: "tomato", index: 0 }] },
  ],
  breakfast2: [
    { name: "Fruta + puñado de frutos secos", ingredients: [{ tag: "fruit_med", index: 1 }, { tag: "nuts_small", index: 0 }] },
    { name: "Yogur natural con miel", ingredients: [{ tag: "yogurt", index: 0 }, { tag: "sweet", index: 0 }] },
    { name: "Tostada pequeña con queso y mermelada s/a", ingredients: [{ tag: "bread_small", index: 0 }, { tag: "fresh_cheese", index: 0 }, { tag: "sweet", index: 1 }] },
    { name: "Café con leche y tostada", ingredients: [{ tag: "milk_small", index: 0 }, { tag: "bread_small", index: 0 }, { tag: "aove", index: 1 }] },
    { name: "Batido suave de plátano y leche", ingredients: [{ tag: "fruit_med", index: 0 }, { tag: "milk", index: 0 }, { tag: "sweet", index: 2 }] },
    { name: "Bowl de fruta con yogur", ingredients: [{ tag: "berries", index: 1 }, { tag: "fruit_small", index: 2 }, { tag: "yogurt", index: 0 }] },
    { name: "Tostada con aguacate", ingredients: [{ tag: "bread_small", index: 0 }, { tag: "avocado", index: 0 }] },
    { name: "Tortita de arroz con crema de cacahuete", ingredients: [{ tag: "bread_small", index: 1 }, { tag: "aove", index: 3 }, { tag: "fruit_small", index: 0 }] },
    { name: "Pieza de fruta + lonchas de pavo", ingredients: [{ tag: "fruit_med", index: 1 }, { tag: "cured_meat", index: 1 }] },
    { name: "Pequeño puñado de frutos secos", ingredients: [{ tag: "nuts", index: 1 }] },
  ],
  lunch: [
    { name: "Arroz con pollo y verduras al wok", ingredients: [{ tag: "rice", index: 0 }, { tag: "poultry", index: 0 }, { tag: "veggies_low", index: 1 }, { tag: "aove", index: 1 }] },
    { name: "Salmón al horno con quinoa y espárragos", ingredients: [{ tag: "fat_fish", index: 0 }, { tag: "rice", index: 2 }, { tag: "veggies_low", index: 2 }, { tag: "aove", index: 0 }] },
    { name: "Lentejas estofadas con verduras", ingredients: [{ tag: "legumes_dry", index: 0 }, { tag: "veggies_low", index: 0 }, { tag: "tomato", index: 0 }, { tag: "aove", index: 0 }] },
    { name: "Pasta integral con atún y tomate", ingredients: [{ tag: "pasta", index: 0 }, { tag: "canned_fish", index: 0 }, { tag: "tomato", index: 2 }, { tag: "hard_cheese", index: 0 }, { tag: "aove", index: 1 }] },
    { name: "Bowl de garbanzos, aguacate y huevo", ingredients: [{ tag: "legumes", index: 0 }, { tag: "avocado", index: 0 }, { tag: "eggs1", index: 0 }, { tag: "salad", index: 0 }, { tag: "aove", index: 0 }] },
    { name: "Pavo con boniato y ensalada", ingredients: [{ tag: "poultry", index: 1 }, { tag: "potato", index: 1 }, { tag: "salad", index: 0 }, { tag: "aove", index: 0 }] },
    { name: "Bacalao con garbanzos y espinacas", ingredients: [{ tag: "white_fish", index: 1 }, { tag: "legumes", index: 0 }, { tag: "veggies_low", index: 4 }, { tag: "aove", index: 0 }] },
    { name: "Hamburguesa casera con boniato", ingredients: [{ tag: "red_meat", index: 0 }, { tag: "bread", index: 0 }, { tag: "potato", index: 1 }, { tag: "salad", index: 0 }, { tag: "aove", index: 1 }] },
    { name: "Arroz salteado con gambas", ingredients: [{ tag: "rice", index: 1 }, { tag: "shellfish", index: 0 }, { tag: "eggs1", index: 0 }, { tag: "veggies_low", index: 0 }, { tag: "aove", index: 1 }] },
    { name: "Ensalada de pollo, quinoa y aguacate", ingredients: [{ tag: "poultry", index: 0 }, { tag: "rice", index: 2 }, { tag: "avocado", index: 0 }, { tag: "salad", index: 0 }, { tag: "aove", index: 0 }] },
  ],
  snack: [
    { name: "Yogur con frutos secos", ingredients: [{ tag: "yogurt", index: 0 }, { tag: "nuts", index: 1 }] },
    { name: "Tostada con pavo y queso fresco", ingredients: [{ tag: "bread_small", index: 0 }, { tag: "cured_meat", index: 1 }, { tag: "fresh_cheese", index: 0 }, { tag: "tomato", index: 0 }] },
    { name: "Batido de proteína con plátano", ingredients: [{ tag: "protein_pw", index: 0 }, { tag: "milk", index: 0 }, { tag: "fruit_med", index: 0 }] },
    { name: "Manzana con crema de cacahuete", ingredients: [{ tag: "fruit_med", index: 1 }, { tag: "aove", index: 3 }] },
    { name: "Hummus con palitos de verdura", ingredients: [{ tag: "hummus", index: 0 }, { tag: "salad", index: 3 }] },
    { name: "Bol de skyr con miel y nueces", ingredients: [{ tag: "greek_yog", index: 1 }, { tag: "sweet", index: 0 }, { tag: "nuts_small", index: 1 }] },
    { name: "Tortita de arroz con atún", ingredients: [{ tag: "bread_small", index: 1 }, { tag: "canned_fish", index: 0 }, { tag: "tomato", index: 0 }] },
    { name: "Mini bocadillo de pavo", ingredients: [{ tag: "bread", index: 1 }, { tag: "cured_meat", index: 2 }, { tag: "fresh_cheese", index: 0 }] },
    { name: "Macedonia de frutas con yogur", ingredients: [{ tag: "fruit_small", index: 0 }, { tag: "berries", index: 1 }, { tag: "yogurt", index: 0 }] },
    { name: "Chocolate negro 85% + almendras", ingredients: [{ tag: "sweet", index: 3 }, { tag: "nuts_small", index: 0 }] },
  ],
  dinner: [
    { name: "Pollo a la plancha con boniato y ensalada", ingredients: [{ tag: "poultry", index: 0 }, { tag: "potato", index: 1 }, { tag: "salad", index: 0 }, { tag: "aove", index: 0 }] },
    { name: "Merluza al horno con verduras", ingredients: [{ tag: "white_fish", index: 0 }, { tag: "veggies_low", index: 3 }, { tag: "aove", index: 0 }] },
    { name: "Crema de verdura + tortilla", ingredients: [{ tag: "veggies_low", index: 0 }, { tag: "potato", index: 3 }, { tag: "eggs2", index: 0 }, { tag: "fresh_cheese", index: 0 }] },
    { name: "Wok de gambas con verduras y fideos", ingredients: [{ tag: "shellfish", index: 0 }, { tag: "pasta", index: 3 }, { tag: "veggies_low", index: 1 }, { tag: "aove", index: 1 }] },
    { name: "Tortilla de claras con salmón ahumado", ingredients: [{ tag: "eggs2", index: 2 }, { tag: "smoked_fish", index: 0 }, { tag: "veggies_low", index: 4 }, { tag: "bread_small", index: 0 }] },
    { name: "Dorada al horno con patata", ingredients: [{ tag: "white_fish", index: 2 }, { tag: "potato", index: 0 }, { tag: "aove", index: 0 }] },
    { name: "Ensalada templada de pollo y aguacate", ingredients: [{ tag: "poultry", index: 0 }, { tag: "avocado", index: 0 }, { tag: "salad", index: 0 }, { tag: "aove", index: 0 }] },
    { name: "Pavo al curry con arroz basmati", ingredients: [{ tag: "poultry", index: 1 }, { tag: "rice", index: 1 }, { tag: "veggies_low", index: 0 }, { tag: "aove", index: 1 }] },
    { name: "Salmón con espárragos y quinoa", ingredients: [{ tag: "fat_fish", index: 0 }, { tag: "veggies_low", index: 2 }, { tag: "rice", index: 2 }, { tag: "aove", index: 1 }] },
    { name: "Revuelto de champiñones, gambas y huevo", ingredients: [{ tag: "veggies_low", index: 0 }, { tag: "shellfish", index: 0 }, { tag: "eggs2", index: 0 }, { tag: "bread_small", index: 0 }] },
  ],
};

const MEAL_TABS: { key: MealKey; label: string; icon: typeof Coffee; pct: number }[] = [
  { key: "breakfast",  label: "Desayuno",   icon: Coffee,   pct: 0.22 },
  { key: "breakfast2", label: "Desayuno 2", icon: Sun,      pct: 0.12 },
  { key: "lunch",      label: "Comida",     icon: Utensils, pct: 0.32 },
  { key: "snack",      label: "Merienda",   icon: Cookie,   pct: 0.12 },
  { key: "dinner",     label: "Cena",       icon: Moon,     pct: 0.22 },
];

const itemKcal = (item: Item) => item.ingredients.reduce((s, ing) => s + POOL[ing.tag][ing.index].kcal, 0);

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
          <TabsTrigger value="food" className="gap-1.5"><Utensils className="h-4 w-4" /> {t("healthyFood")}</TabsTrigger>
          <TabsTrigger value="calc" className="gap-1.5"><Calculator className="h-4 w-4" /> {t("calorieCounter")}</TabsTrigger>
        </TabsList>

        <TabsContent value="food"><HealthyFood /></TabsContent>
        <TabsContent value="calc"><CalorieCounter /></TabsContent>
      </Tabs>
    </div>
  );
}

/* ============================ COMIDA SALUDABLE ============================ */
type MealsState = Record<MealKey, Item[]>;
function cloneMeals(): MealsState {
  return Object.fromEntries(
    (Object.keys(MEALS) as MealKey[]).map((k) => [k, MEALS[k].map((it) => ({ ...it, ingredients: it.ingredients.map((i) => ({ ...i })) }))]),
  ) as MealsState;
}

function HealthyFood() {
  const [meals, setMeals] = useState<MealsState>(() => cloneMeals());
  const [selected, setSelected] = useState<Record<MealKey, Set<number>>>({
    breakfast: new Set(), breakfast2: new Set(), lunch: new Set(), snack: new Set(), dinner: new Set(),
  });

  const toggle = (meal: MealKey, idx: number) => {
    setSelected((p) => {
      const next = new Set(p[meal]);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return { ...p, [meal]: next };
    });
  };

  const swap = (meal: MealKey, itemIdx: number, ingIdx: number, newOptIdx: number) => {
    setMeals((prev) => {
      const next = cloneMealsFrom(prev);
      next[meal][itemIdx].ingredients[ingIdx].index = newOptIdx;
      return next;
    });
  };

  const reset = () => {
    setMeals(cloneMeals());
    setSelected({ breakfast: new Set(), breakfast2: new Set(), lunch: new Set(), snack: new Set(), dinner: new Set() });
  };

  const total = useMemo(() => {
    let s = 0;
    (Object.keys(meals) as MealKey[]).forEach((m) => selected[m].forEach((i) => { s += itemKcal(meals[m][i]); }));
    return s;
  }, [meals, selected]);

  const totalItems = (Object.keys(selected) as MealKey[]).reduce((a, m) => a + selected[m].size, 0);

  return (
    <div className="space-y-4">
      <div className="sticky top-[112px] z-10 rounded-2xl border bg-card/95 backdrop-blur p-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Total seleccionado</p>
          <p className="font-bold text-xl">{total} <span className="text-xs text-muted-foreground">kcal · {totalItems} platos</span></p>
        </div>
        <Button variant="outline" size="sm" onClick={reset} disabled={totalItems === 0 && JSON.stringify(meals) === JSON.stringify(cloneMeals())}>
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
          const items = meals[m.key];
          const mealTotal = Array.from(selected[m.key]).reduce((acc, i) => acc + itemKcal(items[i]), 0);
          return (
            <TabsContent key={m.key} value={m.key} className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="font-semibold">{m.label} <span className="text-xs text-muted-foreground">({items.length} opciones)</span></h2>
                <span className="text-xs text-muted-foreground">Subtotal: <span className="font-mono font-semibold text-foreground">{mealTotal} kcal</span></span>
              </div>
              {items.map((item, i) => {
                const isOn = selected[m.key].has(i);
                const kcal = itemKcal(item);
                return (
                  <div key={i} className={`rounded-2xl border p-4 space-y-2 transition ${isOn ? "border-primary bg-primary/5 ring-1 ring-primary" : "bg-card"}`}>
                    <button type="button" onClick={() => toggle(m.key, i)} className="w-full text-left flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span className={`shrink-0 mt-0.5 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold border ${isOn ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-muted-foreground"}`}>
                          {isOn ? <Check className="h-3.5 w-3.5" /> : i + 1}
                        </span>
                        <h3 className="font-semibold leading-tight">{item.name}</h3>
                      </div>
                      <span className="shrink-0 rounded-full bg-primary/15 text-primary text-xs font-mono px-2 py-0.5">{kcal} kcal</span>
                    </button>
                    <div className="pl-9 space-y-1.5">
                      {item.ingredients.map((ing, k) => {
                        const opts = POOL[ing.tag];
                        const current = opts[ing.index];
                        return (
                          <div key={k} className="flex items-center justify-between gap-2">
                            <div className="relative flex-1 min-w-0">
                              <select
                                value={ing.index}
                                onChange={(e) => swap(m.key, i, k, Number(e.target.value))}
                                className="w-full appearance-none bg-background border border-input rounded-md pl-2.5 pr-7 py-1 text-xs sm:text-sm truncate hover:border-primary cursor-pointer"
                              >
                                {opts.map((o, idx) => (
                                  <option key={idx} value={idx}>{o.label} · {o.kcal} kcal</option>
                                ))}
                              </select>
                              <ChevronDown className="h-3.5 w-3.5 absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            </div>
                            <span className="shrink-0 text-[11px] font-mono text-muted-foreground w-14 text-right">{current.kcal} kcal</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}

function cloneMealsFrom(src: MealsState): MealsState {
  return Object.fromEntries(
    (Object.keys(src) as MealKey[]).map((k) => [k, src[k].map((it) => ({ ...it, ingredients: it.ingredients.map((i) => ({ ...i })) }))]),
  ) as MealsState;
}

/* ============================ CUENTA CALORÍAS ============================ */
type Sex = "male" | "female";
type Goal = "cut" | "bulk" | "lose" | "maintain";
type Activity = 1 | 2 | 3 | 4 | 5;

// TDEE multipliers (Mifflin-St Jeor estándar)
const ACTIVITY_FACTOR: Record<Activity, number> = { 1: 1.2, 2: 1.375, 3: 1.55, 4: 1.725, 5: 1.9 };

/**
 * Perfil por objetivo basado en recomendaciones ISSN / ACSM:
 *  - kcalPct relativo al TDEE
 *  - protein g/kg de peso corporal
 *  - fat g/kg (mínimo saludable 0.6-1.0)
 *  - meals/día sugeridas
 *  - waterMlPerKg realista (30-40 ml/kg según actividad — ajustado luego)
 *  - weeklyPctChange porcentaje de peso corporal por semana
 */
const GOAL_PROFILE: Record<Goal, { kcalPct: number; protein: number; fat: number; meals: number; weeklyPct: number }> = {
  cut:      { kcalPct: -0.15, protein: 2.0, fat: 0.8, meals: 5, weeklyPct: -0.005 }, // -0.5%/sem
  bulk:     { kcalPct: +0.10, protein: 1.8, fat: 1.0, meals: 5, weeklyPct: +0.0025 }, // +0.25%/sem
  lose:     { kcalPct: -0.22, protein: 2.2, fat: 0.7, meals: 4, weeklyPct: -0.0075 }, // -0.75%/sem
  maintain: { kcalPct:  0.00, protein: 1.6, fat: 0.9, meals: 4, weeklyPct: 0 },
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

  // Recalculo en vivo (sin botón) — más realista, cambia con cada input
  const result = useMemo(() => {
    const a = Number(age), h = Number(height), w = Number(weight), tw = Number(target);
    if (!a || !h || !w || a < 10 || h < 100 || w < 30) return null;

    const bmr = sex === "male" ? 10 * w + 6.25 * h - 5 * a + 5 : 10 * w + 6.25 * h - 5 * a - 161;
    const tdee = bmr * ACTIVITY_FACTOR[activity];
    const prof = GOAL_PROFILE[goal];

    // ajuste por objetivo
    let kcal = tdee * (1 + prof.kcalPct);

    // límite mínimo seguro: nunca por debajo de BMR * 1.1 o de 1500/1200 kcal (h/m)
    const floor = Math.max(sex === "male" ? 1500 : 1200, bmr * 1.1);
    kcal = Math.max(floor, kcal);

    // macros
    const p = Math.round(w * prof.protein);
    const f = Math.round(w * prof.fat);
    const c = Math.max(0, Math.round((kcal - (p * 4 + f * 9)) / 4));

    // agua realista: 30 ml/kg + 350 ml por hora de actividad estimada
    const extraActivity = (ACTIVITY_FACTOR[activity] - 1.2) * 1000; // ml extra
    const waterMl = w * 30 + extraActivity;
    const waterL = Math.round(waterMl / 100) / 10;

    // cambio semanal en kg
    const weeklyKg = +(w * prof.weeklyPct).toFixed(2);

    // semanas hasta objetivo
    let weeksToTarget: number | null = null;
    if (tw && weeklyKg !== 0 && Math.sign(tw - w) === Math.sign(weeklyKg)) {
      weeksToTarget = Math.ceil(Math.abs((tw - w) / weeklyKg));
    }

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      kcal: Math.round(kcal),
      p, c, f,
      waterL,
      meals: prof.meals,
      weeksToTarget,
      weeklyKg,
    };
  }, [sex, age, height, weight, target, activity, goal]);

  /**
   * Reparto de comidas y sugerencia de qué números elegir
   * Para cada slot, target = kcal * pct → encontrar los 3 platos del catálogo
   * cuya kcal esté más cerca del target (basado en kcal por defecto).
   */
  const split = useMemo(() => {
    if (!result) return [];
    const meals = result.meals;
    // Si son 4 comidas, fusionamos Desayuno2 con Desayuno (reparto consolidado)
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
      // top 3 platos más cercanos
      const ranked = MEALS[tab.key]
        .map((it, i) => ({ i: i + 1, k: itemKcal(it), name: it.name }))
        .sort((a, b) => Math.abs(a.k - targetKcal) - Math.abs(b.k - targetKcal))
        .slice(0, 3)
        .sort((a, b) => a.i - b.i);
      return {
        n: idx + 1,
        name: tab.label,
        pct: tab.pct,
        kcal: targetKcal,
        picks: ranked,
      };
    });
  }, [result]);

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
          <Label>{t("goal")}</Label>
          <div className="grid grid-cols-2 gap-2">
            {(["cut", "bulk", "lose", "maintain"] as Goal[]).map((g) => (
              <button key={g} type="button" onClick={() => setGoal(g)}
                className={`py-2 rounded-lg text-sm font-medium border transition ${goal === g ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"}`}>{t(("goal" + g.charAt(0).toUpperCase() + g.slice(1)) as "goalCut")}</button>
            ))}
          </div>
        </div>

        {!result && <p className="text-xs text-muted-foreground text-center">Introduce edad, altura y peso para calcular tu plan personalizado.</p>}
      </div>

      {result && (
        <div className="rounded-2xl border bg-card p-5 space-y-5">
          <div>
            <h3 className="font-semibold text-lg">{t("yourPlan")}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Objetivo: <span className="font-semibold text-foreground">{t(("goal" + goal.charAt(0).toUpperCase() + goal.slice(1)) as "goalCut")}</span>
              {" · "}TMB {result.bmr} kcal · Gasto total (TDEE) {result.tdee} kcal
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
            <h4 className="font-semibold text-sm">{t("mealsBreakdown")} · {result.meals} comidas</h4>
            <p className="text-xs text-muted-foreground">Sugerencia de qué platos del catálogo encajan mejor con cada comida (los números corresponden al listado de "Comida saludable").</p>
            <ul className="text-sm space-y-2">
              {split.map((m) => (
                <li key={m.n} className="rounded-xl border border-border/60 bg-background/60 p-3 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold">{m.n}. {m.name}</span>
                    <span className="font-mono text-xs text-muted-foreground">~{m.kcal} kcal · {Math.round(m.pct * 100)}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Elige entre las opciones: <span className="text-foreground font-semibold">{m.picks.map((p) => `#${p.i}`).join(", ")}</span>
                    <span className="text-muted-foreground/80"> ({m.picks.map((p) => `${p.k} kcal`).join(" · ")})</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 pt-2 border-t">
            <h4 className="font-semibold text-sm">{t("tips")} profesionales para tu objetivo</h4>
            <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-5">
              {goal === "cut" && <>
                <li><strong>Déficit moderado (~15% del TDEE).</strong> Pérdida realista de 0,4-0,6% de tu peso/semana preservando masa muscular.</li>
                <li><strong>Proteína 2,0 g/kg</strong> repartida en 4-5 tomas de 30-45 g (umbral de leucina ≈ 2,5-3 g por toma).</li>
                <li><strong>Fuerza 4 días/sem</strong> con sobrecarga progresiva (RIR 1-3) + 8.000-10.000 pasos diarios. Cardio opcional: 2 sesiones LISS 30-40 min.</li>
                <li>Mínimo 25-30 g de fibra/día (verdura en comida y cena, fruta entera, legumbre 2-3 veces/sem).</li>
                <li>Evita líquidos calóricos; alcohol &lt; 1-2 veces/semana. Café y té sin azúcar son libres.</li>
                <li>Si te estancas 10-14 días, baja -100 kcal o sube 1.500 pasos antes de tocar el entreno.</li>
              </>}
              {goal === "bulk" && <>
                <li><strong>Superávit controlado (~10%).</strong> Subida realista: 0,2-0,3% de tu peso/semana (≈ 1-1,5 kg/mes en avanzados, más en novatos).</li>
                <li><strong>Proteína 1,8 g/kg</strong> en 4-5 tomas. Carbohidratos altos pre y post entreno (40-80 g cada uno).</li>
                <li><strong>Fuerza 4-5 días/sem</strong>, rangos 6-12 reps, RIR 1-3, progresión semanal en peso o reps.</li>
                <li>Hidratos de calidad (arroz, pasta integral, patata, avena) en torno a entreno; grasas saludables (AOVE, pescado azul, frutos secos) el resto del día.</li>
                <li>Mide cintura cada 2 semanas: si crece &gt; 1 cm/mes, baja -150 kcal — estás ganando grasa de más.</li>
                <li>Sueño 7-9 h y 1-2 días sin entrenar/semana. Sin descanso no hay hipertrofia.</li>
              </>}
              {goal === "lose" && <>
                <li><strong>Déficit más agresivo (~22%).</strong> Pérdida 0,6-0,8% de tu peso/semana. No mantener más de 10-12 semanas seguidas.</li>
                <li><strong>Proteína alta (2,2 g/kg)</strong> para preservar músculo y saciar; grasas en mínimos saludables (0,7 g/kg).</li>
                <li><strong>Cardio 3-4 días</strong> (mezcla LISS + HIIT 1 día) + fuerza 3 días para mantener masa muscular y metabolismo.</li>
                <li>Pesa los alimentos las primeras 2-3 semanas para calibrar. Revisa peso medio semanal (no diario).</li>
                <li>NEAT clave: objetivo 10.000 pasos/día. Más actividad espontánea quema más que cualquier sesión de cardio.</li>
                <li>Tras 8-10 semanas haz 1-2 semanas en mantenimiento (diet break) para recuperar hormonas y hambre.</li>
              </>}
              {goal === "maintain" && <>
                <li><strong>Calorías en torno al TDEE.</strong> Vigila peso semanalmente y ajusta ±100 kcal si la balanza se mueve &gt; 1% en 2-3 semanas.</li>
                <li><strong>Proteína 1,6 g/kg</strong> suficiente para preservar músculo con entrenamiento de fuerza 3-4 días/sem.</li>
                <li>Reparto equilibrado: ~30% proteína / 40% hidratos / 30% grasas. Flexible según preferencias.</li>
                <li>Regla 80/20: 80% alimentos frescos y nutritivos, 20% margen para vida social sin culpa.</li>
                <li>Hidratación 30-35 ml/kg + 350-700 ml extra por hora de actividad. Café/té sin azúcar cuentan.</li>
                <li>Sueño 7-9 h y 7.000-10.000 pasos/día. La constancia &gt; la intensidad.</li>
              </>}
            </ul>
            <p className="text-[11px] text-muted-foreground pt-2 border-t border-border/40">
              ⚠️ Información orientativa basada en la ecuación de Mifflin-St Jeor y guías ISSN/ACSM. Para condiciones médicas, embarazo o deporte de élite consulta a un dietista-nutricionista colegiado.
            </p>
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
