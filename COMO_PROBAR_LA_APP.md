# Cómo Probar la Aplicación - Engineering Pocket Helper

## Estado Actual
✅ Emulador Android detectado: `emulator-5554`

## Pasos para Probar la App

### Opción 1: Usando React Native CLI (Recomendado)

**Paso 1: Abrir una nueva terminal PowerShell**
- Abre una nueva ventana de PowerShell
- Navega al directorio del proyecto:
```powershell
cd "C:\Users\odena\Documentos NS\Engineering handbook"
```

**Paso 2: Iniciar Metro Bundler**
En la primera terminal, ejecuta:
```powershell
npx react-native start
```
Esto iniciará el servidor de desarrollo. Déjalo corriendo.

**Paso 3: Instalar y ejecutar en Android**
Abre OTRA terminal PowerShell nueva y ejecuta:
```powershell
cd "C:\Users\odena\Documentos NS\Engineering handbook"
npx react-native run-android
```

### Opción 2: Usando npm scripts

**Paso 1: Iniciar Metro**
```powershell
npm start
```

**Paso 2: En otra terminal, ejecutar Android**
```powershell
npm run android
```

### Opción 3: Instalación Manual (Si las anteriores fallan)

**Paso 1: Compilar la app**
```powershell
cd android
.\gradlew assembleDebug
cd ..
```

**Paso 2: Instalar en el emulador**
```powershell
adb install -r android\app\build\outputs\apk\debug\app-debug.apk
```

**Paso 3: Iniciar Metro**
```powershell
npx react-native start
```

**Paso 4: Abrir la app en el emulador**
Busca "EngineeringPocketHelper" en el menú de apps del emulador y ábrela.

## Solución de Problemas

### Si Metro no inicia
```powershell
# Limpiar caché
npx react-native start --reset-cache
```

### Si la app no se instala
```powershell
# Limpiar build de Android
cd android
.\gradlew clean
cd ..

# Reinstalar dependencias
npm install
```

### Si ves "Unable to load script"
1. Asegúrate de que Metro está corriendo
2. En el emulador, presiona Ctrl+M (o sacude el dispositivo)
3. Selecciona "Reload"

### Si ves errores de permisos
```powershell
# En el directorio android
cd android
.\gradlew clean
cd ..
```

## Verificar que Todo Funciona

Una vez que la app se abra, deberías ver:

1. **Pantalla de Inicio** con tarjetas para:
   - Unit Converter (Conversor de Unidades)
   - Drill & Threading Tables (Tablas de Taladrado)
   - Flange Database (Base de Datos de Bridas)
   - Torque Calculator (Calculadora de Torque)
   - Offset Calculator (Calculadora de Offset)
   - Task List (Lista de Tareas)
   - Photo Annotation (Anotación de Fotos)
   - Sticky Notes (Notas Adhesivas)
   - Voice Notes (Notas de Voz)

2. **Navegación inferior** con:
   - Home (Inicio)
   - Settings (Configuración)

3. **Cambio de idioma**: Ve a Settings y cambia entre English y Spanish

## Funcionalidades para Probar

### 1. Unit Converter
- Selecciona una categoría (Length, Weight, etc.)
- Ingresa un valor
- Selecciona unidades de origen y destino
- Verifica la conversión

### 2. Torque Calculator
- Selecciona tamaño de tornillo
- Selecciona grado del tornillo
- Selecciona condición de lubricación
- Verifica el cálculo en múltiples unidades

### 3. Offset Calculator
- Ingresa ángulo, offset y diámetro de tubería
- Verifica los cálculos geométricos

### 4. Task List
- Agrega una nueva tarea
- Marca como completada
- Edita la descripción
- Elimina tareas

### 5. Drill & Threading Tables
- Selecciona un estándar de rosca
- Busca especificaciones de taladrado

### 6. Flange Database
- Busca bridas por DN y estándar
- Busca por PCD (Pitch Circle Diameter)

### 7. Cambio de Idioma
- Ve a Settings
- Cambia entre English y Spanish
- Verifica que toda la UI se actualiza

## Comandos Útiles

```powershell
# Ver logs en tiempo real
adb logcat | Select-String "ReactNative"

# Reiniciar Metro con caché limpia
npx react-native start --reset-cache

# Reinstalar la app
npx react-native run-android

# Ver dispositivos conectados
adb devices

# Abrir menú de desarrollo en el emulador
adb shell input keyevent 82
```

## Notas Importantes

- **Metro debe estar corriendo** antes de abrir la app
- Si haces cambios en código nativo (android/), necesitas recompilar con `npx react-native run-android`
- Si solo cambias código JavaScript/TypeScript, puedes recargar con Ctrl+M → Reload
- El emulador debe estar corriendo antes de ejecutar `run-android`

## Estado del Proyecto

✅ Todas las funcionalidades implementadas
✅ 83% de tests pasando
✅ Navegación completa
✅ Soporte bilingüe (English/Spanish)
✅ Tema y estilos aplicados
✅ Manejo de errores implementado

¡La app está lista para probar! 🚀
