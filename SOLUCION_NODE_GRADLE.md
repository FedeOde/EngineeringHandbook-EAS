# 🔧 Solución: Gradle No Encuentra Node.js

## Problema
```
Cannot run program "node": CreateProcess error=2, El sistema no puede encontrar el archivo especificado
```

Gradle no puede encontrar Node.js aunque esté instalado.

## Solución Rápida

### Opción 1: Agregar Node al PATH de esta sesión

```powershell
$env:PATH = "C:\Program Files\nodejs;$env:PATH"
```

Luego intenta de nuevo:
```powershell
.\gradlew assembleDebug
```

### Opción 2: Configurar Node en gradle.properties

Crea o edita el archivo `android/gradle.properties` y agrega:

```properties
org.gradle.nodejs.home=C:\\Program Files\\nodejs
```

**Nota**: Usa doble barra invertida `\\` en Windows.

### Opción 3: Usar la Ruta Completa de Node

Edita `android/settings.gradle` y busca donde se usa `node`. Cambia `node` por la ruta completa:

```
"C:\\Program Files\\nodejs\\node.exe"
```

---

## Solución Permanente

Agregar Node.js al PATH del sistema:

1. Presiona `Windows + R`
2. Escribe `sysdm.cpl` y presiona Enter
3. Ve a "Opciones avanzadas" → "Variables de entorno"
4. En "Variables del sistema", busca `Path`
5. Haz clic en "Editar"
6. Haz clic en "Nuevo"
7. Agrega: `C:\Program Files\nodejs`
8. Haz clic en "Aceptar" en todas las ventanas
9. **Cierra y abre PowerShell de nuevo**

---

## Alternativa: Usar EAS Build (Expo Application Services)

Si sigues teniendo problemas con Gradle, puedes usar EAS Build de Expo para compilar en la nube:

### Paso 1: Instalar EAS CLI
```powershell
npm install -g eas-cli
```

### Paso 2: Configurar EAS
```powershell
cd "C:\Users\odena\Documentos NS\Engineering handbook"
eas build:configure
```

### Paso 3: Compilar APK en la nube
```powershell
eas build --platform android --profile preview
```

Esto compilará tu APK en los servidores de Expo y te dará un link para descargarla.

**Ventajas:**
- ✅ No necesitas configurar nada localmente
- ✅ No necesitas Android Studio
- ✅ Compilación más rápida
- ✅ APK optimizada

**Desventajas:**
- ⏱️ Requiere cuenta de Expo (gratis)
- ⏱️ Primera compilación toma ~10-15 minutos

---

## Resumen de Comandos

### Solución Rápida (Opción 1)
```powershell
# Agregar Node al PATH
$env:PATH = "C:\Program Files\nodejs;$env:PATH"

# Verificar
node --version

# Compilar
.\gradlew assembleDebug
```

### Alternativa con EAS Build
```powershell
# Instalar EAS
npm install -g eas-cli

# Volver al directorio raíz
cd ..

# Configurar
eas build:configure

# Compilar
eas build --platform android --profile preview
```

---

## Próximos Pasos

1. Intenta la Solución Rápida (Opción 1) primero
2. Si no funciona, usa EAS Build (más fácil)
3. Avísame cuál método funcionó
