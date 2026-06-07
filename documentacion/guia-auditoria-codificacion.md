# Guía de Auditoría de Codificación (UTF-8)

Esta regla ha sido implementada para prevenir la aparición de caracteres corruptos (**Mojibake**) en el código fuente. Estos errores suelen ocurrir cuando archivos guardados en UTF-8 son interpretados o guardados accidentalmente con una codificación diferente (como ISO-8859-1).

## 🚫 El Problema: Mojibake
Se manifiesta como símbolos extraños en la interfaz de usuario o comentarios:
- `DescripciÃ³n` en lugar de **Descripción**
- `CotizaciÃ³n` en lugar de **Cotización**
- `GarantÃ­a` en lugar de **Garantía**

## 🛠️ Herramienta de Auditoría
Se ha creado un script automatizado que escanea el proyecto en busca de estos patrones.

### Cómo ejecutarlo
Puedes correr la auditoría en cualquier momento con el siguiente comando:
```bash
npm run audit:encoding
```

Este script también está integrado en el comando general de linting:
```bash
npm run lint
```

## 📋 Reglas del Proyecto
1. **UTF-8 Obligatorio**: Todos los archivos del proyecto (`.ts`, `.html`, `.json`, `.scss`) deben estar guardados en formato **UTF-8 sin BOM**.
2. **Falla en CI/CD**: Cualquier archivo que contenga caracteres mojibake hará que el proceso de integración continua (o el comando lint local) falle.

## 💡 Cómo solucionar errores
Si la auditoría falla:
1. **Localiza el archivo**: El script te indicará la ruta y el número de línea exacto.
2. **Corrige el texto**: Reemplaza el símbolo extraño por el carácter correcto (á, é, í, ó, ú, ñ, ¿, ¡).
3. **Configura tu editor**:
   - En **VS Code**, asegúrate de que en la barra de estado (esquina inferior derecha) diga **UTF-8**.
   - Se recomienda tener la siguiente configuración en `.vscode/settings.json`:
     ```json
     {
       "files.encoding": "utf8",
       "files.autoGuessEncoding": false
     }
     ```

## 🔍 Archivos Auditados
- Carpeta `src/`: Todos los componentes, servicios y estilos.
- Carpeta `public/`: Archivos de traducción i18n (`es.json`, `en.json`).
