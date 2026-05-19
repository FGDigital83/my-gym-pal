# 📱 Subir Training Plan a Google Play Store

La app se empaqueta como Android nativo con **Capacitor** (envuelve la web app).
Lovable deja todo el código y los assets listos; los **pasos finales se hacen
en tu ordenador** porque Google exige firmar el `.aab` con una clave privada
que solo tú debes tener.

---

## ✅ Lo que ya está hecho en este repo
- `capacitor.config.ts` con `appId = app.lovable.trainingplan`, nombre y splash configurados.
- Icono 512×512 → `src/assets/play-store/icon-512.png`
- Feature graphic 1024×500 (lo redimensionas) → `src/assets/play-store/feature-graphic.jpg`
- Splash 2732×2732 → `src/assets/play-store/splash-2732.png`
- Textos de la ficha → `STORE_LISTING.md`
- Política de privacidad → `PRIVACY_POLICY.md` (debes publicarla en una URL pública)

---

## 1. Requisitos en tu ordenador
- **Node.js 20+** y `bun` (o `npm`)
- **Android Studio** (instala SDK Android 34+ y JDK 17)
- Cuenta de **Google Play Console** — pago único de **25 USD**

## 2. Bajar el código desde Lovable
1. Botón **GitHub → Connect** en Lovable.
2. En tu terminal:
   ```bash
   git clone <tu-repo>
   cd <tu-repo>
   bun install
   ```

## 3. Añadir Android (solo la primera vez)
```bash
bun add @capacitor/core @capacitor/android @capacitor/splash-screen
bun add -d @capacitor/cli @capacitor/assets
npx cap add android
```

## 4. Generar iconos y splash automáticamente
```bash
mkdir -p assets
cp src/assets/play-store/icon-512.png  assets/icon-only.png
cp src/assets/play-store/icon-512.png  assets/icon-foreground.png
cp src/assets/play-store/splash-2732.png assets/splash.png
cp src/assets/play-store/splash-2732.png assets/splash-dark.png
npx capacitor-assets generate --android
```
Esto crea todas las densidades (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi) en
`android/app/src/main/res/`.

## 5. Build + sincronizar
```bash
bun run build          # genera /dist
npx cap sync android   # copia el build al proyecto Android
npx cap open android   # abre Android Studio
```

## 6. Generar el `.aab` firmado
En Android Studio:
1. Menú **Build → Generate Signed Bundle / APK…**
2. Elige **Android App Bundle (.aab)** ← formato obligatorio.
3. **Create new keystore** (la primera vez):
   - Guarda el archivo `.jks` y **las contraseñas** en sitio seguro.
   - ⚠️ Si pierdes la clave, **NO puedes actualizar la app nunca más**.
4. Variante: **release**.
5. El `.aab` se genera en:
   `android/app/build/outputs/bundle/release/app-release.aab`

## 7. Crear la app en Play Console
1. Entra en https://play.google.com/console y haz clic en **Crear app**.
2. Rellena:
   - Nombre: **Training Plan**
   - Idioma predeterminado: Español (España)
   - Tipo: App
   - Gratuita o de pago: Gratuita
3. Acepta las declaraciones obligatorias.

## 8. Completar la ficha de Play Store
Usa los textos de `STORE_LISTING.md`. Necesitas subir:

| Asset                    | Tamaño                | Archivo en este repo                          |
|--------------------------|-----------------------|-----------------------------------------------|
| Icono de la app          | 512 × 512 PNG         | `src/assets/play-store/icon-512.png`          |
| Feature graphic          | 1024 × 500 JPG/PNG    | `src/assets/play-store/feature-graphic.jpg` *(recorta a 1024×500)* |
| Capturas teléfono (mín 2)| 1080 × 1920 cada una  | hacer screenshots desde el emulador / móvil  |
| Política de privacidad   | URL pública           | publica `PRIVACY_POLICY.md` (ej. GitHub Pages)|

## 9. Formularios obligatorios
En el menú izquierdo de Play Console:
- **Acceso a la app** → No requiere credenciales especiales.
- **Anuncios** → No contiene anuncios.
- **Clasificación de contenido** → Rellena el cuestionario (apta para todos).
- **Público objetivo** → 13+ años (datos de salud).
- **Seguridad de los datos** → Declara: email (auth), edad/altura/peso (función app),
  todo cifrado en tránsito y en reposo, el usuario puede solicitar borrado.
- **Política de privacidad** → pega la URL pública.

## 10. Subir el `.aab`
1. **Producción → Crear nueva versión**.
2. Sube `app-release.aab`.
3. Notas de la versión (puedes copiar de `STORE_LISTING.md` → "Novedades").
4. **Revisar y publicar**.

Google revisa entre **unas horas y 7 días**. Recibirás email cuando esté aprobada.

---

## 🔄 Actualizar la app más adelante
Cada vez que cambies código en Lovable:
```bash
git pull
bun install
bun run build
npx cap sync android
```
Abre Android Studio, **sube el `versionCode`** en `android/app/build.gradle`
(ej. de `1` a `2`) y opcionalmente el `versionName` ("1.0.1"), genera otro
`.aab` firmado **con el mismo keystore**, y súbelo en Play Console como
nueva versión.

---

## 💡 Truco recomendado: testers internos primero
En Play Console → **Pruebas internas** → crea una versión, añade tu
email como tester y prueba la app real antes de publicar en producción.
Aprobación en minutos en vez de días.
