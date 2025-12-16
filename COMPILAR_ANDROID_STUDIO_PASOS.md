# 🏗️ Pasos para Compilar con Android Studio

## ⚠️ IMPORTANTE: Ejecuta estos comandos en PowerShell

Abre una **nueva ventana de PowerShell** y ejecuta estos comandos:

---

## Paso 1: Navegar al Directorio del Proyecto

```powershell
cd "C:\Users\odena\Documentos NS\Engineering handbook"
```

---

## Paso 2: Verificar que No Existe la Carpeta Android

```powershell
Test-Path android
```

Debería mostrar: `False`

Si muestra `True`, elimínala primero:
```powershell
Remove-Item -Recurse -Force android
```

---

## Paso 3: Instalar Dependencias (Si No Lo Has Hecho)

```powershell
npm install
```

Esto instalará `metro-minify-terser` y otras dependencias que agregamos.

---

## Paso 4: Generar la Carpeta Android con Expo

```powershell
npx expo prebuild --platform android --clean
```

Este comando:
- Creará la carpeta `android/` con todos los archivos nativos
- Configurará Gradle correctamente para Expo
- Tomará 2-3 minutos

**Espera a que termine completamente**. Verás algo como:
```
✔ Created native project | /android
```

---

## Paso 5: Verificar que Se Creó la Carpeta

```powershell
Test-Path android
```

Debería mostrar: `True`

```powershell
ls android
```

Deberías ver archivos como:
- `build.gradle`
- `settings.gradle`
- `app/`
- `gradle/`

---

## Paso 6: Abrir en Android Studio

1. **Abre Android Studio**
2. **File → Open**
3. Navega a: `C:\Users\odena\Documentos NS\Engineering handbook\android`
4. Haz clic en **OK**

---

## Paso 7: Esperar la Sincronización de Gradle

Android Studio detectará el proyecto y comenzará a sincronizar Gradle automáticamente.

En la parte inferior verás:
```
Gradle sync in progress...
```

**Espera pacientemente**. Esto puede tomar 5-10 minutos la primera vez porque:
- Descarga dependencias de Gradle
- Descarga dependencias de Android
- Configura el proyecto

Cuando termine verás:
```
Gradle sync finished in X s
```

---

## Paso 8: Compilar la APK

### Opción A: APK de Debug (Recomendado para Pruebas)

1. En el menú superior: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. Espera 5-10 minutos (primera vez)
3. Verás una notificación: **"APK(s) generated successfully"**
4. Haz clic en **"locate"** para ver la APK

La APK estará en:
```
C:\Users\odena\Documentos NS\Engineering handbook\android\app\build\outputs\apk\debug\app-debug.apk
```

### Opción B: Ejecutar en el Emulador Directamente

1. Asegúrate de que tu emulador esté corriendo
2. En Android Studio, arriba a la derecha verás un dropdown con "app"
3. Al lado verás tu emulador (ej: "Pixel_5_API_30")
4. Haz clic en el botón verde de **Play (▶️)**
5. La app se compilará e instalará automáticamente en el emulador

---

## Paso 9: Instalar la APK

### En el Emulador:
```powershell
# Arrastra el archivo app-debug.apk al emulador
# O usa adb:
adb install "android\app\build\outputs\apk\debug\app-debug.apk"
```

### En tu Teléfono:
1. Copia `app-debug.apk` a tu teléfono (USB, email, Drive)
2. Abre el archivo en tu teléfono
3. Permite instalar desde fuentes desconocidas si te lo pide
4. Instala

---

## 🔧 Solución de Problemas

### Error: "Gradle sync failed"

**Solución 1**: Invalidar caché de Android Studio
1. **File → Invalidate Caches → Invalidate and Restart**
2. Espera a que reinicie
3. Deja que sincronice de nuevo

**Solución 2**: Limpiar y regenerar
```powershell
cd "C:\Users\odena\Documentos NS\Engineering handbook"
Remove-Item -Recurse -Force android
npx expo prebuild --platform android --clean
```

### Error: "SDK location not found"

1. En Android Studio: **File → Project Structure → SDK Location**
2. **Android SDK location**: `C:\Users\odena\AppData\Local\Android\Sdk`
3. **Apply → OK**

### Error: "Plugin [id: 'com.facebook.react.settings'] was not found"

Este error ya está solucionado. Si lo ves:
1. Verifica que `package.json` NO tenga `@react-native/metro-config`
2. Verifica que `metro.config.js` use `expo/metro-config`
3. Regenera la carpeta android:
```powershell
Remove-Item -Recurse -Force android
npx expo prebuild --platform android --clean
```

### Error: "Could not resolve..."

```powershell
npm install
npx expo prebuild --platform android --clean
```

### Error: "Metro bundler not running"

Antes de ejecutar la app, inicia Metro en una terminal separada:
```powershell
npm start
```

Deja esa terminal corriendo.

---

## 📊 Comparación: Android Studio vs EAS Build

### Android Studio
- ✅ Control total sobre la compilación
- ✅ Puedes depurar código nativo
- ✅ Más rápido después de la primera compilación
- ✅ Puedes ejecutar directamente en el emulador
- ❌ Requiere configuración local (10 GB de espacio)
- ❌ Primera compilación lenta (15-20 minutos)
- ❌ Puede tener problemas de configuración

### EAS Build (Alternativa)
- ✅ Sin configuración local necesaria
- ✅ Compilación en la nube
- ✅ Más fácil y confiable
- ❌ Requiere cuenta Expo (gratis)
- ❌ Cada compilación toma 10-15 minutos
- ❌ Necesitas internet

---

## 🎯 Resumen de Comandos

```powershell
# 1. Navegar al proyecto
cd "C:\Users\odena\Documentos NS\Engineering handbook"

# 2. Instalar dependencias
npm install

# 3. Generar carpeta android
npx expo prebuild --platform android --clean

# 4. Abrir Android Studio
# File → Open → Seleccionar carpeta android/

# 5. Esperar sincronización de Gradle (5-10 min)

# 6. Compilar APK
# Build → Build Bundle(s) / APK(s) → Build APK(s)

# 7. Instalar en emulador
adb install "android\app\build\outputs\apk\debug\app-debug.apk"
```

---

## 🚀 Próximos Pasos

1. **Abre una nueva ventana de PowerShell**
2. **Ejecuta los comandos del Paso 1-4**
3. **Abre Android Studio y sigue los Pasos 6-9**

Si tienes algún error, revisa la sección de "Solución de Problemas" arriba.

¡Buena suerte! 🎉
