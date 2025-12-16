# 📱 Cómo Compilar tu App en Android Studio

## ✅ Lo que Ya Está Listo

- ✅ `package.json` configurado correctamente (sin dependencias de React Native CLI)
- ✅ `metro.config.js` configurado para Expo
- ✅ `tsconfig.json` configurado correctamente
- ✅ `app.json` configurado para Expo
- ✅ Dependencia `metro-minify-terser` agregada

---

## 🎯 Pasos Simples (Copia y Pega)

### 1️⃣ Abre PowerShell y Navega al Proyecto

```powershell
cd "C:\Users\odena\Documentos NS\Engineering handbook"
```

### 2️⃣ Instala las Dependencias

```powershell
npm install
```

Espera 1-2 minutos. Esto instalará `metro-minify-terser` y otras dependencias.

### 3️⃣ Genera la Carpeta Android

```powershell
npx expo prebuild --platform android --clean
```

**Espera 2-3 minutos**. Verás algo como:
```
✔ Created native project | /android
```

### 4️⃣ Abre Android Studio

1. Abre **Android Studio**
2. **File → Open**
3. Selecciona: `C:\Users\odena\Documentos NS\Engineering handbook\android`
4. Click **OK**

### 5️⃣ Espera la Sincronización de Gradle

En la parte inferior de Android Studio verás:
```
Gradle sync in progress...
```

**Espera 5-10 minutos**. Cuando termine verás:
```
Gradle sync finished
```

### 6️⃣ Compila la APK

1. **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. Espera 5-10 minutos
3. Verás: **"APK(s) generated successfully"**
4. Click **"locate"**

Tu APK estará en:
```
android\app\build\outputs\apk\debug\app-debug.apk
```

### 7️⃣ Instala en tu Emulador o Teléfono

**Opción A - Emulador:**
- Arrastra `app-debug.apk` al emulador

**Opción B - Teléfono:**
- Copia `app-debug.apk` a tu teléfono
- Ábrelo y permite instalar desde fuentes desconocidas

---

## 🚨 Si Algo Sale Mal

### Error: "Gradle sync failed"

```powershell
# En PowerShell:
cd "C:\Users\odena\Documentos NS\Engineering handbook"
Remove-Item -Recurse -Force android
npx expo prebuild --platform android --clean
```

Luego abre de nuevo en Android Studio.

### Error: "SDK location not found"

En Android Studio:
1. **File → Project Structure → SDK Location**
2. **Android SDK location**: `C:\Users\odena\AppData\Local\Android\Sdk`
3. **Apply → OK**

### Error: "Plugin [id: 'com.facebook.react.settings'] was not found"

Este error ya está solucionado. Si lo ves, ejecuta:

```powershell
npm install
Remove-Item -Recurse -Force android
npx expo prebuild --platform android --clean
```

---

## 🎉 ¡Eso es Todo!

Sigue los pasos 1-7 y tendrás tu APK lista para probar.

**Tiempo total estimado**: 20-30 minutos (la primera vez)

---

## 💡 Alternativa Más Fácil: EAS Build

Si Android Studio te da problemas, puedes usar EAS Build (compilación en la nube):

```powershell
cd "C:\Users\odena\Documentos NS\Engineering handbook"
npm install
$env:EAS_NO_VCS=1
eas build --platform android --profile preview --clear-cache
```

Espera 10-15 minutos y recibirás un link para descargar la APK.

**Ventaja**: No necesitas Android Studio instalado.
**Desventaja**: Cada compilación toma 10-15 minutos.

---

## 📝 Notas Importantes

1. **Primera compilación**: Siempre es lenta (15-20 minutos)
2. **Compilaciones siguientes**: Más rápidas (5-10 minutos)
3. **Espacio en disco**: Android Studio + SDK necesitan ~10 GB
4. **Internet**: Necesitas internet para descargar dependencias de Gradle

---

## ❓ ¿Qué Método Usar?

**Usa Android Studio si**:
- Quieres compilar localmente
- Vas a hacer muchas compilaciones
- Tienes espacio en disco (10 GB)
- Quieres depurar código nativo

**Usa EAS Build si**:
- Quieres algo más simple
- No tienes espacio en disco
- Solo necesitas una APK ocasionalmente
- Android Studio te da problemas

---

## 🚀 Empieza Ahora

Abre PowerShell y ejecuta los comandos del **Paso 1-3**.

¡Buena suerte! 🎉
