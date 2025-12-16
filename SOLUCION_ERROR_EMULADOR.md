# Solución: Error de Conexión con Emulador

## Error Detectado
```
Error: could not connect to TCP port 5554
No se puede establecer una conexión ya que el equipo de destino denegó expresamente dicha conexión
```

## Causa
El emulador está corriendo pero ADB (Android Debug Bridge) perdió la conexión o está en un estado inconsistente.

## Solución Rápida

### Paso 1: Reiniciar ADB
Ejecuta estos comandos en PowerShell:

```powershell
# Matar el servidor ADB
adb kill-server

# Iniciar el servidor ADB
adb start-server

# Verificar dispositivos
adb devices
```

Deberías ver:
```
List of devices attached
emulator-5554   device
```

### Paso 2: Si el Paso 1 No Funciona - Reiniciar Emulador

**Opción A: Desde Android Studio**
1. Abre Android Studio
2. Ve a Tools → Device Manager (o AVD Manager)
3. Detén el emulador actual (botón Stop)
4. Espera 10 segundos
5. Inicia el emulador de nuevo (botón Play)

**Opción B: Desde Línea de Comandos**
```powershell
# Cerrar el emulador
adb -s emulator-5554 emu kill

# Esperar 10 segundos

# Listar emuladores disponibles
emulator -list-avds

# Iniciar el emulador (reemplaza NOMBRE_AVD con el nombre que aparece)
emulator -avd NOMBRE_AVD
```

### Paso 3: Verificar Conexión
```powershell
adb devices
```

Debe mostrar:
```
List of devices attached
emulator-5554   device
```

Si muestra `offline` o `unauthorized`, reinicia el emulador.

### Paso 4: Intentar de Nuevo
Una vez que el emulador esté conectado correctamente:

```powershell
npm run android
```

## Solución Alternativa: Usar Expo Go (Más Fácil)

Si sigues teniendo problemas con el emulador, puedes usar Expo Go en tu teléfono real:

### Paso 1: Instalar Expo Go
- **Android**: https://play.google.com/store/apps/details?id=host.exp.exponent
- Descarga e instala en tu teléfono

### Paso 2: Iniciar Expo
```powershell
npm start
```

### Paso 3: Escanear QR
1. Verás un código QR en la terminal
2. Abre Expo Go en tu teléfono
3. Escanea el código QR
4. La app se cargará en tu teléfono

**Ventajas de Expo Go:**
- ✅ No necesitas emulador
- ✅ Pruebas en dispositivo real
- ✅ Más rápido para desarrollo
- ✅ Sin problemas de conexión ADB

## Comandos de Diagnóstico

```powershell
# Ver estado de ADB
adb version

# Ver procesos de ADB
tasklist | findstr adb

# Matar todos los procesos de ADB (si está atascado)
taskkill /F /IM adb.exe

# Ver logs del emulador
adb logcat

# Ver información del dispositivo
adb shell getprop ro.product.model
```

## Si Nada Funciona

### Opción 1: Reinstalar Platform Tools
1. Abre Android Studio
2. Ve a Tools → SDK Manager
3. En la pestaña "SDK Tools"
4. Desmarca "Android SDK Platform-Tools"
5. Aplica cambios (desinstala)
6. Marca "Android SDK Platform-Tools" de nuevo
7. Aplica cambios (reinstala)

### Opción 2: Crear Nuevo Emulador
1. Abre Android Studio
2. Tools → Device Manager
3. Create Device
4. Selecciona un dispositivo (ej: Pixel 5)
5. Selecciona una imagen del sistema (ej: Android 13 - API 33)
6. Finish
7. Inicia el nuevo emulador

### Opción 3: Usar Dispositivo Físico
1. Conecta tu teléfono Android por USB
2. Habilita "Depuración USB" en tu teléfono:
   - Settings → About Phone
   - Toca "Build Number" 7 veces
   - Vuelve → Developer Options
   - Activa "USB Debugging"
3. Ejecuta `adb devices` - deberías ver tu dispositivo
4. Ejecuta `npm run android`

## Recomendación

Para desarrollo rápido, te recomiendo **usar Expo Go en tu teléfono**:
1. Es más rápido
2. No tiene problemas de emulador
3. Pruebas en hardware real
4. Recarga automática funciona mejor

Solo necesitas:
```powershell
npm start
```

Y escanear el QR con Expo Go.

## Próximos Pasos

1. Intenta reiniciar ADB (Paso 1)
2. Si no funciona, reinicia el emulador (Paso 2)
3. Si sigue fallando, usa Expo Go en tu teléfono (más fácil)
4. Avísame qué método funcionó
