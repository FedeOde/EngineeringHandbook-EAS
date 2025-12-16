# 🚀 Compilar APK con EAS Build (Expo Application Services)

## ¿Por Qué EAS Build?

Después de varios intentos con Gradle local, la forma más rápida y confiable es usar EAS Build:

✅ **Ventajas:**
- No necesitas configurar nada localmente
- No necesitas Android Studio ni Java configurado
- Compilación en servidores de Expo (más rápida)
- APK optimizada y lista para instalar
- Gratis para proyectos pequeños

⏱️ **Tiempo:** 10-15 minutos (primera vez)

---

## Paso 1: Instalar EAS CLI

```powershell
npm install -g eas-cli
```

---

## Paso 2: Volver al Directorio Raíz

```powershell
cd ..
```

Debes estar en: `C:\Users\odena\Documentos NS\Engineering handbook`

---

## Paso 3: Iniciar Sesión en Expo

```powershell
eas login
```

Si no tienes cuenta:
```powershell
eas register
```

Es gratis. Solo necesitas un email y contraseña.

---

## Paso 4: Configurar EAS Build

```powershell
eas build:configure
```

Esto creará un archivo `eas.json` con la configuración.

---

## Paso 5: Compilar la APK

```powershell
eas build --platform android --profile preview
```

**¿Qué pasará?**
1. EAS subirá tu código a sus servidores
2. Compilará la APK en la nube
3. Te dará un link para descargarla

**Tiempo estimado:** 10-15 minutos

---

## Paso 6: Descargar e Instalar

Una vez que termine, verás algo como:

```
✔ Build finished
https://expo.dev/accounts/TU_USUARIO/projects/engineering-pocket-helper/builds/XXXXX
```

1. Abre ese link en tu navegador
2. Descarga la APK
3. Transfiérela a tu teléfono
4. Instálala

---

## Alternativa: Compilar para Instalación Directa

Si quieres que EAS instale directamente en tu dispositivo conectado:

```powershell
eas build --platform android --profile preview --local
```

Esto compila localmente pero usando el entorno de EAS (más confiable que Gradle directo).

---

## Perfiles de Compilación

EAS tiene 3 perfiles en `eas.json`:

### 1. **development** - Para desarrollo
```powershell
eas build --platform android --profile development
```
- Incluye herramientas de desarrollo
- Más grande (~80 MB)
- Para pruebas internas

### 2. **preview** - Para pruebas (RECOMENDADO)
```powershell
eas build --platform android --profile preview
```
- APK optimizada
- Tamaño medio (~30-40 MB)
- Para compartir con testers

### 3. **production** - Para publicar
```powershell
eas build --platform android --profile production
```
- AAB para Google Play Store
- Máxima optimización
- Requiere firma de app

---

## Comandos Completos en Orden

```powershell
# 1. Instalar EAS CLI
npm install -g eas-cli

# 2. Volver al directorio raíz
cd ..

# 3. Iniciar sesión
eas login

# 4. Configurar
eas build:configure

# 5. Compilar APK
eas build --platform android --profile preview
```

---

## Ver el Estado de la Compilación

```powershell
eas build:list
```

O visita: https://expo.dev/accounts/TU_USUARIO/projects

---

## Solución de Problemas

### "No Expo account found"
```powershell
eas register
```

### "Project not configured"
```powershell
eas build:configure
```

### "Build failed"
Revisa los logs en el link que te da EAS. Usualmente son problemas de dependencias que EAS puede resolver automáticamente.

---

## Costos

- **Gratis**: 30 builds/mes para proyectos de código abierto
- **Hobby**: Gratis con límites
- **Production**: $29/mes para builds ilimitados

Para tu proyecto, el plan gratuito es suficiente.

---

## Resumen

EAS Build es la solución más confiable cuando Gradle local tiene problemas. Es lo que Expo recomienda oficialmente y lo que usan miles de desarrolladores.

**Próximos pasos:**
1. Ejecuta `npm install -g eas-cli`
2. Ejecuta `cd ..` (volver al directorio raíz)
3. Ejecuta `eas login` (o `eas register` si no tienes cuenta)
4. Ejecuta `eas build:configure`
5. Ejecuta `eas build --platform android --profile preview`
6. Espera 10-15 minutos
7. Descarga e instala la APK

¡Avísame cuando empieces y te ayudo con cualquier error! 🚀
