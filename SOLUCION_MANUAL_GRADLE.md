# 🔧 Solución Manual para Error de Gradle

## ⚠️ ADVERTENCIA

Esta es una solución avanzada que requiere modificar archivos de Gradle manualmente. **Solo intenta esto si realmente quieres compilar localmente y EAS Build no es una opción para ti.**

**Recomendación**: Usa EAS Build (ver `RECOMENDACION_FINAL_APK.md`)

---

## 🐛 El Problema

```
Plugin [id: 'com.facebook.react.settings'] was not found
```

Este error ocurre porque:
1. `expo prebuild` genera `settings.gradle` con referencias al plugin de React Native CLI
2. El plugin `@react-native/gradle-plugin` no se está resolviendo correctamente
3. Gradle no puede encontrar el plugin y falla

---

## 🛠️ Solución Manual

### Paso 1: Eliminar la Carpeta Android

```powershell
cd "C:\Users\odena\Documentos NS\Engineering handbook"
Remove-Item -Recurse -Force android
```

### Paso 2: Verificar package.json

Asegúrate de que `react-native` esté instalado:

```powershell
npm list react-native
```

Deberías ver:
```
engineering-pocket-helper@1.0.0
└── react-native@0.73.11
```

Si no está, instálalo:
```powershell
npm install
```

### Paso 3: Regenerar con Expo

```powershell
npx expo prebuild --platform android --clean
```

### Paso 4: Modificar settings.gradle

Abre el archivo `android/settings.gradle` y reemplaza TODO el contenido con esto:

```groovy
pluginManagement {
  repositories {
    google()
    mavenCentral()
    gradlePluginPortal()
  }
}

dependencyResolutionManagement {
  repositoriesMode.set(RepositoriesMode.PREFER_PROJECT)
  repositories {
    google()
    mavenCentral()
    maven { url 'https://www.jitpack.io' }
  }
}

rootProject.name = 'Engineering Pocket Helper'
include ':app'

// Expo autolinking
apply from: new File(["node", "--print", "require.resolve('expo/package.json')"].execute(null, rootDir).text.trim(), "../scripts/autolinking.gradle")
useExpoModules()
```

### Paso 5: Modificar build.gradle (raíz)

Abre `android/build.gradle` y reemplaza TODO el contenido con esto:

```groovy
buildscript {
  ext {
    buildToolsVersion = "34.0.0"
    minSdkVersion = 23
    compileSdkVersion = 34
    targetSdkVersion = 34
    kotlinVersion = "1.9.22"
  }
  
  repositories {
    google()
    mavenCentral()
  }
  
  dependencies {
    classpath('com.android.tools.build:gradle:8.1.4')
    classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion")
  }
}

allprojects {
  repositories {
    google()
    mavenCentral()
    maven { url 'https://www.jitpack.io' }
  }
}
```

### Paso 6: Abrir en Android Studio

1. Abre Android Studio
2. File → Open
3. Selecciona: `C:\Users\odena\Documentos NS\Engineering handbook\android`
4. Espera la sincronización de Gradle

---

## ⚠️ Problemas Potenciales

### Si Gradle Sync Falla de Nuevo

El problema es más profundo y probablemente relacionado con:
- Versión de Node.js
- Configuración de PATH en Windows
- Permisos de archivos
- Versión de Gradle

**En este caso, usa EAS Build.**

### Si la App No Compila

Es posible que al modificar los archivos de Gradle manualmente, algunas funcionalidades de Expo no funcionen correctamente.

**En este caso, usa EAS Build.**

---

## 🎯 Alternativa: Usar Versión Anterior de React Native

Otra opción es downgrade a React Native 0.72, que no usa el nuevo sistema de plugins:

### Paso 1: Modificar package.json

Cambia la versión de `react-native`:

```json
"react-native": "0.72.7"
```

### Paso 2: Reinstalar

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Paso 3: Regenerar Android

```powershell
Remove-Item -Recurse -Force android
npx expo prebuild --platform android --clean
```

**Advertencia**: Esto puede causar incompatibilidades con otras dependencias.

---

## 🚀 Recomendación Final

Honestamente, **ninguna de estas soluciones manuales es ideal**. Todas tienen riesgos:

- ❌ Pueden romper funcionalidades de Expo
- ❌ Pueden causar problemas en el futuro
- ❌ Requieren mantenimiento manual
- ❌ No son la configuración oficial

**La mejor solución es usar EAS Build**:

```powershell
cd "C:\Users\odena\Documentos NS\Engineering handbook"
$env:EAS_NO_VCS=1
eas build --platform android --profile preview --clear-cache
```

Es:
- ✅ Oficial y soportado por Expo
- ✅ Funciona siempre
- ✅ No requiere modificaciones manuales
- ✅ Genera APKs idénticas a las locales

---

## 📝 Conclusión

Si realmente necesitas compilar localmente:
1. Intenta la Solución Manual (Paso 1-6)
2. Si falla, intenta el Downgrade de React Native
3. Si falla, **usa EAS Build**

Pero mi recomendación es: **Salta directo a EAS Build y ahórrate el dolor de cabeza.**

¿Qué prefieres intentar? 🤔
