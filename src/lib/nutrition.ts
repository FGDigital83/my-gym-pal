/* =============================================================================
   NUTRICIÓN — Datos paramétricos + i18n (ES/EN/FR/DE/IT/PT, fallback EN)
   - POOL: ingredientes intercambiables (cantidad + unidad + food key + kcal)
   - FOOD: nombres traducidos por foodKey
   - RECIPE_NAMES: nombres de recetas por recipeKey
   - UI: textos de la pestaña Nutrición
   - FOOD_DENSITY: tabla kcal/100g + sinónimos para "añadir manual"
   ============================================================================= */

export type Lang6 = "es" | "en" | "fr" | "de" | "it" | "pt";
const FALLBACK: Lang6 = "en";
export function pickLang(code: string): Lang6 {
  return (["es", "en", "fr", "de", "it", "pt"] as const).includes(code as Lang6) ? (code as Lang6) : FALLBACK;
}

/* ----------------------------- Conectores ---------------------------------- */
const CONNECTOR: Record<Lang6, string> = { es: " de ", en: " ", fr: " de ", de: " ", it: " di ", pt: " de " };
const NO_CONNECTOR_PIECES: Record<Lang6, string> = { es: " ", en: " ", fr: " ", de: " ", it: " ", pt: " " };

/* ----------------------------- FOOD NAMES ---------------------------------- */
type L = Record<Lang6, string>;
export const FOOD: Record<string, L> = {
  // Cereales / hidratos
  oats_flakes:   { es:"avena en copos", en:"rolled oats", fr:"flocons d'avoine", de:"Haferflocken", it:"fiocchi d'avena", pt:"flocos de aveia" },
  muesli:        { es:"muesli sin azúcar", en:"unsweetened muesli", fr:"muesli sans sucre", de:"Müsli ohne Zucker", it:"muesli senza zucchero", pt:"muesli sem açúcar" },
  cornflakes:    { es:"copos de maíz integral", en:"whole-grain cornflakes", fr:"corn flakes complets", de:"Vollkorn-Cornflakes", it:"corn flakes integrali", pt:"flocos de milho integrais" },
  quinoa_raw:    { es:"quinoa (en crudo)", en:"raw quinoa", fr:"quinoa cru", de:"Quinoa (roh)", it:"quinoa (cruda)", pt:"quinoa (crua)" },
  rice_brown:    { es:"arroz integral (crudo)", en:"raw brown rice", fr:"riz complet cru", de:"Vollkornreis (roh)", it:"riso integrale (crudo)", pt:"arroz integral (cru)" },
  rice_basmati:  { es:"arroz basmati (crudo)", en:"raw basmati rice", fr:"riz basmati cru", de:"Basmatireis (roh)", it:"riso basmati (crudo)", pt:"arroz basmati (cru)" },
  couscous:      { es:"cuscús integral (crudo)", en:"whole-grain couscous (raw)", fr:"couscous complet cru", de:"Vollkorn-Couscous (roh)", it:"cuscus integrale (crudo)", pt:"cuscuz integral (cru)" },
  pasta_whole:   { es:"pasta integral (crudo)", en:"raw whole-grain pasta", fr:"pâtes complètes crues", de:"Vollkornnudeln (roh)", it:"pasta integrale (cruda)", pt:"massa integral (crua)" },
  pasta_wheat:   { es:"pasta de trigo (crudo)", en:"raw wheat pasta", fr:"pâtes au blé crues", de:"Weizennudeln (roh)", it:"pasta di grano (cruda)", pt:"massa de trigo (crua)" },
  pasta_lentil:  { es:"pasta de lentejas (crudo)", en:"raw lentil pasta", fr:"pâtes aux lentilles crues", de:"Linsennudeln (roh)", it:"pasta di lenticchie (cruda)", pt:"massa de lentilhas (crua)" },
  noodles_rice:  { es:"fideos de arroz (crudo)", en:"raw rice noodles", fr:"nouilles de riz crues", de:"Reisnudeln (roh)", it:"spaghetti di riso (crudi)", pt:"noodles de arroz (crus)" },
  potato_boiled: { es:"patata cocida", en:"boiled potato", fr:"pomme de terre cuite", de:"gekochte Kartoffel", it:"patata lessa", pt:"batata cozida" },
  sweet_potato:  { es:"boniato asado", en:"roasted sweet potato", fr:"patate douce rôtie", de:"gebackene Süßkartoffel", it:"patata dolce al forno", pt:"batata-doce assada" },
  cassava:       { es:"yuca cocida", en:"boiled cassava", fr:"manioc cuit", de:"gekochte Maniok", it:"manioca lessa", pt:"mandioca cozida" },
  pumpkin:       { es:"calabaza asada", en:"roasted pumpkin", fr:"potiron rôti", de:"gebackener Kürbis", it:"zucca al forno", pt:"abóbora assada" },
  bread_whole:   { es:"pan integral", en:"whole-grain bread", fr:"pain complet", de:"Vollkornbrot", it:"pane integrale", pt:"pão integral" },
  bread_roll:    { es:"mollete integral", en:"whole-grain roll", fr:"petit pain complet", de:"Vollkornbrötchen", it:"panino integrale", pt:"pãozinho integral" },
  corn_tortilla: { es:"tortitas de maíz", en:"corn cakes", fr:"galettes de maïs", de:"Maiswaffeln", it:"gallette di mais", pt:"tortitas de milho" },
  wrap_whole:    { es:"wrap integral", en:"whole-grain wrap", fr:"wrap complet", de:"Vollkornwrap", it:"wrap integrale", pt:"wrap integral" },
  bread_slice:   { es:"rebanada de pan integral", en:"whole-grain bread slice", fr:"tranche de pain complet", de:"Vollkornbrotscheibe", it:"fetta di pane integrale", pt:"fatia de pão integral" },
  rice_cake:     { es:"tortitas de arroz", en:"rice cakes", fr:"galettes de riz", de:"Reiswaffeln", it:"gallette di riso", pt:"tortitas de arroz" },
  biscote:       { es:"biscote integral", en:"whole-grain rusk", fr:"biscotte complète", de:"Vollkornzwieback", it:"fetta biscottata integrale", pt:"tosta integral" },
  // Proteínas
  chicken_breast:{ es:"pechuga de pollo", en:"chicken breast", fr:"blanc de poulet", de:"Hähnchenbrust", it:"petto di pollo", pt:"peito de frango" },
  turkey_breast: { es:"pechuga de pavo", en:"turkey breast", fr:"blanc de dinde", de:"Putenbrust", it:"petto di tacchino", pt:"peito de peru" },
  chicken_thigh: { es:"muslo de pollo sin piel", en:"skinless chicken thigh", fr:"cuisse de poulet sans peau", de:"Hähnchenschenkel ohne Haut", it:"coscia di pollo senza pelle", pt:"coxa de frango sem pele" },
  rabbit:        { es:"conejo", en:"rabbit", fr:"lapin", de:"Kaninchen", it:"coniglio", pt:"coelho" },
  hake:          { es:"merluza", en:"hake", fr:"merlu", de:"Seehecht", it:"nasello", pt:"pescada" },
  cod:           { es:"bacalao fresco", en:"fresh cod", fr:"cabillaud frais", de:"frischer Kabeljau", it:"merluzzo fresco", pt:"bacalhau fresco" },
  bream:         { es:"dorada", en:"sea bream", fr:"dorade", de:"Dorade", it:"orata", pt:"dourada" },
  seabass:       { es:"lubina", en:"sea bass", fr:"bar", de:"Wolfsbarsch", it:"branzino", pt:"robalo" },
  monkfish:      { es:"rape", en:"monkfish", fr:"lotte", de:"Seeteufel", it:"rana pescatrice", pt:"tamboril" },
  salmon:        { es:"salmón", en:"salmon", fr:"saumon", de:"Lachs", it:"salmone", pt:"salmão" },
  tuna_fresh:    { es:"atún fresco", en:"fresh tuna", fr:"thon frais", de:"frischer Thunfisch", it:"tonno fresco", pt:"atum fresco" },
  mackerel:      { es:"caballa", en:"mackerel", fr:"maquereau", de:"Makrele", it:"sgombro", pt:"cavala" },
  sardine:       { es:"sardinas", en:"sardines", fr:"sardines", de:"Sardinen", it:"sardine", pt:"sardinhas" },
  shrimp:        { es:"gambas peladas", en:"peeled shrimp", fr:"crevettes décortiquées", de:"geschälte Garnelen", it:"gamberi sgusciati", pt:"camarão descascado" },
  mussel:        { es:"mejillones (carne)", en:"mussels (meat)", fr:"moules (chair)", de:"Muscheln (Fleisch)", it:"cozze (polpa)", pt:"mexilhões (polpa)" },
  squid:         { es:"calamar", en:"squid", fr:"calamar", de:"Tintenfisch", it:"calamaro", pt:"lula" },
  prawn:         { es:"langostinos", en:"king prawns", fr:"gambas", de:"Riesengarnelen", it:"mazzancolle", pt:"lagostins" },
  beef_lean:     { es:"ternera magra", en:"lean beef", fr:"bœuf maigre", de:"mageres Rindfleisch", it:"manzo magro", pt:"vitela magra" },
  pork_loin:     { es:"solomillo de cerdo", en:"pork tenderloin", fr:"filet de porc", de:"Schweinefilet", it:"filetto di maiale", pt:"lombo de porco" },
  beef_mince5:   { es:"carne picada 5% MG", en:"5% fat minced beef", fr:"viande hachée 5% MG", de:"Rinderhack 5% Fett", it:"carne macinata 5% grassi", pt:"carne picada 5% gordura" },
  egg_whole:     { es:"huevo M", en:"medium egg", fr:"œuf moyen", de:"mittleres Ei", it:"uovo medio", pt:"ovo médio" },
  egg_white:     { es:"clara de huevo", en:"egg white", fr:"blanc d'œuf", de:"Eiweiß", it:"albume", pt:"clara de ovo" },
  egg_white_yolk:{ es:"claras + 1 yema", en:"egg whites + 1 yolk", fr:"blancs + 1 jaune", de:"Eiweiß + 1 Eigelb", it:"albumi + 1 tuorlo", pt:"claras + 1 gema" },
  chickpea_cooked:{ es:"garbanzos cocidos", en:"cooked chickpeas", fr:"pois chiches cuits", de:"gekochte Kichererbsen", it:"ceci lessati", pt:"grão-de-bico cozido" },
  lentil_cooked: { es:"lentejas cocidas", en:"cooked lentils", fr:"lentilles cuites", de:"gekochte Linsen", it:"lenticchie lessate", pt:"lentilhas cozidas" },
  bean_white:    { es:"alubias blancas cocidas", en:"cooked white beans", fr:"haricots blancs cuits", de:"gekochte weiße Bohnen", it:"fagioli bianchi lessati", pt:"feijão branco cozido" },
  edamame:       { es:"edamame sin vaina", en:"shelled edamame", fr:"edamame écossé", de:"Edamame ohne Schoten", it:"edamame sgusciato", pt:"edamame sem vagem" },
  lentil_dry:    { es:"lentejas (crudo)", en:"raw lentils", fr:"lentilles crues", de:"Linsen (roh)", it:"lenticchie (crude)", pt:"lentilhas (cruas)" },
  chickpea_dry:  { es:"garbanzos (crudo)", en:"raw chickpeas", fr:"pois chiches crus", de:"Kichererbsen (roh)", it:"ceci (crudi)", pt:"grão-de-bico (cru)" },
  bean_dry:      { es:"alubias (crudo)", en:"raw beans", fr:"haricots crus", de:"Bohnen (roh)", it:"fagioli (crudi)", pt:"feijão (cru)" },
  ham_cured:     { es:"jamón serrano", en:"cured ham", fr:"jambon cru", de:"Serrano-Schinken", it:"prosciutto crudo", pt:"presunto curado" },
  turkey_slice:  { es:"pavo bajo en sal", en:"low-salt turkey slices", fr:"dinde peu salée", de:"salzarme Putenbrust", it:"tacchino poco salato", pt:"peru pouco salgado" },
  ham_cooked:    { es:"jamón cocido extra", en:"premium cooked ham", fr:"jambon blanc extra", de:"Kochschinken extra", it:"prosciutto cotto extra", pt:"fiambre extra" },
  cecina:        { es:"cecina", en:"cured beef", fr:"viande séchée", de:"luftgetrocknetes Rindfleisch", it:"bresaola", pt:"carne curada" },
  tuna_canned:   { es:"atún al natural", en:"tuna in water", fr:"thon au naturel", de:"Thunfisch im eigenen Saft", it:"tonno al naturale", pt:"atum em água" },
  mackerel_can:  { es:"caballa al natural", en:"mackerel in water", fr:"maquereau au naturel", de:"Makrele natur", it:"sgombro al naturale", pt:"cavala em água" },
  sardine_oil:   { es:"sardinas en AOVE", en:"sardines in olive oil", fr:"sardines à l'huile d'olive", de:"Sardinen in Olivenöl", it:"sardine sott'olio", pt:"sardinhas em azeite" },
  salmon_smoked: { es:"salmón ahumado", en:"smoked salmon", fr:"saumon fumé", de:"Räucherlachs", it:"salmone affumicato", pt:"salmão fumado" },
  trout_smoked:  { es:"trucha ahumada", en:"smoked trout", fr:"truite fumée", de:"Räucherforelle", it:"trota affumicata", pt:"truta fumada" },
  bonito_can:    { es:"bonito en conserva", en:"canned bonito", fr:"bonite en conserve", de:"Bonito aus der Dose", it:"tonnetto in scatola", pt:"bonito em conserva" },
  // Lácteos
  milk_skim:     { es:"leche desnatada", en:"skimmed milk", fr:"lait écrémé", de:"Magermilch", it:"latte scremato", pt:"leite desnatado" },
  milk_semi:     { es:"leche semi", en:"semi-skimmed milk", fr:"lait demi-écrémé", de:"fettarme Milch", it:"latte parzialmente scremato", pt:"leite meio gordo" },
  oat_drink:     { es:"bebida de avena sin azúcar", en:"unsweetened oat drink", fr:"boisson avoine sans sucre", de:"Haferdrink ohne Zucker", it:"bevanda d'avena senza zucchero", pt:"bebida de aveia sem açúcar" },
  soy_drink:     { es:"bebida de soja sin azúcar", en:"unsweetened soy drink", fr:"boisson soja sans sucre", de:"Sojadrink ohne Zucker", it:"bevanda di soia senza zucchero", pt:"bebida de soja sem açúcar" },
  almond_drink:  { es:"bebida de almendra sin azúcar", en:"unsweetened almond drink", fr:"boisson amande sans sucre", de:"Mandeldrink ohne Zucker", it:"bevanda di mandorla senza zucchero", pt:"bebida de amêndoa sem açúcar" },
  yogurt_plain:  { es:"yogur natural sin azúcar", en:"plain unsweetened yogurt", fr:"yaourt nature sans sucre", de:"Naturjoghurt ohne Zucker", it:"yogurt bianco senza zucchero", pt:"iogurte natural sem açúcar" },
  kefir:         { es:"kéfir natural", en:"plain kefir", fr:"kéfir nature", de:"Naturkefir", it:"kefir naturale", pt:"kefir natural" },
  yogurt_soy:    { es:"yogur de soja sin azúcar", en:"unsweetened soy yogurt", fr:"yaourt soja sans sucre", de:"Sojajoghurt ohne Zucker", it:"yogurt di soia senza zucchero", pt:"iogurte de soja sem açúcar" },
  greek_yogurt:  { es:"yogur griego 0%", en:"0% Greek yogurt", fr:"yaourt grec 0%", de:"griechischer Joghurt 0%", it:"yogurt greco 0%", pt:"iogurte grego 0%" },
  skyr:          { es:"skyr natural", en:"plain skyr", fr:"skyr nature", de:"Naturskyr", it:"skyr naturale", pt:"skyr natural" },
  quark:         { es:"queso quark 0%", en:"0% quark cheese", fr:"fromage blanc quark 0%", de:"Magerquark", it:"quark 0%", pt:"queijo quark 0%" },
  cottage_cheese:{ es:"requesón", en:"cottage cheese", fr:"fromage frais", de:"Hüttenkäse", it:"ricotta", pt:"queijo cottage" },
  cheese_low_fat:{ es:"queso fresco batido 0%", en:"0% fresh cheese spread", fr:"fromage frais battu 0%", de:"körniger Frischkäse 0%", it:"formaggio fresco spalmabile 0%", pt:"queijo fresco batido 0%" },
  cheese_burgos: { es:"queso burgos", en:"Burgos fresh cheese", fr:"fromage frais Burgos", de:"Burgos-Frischkäse", it:"formaggio fresco Burgos", pt:"queijo fresco Burgos" },
  mozzarella:    { es:"mozzarella light", en:"light mozzarella", fr:"mozzarella light", de:"Light-Mozzarella", it:"mozzarella light", pt:"mozzarela light" },
  feta:          { es:"feta", en:"feta", fr:"feta", de:"Feta", it:"feta", pt:"feta" },
  parmesan:      { es:"queso parmesano", en:"parmesan cheese", fr:"parmesan", de:"Parmesan", it:"parmigiano", pt:"parmesão" },
  cheese_cured:  { es:"queso curado", en:"aged cheese", fr:"fromage affiné", de:"gereifter Käse", it:"formaggio stagionato", pt:"queijo curado" },
  cheese_semi:   { es:"queso semicurado", en:"semi-aged cheese", fr:"fromage mi-affiné", de:"halbfester Käse", it:"formaggio semistagionato", pt:"queijo meio-curado" },
  // Frutas
  banana:        { es:"plátano", en:"banana", fr:"banane", de:"Banane", it:"banana", pt:"banana" },
  banana_small:  { es:"plátano pequeño", en:"small banana", fr:"petite banane", de:"kleine Banane", it:"banana piccola", pt:"banana pequena" },
  apple:         { es:"manzana", en:"apple", fr:"pomme", de:"Apfel", it:"mela", pt:"maçã" },
  apple_small:   { es:"manzana pequeña", en:"small apple", fr:"petite pomme", de:"kleiner Apfel", it:"mela piccola", pt:"maçã pequena" },
  pear:          { es:"pera", en:"pear", fr:"poire", de:"Birne", it:"pera", pt:"pera" },
  kiwi:          { es:"kiwi", en:"kiwi", fr:"kiwi", de:"Kiwi", it:"kiwi", pt:"kiwi" },
  orange:        { es:"naranja", en:"orange", fr:"orange", de:"Orange", it:"arancia", pt:"laranja" },
  peach:         { es:"melocotón", en:"peach", fr:"pêche", de:"Pfirsich", it:"pesca", pt:"pêssego" },
  tangerine:     { es:"mandarina", en:"tangerine", fr:"mandarine", de:"Mandarine", it:"mandarino", pt:"tangerina" },
  grape:         { es:"uvas", en:"grapes", fr:"raisins", de:"Trauben", it:"uva", pt:"uvas" },
  berries:       { es:"frutos rojos", en:"mixed berries", fr:"fruits rouges", de:"Beeren", it:"frutti rossi", pt:"frutos vermelhos" },
  strawberry:    { es:"fresas", en:"strawberries", fr:"fraises", de:"Erdbeeren", it:"fragole", pt:"morangos" },
  blueberry:     { es:"arándanos", en:"blueberries", fr:"myrtilles", de:"Heidelbeeren", it:"mirtilli", pt:"mirtilos" },
  raspberry:     { es:"frambuesas", en:"raspberries", fr:"framboises", de:"Himbeeren", it:"lamponi", pt:"framboesas" },
  // Grasas / frutos secos
  walnut:        { es:"nueces", en:"walnuts", fr:"noix", de:"Walnüsse", it:"noci", pt:"nozes" },
  almond:        { es:"almendras", en:"almonds", fr:"amandes", de:"Mandeln", it:"mandorle", pt:"amêndoas" },
  hazelnut:      { es:"avellanas", en:"hazelnuts", fr:"noisettes", de:"Haselnüsse", it:"nocciole", pt:"avelãs" },
  cashew:        { es:"anacardos", en:"cashews", fr:"noix de cajou", de:"Cashewkerne", it:"anacardi", pt:"cajus" },
  pistachio:     { es:"pistachos", en:"pistachios", fr:"pistaches", de:"Pistazien", it:"pistacchi", pt:"pistácios" },
  chia:          { es:"semillas de chía", en:"chia seeds", fr:"graines de chia", de:"Chiasamen", it:"semi di chia", pt:"sementes de chia" },
  flax:          { es:"semillas de lino", en:"flax seeds", fr:"graines de lin", de:"Leinsamen", it:"semi di lino", pt:"sementes de linhaça" },
  pumpkin_seed:  { es:"semillas de calabaza", en:"pumpkin seeds", fr:"graines de courge", de:"Kürbiskerne", it:"semi di zucca", pt:"sementes de abóbora" },
  sesame:        { es:"sésamo", en:"sesame", fr:"sésame", de:"Sesam", it:"sesamo", pt:"gergelim" },
  avocado_half:  { es:"aguacate", en:"avocado", fr:"avocat", de:"Avocado", it:"avocado", pt:"abacate" },
  guacamole:     { es:"guacamole casero", en:"homemade guacamole", fr:"guacamole maison", de:"hausgemachte Guacamole", it:"guacamole fatto in casa", pt:"guacamole caseiro" },
  evoo:          { es:"AOVE", en:"extra virgin olive oil", fr:"huile d'olive vierge extra", de:"natives Olivenöl extra", it:"olio EVO", pt:"azeite extra virgem" },
  peanut_butter: { es:"crema de cacahuete 100%", en:"100% peanut butter", fr:"beurre de cacahuète 100%", de:"100% Erdnussbutter", it:"crema di arachidi 100%", pt:"manteiga de amendoim 100%" },
  // Verduras
  veg_steam:     { es:"verduras al vapor", en:"steamed vegetables", fr:"légumes vapeur", de:"gedämpftes Gemüse", it:"verdure al vapore", pt:"legumes a vapor" },
  broccoli:      { es:"brócoli", en:"broccoli", fr:"brocoli", de:"Brokkoli", it:"broccoli", pt:"brócolos" },
  asparagus:     { es:"espárragos verdes", en:"green asparagus", fr:"asperges vertes", de:"grüner Spargel", it:"asparagi verdi", pt:"espargos verdes" },
  zucchini:      { es:"calabacín", en:"zucchini", fr:"courgette", de:"Zucchini", it:"zucchina", pt:"courgette" },
  spinach:       { es:"espinacas salteadas", en:"sautéed spinach", fr:"épinards sautés", de:"gebratener Spinat", it:"spinaci saltati", pt:"espinafres salteados" },
  mixed_salad:   { es:"ensalada variada", en:"mixed salad", fr:"salade composée", de:"gemischter Salat", it:"insalata mista", pt:"salada mista" },
  rocket:        { es:"canónigos y rúcula", en:"lamb's lettuce & rocket", fr:"mâche et roquette", de:"Feldsalat & Rucola", it:"valeriana e rucola", pt:"alface e rúcula" },
  tomato_onion:  { es:"tomate + cebolla", en:"tomato + onion", fr:"tomate + oignon", de:"Tomate + Zwiebel", it:"pomodoro + cipolla", pt:"tomate + cebola" },
  cucumber:      { es:"pepino + zanahoria", en:"cucumber + carrot", fr:"concombre + carotte", de:"Gurke + Karotte", it:"cetriolo + carota", pt:"pepino + cenoura" },
  tomato:        { es:"tomate", en:"tomato", fr:"tomate", de:"Tomate", it:"pomodoro", pt:"tomate" },
  cherry_tomato: { es:"tomate cherry", en:"cherry tomato", fr:"tomate cerise", de:"Kirschtomate", it:"pomodoro ciliegino", pt:"tomate cherry" },
  tomato_grated: { es:"tomate triturado natural", en:"natural crushed tomato", fr:"tomate concassée nature", de:"passierte Tomaten natur", it:"pomodoro a pezzi naturale", pt:"tomate triturado natural" },
  // Extras
  honey:         { es:"miel", en:"honey", fr:"miel", de:"Honig", it:"miele", pt:"mel" },
  jam_nsa:       { es:"mermelada sin azúcar", en:"sugar-free jam", fr:"confiture sans sucre", de:"zuckerfreie Marmelade", it:"marmellata senza zucchero", pt:"compota sem açúcar" },
  cocoa:         { es:"cacao puro", en:"pure cocoa", fr:"cacao pur", de:"reines Kakao", it:"cacao puro", pt:"cacau puro" },
  dark_choc:     { es:"chocolate negro 85%", en:"85% dark chocolate", fr:"chocolat noir 85%", de:"Zartbitterschokolade 85%", it:"cioccolato fondente 85%", pt:"chocolate negro 85%" },
  hummus:        { es:"hummus casero", en:"homemade hummus", fr:"houmous maison", de:"hausgemachter Hummus", it:"hummus fatto in casa", pt:"húmus caseiro" },
  babaganoush:   { es:"babaganoush", en:"baba ganoush", fr:"baba ganousch", de:"Baba Ganoush", it:"baba ganoush", pt:"baba ganoush" },
  whey:          { es:"proteína whey", en:"whey protein", fr:"protéine whey", de:"Whey-Protein", it:"proteine whey", pt:"proteína whey" },
  pea_protein:   { es:"proteína vegana de guisante", en:"vegan pea protein", fr:"protéine vegan de pois", de:"veganes Erbsenprotein", it:"proteine vegane di pisello", pt:"proteína vegana de ervilha" },
  none_protein:  { es:"sin proteína en polvo", en:"no protein powder", fr:"sans protéine en poudre", de:"ohne Proteinpulver", it:"senza proteine in polvere", pt:"sem proteína em pó" },
};

export type FoodKey = keyof typeof FOOD;

/* Unidades — comunes en todas las lenguas */
export type Unit = "g" | "ml" | "pcs" | "tbsp" | "tsp";
const UNIT_PCS: Record<Lang6, string> = { es: "ud", en: "pc", fr: "pc", de: "St", it: "pz", pt: "un" };

export type PoolItem = { qty: number; unit: Unit; food: FoodKey; kcal: number };

export function formatIngredient(it: PoolItem, lang: Lang6, includeKcal = false): string {
  const food = FOOD[it.food]?.[lang] ?? FOOD[it.food]?.en ?? it.food;
  let base: string;
  if (it.unit === "pcs") {
    base = `${it.qty} ${food}`;
  } else {
    base = `${it.qty} ${it.unit}${CONNECTOR[lang]}${food}`;
  }
  return includeKcal ? `${base} · ${it.kcal} kcal` : base;
}
void UNIT_PCS; void NO_CONNECTOR_PIECES;

/* ============================== POOL ====================================== */
export const POOL = {
  oats:        [{ qty:60, unit:"g", food:"oats_flakes", kcal:220 }, { qty:60, unit:"g", food:"muesli", kcal:230 }, { qty:50, unit:"g", food:"cornflakes", kcal:185 }, { qty:60, unit:"g", food:"quinoa_raw", kcal:220 }],
  rice:        [{ qty:70, unit:"g", food:"rice_brown", kcal:245 }, { qty:70, unit:"g", food:"rice_basmati", kcal:250 }, { qty:70, unit:"g", food:"quinoa_raw", kcal:255 }, { qty:70, unit:"g", food:"couscous", kcal:260 }],
  pasta:       [{ qty:80, unit:"g", food:"pasta_whole", kcal:295 }, { qty:80, unit:"g", food:"pasta_wheat", kcal:285 }, { qty:80, unit:"g", food:"pasta_lentil", kcal:280 }, { qty:80, unit:"g", food:"noodles_rice", kcal:285 }],
  potato:      [{ qty:200, unit:"g", food:"potato_boiled", kcal:170 }, { qty:200, unit:"g", food:"sweet_potato", kcal:180 }, { qty:200, unit:"g", food:"cassava", kcal:320 }, { qty:200, unit:"g", food:"pumpkin", kcal:80 }],
  bread:       [{ qty:80, unit:"g", food:"bread_whole", kcal:200 }, { qty:70, unit:"g", food:"bread_roll", kcal:180 }, { qty:20, unit:"g", food:"corn_tortilla", kcal:80 }, { qty:60, unit:"g", food:"wrap_whole", kcal:170 }],
  bread_small: [{ qty:40, unit:"g", food:"bread_slice", kcal:100 }, { qty:20, unit:"g", food:"rice_cake", kcal:75 }, { qty:12, unit:"g", food:"biscote", kcal:45 }],
  poultry:     [{ qty:150, unit:"g", food:"chicken_breast", kcal:165 }, { qty:150, unit:"g", food:"turkey_breast", kcal:155 }, { qty:150, unit:"g", food:"chicken_thigh", kcal:200 }, { qty:150, unit:"g", food:"rabbit", kcal:180 }],
  white_fish:  [{ qty:180, unit:"g", food:"hake", kcal:145 }, { qty:180, unit:"g", food:"cod", kcal:150 }, { qty:180, unit:"g", food:"bream", kcal:175 }, { qty:180, unit:"g", food:"seabass", kcal:170 }, { qty:180, unit:"g", food:"monkfish", kcal:130 }],
  fat_fish:    [{ qty:150, unit:"g", food:"salmon", kcal:310 }, { qty:150, unit:"g", food:"tuna_fresh", kcal:220 }, { qty:150, unit:"g", food:"mackerel", kcal:280 }, { qty:150, unit:"g", food:"sardine", kcal:250 }],
  shellfish:   [{ qty:150, unit:"g", food:"shrimp", kcal:150 }, { qty:150, unit:"g", food:"mussel", kcal:130 }, { qty:150, unit:"g", food:"squid", kcal:140 }, { qty:150, unit:"g", food:"prawn", kcal:145 }],
  red_meat:    [{ qty:130, unit:"g", food:"beef_lean", kcal:200 }, { qty:130, unit:"g", food:"pork_loin", kcal:195 }, { qty:130, unit:"g", food:"beef_mince5", kcal:175 }],
  eggs2:       [{ qty:2, unit:"pcs", food:"egg_whole", kcal:145 }, { qty:3, unit:"pcs", food:"egg_white_yolk", kcal:125 }, { qty:4, unit:"pcs", food:"egg_white", kcal:70 }],
  eggs1:       [{ qty:1, unit:"pcs", food:"egg_whole", kcal:72 }, { qty:2, unit:"pcs", food:"egg_white", kcal:35 }],
  legumes:     [{ qty:150, unit:"g", food:"chickpea_cooked", kcal:240 }, { qty:150, unit:"g", food:"lentil_cooked", kcal:175 }, { qty:150, unit:"g", food:"bean_white", kcal:195 }, { qty:150, unit:"g", food:"edamame", kcal:180 }],
  legumes_dry: [{ qty:80, unit:"g", food:"lentil_dry", kcal:280 }, { qty:80, unit:"g", food:"chickpea_dry", kcal:290 }, { qty:80, unit:"g", food:"bean_dry", kcal:270 }],
  cured_meat:  [{ qty:40, unit:"g", food:"ham_cured", kcal:95 }, { qty:40, unit:"g", food:"turkey_slice", kcal:45 }, { qty:40, unit:"g", food:"ham_cooked", kcal:50 }, { qty:40, unit:"g", food:"cecina", kcal:75 }],
  canned_fish: [{ qty:50, unit:"g", food:"tuna_canned", kcal:60 }, { qty:50, unit:"g", food:"mackerel_can", kcal:75 }, { qty:50, unit:"g", food:"sardine_oil", kcal:130 }],
  smoked_fish: [{ qty:80, unit:"g", food:"salmon_smoked", kcal:115 }, { qty:80, unit:"g", food:"trout_smoked", kcal:110 }, { qty:80, unit:"g", food:"bonito_can", kcal:95 }],
  milk:        [{ qty:250, unit:"ml", food:"milk_skim", kcal:90 }, { qty:250, unit:"ml", food:"milk_semi", kcal:115 }, { qty:250, unit:"ml", food:"oat_drink", kcal:100 }, { qty:250, unit:"ml", food:"soy_drink", kcal:80 }],
  milk_small:  [{ qty:200, unit:"ml", food:"milk_skim", kcal:70 }, { qty:200, unit:"ml", food:"soy_drink", kcal:65 }, { qty:200, unit:"ml", food:"almond_drink", kcal:30 }],
  yogurt:      [{ qty:125, unit:"g", food:"yogurt_plain", kcal:75 }, { qty:125, unit:"g", food:"kefir", kcal:80 }, { qty:125, unit:"g", food:"yogurt_soy", kcal:60 }],
  greek_yog:   [{ qty:200, unit:"g", food:"greek_yogurt", kcal:120 }, { qty:200, unit:"g", food:"skyr", kcal:130 }, { qty:200, unit:"g", food:"quark", kcal:145 }, { qty:200, unit:"g", food:"cottage_cheese", kcal:195 }],
  fresh_cheese:[{ qty:30, unit:"g", food:"cheese_low_fat", kcal:22 }, { qty:30, unit:"g", food:"cheese_burgos", kcal:50 }, { qty:30, unit:"g", food:"mozzarella", kcal:60 }, { qty:30, unit:"g", food:"feta", kcal:80 }],
  hard_cheese: [{ qty:20, unit:"g", food:"parmesan", kcal:80 }, { qty:20, unit:"g", food:"cheese_cured", kcal:80 }, { qty:20, unit:"g", food:"cheese_semi", kcal:70 }],
  fruit_med:   [{ qty:1, unit:"pcs", food:"banana", kcal:105 }, { qty:1, unit:"pcs", food:"apple", kcal:95 }, { qty:1, unit:"pcs", food:"pear", kcal:100 }, { qty:2, unit:"pcs", food:"kiwi", kcal:90 }, { qty:1, unit:"pcs", food:"orange", kcal:85 }, { qty:1, unit:"pcs", food:"peach", kcal:60 }],
  fruit_small: [{ qty:1, unit:"pcs", food:"apple_small", kcal:70 }, { qty:1, unit:"pcs", food:"tangerine", kcal:45 }, { qty:1, unit:"pcs", food:"kiwi", kcal:50 }, { qty:120, unit:"g", food:"grape", kcal:85 }, { qty:1, unit:"pcs", food:"banana_small", kcal:80 }],
  berries:     [{ qty:100, unit:"g", food:"berries", kcal:45 }, { qty:100, unit:"g", food:"strawberry", kcal:32 }, { qty:100, unit:"g", food:"blueberry", kcal:57 }, { qty:100, unit:"g", food:"raspberry", kcal:52 }],
  nuts:        [{ qty:20, unit:"g", food:"walnut", kcal:130 }, { qty:20, unit:"g", food:"almond", kcal:120 }, { qty:20, unit:"g", food:"hazelnut", kcal:125 }, { qty:20, unit:"g", food:"cashew", kcal:115 }, { qty:20, unit:"g", food:"pistachio", kcal:115 }],
  nuts_small:  [{ qty:15, unit:"g", food:"almond", kcal:90 }, { qty:15, unit:"g", food:"walnut", kcal:100 }, { qty:15, unit:"g", food:"pistachio", kcal:85 }, { qty:15, unit:"g", food:"hazelnut", kcal:95 }],
  seeds:       [{ qty:10, unit:"g", food:"chia", kcal:50 }, { qty:10, unit:"g", food:"flax", kcal:53 }, { qty:10, unit:"g", food:"pumpkin_seed", kcal:55 }, { qty:10, unit:"g", food:"sesame", kcal:57 }],
  avocado:     [{ qty:75, unit:"g", food:"avocado_half", kcal:120 }, { qty:40, unit:"g", food:"avocado_half", kcal:65 }, { qty:60, unit:"g", food:"guacamole", kcal:100 }],
  aove:        [{ qty:10, unit:"ml", food:"evoo", kcal:90 }, { qty:5, unit:"ml", food:"evoo", kcal:45 }, { qty:15, unit:"ml", food:"evoo", kcal:135 }, { qty:10, unit:"g", food:"peanut_butter", kcal:60 }],
  veggies_low: [{ qty:150, unit:"g", food:"veg_steam", kcal:40 }, { qty:150, unit:"g", food:"broccoli", kcal:50 }, { qty:150, unit:"g", food:"asparagus", kcal:30 }, { qty:150, unit:"g", food:"zucchini", kcal:25 }, { qty:150, unit:"g", food:"spinach", kcal:35 }],
  salad:       [{ qty:100, unit:"g", food:"mixed_salad", kcal:30 }, { qty:100, unit:"g", food:"rocket", kcal:25 }, { qty:100, unit:"g", food:"tomato_onion", kcal:35 }, { qty:100, unit:"g", food:"cucumber", kcal:30 }],
  tomato:      [{ qty:100, unit:"g", food:"tomato", kcal:18 }, { qty:100, unit:"g", food:"cherry_tomato", kcal:20 }, { qty:100, unit:"g", food:"tomato_grated", kcal:22 }],
  sweet:       [{ qty:10, unit:"g", food:"honey", kcal:30 }, { qty:10, unit:"g", food:"jam_nsa", kcal:15 }, { qty:5, unit:"g", food:"cocoa", kcal:15 }, { qty:20, unit:"g", food:"dark_choc", kcal:110 }],
  hummus:      [{ qty:60, unit:"g", food:"hummus", kcal:100 }, { qty:60, unit:"g", food:"babaganoush", kcal:90 }, { qty:60, unit:"g", food:"guacamole", kcal:95 }],
  protein_pw:  [{ qty:30, unit:"g", food:"whey", kcal:115 }, { qty:30, unit:"g", food:"pea_protein", kcal:110 }, { qty:0, unit:"g", food:"none_protein", kcal:0 }],
} as const satisfies Record<string, readonly PoolItem[]>;

export type Tag = keyof typeof POOL;

/* ============================ RECIPE NAMES ================================ */
export const RECIPE: Record<string, L> = {
  // Breakfast
  r_oat_bowl:     { es:"Avena con leche, fruta y frutos secos", en:"Oatmeal with milk, fruit and nuts", fr:"Porridge au lait, fruits et noix", de:"Haferflocken mit Milch, Obst und Nüssen", it:"Avena con latte, frutta e noci", pt:"Aveia com leite, fruta e frutos secos" },
  r_toast_avo:    { es:"Tostadas con aguacate y huevos", en:"Avocado toast with eggs", fr:"Toast à l'avocat et œufs", de:"Avocado-Toast mit Eiern", it:"Tostadas con avocado e uova", pt:"Tostas com abacate e ovos" },
  r_greek_bowl:   { es:"Yogur griego con frutos rojos y granola", en:"Greek yogurt with berries and granola", fr:"Yaourt grec aux fruits rouges et granola", de:"Griechischer Joghurt mit Beeren und Granola", it:"Yogurt greco con frutti rossi e granola", pt:"Iogurte grego com frutos vermelhos e granola" },
  r_omelette_sp:  { es:"Tortilla con espinacas y queso fresco", en:"Omelette with spinach and fresh cheese", fr:"Omelette aux épinards et fromage frais", de:"Omelett mit Spinat und Frischkäse", it:"Frittata con spinaci e formaggio fresco", pt:"Omelete com espinafres e queijo fresco" },
  r_smoothie:     { es:"Smoothie bowl proteico", en:"Protein smoothie bowl", fr:"Smoothie bowl protéiné", de:"Protein-Smoothie-Bowl", it:"Smoothie bowl proteico", pt:"Smoothie bowl proteico" },
  r_skyr_kiwi:    { es:"Skyr con kiwi y almendras", en:"Skyr with kiwi and almonds", fr:"Skyr au kiwi et amandes", de:"Skyr mit Kiwi und Mandeln", it:"Skyr con kiwi e mandorle", pt:"Skyr com kiwi e amêndoas" },
  r_toast_ham:    { es:"Tostadas con tomate y jamón serrano", en:"Toast with tomato and cured ham", fr:"Toasts à la tomate et jambon cru", de:"Toast mit Tomate und Serrano-Schinken", it:"Tostadas con pomodoro e prosciutto crudo", pt:"Tostas com tomate e presunto curado" },
  r_porridge:     { es:"Porridge con manzana y canela", en:"Porridge with apple and cinnamon", fr:"Porridge à la pomme et cannelle", de:"Porridge mit Apfel und Zimt", it:"Porridge con mela e cannella", pt:"Papas de aveia com maçã e canela" },
  r_wrap_egg:     { es:"Wrap de huevo y aguacate", en:"Egg and avocado wrap", fr:"Wrap œuf et avocat", de:"Wrap mit Ei und Avocado", it:"Wrap di uovo e avocado", pt:"Wrap de ovo e abacate" },
  r_sandwich:     { es:"Sándwich de pavo y queso fresco", en:"Turkey and fresh cheese sandwich", fr:"Sandwich dinde et fromage frais", de:"Puten-Frischkäse-Sandwich", it:"Sandwich di tacchino e formaggio fresco", pt:"Sanduíche de peru e queijo fresco" },
  // Breakfast 2
  r_fruit_nuts:   { es:"Fruta + puñado de frutos secos", en:"Fruit + handful of nuts", fr:"Fruit + poignée de noix", de:"Obst + eine Handvoll Nüsse", it:"Frutta + manciata di noci", pt:"Fruta + punhado de frutos secos" },
  r_yogurt_honey: { es:"Yogur natural con miel", en:"Plain yogurt with honey", fr:"Yaourt nature au miel", de:"Naturjoghurt mit Honig", it:"Yogurt naturale con miele", pt:"Iogurte natural com mel" },
  r_toast_cheese: { es:"Tostada pequeña con queso y mermelada sin azúcar", en:"Small toast with cheese and sugar-free jam", fr:"Petite tartine fromage et confiture sans sucre", de:"Kleiner Toast mit Käse und zuckerfreier Marmelade", it:"Tostada piccola con formaggio e marmellata senza zucchero", pt:"Tosta pequena com queijo e compota sem açúcar" },
  r_coffee_toast: { es:"Café con leche y tostada", en:"Café au lait with toast", fr:"Café au lait et toast", de:"Milchkaffee mit Toast", it:"Caffellatte e tostada", pt:"Café com leite e tosta" },
  r_banana_shake: { es:"Batido suave de plátano y leche", en:"Smooth banana and milk shake", fr:"Smoothie léger banane et lait", de:"Sanfter Bananen-Milch-Shake", it:"Frullato leggero banana e latte", pt:"Batido suave de banana e leite" },
  r_fruit_bowl:   { es:"Bowl de fruta con yogur", en:"Fruit bowl with yogurt", fr:"Bowl de fruits au yaourt", de:"Obst-Bowl mit Joghurt", it:"Bowl di frutta con yogurt", pt:"Bowl de fruta com iogurte" },
  r_toast_avo_s:  { es:"Tostada con aguacate", en:"Avocado toast", fr:"Tartine à l'avocat", de:"Toast mit Avocado", it:"Tostada con avocado", pt:"Tosta com abacate" },
  r_rice_pb:      { es:"Tortita de arroz con crema de cacahuete", en:"Rice cake with peanut butter", fr:"Galette de riz au beurre de cacahuète", de:"Reiswaffel mit Erdnussbutter", it:"Galletta di riso con crema di arachidi", pt:"Tortita de arroz com manteiga de amendoim" },
  r_fruit_turkey: { es:"Pieza de fruta + lonchas de pavo", en:"Piece of fruit + turkey slices", fr:"Fruit + tranches de dinde", de:"Obststück + Putenscheiben", it:"Frutto + fette di tacchino", pt:"Peça de fruta + fatias de peru" },
  r_nuts_small:   { es:"Pequeño puñado de frutos secos", en:"Small handful of nuts", fr:"Petite poignée de noix", de:"Kleine Handvoll Nüsse", it:"Piccola manciata di noci", pt:"Pequeno punhado de frutos secos" },
  // Lunch
  r_rice_chick:   { es:"Arroz con pollo y verduras al wok", en:"Rice with chicken and wok vegetables", fr:"Riz au poulet et légumes wok", de:"Reis mit Hähnchen und Wokgemüse", it:"Riso con pollo e verdure al wok", pt:"Arroz com frango e legumes ao wok" },
  r_salmon_quin:  { es:"Salmón al horno con quinoa y espárragos", en:"Baked salmon with quinoa and asparagus", fr:"Saumon au four, quinoa et asperges", de:"Ofen-Lachs mit Quinoa und Spargel", it:"Salmone al forno con quinoa e asparagi", pt:"Salmão no forno com quinoa e espargos" },
  r_lentil_stew:  { es:"Lentejas estofadas con verduras", en:"Lentil stew with vegetables", fr:"Lentilles mijotées aux légumes", de:"Linseneintopf mit Gemüse", it:"Lenticchie stufate con verdure", pt:"Lentilhas estufadas com legumes" },
  r_pasta_tuna:   { es:"Pasta integral con atún y tomate", en:"Whole-grain pasta with tuna and tomato", fr:"Pâtes complètes au thon et tomate", de:"Vollkornnudeln mit Thunfisch und Tomate", it:"Pasta integrale con tonno e pomodoro", pt:"Massa integral com atum e tomate" },
  r_chickpea_avo: { es:"Bowl de garbanzos, aguacate y huevo", en:"Chickpea, avocado and egg bowl", fr:"Bowl pois chiches, avocat et œuf", de:"Kichererbsen-, Avocado- und Ei-Bowl", it:"Bowl di ceci, avocado e uovo", pt:"Bowl de grão-de-bico, abacate e ovo" },
  r_turkey_sw:    { es:"Pavo con boniato y ensalada", en:"Turkey with sweet potato and salad", fr:"Dinde, patate douce et salade", de:"Pute mit Süßkartoffel und Salat", it:"Tacchino con patata dolce e insalata", pt:"Peru com batata-doce e salada" },
  r_cod_legumes:  { es:"Bacalao con garbanzos y espinacas", en:"Cod with chickpeas and spinach", fr:"Cabillaud aux pois chiches et épinards", de:"Kabeljau mit Kichererbsen und Spinat", it:"Merluzzo con ceci e spinaci", pt:"Bacalhau com grão-de-bico e espinafres" },
  r_burger:       { es:"Hamburguesa casera con boniato", en:"Homemade burger with sweet potato", fr:"Burger maison à la patate douce", de:"Hausgemachter Burger mit Süßkartoffel", it:"Hamburger fatto in casa con patata dolce", pt:"Hambúrguer caseiro com batata-doce" },
  r_rice_shrimp:  { es:"Arroz salteado con gambas", en:"Stir-fried rice with shrimp", fr:"Riz sauté aux crevettes", de:"Gebratener Reis mit Garnelen", it:"Riso saltato con gamberi", pt:"Arroz salteado com camarão" },
  r_chick_salad:  { es:"Ensalada de pollo, quinoa y aguacate", en:"Chicken, quinoa and avocado salad", fr:"Salade poulet, quinoa et avocat", de:"Hähnchen-, Quinoa- und Avocado-Salat", it:"Insalata di pollo, quinoa e avocado", pt:"Salada de frango, quinoa e abacate" },
  // Snack
  r_yog_nuts:     { es:"Yogur con frutos secos", en:"Yogurt with nuts", fr:"Yaourt aux noix", de:"Joghurt mit Nüssen", it:"Yogurt con noci", pt:"Iogurte com frutos secos" },
  r_toast_turkey: { es:"Tostada con pavo y queso fresco", en:"Toast with turkey and fresh cheese", fr:"Toast dinde et fromage frais", de:"Toast mit Pute und Frischkäse", it:"Tostada con tacchino e formaggio fresco", pt:"Tosta com peru e queijo fresco" },
  r_protein_sh:   { es:"Batido de proteína con plátano", en:"Protein shake with banana", fr:"Shake protéiné à la banane", de:"Protein-Shake mit Banane", it:"Frullato proteico con banana", pt:"Batido de proteína com banana" },
  r_apple_pb:     { es:"Manzana con crema de cacahuete", en:"Apple with peanut butter", fr:"Pomme au beurre de cacahuète", de:"Apfel mit Erdnussbutter", it:"Mela con crema di arachidi", pt:"Maçã com manteiga de amendoim" },
  r_hummus_veg:   { es:"Hummus con palitos de verdura", en:"Hummus with veggie sticks", fr:"Houmous et bâtonnets de légumes", de:"Hummus mit Gemüsesticks", it:"Hummus con bastoncini di verdura", pt:"Húmus com palitos de legumes" },
  r_skyr_honey:   { es:"Bol de skyr con miel y nueces", en:"Skyr bowl with honey and walnuts", fr:"Bowl de skyr au miel et noix", de:"Skyr-Bowl mit Honig und Walnüssen", it:"Bowl di skyr con miele e noci", pt:"Bowl de skyr com mel e nozes" },
  r_rice_tuna:    { es:"Tortita de arroz con atún", en:"Rice cake with tuna", fr:"Galette de riz au thon", de:"Reiswaffel mit Thunfisch", it:"Galletta di riso con tonno", pt:"Tortita de arroz com atum" },
  r_mini_sand:    { es:"Mini bocadillo de pavo", en:"Mini turkey sandwich", fr:"Mini sandwich à la dinde", de:"Mini-Putensandwich", it:"Mini panino di tacchino", pt:"Mini sanduíche de peru" },
  r_fruit_yog:    { es:"Macedonia de frutas con yogur", en:"Fruit salad with yogurt", fr:"Salade de fruits au yaourt", de:"Obstsalat mit Joghurt", it:"Macedonia di frutta con yogurt", pt:"Salada de fruta com iogurte" },
  r_choc_almond:  { es:"Chocolate negro 85% + almendras", en:"85% dark chocolate + almonds", fr:"Chocolat noir 85% + amandes", de:"85% Zartbitterschokolade + Mandeln", it:"Cioccolato fondente 85% + mandorle", pt:"Chocolate negro 85% + amêndoas" },
  // Dinner
  r_chick_sw:     { es:"Pollo a la plancha con boniato y ensalada", en:"Grilled chicken with sweet potato and salad", fr:"Poulet grillé, patate douce et salade", de:"Gegrilltes Hähnchen mit Süßkartoffel und Salat", it:"Pollo alla piastra con patata dolce e insalata", pt:"Frango grelhado com batata-doce e salada" },
  r_hake_veg:     { es:"Merluza al horno con verduras", en:"Baked hake with vegetables", fr:"Merlu au four et légumes", de:"Ofen-Seehecht mit Gemüse", it:"Nasello al forno con verdure", pt:"Pescada no forno com legumes" },
  r_cream_omel:   { es:"Crema de verdura + tortilla", en:"Vegetable cream + omelette", fr:"Velouté de légumes + omelette", de:"Gemüsecreme + Omelett", it:"Crema di verdure + frittata", pt:"Creme de legumes + omelete" },
  r_wok_prawn:    { es:"Wok de gambas con verduras y fideos", en:"Prawn wok with vegetables and noodles", fr:"Wok de crevettes, légumes et nouilles", de:"Garnelen-Wok mit Gemüse und Nudeln", it:"Wok di gamberi con verdure e spaghetti", pt:"Wok de camarão com legumes e noodles" },
  r_omel_salmon:  { es:"Tortilla de claras con salmón ahumado", en:"Egg white omelette with smoked salmon", fr:"Omelette de blancs au saumon fumé", de:"Eiweiß-Omelett mit Räucherlachs", it:"Frittata di albumi con salmone affumicato", pt:"Omelete de claras com salmão fumado" },
  r_bream_pot:    { es:"Dorada al horno con patata", en:"Baked sea bream with potato", fr:"Dorade au four et pommes de terre", de:"Ofen-Dorade mit Kartoffel", it:"Orata al forno con patate", pt:"Dourada no forno com batata" },
  r_chick_avo_s:  { es:"Ensalada templada de pollo y aguacate", en:"Warm chicken and avocado salad", fr:"Salade tiède poulet avocat", de:"Lauwarmer Hähnchen-Avocado-Salat", it:"Insalata tiepida di pollo e avocado", pt:"Salada morna de frango e abacate" },
  r_turkey_curry: { es:"Pavo al curry con arroz basmati", en:"Curry turkey with basmati rice", fr:"Dinde au curry et riz basmati", de:"Putencurry mit Basmatireis", it:"Tacchino al curry con riso basmati", pt:"Peru ao caril com arroz basmati" },
  r_salmon_asp:   { es:"Salmón con espárragos y quinoa", en:"Salmon with asparagus and quinoa", fr:"Saumon, asperges et quinoa", de:"Lachs mit Spargel und Quinoa", it:"Salmone con asparagi e quinoa", pt:"Salmão com espargos e quinoa" },
  r_scramble:     { es:"Revuelto de champiñones, gambas y huevo", en:"Mushroom, shrimp and egg scramble", fr:"Brouillade champignons, crevettes et œuf", de:"Rührei mit Champignons und Garnelen", it:"Uova strapazzate con funghi e gamberi", pt:"Mexido de cogumelos, camarão e ovo" },
  // Auto recipes (generated from preferred ingredients)
  r_bowl_pref:    { es:"Bowl con tus ingredientes", en:"Bowl with your ingredients", fr:"Bowl avec vos ingrédients", de:"Bowl mit deinen Zutaten", it:"Bowl con i tuoi ingredienti", pt:"Bowl com os teus ingredientes" },
  r_saute_pref:   { es:"Salteado con tus ingredientes", en:"Stir-fry with your ingredients", fr:"Sauté avec vos ingrédients", de:"Pfannengericht mit deinen Zutaten", it:"Saltato con i tuoi ingredienti", pt:"Salteado com os teus ingredientes" },
  r_salad_pref:   { es:"Ensalada con tus ingredientes", en:"Salad with your ingredients", fr:"Salade avec vos ingrédients", de:"Salat mit deinen Zutaten", it:"Insalata con i tuoi ingredienti", pt:"Salada com os teus ingredientes" },
  r_plate_pref:   { es:"Plato combinado con tus ingredientes", en:"Combo plate with your ingredients", fr:"Assiette composée avec vos ingrédients", de:"Combo-Teller mit deinen Zutaten", it:"Piatto unico con i tuoi ingredienti", pt:"Prato combinado com os teus ingredientes" },
};

export type RecipeKey = keyof typeof RECIPE;

/* ============================ MEALS DEFAULT =============================== */
export type Ingredient = { tag: Tag; index: number };
export type Item = { name: RecipeKey; ingredients: Ingredient[]; auto?: boolean };
export type MealKey = "breakfast" | "breakfast2" | "lunch" | "snack" | "dinner";

export const DEFAULT_MEALS: Record<MealKey, Item[]> = {
  breakfast: [
    { name:"r_oat_bowl",   ingredients:[{tag:"oats",index:0},{tag:"milk",index:0},{tag:"fruit_med",index:0},{tag:"nuts",index:0},{tag:"sweet",index:0}] },
    { name:"r_toast_avo",  ingredients:[{tag:"bread",index:0},{tag:"avocado",index:0},{tag:"eggs2",index:0},{tag:"tomato",index:0},{tag:"aove",index:1}] },
    { name:"r_greek_bowl", ingredients:[{tag:"greek_yog",index:0},{tag:"berries",index:0},{tag:"oats",index:1},{tag:"sweet",index:0}] },
    { name:"r_omelette_sp",ingredients:[{tag:"eggs2",index:1},{tag:"veggies_low",index:4},{tag:"fresh_cheese",index:0},{tag:"bread_small",index:0}] },
    { name:"r_smoothie",   ingredients:[{tag:"fruit_med",index:0},{tag:"berries",index:0},{tag:"protein_pw",index:0},{tag:"oats",index:0},{tag:"seeds",index:0}] },
    { name:"r_skyr_kiwi",  ingredients:[{tag:"greek_yog",index:1},{tag:"fruit_med",index:3},{tag:"nuts",index:1}] },
    { name:"r_toast_ham",  ingredients:[{tag:"bread",index:0},{tag:"tomato",index:0},{tag:"cured_meat",index:0},{tag:"aove",index:0}] },
    { name:"r_porridge",   ingredients:[{tag:"oats",index:0},{tag:"milk",index:0},{tag:"fruit_med",index:1},{tag:"nuts_small",index:0}] },
    { name:"r_wrap_egg",   ingredients:[{tag:"bread",index:3},{tag:"eggs2",index:0},{tag:"avocado",index:0},{tag:"veggies_low",index:4}] },
    { name:"r_sandwich",   ingredients:[{tag:"bread",index:0},{tag:"cured_meat",index:1},{tag:"fresh_cheese",index:0},{tag:"tomato",index:0}] },
  ],
  breakfast2: [
    { name:"r_fruit_nuts",   ingredients:[{tag:"fruit_med",index:1},{tag:"nuts_small",index:0}] },
    { name:"r_yogurt_honey", ingredients:[{tag:"yogurt",index:0},{tag:"sweet",index:0}] },
    { name:"r_toast_cheese", ingredients:[{tag:"bread_small",index:0},{tag:"fresh_cheese",index:0},{tag:"sweet",index:1}] },
    { name:"r_coffee_toast", ingredients:[{tag:"milk_small",index:0},{tag:"bread_small",index:0},{tag:"aove",index:1}] },
    { name:"r_banana_shake", ingredients:[{tag:"fruit_med",index:0},{tag:"milk",index:0},{tag:"sweet",index:2}] },
    { name:"r_fruit_bowl",   ingredients:[{tag:"berries",index:1},{tag:"fruit_small",index:2},{tag:"yogurt",index:0}] },
    { name:"r_toast_avo_s",  ingredients:[{tag:"bread_small",index:0},{tag:"avocado",index:0}] },
    { name:"r_rice_pb",      ingredients:[{tag:"bread_small",index:1},{tag:"aove",index:3},{tag:"fruit_small",index:0}] },
    { name:"r_fruit_turkey", ingredients:[{tag:"fruit_med",index:1},{tag:"cured_meat",index:1}] },
    { name:"r_nuts_small",   ingredients:[{tag:"nuts",index:1}] },
  ],
  lunch: [
    { name:"r_rice_chick",  ingredients:[{tag:"rice",index:0},{tag:"poultry",index:0},{tag:"veggies_low",index:1},{tag:"aove",index:1}] },
    { name:"r_salmon_quin", ingredients:[{tag:"fat_fish",index:0},{tag:"rice",index:2},{tag:"veggies_low",index:2},{tag:"aove",index:0}] },
    { name:"r_lentil_stew", ingredients:[{tag:"legumes_dry",index:0},{tag:"veggies_low",index:0},{tag:"tomato",index:0},{tag:"aove",index:0}] },
    { name:"r_pasta_tuna",  ingredients:[{tag:"pasta",index:0},{tag:"canned_fish",index:0},{tag:"tomato",index:2},{tag:"hard_cheese",index:0},{tag:"aove",index:1}] },
    { name:"r_chickpea_avo",ingredients:[{tag:"legumes",index:0},{tag:"avocado",index:0},{tag:"eggs1",index:0},{tag:"salad",index:0},{tag:"aove",index:0}] },
    { name:"r_turkey_sw",   ingredients:[{tag:"poultry",index:1},{tag:"potato",index:1},{tag:"salad",index:0},{tag:"aove",index:0}] },
    { name:"r_cod_legumes", ingredients:[{tag:"white_fish",index:1},{tag:"legumes",index:0},{tag:"veggies_low",index:4},{tag:"aove",index:0}] },
    { name:"r_burger",      ingredients:[{tag:"red_meat",index:0},{tag:"bread",index:0},{tag:"potato",index:1},{tag:"salad",index:0},{tag:"aove",index:1}] },
    { name:"r_rice_shrimp", ingredients:[{tag:"rice",index:1},{tag:"shellfish",index:0},{tag:"eggs1",index:0},{tag:"veggies_low",index:0},{tag:"aove",index:1}] },
    { name:"r_chick_salad", ingredients:[{tag:"poultry",index:0},{tag:"rice",index:2},{tag:"avocado",index:0},{tag:"salad",index:0},{tag:"aove",index:0}] },
  ],
  snack: [
    { name:"r_yog_nuts",     ingredients:[{tag:"yogurt",index:0},{tag:"nuts",index:1}] },
    { name:"r_toast_turkey", ingredients:[{tag:"bread_small",index:0},{tag:"cured_meat",index:1},{tag:"fresh_cheese",index:0},{tag:"tomato",index:0}] },
    { name:"r_protein_sh",   ingredients:[{tag:"protein_pw",index:0},{tag:"milk",index:0},{tag:"fruit_med",index:0}] },
    { name:"r_apple_pb",     ingredients:[{tag:"fruit_med",index:1},{tag:"aove",index:3}] },
    { name:"r_hummus_veg",   ingredients:[{tag:"hummus",index:0},{tag:"salad",index:3}] },
    { name:"r_skyr_honey",   ingredients:[{tag:"greek_yog",index:1},{tag:"sweet",index:0},{tag:"nuts_small",index:1}] },
    { name:"r_rice_tuna",    ingredients:[{tag:"bread_small",index:1},{tag:"canned_fish",index:0},{tag:"tomato",index:0}] },
    { name:"r_mini_sand",    ingredients:[{tag:"bread",index:1},{tag:"cured_meat",index:2},{tag:"fresh_cheese",index:0}] },
    { name:"r_fruit_yog",    ingredients:[{tag:"fruit_small",index:0},{tag:"berries",index:1},{tag:"yogurt",index:0}] },
    { name:"r_choc_almond",  ingredients:[{tag:"sweet",index:3},{tag:"nuts_small",index:0}] },
  ],
  dinner: [
    { name:"r_chick_sw",     ingredients:[{tag:"poultry",index:0},{tag:"potato",index:1},{tag:"salad",index:0},{tag:"aove",index:0}] },
    { name:"r_hake_veg",     ingredients:[{tag:"white_fish",index:0},{tag:"veggies_low",index:3},{tag:"aove",index:0}] },
    { name:"r_cream_omel",   ingredients:[{tag:"veggies_low",index:0},{tag:"potato",index:3},{tag:"eggs2",index:0},{tag:"fresh_cheese",index:0}] },
    { name:"r_wok_prawn",    ingredients:[{tag:"shellfish",index:0},{tag:"pasta",index:3},{tag:"veggies_low",index:1},{tag:"aove",index:1}] },
    { name:"r_omel_salmon",  ingredients:[{tag:"eggs2",index:2},{tag:"smoked_fish",index:0},{tag:"veggies_low",index:4},{tag:"bread_small",index:0}] },
    { name:"r_bream_pot",    ingredients:[{tag:"white_fish",index:2},{tag:"potato",index:0},{tag:"aove",index:0}] },
    { name:"r_chick_avo_s",  ingredients:[{tag:"poultry",index:0},{tag:"avocado",index:0},{tag:"salad",index:0},{tag:"aove",index:0}] },
    { name:"r_turkey_curry", ingredients:[{tag:"poultry",index:1},{tag:"rice",index:1},{tag:"veggies_low",index:0},{tag:"aove",index:1}] },
    { name:"r_salmon_asp",   ingredients:[{tag:"fat_fish",index:0},{tag:"veggies_low",index:2},{tag:"rice",index:2},{tag:"aove",index:1}] },
    { name:"r_scramble",     ingredients:[{tag:"veggies_low",index:0},{tag:"shellfish",index:0},{tag:"eggs2",index:0},{tag:"bread_small",index:0}] },
  ],
};

/* ====================== PREFERRED INGREDIENTS ============================ */
/* Categorías para selección de "Ingredientes preferidos".
   Cada categoría apunta a tags del POOL. */
export type PrefCategory = "protein" | "carb" | "veg" | "fruit" | "dairy" | "fat";
export const PREF_TAGS: Record<PrefCategory, Tag[]> = {
  protein: ["poultry", "white_fish", "fat_fish", "shellfish", "red_meat", "eggs2", "legumes", "cured_meat", "canned_fish", "smoked_fish"],
  carb:    ["oats", "rice", "pasta", "potato", "bread"],
  veg:     ["veggies_low", "salad", "tomato"],
  fruit:   ["fruit_med", "fruit_small", "berries"],
  dairy:   ["milk", "yogurt", "greek_yog", "fresh_cheese"],
  fat:     ["nuts", "seeds", "avocado", "aove"],
};

/* Plantillas de receta para auto-generar 4 platos por comida usando preferencias */
const TEMPLATES: Record<MealKey, { name: RecipeKey; cats: PrefCategory[] }[]> = {
  breakfast: [
    { name:"r_bowl_pref",  cats:["dairy","fruit","carb","fat"] },
    { name:"r_plate_pref", cats:["carb","protein","fruit"] },
    { name:"r_salad_pref", cats:["dairy","fruit","fat"] },
    { name:"r_saute_pref", cats:["protein","carb","veg"] },
  ],
  breakfast2: [
    { name:"r_bowl_pref",  cats:["fruit","dairy","fat"] },
    { name:"r_plate_pref", cats:["carb","dairy"] },
    { name:"r_salad_pref", cats:["fruit","fat"] },
    { name:"r_saute_pref", cats:["protein","carb"] },
  ],
  lunch: [
    { name:"r_bowl_pref",  cats:["carb","protein","veg","fat"] },
    { name:"r_saute_pref", cats:["protein","carb","veg","fat"] },
    { name:"r_salad_pref", cats:["protein","carb","veg","fat"] },
    { name:"r_plate_pref", cats:["protein","carb","veg","fat"] },
  ],
  snack: [
    { name:"r_bowl_pref",  cats:["dairy","fruit","fat"] },
    { name:"r_plate_pref", cats:["carb","protein"] },
    { name:"r_salad_pref", cats:["fruit","dairy"] },
    { name:"r_saute_pref", cats:["protein","veg"] },
  ],
  dinner: [
    { name:"r_bowl_pref",  cats:["protein","veg","carb","fat"] },
    { name:"r_saute_pref", cats:["protein","veg","fat"] },
    { name:"r_salad_pref", cats:["protein","veg","fat"] },
    { name:"r_plate_pref", cats:["protein","carb","veg","fat"] },
  ],
};

/** Genera 4 recetas a partir de los tags preferidos del usuario */
export function generatePreferredMeals(meal: MealKey, preferredTags: Set<Tag>): Item[] {
  const tpls = TEMPLATES[meal];
  return tpls.map((tpl): Item => {
    const ingredients: Ingredient[] = [];
    for (const cat of tpl.cats) {
      const candidates = PREF_TAGS[cat].filter((tag) => preferredTags.has(tag));
      const tag = candidates.length > 0
        ? candidates[Math.floor(Math.random() * candidates.length)]
        : PREF_TAGS[cat][0];
      ingredients.push({ tag, index: 0 });
    }
    return { name: tpl.name, ingredients, auto: true };
  });
}

/* ============================ FOOD DENSITY ================================ */
/* Tabla kcal/100 g con sinónimos en ES/EN para "Añadir manualmente".
   Si el usuario escribe un alimento, calculamos la cantidad necesaria
   para cubrir las kcal del ingrediente original. */
export const DENSITY: { keys: string[]; kcalPer100g: number; unit: "g" | "ml" | "pcs" }[] = [
  // Proteínas
  { keys:["pollo","chicken","pechuga de pollo","chicken breast"], kcalPer100g:110, unit:"g" },
  { keys:["pavo","turkey"], kcalPer100g:105, unit:"g" },
  { keys:["ternera","beef","vaca"], kcalPer100g:155, unit:"g" },
  { keys:["cerdo","pork","solomillo"], kcalPer100g:150, unit:"g" },
  { keys:["salmon","salmón","salmon ahumado","smoked salmon"], kcalPer100g:200, unit:"g" },
  { keys:["atun","atún","tuna","atun al natural"], kcalPer100g:120, unit:"g" },
  { keys:["merluza","hake","bacalao","cod","dorada","lubina","rape","white fish","pescado blanco"], kcalPer100g:85, unit:"g" },
  { keys:["sardina","sardine","caballa","mackerel"], kcalPer100g:180, unit:"g" },
  { keys:["gambas","shrimp","camaron","prawn","langostino"], kcalPer100g:95, unit:"g" },
  { keys:["mejillon","mussel"], kcalPer100g:85, unit:"g" },
  { keys:["calamar","squid","pulpo","octopus"], kcalPer100g:90, unit:"g" },
  { keys:["huevo","egg"], kcalPer100g:155, unit:"g" },
  { keys:["clara","egg white"], kcalPer100g:50, unit:"g" },
  { keys:["jamon","jamón","ham","jamón serrano"], kcalPer100g:240, unit:"g" },
  { keys:["tofu"], kcalPer100g:80, unit:"g" },
  { keys:["seitan"], kcalPer100g:140, unit:"g" },
  { keys:["tempeh"], kcalPer100g:190, unit:"g" },
  // Lácteos
  { keys:["leche","milk","leche desnatada"], kcalPer100g:36, unit:"ml" },
  { keys:["yogur","yogurt","yogur natural"], kcalPer100g:60, unit:"g" },
  { keys:["yogur griego","greek yogurt","skyr"], kcalPer100g:65, unit:"g" },
  { keys:["queso","cheese","queso curado"], kcalPer100g:380, unit:"g" },
  { keys:["queso fresco","fresh cheese","mozzarella","feta"], kcalPer100g:200, unit:"g" },
  { keys:["mantequilla","butter"], kcalPer100g:720, unit:"g" },
  // Cereales / hidratos (crudo)
  { keys:["arroz","rice","arroz integral","arroz basmati"], kcalPer100g:350, unit:"g" },
  { keys:["pasta","pasta integral","spaghetti","macarrones"], kcalPer100g:360, unit:"g" },
  { keys:["avena","oats","copos de avena"], kcalPer100g:370, unit:"g" },
  { keys:["quinoa"], kcalPer100g:365, unit:"g" },
  { keys:["pan","bread","pan integral"], kcalPer100g:250, unit:"g" },
  { keys:["patata","potato","patatas"], kcalPer100g:85, unit:"g" },
  { keys:["boniato","sweet potato","batata"], kcalPer100g:90, unit:"g" },
  { keys:["maiz","maíz","corn"], kcalPer100g:90, unit:"g" },
  { keys:["cuscus","cuscús","couscous"], kcalPer100g:370, unit:"g" },
  { keys:["lenteja","lentil","lentejas"], kcalPer100g:350, unit:"g" },
  { keys:["garbanzo","chickpea","garbanzos"], kcalPer100g:365, unit:"g" },
  { keys:["alubias","beans","frijoles"], kcalPer100g:340, unit:"g" },
  // Frutas
  { keys:["platano","plátano","banana"], kcalPer100g:90, unit:"g" },
  { keys:["manzana","apple"], kcalPer100g:55, unit:"g" },
  { keys:["pera","pear"], kcalPer100g:58, unit:"g" },
  { keys:["naranja","orange"], kcalPer100g:45, unit:"g" },
  { keys:["mandarina","tangerine"], kcalPer100g:50, unit:"g" },
  { keys:["kiwi"], kcalPer100g:60, unit:"g" },
  { keys:["uva","grape","uvas"], kcalPer100g:70, unit:"g" },
  { keys:["fresa","strawberry"], kcalPer100g:32, unit:"g" },
  { keys:["arandano","arándano","blueberry"], kcalPer100g:57, unit:"g" },
  { keys:["frambuesa","raspberry"], kcalPer100g:52, unit:"g" },
  { keys:["melocoton","melocotón","peach"], kcalPer100g:40, unit:"g" },
  { keys:["pera","sandia","sandía","watermelon"], kcalPer100g:30, unit:"g" },
  { keys:["melon","melón","melon"], kcalPer100g:35, unit:"g" },
  { keys:["pina","piña","pineapple"], kcalPer100g:50, unit:"g" },
  { keys:["mango"], kcalPer100g:60, unit:"g" },
  { keys:["aguacate","avocado"], kcalPer100g:160, unit:"g" },
  // Verduras
  { keys:["brocoli","brócoli","broccoli"], kcalPer100g:35, unit:"g" },
  { keys:["espinaca","spinach","espinacas"], kcalPer100g:25, unit:"g" },
  { keys:["lechuga","lettuce","canónigos"], kcalPer100g:15, unit:"g" },
  { keys:["tomate","tomato"], kcalPer100g:18, unit:"g" },
  { keys:["pepino","cucumber"], kcalPer100g:15, unit:"g" },
  { keys:["zanahoria","carrot"], kcalPer100g:35, unit:"g" },
  { keys:["calabacin","calabacín","zucchini"], kcalPer100g:18, unit:"g" },
  { keys:["pimiento","pepper"], kcalPer100g:25, unit:"g" },
  { keys:["esparragos","espárragos","asparagus"], kcalPer100g:20, unit:"g" },
  { keys:["cebolla","onion"], kcalPer100g:40, unit:"g" },
  { keys:["champinon","champiñón","mushroom","seta"], kcalPer100g:25, unit:"g" },
  { keys:["calabaza","pumpkin","squash"], kcalPer100g:30, unit:"g" },
  // Grasas / extras
  { keys:["aceite","oil","aove","olive oil"], kcalPer100g:900, unit:"ml" },
  { keys:["nuez","walnut","nueces"], kcalPer100g:650, unit:"g" },
  { keys:["almendra","almond","almendras"], kcalPer100g:600, unit:"g" },
  { keys:["avellana","hazelnut"], kcalPer100g:625, unit:"g" },
  { keys:["pistacho","pistachio"], kcalPer100g:570, unit:"g" },
  { keys:["anacardo","cashew"], kcalPer100g:575, unit:"g" },
  { keys:["semillas","seeds","chia","lino","sesamo","sésamo"], kcalPer100g:500, unit:"g" },
  { keys:["miel","honey"], kcalPer100g:305, unit:"g" },
  { keys:["mermelada","jam"], kcalPer100g:140, unit:"g" },
  { keys:["chocolate","chocolate negro"], kcalPer100g:540, unit:"g" },
  { keys:["cacao"], kcalPer100g:300, unit:"g" },
  { keys:["mantequilla cacahuete","peanut butter","crema cacahuete"], kcalPer100g:600, unit:"g" },
  { keys:["hummus"], kcalPer100g:170, unit:"g" },
];

export function lookupDensity(query: string): { kcalPer100g: number; unit: "g" | "ml" | "pcs" } | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  // exact match first
  for (const row of DENSITY) {
    if (row.keys.some((k) => k.toLowerCase() === q)) return { kcalPer100g: row.kcalPer100g, unit: row.unit };
  }
  // contains match
  for (const row of DENSITY) {
    if (row.keys.some((k) => q.includes(k.toLowerCase()) || k.toLowerCase().includes(q))) {
      return { kcalPer100g: row.kcalPer100g, unit: row.unit };
    }
  }
  return null;
}

/* ============================== UI TEXTS ================================== */
export const UI: Record<string, L> = {
  totalSelected:    { es:"Total seleccionado", en:"Selected total", fr:"Total sélectionné", de:"Ausgewählt gesamt", it:"Totale selezionato", pt:"Total selecionado" },
  reset:            { es:"Reiniciar", en:"Reset", fr:"Réinitialiser", de:"Zurücksetzen", it:"Reimposta", pt:"Reiniciar" },
  plates:           { es:"platos", en:"plates", fr:"plats", de:"Gerichte", it:"piatti", pt:"pratos" },
  options:          { es:"opciones", en:"options", fr:"options", de:"Optionen", it:"opzioni", pt:"opções" },
  subtotal:         { es:"Subtotal", en:"Subtotal", fr:"Sous-total", de:"Zwischensumme", it:"Subtotale", pt:"Subtotal" },
  breakfast:        { es:"Desayuno", en:"Breakfast", fr:"Petit-déjeuner", de:"Frühstück", it:"Colazione", pt:"Pequeno-almoço" },
  breakfast2:       { es:"Desayuno 2", en:"Mid-morning", fr:"Collation matin", de:"Zwischenmahlzeit", it:"Spuntino mattina", pt:"Lanche manhã" },
  lunch:            { es:"Comida", en:"Lunch", fr:"Déjeuner", de:"Mittagessen", it:"Pranzo", pt:"Almoço" },
  snack:            { es:"Merienda", en:"Snack", fr:"Goûter", de:"Snack", it:"Merenda", pt:"Lanche" },
  dinner:           { es:"Cena", en:"Dinner", fr:"Dîner", de:"Abendessen", it:"Cena", pt:"Jantar" },
  addManual:        { es:"➕ Añadir manualmente", en:"➕ Add manually", fr:"➕ Ajouter manuellement", de:"➕ Manuell hinzufügen", it:"➕ Aggiungi manualmente", pt:"➕ Adicionar manualmente" },
  manualPh:         { es:"Escribe un ingrediente (ej. salmón ahumado)", en:"Type an ingredient (e.g. smoked salmon)", fr:"Saisis un ingrédient (ex. saumon fumé)", de:"Zutat eingeben (z. B. Räucherlachs)", it:"Scrivi un ingrediente (es. salmone affumicato)", pt:"Escreve um ingrediente (ex. salmão fumado)" },
  manualAdd:        { es:"Calcular", en:"Calculate", fr:"Calculer", de:"Berechnen", it:"Calcola", pt:"Calcular" },
  manualNotFound:   { es:"No encontrado. Usaremos un valor aproximado de 150 kcal/100 g.", en:"Not found. Using an approximate value of 150 kcal/100 g.", fr:"Introuvable. Valeur approximative 150 kcal/100 g.", de:"Nicht gefunden. Annäherung 150 kcal/100 g.", it:"Non trovato. Valore approssimativo 150 kcal/100 g.", pt:"Não encontrado. Valor aproximado 150 kcal/100 g." },
  preferred:        { es:"Ingredientes preferidos", en:"Preferred ingredients", fr:"Ingrédients préférés", de:"Bevorzugte Zutaten", it:"Ingredienti preferiti", pt:"Ingredientes preferidos" },
  preferredHelp:    { es:"Elige tus ingredientes favoritos. Las primeras 4 recetas se generan automáticamente con ellos; las 10 restantes se mantienen.", en:"Pick your favorite ingredients. The first 4 recipes are auto-generated with them; the other 10 stay as they are.", fr:"Choisis tes ingrédients préférés. Les 4 premières recettes sont générées automatiquement; les 10 autres restent identiques.", de:"Wähle deine Lieblingszutaten. Die ersten 4 Rezepte werden automatisch damit erstellt; die anderen 10 bleiben.", it:"Scegli i tuoi ingredienti preferiti. Le prime 4 ricette sono generate con essi; le altre 10 restano uguali.", pt:"Escolhe os teus ingredientes favoritos. As primeiras 4 receitas são geradas com eles; as outras 10 mantêm-se." },
  cat_protein:      { es:"Proteínas", en:"Proteins", fr:"Protéines", de:"Proteine", it:"Proteine", pt:"Proteínas" },
  cat_carb:         { es:"Hidratos", en:"Carbs", fr:"Glucides", de:"Kohlenhydrate", it:"Carboidrati", pt:"Hidratos" },
  cat_veg:          { es:"Verduras", en:"Vegetables", fr:"Légumes", de:"Gemüse", it:"Verdure", pt:"Vegetais" },
  cat_fruit:        { es:"Frutas", en:"Fruits", fr:"Fruits", de:"Obst", it:"Frutta", pt:"Frutas" },
  cat_dairy:        { es:"Lácteos", en:"Dairy", fr:"Laitages", de:"Milchprodukte", it:"Latticini", pt:"Lácteos" },
  cat_fat:          { es:"Grasas saludables", en:"Healthy fats", fr:"Bonnes graisses", de:"Gesunde Fette", it:"Grassi sani", pt:"Gorduras saudáveis" },
  applyPref:        { es:"Aplicar a recetas", en:"Apply to recipes", fr:"Appliquer aux recettes", de:"Auf Rezepte anwenden", it:"Applica alle ricette", pt:"Aplicar às receitas" },
  autoRecipe:       { es:"Auto", en:"Auto", fr:"Auto", de:"Auto", it:"Auto", pt:"Auto" },
  needsPref:        { es:"Elige al menos 1 ingrediente preferido para regenerar las 4 primeras recetas.", en:"Pick at least 1 preferred ingredient to regenerate the first 4 recipes.", fr:"Choisis au moins 1 ingrédient préféré pour régénérer les 4 premières recettes.", de:"Wähle mindestens 1 bevorzugte Zutat, um die ersten 4 Rezepte neu zu erzeugen.", it:"Scegli almeno 1 ingrediente preferito per rigenerare le prime 4 ricette.", pt:"Escolhe ao menos 1 ingrediente preferido para regerar as 4 primeiras receitas." },
  recipesTab:       { es:"Recetas", en:"Recipes", fr:"Recettes", de:"Rezepte", it:"Ricette", pt:"Receitas" },
  // Calorie counter
  intro:            { es:"Introduce edad, altura y peso para calcular tu plan personalizado.", en:"Enter age, height and weight to calculate your personalized plan.", fr:"Saisis âge, taille et poids pour calculer ton plan personnalisé.", de:"Gib Alter, Größe und Gewicht ein, um deinen Plan zu berechnen.", it:"Inserisci età, altezza e peso per il tuo piano personalizzato.", pt:"Insere idade, altura e peso para calcular o teu plano." },
  bmr:              { es:"TMB", en:"BMR", fr:"MB", de:"GU", it:"MB", pt:"TMB" },
  tdee:             { es:"Gasto total (TDEE)", en:"Total expenditure (TDEE)", fr:"Dépense totale (TDEE)", de:"Gesamtumsatz (TDEE)", it:"Dispendio totale (TDEE)", pt:"Gasto total (TDEE)" },
  goalLabel:        { es:"Objetivo", en:"Goal", fr:"Objectif", de:"Ziel", it:"Obiettivo", pt:"Objetivo" },
  dailyWater:       { es:"Agua diaria", en:"Daily water", fr:"Eau quotidienne", de:"Tägliches Wasser", it:"Acqua quotidiana", pt:"Água diária" },
  mealsPerDay:      { es:"Comidas/día", en:"Meals/day", fr:"Repas/jour", de:"Mahlzeiten/Tag", it:"Pasti/giorno", pt:"Refeições/dia" },
  timeEst:          { es:"Tiempo estimado", en:"Estimated time", fr:"Temps estimé", de:"Geschätzte Zeit", it:"Tempo stimato", pt:"Tempo estimado" },
  weeks:            { es:"sem", en:"wk", fr:"sem", de:"Wo", it:"sett", pt:"sem" },
  splitTitle:       { es:"Reparto por comida", en:"Meal split", fr:"Répartition par repas", de:"Aufteilung pro Mahlzeit", it:"Ripartizione per pasto", pt:"Repartição por refeição" },
  splitHelp:        { es:"Sugerencia de qué platos del catálogo encajan mejor con cada comida (los números corresponden al listado de \"Comida saludable\").", en:"Suggested plates from the catalogue that best fit each meal (numbers refer to the \"Healthy food\" list).", fr:"Plats suggérés du catalogue pour chaque repas (numéros de la liste \"Alimentation saine\").", de:"Vorgeschlagene Gerichte aus dem Katalog für jede Mahlzeit (Nummern aus der „Gesunde Ernährung\"-Liste).", it:"Piatti consigliati dal catalogo per ogni pasto (numeri dalla lista \"Cibo sano\").", pt:"Pratos sugeridos do catálogo para cada refeição (números da lista \"Alimentação saudável\")." },
  chooseAmong:      { es:"Elige entre las opciones", en:"Choose from the options", fr:"Choisis parmi les options", de:"Wähle aus den Optionen", it:"Scegli tra le opzioni", pt:"Escolhe entre as opções" },
  tipsTitle:        { es:"Consejos profesionales para tu objetivo", en:"Professional tips for your goal", fr:"Conseils professionnels pour ton objectif", de:"Profi-Tipps für dein Ziel", it:"Consigli professionali per il tuo obiettivo", pt:"Conselhos profissionais para o teu objetivo" },
  disclaimer:       { es:"Información orientativa basada en la ecuación de Mifflin-St Jeor y guías ISSN/ACSM. Para condiciones médicas, embarazo o deporte de élite consulta a un dietista-nutricionista colegiado.", en:"Informational guidance based on Mifflin-St Jeor equation and ISSN/ACSM guidelines. For medical conditions, pregnancy or elite sport consult a registered dietitian.", fr:"Information indicative basée sur l'équation Mifflin-St Jeor et les guides ISSN/ACSM. Pour conditions médicales, grossesse ou sport élite consulte un diététicien.", de:"Hinweise nach Mifflin-St Jeor und ISSN/ACSM-Richtlinien. Bei medizinischen Bedingungen, Schwangerschaft oder Leistungssport bitte Ernährungsberater konsultieren.", it:"Indicazioni informative basate su Mifflin-St Jeor e linee guida ISSN/ACSM. Per condizioni mediche, gravidanza o sport élite consulta un dietista.", pt:"Informação orientativa baseada em Mifflin-St Jeor e diretrizes ISSN/ACSM. Para condições médicas, gravidez ou desporto de elite consulta um nutricionista." },
};

export function tn(key: keyof typeof UI, lang: Lang6): string {
  return UI[key]?.[lang] ?? UI[key]?.en ?? key;
}
export function tFood(food: string, lang: Lang6): string {
  return FOOD[food]?.[lang] ?? FOOD[food]?.en ?? food;
}
export function tRecipe(key: string, lang: Lang6): string {
  return RECIPE[key]?.[lang] ?? RECIPE[key]?.en ?? key;
}

/* =========================== TIPS PER GOAL ================================= */
export type Goal = "cut" | "bulk" | "lose" | "maintain";
export const TIPS: Record<Goal, L[]> = {
  cut: [
    { es:"Déficit moderado (~15% del TDEE). Pérdida realista 0,4-0,6% del peso/sem preservando masa muscular.", en:"Moderate deficit (~15% of TDEE). Realistic loss 0.4-0.6% body weight/week while preserving muscle.", fr:"Déficit modéré (~15% du TDEE). Perte réaliste 0,4-0,6% du poids/sem en préservant le muscle.", de:"Moderates Defizit (~15% des TDEE). Realistischer Verlust 0,4-0,6% Körpergewicht/Woche bei Muskelerhalt.", it:"Deficit moderato (~15% del TDEE). Perdita realistica 0,4-0,6% peso/sett mantenendo i muscoli.", pt:"Déficit moderado (~15% do TDEE). Perda realista 0,4-0,6% peso/sem preservando músculo." },
    { es:"Proteína 2,0 g/kg en 4-5 tomas de 30-45 g (umbral leucina ≈ 2,5-3 g por toma).", en:"Protein 2.0 g/kg in 4-5 meals of 30-45 g (leucine threshold ≈ 2.5-3 g per meal).", fr:"Protéines 2,0 g/kg sur 4-5 prises de 30-45 g (seuil leucine ≈ 2,5-3 g par prise).", de:"Eiweiß 2,0 g/kg in 4-5 Mahlzeiten à 30-45 g (Leucinschwelle ≈ 2,5-3 g/Mahlzeit).", it:"Proteine 2,0 g/kg in 4-5 pasti da 30-45 g (soglia leucina ≈ 2,5-3 g/pasto).", pt:"Proteína 2,0 g/kg em 4-5 tomas de 30-45 g (limiar leucina ≈ 2,5-3 g por toma)." },
    { es:"Fuerza 4 días/sem con sobrecarga progresiva (RIR 1-3) + 8.000-10.000 pasos diarios.", en:"Strength 4 days/wk with progressive overload (RIR 1-3) + 8,000-10,000 daily steps.", fr:"Force 4 j/sem en surcharge progressive (RIR 1-3) + 8 000-10 000 pas/jour.", de:"Kraft 4 Tage/Woche mit progressiver Überlastung (RIR 1-3) + 8.000-10.000 Schritte/Tag.", it:"Forza 4 giorni/sett con sovraccarico progressivo (RIR 1-3) + 8.000-10.000 passi/giorno.", pt:"Força 4 dias/sem com sobrecarga progressiva (RIR 1-3) + 8.000-10.000 passos diários." },
    { es:"Mínimo 25-30 g de fibra/día (verdura en comida y cena, fruta entera, legumbre 2-3 veces/sem).", en:"Minimum 25-30 g fiber/day (vegetables at lunch & dinner, whole fruit, legumes 2-3 times/wk).", fr:"Minimum 25-30 g de fibres/jour (légumes midi et soir, fruits entiers, légumineuses 2-3 fois/sem).", de:"Mind. 25-30 g Ballaststoffe/Tag (Gemüse mittags und abends, ganze Früchte, Hülsenfrüchte 2-3x/Woche).", it:"Minimo 25-30 g fibra/giorno (verdure a pranzo e cena, frutta intera, legumi 2-3 volte/sett).", pt:"Mínimo 25-30 g de fibra/dia (legumes ao almoço e jantar, fruta inteira, leguminosas 2-3x/sem)." },
    { es:"Evita líquidos calóricos; alcohol < 1-2 veces/sem. Café y té sin azúcar son libres.", en:"Avoid caloric drinks; alcohol < 1-2 times/wk. Coffee and tea without sugar are free.", fr:"Évite les boissons caloriques; alcool < 1-2 fois/sem. Café et thé sans sucre libres.", de:"Vermeide kalorische Getränke; Alkohol < 1-2x/Woche. Kaffee/Tee ohne Zucker frei.", it:"Evita bevande caloriche; alcol < 1-2 volte/sett. Caffè e tè senza zucchero liberi.", pt:"Evita líquidos calóricos; álcool < 1-2 vezes/sem. Café e chá sem açúcar livres." },
    { es:"Si te estancas 10-14 días, baja -100 kcal o sube 1.500 pasos antes de tocar el entreno.", en:"If you stall 10-14 days, drop -100 kcal or add 1,500 steps before changing training.", fr:"Si tu stagnes 10-14 jours, baisse -100 kcal ou ajoute 1 500 pas avant de toucher à l'entraînement.", de:"Bei Stillstand 10-14 Tage: -100 kcal oder +1.500 Schritte vor Trainingsanpassung.", it:"Se ti blocchi 10-14 giorni, riduci -100 kcal o aggiungi 1.500 passi prima di cambiare l'allenamento.", pt:"Se estagnares 10-14 dias, reduz -100 kcal ou sobe 1.500 passos antes de mudar o treino." },
  ],
  bulk: [
    { es:"Superávit controlado (~10%). Subida realista 0,2-0,3% peso/sem (≈ 1-1,5 kg/mes en avanzados).", en:"Controlled surplus (~10%). Realistic gain 0.2-0.3% body weight/week (≈ 1-1.5 kg/month for advanced).", fr:"Surplus contrôlé (~10%). Gain réaliste 0,2-0,3% poids/sem (≈ 1-1,5 kg/mois en avancé).", de:"Kontrollierter Überschuss (~10%). Realistischer Zuwachs 0,2-0,3% Körpergewicht/Woche (~1-1,5 kg/Monat).", it:"Surplus controllato (~10%). Aumento realistico 0,2-0,3% peso/sett (~1-1,5 kg/mese in avanzati).", pt:"Superávit controlado (~10%). Subida realista 0,2-0,3% peso/sem (~1-1,5 kg/mês em avançados)." },
    { es:"Proteína 1,8 g/kg en 4-5 tomas. Carbohidratos altos pre y post entreno (40-80 g).", en:"Protein 1.8 g/kg in 4-5 meals. High carbs pre & post training (40-80 g).", fr:"Protéines 1,8 g/kg sur 4-5 prises. Glucides élevés avant et après l'entraînement (40-80 g).", de:"Eiweiß 1,8 g/kg in 4-5 Mahlzeiten. Viel Kohlenhydrate vor und nach dem Training (40-80 g).", it:"Proteine 1,8 g/kg in 4-5 pasti. Carboidrati alti pre e post allenamento (40-80 g).", pt:"Proteína 1,8 g/kg em 4-5 tomas. Hidratos altos pré e pós treino (40-80 g)." },
    { es:"Fuerza 4-5 días/sem, 6-12 reps, RIR 1-3, progresión semanal en peso o reps.", en:"Strength 4-5 days/wk, 6-12 reps, RIR 1-3, weekly progression in load or reps.", fr:"Force 4-5 j/sem, 6-12 reps, RIR 1-3, progression hebdo en charge ou reps.", de:"Kraft 4-5 Tage/Woche, 6-12 Wdh, RIR 1-3, wöchentliche Progression bei Last oder Wdh.", it:"Forza 4-5 giorni/sett, 6-12 ripetizioni, RIR 1-3, progressione settimanale.", pt:"Força 4-5 dias/sem, 6-12 reps, RIR 1-3, progressão semanal em carga ou reps." },
    { es:"Hidratos de calidad (arroz, pasta integral, patata, avena) en torno al entreno.", en:"Quality carbs (rice, whole-grain pasta, potato, oats) around training.", fr:"Glucides de qualité (riz, pâtes complètes, pomme de terre, avoine) autour de l'entraînement.", de:"Hochwertige Kohlenhydrate (Reis, Vollkornnudeln, Kartoffel, Hafer) rund ums Training.", it:"Carboidrati di qualità (riso, pasta integrale, patata, avena) intorno all'allenamento.", pt:"Hidratos de qualidade (arroz, massa integral, batata, aveia) em torno do treino." },
    { es:"Mide cintura cada 2 sem: si crece >1 cm/mes, baja -150 kcal — estás ganando grasa de más.", en:"Measure waist every 2 wks: if it grows >1 cm/month, drop -150 kcal — you're gaining too much fat.", fr:"Mesure la taille toutes les 2 sem: si >1 cm/mois, baisse -150 kcal — trop de gras.", de:"Taille alle 2 Wo messen: wächst sie >1 cm/Monat, -150 kcal — zu viel Fettzunahme.", it:"Misura il girovita ogni 2 sett: se cresce >1 cm/mese, riduci -150 kcal — troppo grasso.", pt:"Mede a cintura a cada 2 sem: se cresce >1 cm/mês, reduz -150 kcal — ganho excessivo de gordura." },
    { es:"Sueño 7-9 h y 1-2 días sin entrenar/sem. Sin descanso no hay hipertrofia.", en:"Sleep 7-9 h and 1-2 rest days/wk. No recovery, no hypertrophy.", fr:"Sommeil 7-9 h et 1-2 jours de repos/sem. Sans récup, pas d'hypertrophie.", de:"7-9 h Schlaf und 1-2 Ruhetage/Wo. Ohne Erholung keine Hypertrophie.", it:"Sonno 7-9 h e 1-2 giorni di riposo/sett. Senza recupero non c'è ipertrofia.", pt:"Sono 7-9 h e 1-2 dias sem treino/sem. Sem descanso não há hipertrofia." },
  ],
  lose: [
    { es:"Déficit más agresivo (~22%). Pérdida 0,6-0,8% peso/sem. No mantener más de 10-12 sem seguidas.", en:"More aggressive deficit (~22%). Loss 0.6-0.8% body weight/week. Don't hold beyond 10-12 wks.", fr:"Déficit plus agressif (~22%). Perte 0,6-0,8% poids/sem. Pas plus de 10-12 sem.", de:"Aggressiveres Defizit (~22%). Verlust 0,6-0,8% Körpergewicht/Woche. Max 10-12 Wochen.", it:"Deficit più aggressivo (~22%). Perdita 0,6-0,8% peso/sett. Non oltre 10-12 sett.", pt:"Déficit mais agressivo (~22%). Perda 0,6-0,8% peso/sem. Não manter +10-12 sem seguidas." },
    { es:"Proteína alta (2,2 g/kg) para preservar músculo y saciar; grasas mínimas (0,7 g/kg).", en:"High protein (2.2 g/kg) to preserve muscle and satiate; minimum fats (0.7 g/kg).", fr:"Protéines élevées (2,2 g/kg) pour préserver le muscle et rassasier; lipides mini (0,7 g/kg).", de:"Hohes Eiweiß (2,2 g/kg) für Muskelerhalt und Sättigung; Fette minimal (0,7 g/kg).", it:"Proteine alte (2,2 g/kg) per preservare massa e saziare; grassi minimi (0,7 g/kg).", pt:"Proteína alta (2,2 g/kg) para preservar músculo e saciar; gorduras mínimas (0,7 g/kg)." },
    { es:"Cardio 3-4 días (mezcla LISS + HIIT 1 día) + fuerza 3 días para mantener músculo.", en:"Cardio 3-4 days (mix LISS + 1 HIIT day) + strength 3 days to keep muscle.", fr:"Cardio 3-4 j (mix LISS + 1 HIIT) + force 3 j pour garder le muscle.", de:"Cardio 3-4 Tage (LISS + 1 HIIT-Tag) + Kraft 3 Tage zum Muskelerhalt.", it:"Cardio 3-4 giorni (mix LISS + 1 HIIT) + forza 3 giorni per mantenere muscolo.", pt:"Cardio 3-4 dias (mistura LISS + 1 HIIT) + força 3 dias para manter músculo." },
    { es:"Pesa los alimentos las primeras 2-3 sem. Revisa peso medio semanal (no diario).", en:"Weigh foods the first 2-3 wks. Track weekly average weight (not daily).", fr:"Pèse les aliments les 2-3 premières sem. Suis le poids moyen hebdo (pas quotidien).", de:"Lebensmittel die ersten 2-3 Wochen wiegen. Wochenmittelgewicht prüfen (nicht täglich).", it:"Pesa gli alimenti le prime 2-3 sett. Monitora il peso medio settimanale.", pt:"Pesa alimentos as primeiras 2-3 sem. Revê peso médio semanal (não diário)." },
    { es:"NEAT clave: objetivo 10.000 pasos/día. Más actividad espontánea quema más que cualquier cardio.", en:"NEAT is key: aim 10,000 steps/day. Spontaneous activity burns more than any cardio.", fr:"NEAT crucial: vise 10 000 pas/jour. L'activité spontanée brûle plus qu'un cardio.", de:"NEAT entscheidend: Ziel 10.000 Schritte/Tag. Alltagsaktivität verbrennt mehr als Cardio.", it:"NEAT chiave: obiettivo 10.000 passi/giorno. L'attività spontanea brucia più di qualsiasi cardio.", pt:"NEAT crucial: meta 10.000 passos/dia. Atividade espontânea queima mais do que cardio." },
    { es:"Tras 8-10 sem haz 1-2 sem en mantenimiento (diet break) para recuperar hormonas y hambre.", en:"After 8-10 wks do 1-2 wks at maintenance (diet break) to restore hormones and hunger.", fr:"Après 8-10 sem, fais 1-2 sem en maintien (diet break) pour récupérer hormones et faim.", de:"Nach 8-10 Wochen 1-2 Wochen Erhaltungskalorien (Diet Break) für Hormone und Hunger.", it:"Dopo 8-10 sett fai 1-2 sett a mantenimento (diet break) per ormoni e fame.", pt:"Após 8-10 sem faz 1-2 sem em manutenção (diet break) para recuperar hormonas e fome." },
  ],
  maintain: [
    { es:"Calorías en torno al TDEE. Vigila peso semanalmente y ajusta ±100 kcal si se mueve >1% en 2-3 sem.", en:"Calories around TDEE. Weigh weekly and adjust ±100 kcal if weight moves >1% in 2-3 wks.", fr:"Calories autour du TDEE. Suis le poids hebdo et ajuste ±100 kcal si bouge >1% en 2-3 sem.", de:"Kalorien um TDEE. Wöchentlich wiegen, ±100 kcal anpassen bei >1% in 2-3 Wochen.", it:"Calorie attorno al TDEE. Pesa settimanalmente, regola ±100 kcal se varia >1% in 2-3 sett.", pt:"Calorias em torno do TDEE. Pesa semanalmente, ajusta ±100 kcal se mover >1% em 2-3 sem." },
    { es:"Proteína 1,6 g/kg suficiente para preservar músculo con fuerza 3-4 días/sem.", en:"Protein 1.6 g/kg is enough to preserve muscle with strength 3-4 days/wk.", fr:"Protéines 1,6 g/kg suffisent pour préserver le muscle avec force 3-4 j/sem.", de:"1,6 g/kg Eiweiß reichen für Muskelerhalt mit Krafttraining 3-4 Tage/Woche.", it:"Proteine 1,6 g/kg sufficienti per preservare muscolo con forza 3-4 giorni/sett.", pt:"Proteína 1,6 g/kg suficiente para preservar músculo com força 3-4 dias/sem." },
    { es:"Reparto equilibrado: ~30% proteína / 40% hidratos / 30% grasas. Flexible según preferencias.", en:"Balanced split: ~30% protein / 40% carbs / 30% fats. Flexible to your taste.", fr:"Répartition équilibrée: ~30% protéines / 40% glucides / 30% lipides.", de:"Ausgewogen: ~30% Eiweiß / 40% KH / 30% Fett.", it:"Ripartizione equilibrata: ~30% proteine / 40% carboidrati / 30% grassi.", pt:"Repartição equilibrada: ~30% proteína / 40% hidratos / 30% gorduras." },
    { es:"Regla 80/20: 80% alimentos frescos y nutritivos, 20% margen para vida social sin culpa.", en:"80/20 rule: 80% fresh nutritious foods, 20% margin for social life without guilt.", fr:"Règle 80/20: 80% d'aliments frais et nutritifs, 20% de marge sociale sans culpabilité.", de:"80/20-Regel: 80% frische, nährstoffreiche Lebensmittel, 20% Spielraum.", it:"Regola 80/20: 80% cibo fresco e nutriente, 20% margine per la vita sociale.", pt:"Regra 80/20: 80% alimentos frescos e nutritivos, 20% margem social sem culpa." },
    { es:"Hidratación 30-35 ml/kg + 350-700 ml extra por hora de actividad.", en:"Hydration 30-35 ml/kg + 350-700 ml extra per hour of activity.", fr:"Hydratation 30-35 ml/kg + 350-700 ml en plus par heure d'activité.", de:"Flüssigkeit 30-35 ml/kg + 350-700 ml extra pro Stunde Aktivität.", it:"Idratazione 30-35 ml/kg + 350-700 ml extra per ora di attività.", pt:"Hidratação 30-35 ml/kg + 350-700 ml extra por hora de atividade." },
    { es:"Sueño 7-9 h y 7.000-10.000 pasos/día. La constancia > la intensidad.", en:"Sleep 7-9 h and 7,000-10,000 steps/day. Consistency > intensity.", fr:"Sommeil 7-9 h et 7 000-10 000 pas/jour. La constance > l'intensité.", de:"7-9 h Schlaf und 7.000-10.000 Schritte/Tag. Beständigkeit > Intensität.", it:"Sonno 7-9 h e 7.000-10.000 passi/giorno. La costanza > l'intensità.", pt:"Sono 7-9 h e 7.000-10.000 passos/dia. A constância > intensidade." },
  ],
};
