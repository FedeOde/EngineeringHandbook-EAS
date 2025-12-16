# ☕ Configurar Java para Compilar la APK

## Buenas Noticias
¡Java ya está instalado con Android Studio! Solo necesitas configurar la variable de entorno.

## Solución Rápida (Temporal - Para Esta Sesión)

Ejecuta este comando en PowerShell:

```powershell
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
```

Luego verifica:
```powershell
java -version
```

Deberías ver algo como:
```
openjdk version "17.0.x"
```

Ahora intenta compilar de nuevo:
```powershell
.\gradlew assembleDebug
```

---

## Solución Permanente (Recomendado)

Para que JAVA_HOME esté configurado siempre:

### Opción 1: Usando PowerShell (Más Fácil)

```powershell
[System.Environment]::SetEnvironmentVariable('JAVA_HOME', 'C:\Program Files\Android\Android Studio\jbr', 'User')
```

Luego **cierra y abre PowerShell de nuevo** para que tome efecto.

### Opción 2: Usando la Interfaz de Windows

1. Presiona `Windows + R`
2. Escribe `sysdm.cpl` y presiona Enter
3. Ve a la pestaña "Opciones avanzadas"
4. Haz clic en "Variables de entorno"
5. En "Variables de usuario", haz clic en "Nueva"
6. Nombre de variable: `JAVA_HOME`
7. Valor de variable: `C:\Program Files\Android\Android Studio\jbr`
8. Haz clic en "Aceptar"
9. Busca la variable `Path` en "Variables de usuario"
10. Haz clic en "Editar"
11. Haz clic en "Nuevo"
12. Agrega: `%JAVA_HOME%\bin`
13. Haz clic en "Aceptar" en todas las ventanas
14. **Cierra y abre PowerShell de nuevo**

---

## Verificar que Funciona

```powershell
java -version
```

Deberías ver la versión de Java.

```powershell
echo $env:JAVA_HOME
```

Debería mostrar: `C:\Program Files\Android\Android Studio\jbr`

---

## Compilar la APK Ahora

Una vez configurado JAVA_HOME:

```powershell
cd "C:\Users\odena\Documentos NS\Engineering handbook\android"
.\gradlew assembleDebug
```

---

## Si Android Studio Está en Otra Ubicación

Si el comando anterior no funciona, busca dónde está instalado Android Studio:

```powershell
Get-ChildItem "C:\Program Files" -Filter "Android Studio" -Recurse -ErrorAction SilentlyContinue
```

O busca en:
- `C:\Program Files\Android\Android Studio\jbr`
- `C:\Program Files (x86)\Android\Android Studio\jbr`
- `C:\Users\TU_USUARIO\AppData\Local\Android\Sdk\jbr`

Una vez que lo encuentres, usa esa ruta para JAVA_HOME.

---

## Alternativa: Instalar Java Standalone

Si prefieres instalar Java por separado:

1. Descarga Java JDK 17: https://adoptium.net/
2. Instala (deja las opciones por defecto)
3. Configura JAVA_HOME a la ruta de instalación (ej: `C:\Program Files\Eclipse Adoptium\jdk-17.0.x-hotspot`)

---

## Resumen de Comandos

```powershell
# 1. Configurar JAVA_HOME (temporal)
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

# 2. Verificar
java -version

# 3. Compilar APK
cd "C:\Users\odena\Documentos NS\Engineering handbook\android"
.\gradlew assembleDebug
```

---

## Próximos Pasos

1. Ejecuta los comandos de "Solución Rápida" arriba
2. Verifica que `java -version` funcione
3. Ejecuta `.\gradlew assembleDebug`
4. Espera 5-10 minutos
5. ¡Tu APK estará lista!
