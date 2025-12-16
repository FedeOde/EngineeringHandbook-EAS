# Pasos para Ejecutar la App - GUÍA RÁPIDA

## ✅ Configuración Completada

He actualizado los archivos necesarios para usar Expo. Ahora sigue estos pasos:

## Paso 1: Instalar Dependencias de Expo

Abre PowerShell en el directorio del proyecto y ejecuta:

```powershell
npm install
```

Esto instalará Expo y actualizará las dependencias.

## Paso 2: Generar Archivos Nativos (Android e iOS)

Ejecuta este comando para generar las carpetas `android/` e `ios/`:

```powershell
npx expo prebuild
```

Este comando:
- Creará la carpeta `android/` con todos los archivos necesarios
- Creará la carpeta `ios/` (si estás en Mac)
- Configurará todo automáticamente

**Nota**: Si te pregunta algo durante el proceso, acepta las opciones por defecto (presiona Enter).

## Paso 3: Iniciar Metro Bundler

En la misma terminal, ejecuta:

```powershell
npm start
```

Esto iniciará el servidor de desarrollo de Expo. Verás un menú con opciones.

## Paso 4: Ejecutar en Android

Tienes dos opciones:

### Opción A: Desde el menú de Expo (Más Fácil)
Cuando ejecutes `npm start`, verás un menú. Presiona `a` para abrir en Android.

### Opción B: Comando directo
Abre OTRA terminal PowerShell y ejecuta:

```powershell
npm run android
```

## ¿Qué Esperar?

1. **Primera vez**: La compilación tomará 5-10 minutos
2. **Metro Bundler**: Verás logs de compilación de JavaScript
3. **Gradle**: Verás logs de compilación de Android
4. **Emulador**: La app se abrirá automáticamente en el emulador

## Si Algo Sale Mal

### Error: "Android SDK not found"
Necesitas instalar Android Studio:
1. Descarga: https://developer.android.com/studio
2. Instala Android Studio
3. Abre Android Studio → More Actions → SDK Manager
4. Instala Android SDK Platform 33

### Error: "No devices found"
Asegúrate de que el emulador esté corriendo:
```powershell
adb devices
```
Deberías ver `emulator-5554   device`

### Error durante prebuild
Limpia e intenta de nuevo:
```powershell
rm -r node_modules
npm install
npx expo prebuild --clean
```

### La app no se actualiza
Presiona `r` en la terminal de Metro para recargar.

## Comandos Útiles

```powershell
# Ver dispositivos conectados
adb devices

# Limpiar caché de Metro
npm start -- --clear

# Limpiar y regenerar archivos nativos
npx expo prebuild --clean

# Ver logs de Android
adb logcat | Select-String "ReactNative"

# Reinstalar dependencias
rm -r node_modules
npm install
```

## Resumen de Comandos en Orden

```powershell
# 1. Instalar dependencias
npm install

# 2. Generar archivos nativos
npx expo prebuild

# 3. Iniciar servidor (en una terminal)
npm start

# 4. Ejecutar en Android (en otra terminal O presionar 'a' en el menú)
npm run android
```

## Próximos Pasos Después de que Funcione

Una vez que la app se abra en el emulador:

1. ✅ Verifica que se muestra la pantalla de inicio
2. ✅ Prueba la navegación entre pantallas
3. ✅ Cambia el idioma en Settings
4. ✅ Prueba las calculadoras
5. ✅ Prueba la lista de tareas

## Nota Importante

- **Primera compilación**: Toma tiempo, sé paciente
- **Cambios en código**: Se recargan automáticamente (Fast Refresh)
- **Cambios en dependencias**: Necesitas reiniciar Metro (`Ctrl+C` y `npm start`)
- **Cambios nativos**: Necesitas recompilar (`npm run android`)

¡Ejecuta los comandos y avísame si encuentras algún error! 🚀
