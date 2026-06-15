## Cambios en Nutrición

### 1. Traducción completa (i18n)
- Mover todos los textos de Nutrición (nombres de platos, ingredientes del POOL, etiquetas de comidas, consejos) a un diccionario clave→idioma.
- Cubrir **ES, EN, FR, DE, IT, PT** con traducción profesional. Resto de los 30 idiomas hacen fallback a EN (luego se pueden ampliar).
- El componente lee siempre `t("clave")` en vez de strings literales, así al cambiar el idioma cambia toda la sección.

### 2. Nueva sub-pestaña "Ingredientes preferidos"
Dentro de cada comida (Desayuno, Desayuno 2, Comida, Merienda, Cena) habrá dos sub-pestañas:
- **Recetas** — las 14 opciones de comida.
- **Ingredientes preferidos** — multi-selección de ingredientes (proteína, hidrato, grasa, verdura, fruta, lácteo).

Al elegir preferencias, las **primeras 4 de las 14 recetas** se regeneran automáticamente usando esos ingredientes (plantillas tipo *bowl, salteado, ensalada, plato combinado* rellenadas con la selección + cantidades ajustadas a la kcal objetivo del tipo de comida). Las **10 restantes** se mantienen como están.

### 3. Añadir ingrediente manual
En cada desplegable de ingrediente, la última opción será **"➕ Añadir manualmente"**. Al pulsarla:
- Se abre un mini-input donde el usuario escribe **solo el nombre** del ingrediente (ej. "salmón ahumado").
- La app:
  1. Busca el alimento en una **tabla interna de densidad calórica** (kcal/100 g) — incluye ~120 alimentos comunes con sinónimos en ES/EN.
  2. Calcula la **cantidad necesaria** para cubrir las kcal que ocupaba el ingrediente original (mantiene el equilibrio de la receta).
  3. Recalcula automáticamente las kcal del plato y el total seleccionado.
- Si el alimento no está en la tabla, se muestra un input opcional de kcal/100 g (un solo campo, no varios).

### 4. Detalles técnicos
- Refactor `src/routes/_authenticated.nutrition.tsx`: los `MEALS` pasan a guardar **claves** (`meal.breakfast.1.name`, `pool.oats.0`) en lugar de literales.
- Nuevo archivo `src/lib/nutrition-i18n.ts` con los diccionarios (6 idiomas × ~200 claves).
- Nuevo archivo `src/lib/food-density.ts` con tabla kcal/100 g + sinónimos para el "añadir manual".
- El estado por comida pasa de `Item[]` a `{ items: Item[], preferred: Set<tag> }` para regenerar las 4 primeras al cambiar preferencias.

### 5. Lo que **no** cambia
- Cuenta calorías (formulas, perfiles, agua, consejos) — sólo se traduce.
- Resto de la app fuera de Nutrición.

¿Confirmas y procedo?