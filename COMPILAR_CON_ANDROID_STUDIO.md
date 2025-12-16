# 🏗️ Compilar con Android Studio

## Paso 1: Instalar Dependencias

Primero asegúrate de tener todas las dependencias instaladas:

```powershell
npm install
```

Esto instalará `metro-minify-terser` y otras dependencias necesarias.

---

## Paso 2: Regenerar la Carpeta Android con Expo

Ahora genera la carpeta `android/` limpia y compatible:

```powershell
# Si existe carpeta android, elimínala primero
Remove-Item -Recurse -Force android -ErrorAction SilentlyContinue

# Regenerar con Expo (esto crea una carpeta compatible)
npx expo prebuild --platform android --clean
```

Esto tomará 2-3 minutos y creará una carpeta `android/` compatible con Expo.

**IMPORTANTE**: Espera a que termine completamente. Verás:
```
✔ Created native project | /android
```

---

## Paso 3: Abrir en Android Studio

1. Abre Android Studio
2. File → Open
3. Navega a: `C:\Users\odena\Documentos NS\Engineering handbook\android`
4. Haz clic en "OK"

Android Studio detectará que es un proyecto Gradle y lo sincronizará automáticamente.

---

## Paso 4: Esperar la Sincronización de Gradle

Android Studio descargará dependencias y sincronizará el proyecto. Esto puede tomar 5-10 minutos la primera vez.

Verás en la parte inferior:
```
Gradle sync in progress...
```

Espera a que termine y diga:
```
Gradle sync finished
```

---

## Paso 5: Compilar la APK desde Android Studio

### Opción A: Compilar APK de Debug (Más Rápido)

1. En el menú: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. Espera 5-10 minutos
3. Verás una notificación: "APK(s) generated successfully"
4. Haz clic en "locate" para ver la APK

La APK estará en:
```
android\app\build\outputs\apk\debug\app-debug.apk
```

### Opción B: Compilar APK de Release (Optimizada)

1. En el menú: **Build → Generate Signed Bundle / APK**
2. Selecciona "APK" → Next
3. Si no tienes keystore:
   - Haz clic en "Create new..."
   - Key store path: Elige una ubicación (ej: `android/app/my-release-key.jks`)
   - Password: Elige una contraseña
   - Alias: `my-key-alias`
   - Validity: 25 años
   - Completa los datos (nombre, organización, etc.)
   - OK
4. Next → Selecciona "release" → Finish
5. Espera 10-15 minutos

La APK estará en:
```
android\app\release\app-release.apk
```

---

## Paso 6: Instalar la APK

### En el Emulador:
1. Arrastra la APK al emulador
2. Se instalará automáticamente

### En tu Teléfono:
1. Copia la APK a tu teléfono (USB, email, Drive)
2. Abre el archivo en tu teléfono
3. Permite instalar desde fuentes desconocidas
4. Instala

---

## Solución de Problemas

### "Gradle sync failed"

**Causa**: Falta configuración o dependencias.

**Solución**:
1. File → Invalidate Caches → Invalidate and Restart
2. Espera a que Android Studio reinicie
3. Deja que sincronice de nuevo

### "SDK location not found"

**Solución**:
1. File → Project Structure → SDK Location
2. Android SDK location: `C:\Users\odena\AppData\Local\Android\Sdk`
3. Apply → OK

### "Build failed: Could not resolve..."

**Solución**:
```powershell
# En el directorio raíz del proyecto
npm install
npx expo prebuild --platform android --clean
```

Luego abre de nuevo en Android Studio.

### "Metro bundler not running"

Antes de compilar, inicia Metro en una terminal:
```powershell
npm start
```

Deja esa terminal corriendo y compila desde Android Studio.

---

## Ventajas de Compilar con Android Studio

- ✅ Ves errores de compilación en tiempo real
- ✅ Puedes depurar el código nativo
- ✅ Tienes control total sobre la configuración
- ✅ Puedes ejecutar directamente en el emulador
- ✅ Más rápido para iteraciones (después de la primera compilación)

---

## Desventajas vs EAS Build

- ⏱️ Requiere configuración local (Android Studio, SDK, etc.)
- ⏱️ Primera compilación es lenta (10-15 minutos)
- ⏱️ Necesitas espacio en disco (~10 GB para Android Studio + SDK)
- ⏱️ Puede tener problemas de configuración en Windows

---

## Resumen de Comandos

```powershell
# 1. Instalar dependencias
npm install

# 2. Regenerar carpeta android
Remove-Item -Recurse -Force android -ErrorAction SilentlyContinue
npx expo prebuild --platform android --clean

# 3. Abrir Android Studio
# File → Open → Seleccionar carpeta android/

# 4. Esperar sincronización de Gradle (5-10 minutos)

# 5. Compilar APK
# Build → Build Bundle(s) / APK(s) → Build APK(s)

# 6. Instalar en emulador (opcional)
adb install "android\app\build\outputs\apk\debug\app-debug.apk"
```

---

## Recomendación

**Para tu primera APK**: Usa EAS Build (más fácil, sin configuración)
```powershell
Remove-Item -Recurse -Force android
$env:EAS_NO_VCS=1
eas build --platform android --profile preview
```

**Para desarrollo continuo**: Usa Android Studio (más rápido después de configurar)

---

## Próximos Pasos

1. Decide qué método prefieres:
   - **EAS Build**: Más fácil, sin configuración (15 minutos)
   - **Android Studio**: Más control, requiere configuración (30 minutos primera vez)

2. Si eliges Android Studio:
   - Ejecuta los comandos del Paso 1
   - Abre Android Studio
   - Sigue los pasos 2-5

3. Si eliges EAS Build:
   - Ejecuta los comandos de SOLUCION_FINAL_APK.md

¿Qué método prefieres probar? 🚀
