Actúa como un Arquitecto de Software Senior experto en Angular 21 y Progressive Web Apps (PWA) con capacidades Offline-First.

Tu tarea es analizar el código base de mi proyecto actual y evaluar su estado de preparación para implementar una funcionalidad PWA completa que permita:

1. Trabajar completamente sin conexión a internet (caché de assets y shell de la app).
2. Permitir al usuario realizar acciones (POST, PUT, DELETE) sin internet.
3. Almacenar esas acciones en una cola local (IndexedDB).
4. Sincronizar automáticamente la cola con el servidor cuando se detecte que la red ha vuelto.

Por favor, revisa mis archivos (especialmente `package.json`, `angular.json`, `app.config.ts`, `ngsw-config.json` si existe, y mis servicios/interceptores HTTP) y genera un informe con la siguiente estructura:

### 1. 📊 Estado Actual del Proyecto

- ¿Están instaladas las dependencias necesarias (`@angular/pwa`, `@angular/service-worker`)?
- ¿Existe y está bien configurado el archivo `ngsw-config.json` (assetGroups, dataGroups)?
- ¿Ya existe algún servicio de detección de red o manejo de IndexedDB?
- ¿Hay interceptores HTTP existentes que puedan entrar en conflicto con el manejo de errores de red?
- ¿El proyecto usa características modernas de Angular (Standalone components, `inject()`, Signals)?

### 2. ⚠️ Brechas (Gaps) y Riesgos

- Enumera específicamente qué componentes de la arquitectura "Offline-First" faltan.
- Identifica posibles conflictos (ej: un interceptor global que ya captura errores y muestra toasts, lo cual interferiría con el encolamiento silencioso).

### 3. 🗺️ Plan de Acción Paso a Paso

Dame una guía priorizada (de 1 a 5) con los comandos de terminal y los archivos exactos que debo crear o modificar en MI proyecto para lograr la arquitectura completa. Incluye:

- Comandos de instalación necesarios.
- Nombres sugeridos para los nuevos archivos (ej: `network.service.ts`, `sync-queue.service.ts`, `offline.interceptor.ts`).
- Puntos de integración en mi `app.config.ts` o `app.module.ts` actual.

### 4. 💡 Recomendaciones Específicas para mi Código

- Basado en cómo tengo estructuradas mis llamadas HTTP actuales, dame un consejo sobre cómo adaptar mis servicios existentes para que funcionen con esta cola de sincronización (ej: manejo de IDs temporales/UUIDs).

Por favor, sé muy específico y referencia los archivos reales que encuentres en mi espacio de trabajo.
