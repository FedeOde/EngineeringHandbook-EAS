# 🚀 Forma MÁS FÁCIL de Probar la App - Expo Go

## ¿Por qué Expo Go?
- ✅ No necesitas compilar nada
- ✅ No hay problemas con emuladores
- ✅ Pruebas en tu teléfono real en 2 minutos
- ✅ Recarga automática al hacer cambios

## Paso 1: Instalar Expo Go en tu Teléfono

**Android:**
https://play.google.com/store/apps/details?id=host.exp.exponent

Descarga e instala la app "Expo Go" desde Google Play Store.

## Paso 2: Asegúrate de que tu PC y Teléfono Estén en la Misma Red WiFi

Ambos dispositivos deben estar conectados a la misma red WiFi (ej: tu WiFi de casa).

## Paso 3: Iniciar el Servidor de Desarrollo

En PowerShell, ejecuta:

```powershell
npm start
```

Verás algo como esto:
```
› Metro waiting on exp://192.168.1.100:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
```

## Paso 4: Escanear el Código QR

1. Abre **Expo Go** en tu teléfono
2. Toca "Scan QR code"
3. Apunta la cámara al código QR que aparece en la terminal
4. ¡Listo! La app se cargará en tu teléfono

## ¿Qué Esperar?

- **Primera carga**: 30-60 segundos (descarga el bundle de JavaScript)
- **Siguientes cargas**: Instantáneo
- **Cambios en código**: Se recargan automáticamente en el teléfono

## Si No Ves el Código QR

Presiona `Shift + D` en la terminal para abrir el panel de desarrollo en el navegador. Ahí verás el QR más grande.

O ejecuta:
```powershell
npm start -- --tunnel
```

Esto creará un túnel que funciona incluso si no estás en la misma red.

## Probar Funcionalidades

Una vez que la app se abra en tu teléfono:

### 1. Pantalla de Inicio
Deberías ver tarjetas para:
- Unit Converter
- Drill & Threading Tables
- Flange Database
- Torque Calculator
- Offset Calculator
- Task List
- Photo Annotation
- Sticky Notes
- Voice Notes

### 2. Cambiar Idioma
- Toca el ícono de Settings (abajo)
- Cambia entre English y Spanish
- Toda la interfaz se actualiza

### 3. Probar Calculadoras
- Toca "Unit Converter"
- Selecciona una categoría (Length, Weight, etc.)
- Ingresa un valor
- Verifica la conversión

### 4. Lista de Tareas
- Toca "Task List"
- Agrega una tarea
- Márcala como completada
- Edita o elimina

## Ventajas de Probar en Teléfono Real

- ✅ Ves el rendimiento real
- ✅ Pruebas gestos táctiles
- ✅ Verificas el tamaño de los elementos
- ✅ Pruebas funciones como cámara y micrófono (cuando las implementes)

## Comandos Útiles Durante Desarrollo

Mientras `npm start` está corriendo, puedes presionar:

- `r` - Recargar la app
- `m` - Abrir menú de desarrollo
- `d` - Abrir DevTools en el navegador
- `Ctrl+C` - Detener el servidor

## Si Algo Sale Mal

### "Unable to connect to Metro"
1. Verifica que tu PC y teléfono estén en la misma WiFi
2. Desactiva el firewall temporalmente
3. O usa modo túnel: `npm start -- --tunnel`

### "Network response timed out"
```powershell
npm start -- --clear
```

### La app no se actualiza
En Expo Go, sacude el teléfono y selecciona "Reload"

## Alternativa: Usar el Emulador

Si prefieres usar el emulador después de todo:

```powershell
# En una terminal
npm start

# En OTRA terminal
npm run android
```

Pero Expo Go es más rápido y fácil para desarrollo. 😊

## Próximos Pasos

1. Instala Expo Go en tu teléfono
2. Ejecuta `npm start` en PowerShell
3. Escanea el QR con Expo Go
4. ¡Prueba la app!
5. Avísame qué tal funciona

---

**Nota**: Si ya ejecutaste `npx expo prebuild`, las carpetas `android/` e `ios/` ya están creadas. Puedes usar tanto Expo Go como compilar para el emulador. Expo Go es solo más rápido para probar. 🚀
