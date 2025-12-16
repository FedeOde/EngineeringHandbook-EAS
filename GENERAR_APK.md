# 📦 Cómo Generar la APK de tu App

## Opción 1: APK de Debug (Más Rápido - RECOMENDADO)

Esta APK es para pruebas. Se genera en 5-10 minutos.

### Paso 1: Navegar a la carpeta android
```powershell
cd android
```

### Paso 2: Compilar la APK de debug
```powershell
.\gradlew assembleDebug
```

**Tiempo estimado**: 5-10 minutos la primera vez (descarga dependencias)

### Paso 3: Ubicar la APK
La APK se generará en:
```
android\app\build\outputs\apk\debug\app-debug.apk
```

### Paso 4: Instalar en tu dispositivo

**Opción A: Instalar en emulador**
```powershell
cd ..
adb install android\app\build\outputs\apk\debug\app-debug.apk
```

**Opción B: Instalar en teléfono físico**
1. Conecta tu teléfono por USB
2. Habilita "Depuración USB" en tu teléfono
3. Ejecuta:
```powershell
cd ..
adb devices
adb install android\app\build\outputs\apk\debug\app-debug.apk
```

**Opción C: Transferir manualmente**
1. Copia el archivo `app-debug.apk` a tu teléfono
2. Abre el archivo en tu teléfono
3. Permite instalar desde fuentes desconocidas si te lo pide
4. Instala la app

---

## Opción 2: APK de Release (Para Distribución)

Esta APK está optimizada y firmada. Es más pequeña y rápida.

### Paso 1: Generar una clave de firma (solo primera vez)

```powershell
cd android\app
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

Te pedirá:
- **Contraseña del keystore**: Elige una y recuérdala (ej: `android123`)
- **Nombre y apellido**: Tu nombre
- **Unidad organizativa**: Tu empresa o "Personal"
- **Organización**: Tu empresa o tu nombre
- **Ciudad**: Tu ciudad
- **Estado**: Tu estado/provincia
- **Código de país**: MX (o tu país)

**⚠️ IMPORTANTE**: Guarda el archivo `my-release-key.keystore` y la contraseña. Los necesitarás para futuras actualizaciones.

### Paso 2: Configurar Gradle para firmar

Crea el archivo `android/gradle.properties` (si no existe) y agrega:

```properties
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=android123
MYAPP_RELEASE_KEY_PASSWORD=android123
```

**⚠️ IMPORTANTE**: Reemplaza `android123` con tu contraseña real.

### Paso 3: Editar android/app/build.gradle

Busca la sección `android { ... }` y agrega antes de `buildTypes`:

```gradle
signingConfigs {
    release {
        if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
            storeFile file(MYAPP_RELEASE_STORE_FILE)
            storePassword MYAPP_RELEASE_STORE_PASSWORD
            keyAlias MYAPP_RELEASE_KEY_ALIAS
            keyPassword MYAPP_RELEASE_KEY_PASSWORD
        }
    }
}
```

Y dentro de `buildTypes { release { ... } }` agrega:

```gradle
signingConfig signingConfigs.release
```

### Paso 4: Compilar APK de release

```powershell
cd android
.\gradlew assembleRelease
```

### Paso 5: Ubicar la APK de release

La APK se generará en:
```
android\app\build\outputs\apk\release\app-release.apk
```

Esta APK es más pequeña (~20-30% menos) y está optimizada.

---

## Opción 3: Generar AAB (Para Google Play Store)

Si quieres publicar en Google Play Store, necesitas un AAB (Android App Bundle):

```powershell
cd android
.\gradlew bundleRelease
```

El AAB se generará en:
```
android\app\build\outputs\bundle\release\app-release.aab
```

---

## Solución de Problemas

### Error: "SDK location not found"

Crea el archivo `android/local.properties` con:
```properties
sdk.dir=C:\\Users\\TU_USUARIO\\AppData\\Local\\Android\\Sdk
```

Reemplaza `TU_USUARIO` con tu nombre de usuario de Windows.

### Error: "JAVA_HOME not set"

Instala Java JDK 11 o superior:
1. Descarga: https://adoptium.net/
2. Instala
3. Configura JAVA_HOME:
```powershell
setx JAVA_HOME "C:\Program Files\Eclipse Adoptium\jdk-11.0.XX-hotspot"
```

### Error durante compilación

Limpia y vuelve a intentar:
```powershell
cd android
.\gradlew clean
.\gradlew assembleDebug
```

### La APK es muy grande

La APK de debug es grande (~50-80 MB). La de release es más pequeña (~20-40 MB).

Para reducir más el tamaño, edita `android/app/build.gradle`:

```gradle
android {
    ...
    buildTypes {
        release {
            ...
            shrinkResources true
            minifyEnabled true
        }
    }
}
```

---

## Comandos Rápidos (Resumen)

### APK de Debug (Recomendado para pruebas)
```powershell
cd android
.\gradlew assembleDebug
cd ..
adb install android\app\build\outputs\apk\debug\app-debug.apk
```

### APK de Release (Para distribución)
```powershell
cd android
.\gradlew assembleRelease
cd ..
# Copia android\app\build\outputs\apk\release\app-release.apk a tu teléfono
```

---

## Verificar la APK

Después de instalar, busca "Engineering Pocket Helper" en el menú de apps de tu dispositivo.

---

## Próximos Pasos

1. Ejecuta `cd android` y luego `.\gradlew assembleDebug`
2. Espera 5-10 minutos (primera vez)
3. Instala la APK en tu dispositivo
4. ¡Prueba la app!

**Nota**: Si encuentras errores durante la compilación, cópialos y avísame para ayudarte a resolverlos.
