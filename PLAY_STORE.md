# Subir Training Plan a Google Play Store

La app se empaqueta como Android usando **Capacitor** (wrapper nativo de la web app).

## 1. Requisitos en tu ordenador
- Node.js 20+ y bun (o npm)
- **Android Studio** (incluye SDK + JDK 17)
- Cuenta de **Google Play Console** (pago único 25 USD)

## 2. Exportar el proyecto desde Lovable
1. Conecta el repo a GitHub (botón GitHub → Connect).
2. Clona el repo en tu máquina: `git clone <tu-repo>`
3. `cd <tu-repo>` y luego `bun install`.

## 3. Añadir Capacitor (solo la primera vez)
```bash
bun add @capacitor/core
bun add -d @capacitor/cli
bun add @capacitor/android
npx cap init "Training Plan" app.lovable.trainingplan --web-dir=dist
npx cap add android
```
> El archivo `capacitor.config.ts` ya está en el repo.

## 4. Build + sincronizar
```bash
bun run build          # genera /dist
npx cap sync android   # copia el build dentro del proyecto Android
npx cap open android   # abre Android Studio
```

## 5. Generar APK / AAB firmado
En Android Studio:
1. `Build` → `Generate Signed Bundle / APK…`
2. Elige **Android App Bundle (.aab)** (formato requerido por Play Store).
3. Crea un **keystore** nuevo (guárdalo con contraseña — sin él no puedes actualizar la app).
4. Variante: `release`.

El archivo `.aab` aparece en `android/app/build/outputs/bundle/release/`.

## 6. Publicar en Play Store
1. Entra en https://play.google.com/console
2. **Crear app** → nombre **Training Plan**, idioma, app gratis.
3. Completa: ficha de Play (descripción, screenshots 1080×1920, icono 512×512, banner 1024×500), clasificación de contenido, política de privacidad, formularios de público objetivo y anuncios.
4. **Producción → Crear nueva versión** → sube el `.aab`.
5. Revisa y envía. Google tarda entre **unas horas y 7 días** en aprobarla.

## 7. Actualizaciones
Cada vez que cambies código:
```bash
bun run build && npx cap sync android
```
Luego sube un nuevo `.aab` con `versionCode` incrementado (`android/app/build.gradle`).

---
**Importante:** la app necesita conexión a internet (usa Lovable Cloud / Supabase). En la ficha de Play Store debes declarar:
- Permisos: Internet (automático).
- Política de privacidad: añade una URL pública con cómo se guardan email, edad, altura, peso.
