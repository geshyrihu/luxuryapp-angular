Actúa como un ingeniero senior especialista en Angular, análisis estático de código, refactorización segura y limpieza de código legado.

OBJETIVO
Necesito que analices de forma exhaustiva, segura y conservadora todos los componentes y archivos dentro de:

D:\repos\luxuryapp-api\client\angular\src

El objetivo es identificar archivos, componentes, módulos, servicios, directivas, pipes, guards, resolvers, interceptors, modelos, utilidades, assets, estilos, specs, configuraciones internas o cualquier otro recurso que NO esté siendo invocado, referenciado, importado, ruteado, renderizado o utilizado de ninguna forma en la aplicación.

REGLA PRINCIPAL
NO debes eliminar, mover, renombrar, modificar ni limpiar ningún archivo automáticamente.
El análisis debe ser SOLO LECTURA.
Tu salida debe ser un informe técnico con candidatos seguros, candidatos dudosos y archivos que deben conservarse.

CONDICIONES IMPORTANTES

1. No confíes únicamente en una búsqueda simple por nombre de archivo.
2. Debes considerar referencias directas, indirectas, dinámicas, implícitas o propias de Angular.
3. Un archivo solo debe marcarse como “eliminable con alta confianza” si existe evidencia suficiente de que no se usa en ninguna parte.
4. Si hay duda, clasifícalo como “REVISIÓN MANUAL” o “BAJA CONFIANZA”.
5. Debes validar especialmente falsos positivos comunes en Angular.
6. Debes entregar evidencia por cada archivo candidato.
7. No debes proponer limpieza definitiva sin antes entregar un plan de validación.

ALCANCE DEL ANÁLISIS
Analiza todo lo que esté dentro de:

D:\repos\luxuryapp-api\client\angular\src

Incluye, si existe:

- Componentes Angular.
- Standalone components.
- Módulos NgModules.
- Servicios e injectables.
- Directivas.
- Pipes.
- Guards.
- Resolvers.
- Interceptors.
- Rutas y rutas lazy.
- Archivos de routing.
- Modelos, interfaces, enums, DTOs.
- Helpers, utils, constants.
- Assets, imágenes, JSON locales.
- Styles, CSS, SCSS, Sass.
- index.html, main.ts, polyfills.ts, styles.ts/scss, environments.
- Archivos de prueba (*.spec.ts).
- Archivos barrel (index.ts).
- Configuraciones referenciadas desde angular.json, tsconfig*.json, package.json, karma.conf, tailwind.config, etc.
- Cualquier archivo .ts, .html, .css, .scss, .json, .svg, .png, .jpg, .ico, .webp, .txt, etc.

FUENTES DE REFERENCIA QUE DEBES REVISAR
Debes buscar referencias en, como mínimo:

- Archivos TypeScript.
- Plantillas HTML.
- Plantillas inline en decoradores @Component.
- Estilos inline en decoradores @Component.
- styleUrls / templateUrl.
- angular.json.
- tsconfig*.json.
- package.json scripts.
- Archivos de rutas.
- loadChildren / loadComponent.
- import dinámico.
- require.
- providers.
- declarations.
- imports.
- exports.
- bootstrap.
- entryComponents, si existe código antiguo.
- Uso de selectores de componentes en HTML.
- Uso de pipes en HTML.
- Uso de directivas por atributo en HTML.
- Uso de servicios mediante constructor, inject(), Injector, APP_INITIALIZER, HTTP_INTERCEPTORS, etc.
- Referencias en SCSS/CSS como url(), @import, @use, background-image, etc.
- Referencias en assets desde HTML, TS o JSON.
- Referencias en tests, e2e, mocks, fixtures o storybooks, si existen.
- Referencias dinámicas por string que coincidan con nombres de archivos, selectores, clases, rutas o componentes.

CRITERIOS PARA CONSIDERAR QUE ALGO “SÍ SE USA”
Marca como KEEP si el archivo cumple al menos una de estas condiciones:

- Es punto de entrada: main.ts, polyfills.ts, index.html, styles globales, environments usados por angular.json.
- Está referenciado directa o indirectamente desde rutas activas.
- Es un componente standalone importado por otro componente, plantilla o ruta.
- Es un componente declarado en un NgModule y su selector aparece en alguna plantilla.
- Es un servicio inyectado o referenciado por alguna clase, provider, factory, interceptor o initializer.
- Es una directiva o pipe declarado/importado y usado en plantilla.
- Es un guard, resolver o interceptor referenciado en rutas o providers.
- Es importado dinámicamente mediante import('...'), loadChildren, loadComponent, require, etc.
- Es usado en angular.json, tsconfig, package.json, karma, jest, cypress, playwright, tailwind, postcss u otra configuración.
- Es un asset referenciado por HTML, CSS, TS o configuración.
- Es un archivo de soporte necesario para tests, mocks, fixtures o herramientas de desarrollo, si su eliminación puede romper el proyecto.
- Existe evidencia de uso dinámico, aunque no haya import estático.
- Es parte de una librería interna o barrel export que podría ser consumida externamente, salvo que se demuestre lo contrario.

CRITERIOS PARA CONSIDERAR QUE ALGO “PODRÍA NO USARSE”
Marca como CANDIDATO si:

- No tiene imports estáticos desde ningún archivo activo.
- No aparece en rutas.
- No aparece en plantillas HTML ni en templates inline.
- No aparece en angular.json, tsconfig ni package.json.
- No es un entry point.
- No es requerido por tests o tooling.
- No tiene referencias dinámicas probables.
- No es un asset referenciado.
- No es un estilo global o importado por componentes.
- No es un archivo de configuración indispensable.
- Solo es referenciado por otros archivos que también parecen no usados.

CLASIFICACIÓN OBLIGATORIA
Para cada archivo analizado, define uno de estos estados:

1. KEEP
   - Se usa o no hay certeza suficiente para eliminarlo.

2. REVIEW_MANUAL
   - Parece no usado, pero hay riesgo de falso positivo.
   - Ejemplos: uso dinámico posible, referencia por string, barrel export, posible consumo externo, tests, assets ambiguos.

3. QUARANTINE_CANDIDATE
   - Hay bastantes indicios de no uso, pero aún se recomienda validación con build/tests antes de decidir.

4. SAFE_TO_REMOVE_HIGH_CONFIDENCE
   - Existe evidencia fuerte de que no se usa.
   - Solo puede marcarse así si pasaste todas las validaciones y no hay señales de uso directo, indirecto o dinámico.

NIVELES DE CONFIANZA
Asigna un nivel de confianza por candidato:

- HIGH
- MEDIUM
- LOW

No uses HIGH si:

- Solo hiciste búsqueda por nombre de archivo.
- No revisaste rutas lazy.
- No revisaste plantillas HTML.
- No revisaste imports dinámicos.
- No revisaste angular.json.
- No revisaste selectores de componentes.
- No verificaste si el archivo es exportado por un barrel.

FASES DEL ANÁLISIS

FASE 1 — INVENTARIO
Genera un inventario completo de archivos dentro de:
D:\repos\luxuryapp-api\client\angular\src

Incluye:

- Ruta completa.
- Extensión.
- Tipo probable: component, module, service, directive, pipe, model, util, route, asset, style, spec, config, other.
- Si parece standalone.
- Si parece parte de un NgModule.
- Si parece entry point.
- Si parece asset.
- Si parece spec/test.

FASE 2 — GRAFO DE DEPENDENCIAS
Construye mentalmente o explícitamente un grafo de dependencias desde los puntos de entrada:

- main.ts
- index.html
- angular.json
- app.routes.ts / app-routing.module.ts / rutas hijas
- app.config.ts, si existe
- AppModule o bootstrap component
- standalone components alcanzables
- lazy routes
- providers globales
- interceptors
- guards
- styles globales
- assets referenciados

Luego identifica archivos no alcanzables desde ese grafo.

FASE 3 — DETECCIÓN DE COMPONENTES NO USADOS
Para componentes Angular:

- Extrae el selector del decorador @Component.
- Busca el selector en archivos HTML.
- Busca el selector en templates inline.
- Verifica si el componente está declarado en algún NgModule.
- Verifica si el componente es standalone y es importado por otro componente/ruta.
- Verifica si aparece en loadComponent o loadChildren.
- Verifica si podría instanciarse dinámicamente vía ViewContainerRef, createComponent, dynamic component loader, etc.
- Si no hay ninguna referencia, márcalo como candidato.

FASE 4 — DETECCIÓN DE SERVICIOS NO USADOS
Para servicios:

- Busca la clase del servicio.
- Busca constructor(private ...: ServiceName) o inject(ServiceName).
- Busca providers que lo referencien.
- Busca APP_INITIALIZER, HTTP_INTERCEPTORS, factories, useExisting, useClass, useFactory.
- Busca referencias en módulos, componentes o rutas.
- Si tiene providedIn: 'root' pero no aparece en ningún lado, trátalo con cuidado: puede ser código muerto, pero requiere validación.
- Si no hay ninguna referencia, márcalo como candidato.

FASE 5 — DETECCIÓN DE RUTAS, GUARDS, RESOLVERS E INTERCEPTORS

- Revisa rutas activas.
- Revisa lazy routes.
- Revisa canActivate, canMatch, canDeactivate, resolve, providers.
- Revisa imports funcionales.
- Revisa referencias por string.
- Si un guard/resolver/interceptor no aparece en rutas ni providers, márcalo como candidato.

FASE 6 — DETECCIÓN DE DIRECTIVAS Y PIPES NO USADOS
Para directivas:

- Extrae el selector.
- Busca el selector en HTML.
- Verifica declarations/imports.
- Considera selectores de atributo, por ejemplo [appSomething].

Para pipes:

- Extrae el name del pipe.
- Busca uso en HTML como | pipeName.
- Verifica declarations/imports.
- Considera pipes usados dinámicamente o transformados en TS.

FASE 7 — DETECCIÓN DE ASSETS Y ESTILOS NO USADOS
Para assets:

- Busca el nombre del archivo.
- Busca rutas parciales.
- Busca en HTML, CSS, SCSS, TS, JSON y angular.json.
- Considera referencias dinámicas por interpolación.
- Si un asset solo existe en src/assets pero no se referencia, márcalo como candidato con confianza media o alta según el caso.

Para estilos:

- Verifica styles globales en angular.json.
- Verifica styleUrls.
- Verifica styles inline.
- Verifica @import, @use, url().
- Si un archivo SCSS/CSS no es importado ni referenciado, márcalo como candidato.

FASE 8 — ANÁLISIS DE ARCHIVOS DE PRUEBA
Para archivos *.spec.ts:

- No los elimines automáticamente.
- Determina si prueban un archivo que sí existe.
- Si el archivo probado existe pero no se usa en producción, marca el spec como REVIEW_MANUAL.
- Si el archivo probado no existe o el spec no corre en ninguna configuración, márcalo como candidato.
- Separa claramente “no usado en runtime” de “no usado en tests”.

FASE 9 — VALIDACIÓN ANTI FALSOS POSITIVOS
Para cada candidato, ejecuta o simula estas verificaciones:

1. Búsqueda por nombre de archivo sin extensión.
2. Búsqueda por nombre de clase principal.
3. Búsqueda por selector de componente/directiva.
4. Búsqueda por nombre de pipe.
5. Búsqueda por ruta/path asociado.
6. Búsqueda por import dinámico.
7. Búsqueda por loadChildren/loadComponent.
8. Búsqueda por templateUrl/styleUrls.
9. Búsqueda en angular.json.
10. Búsqueda en tsconfig*.json.
11. Búsqueda en package.json scripts o tools.
12. Búsqueda en tests/e2e/mocks, si existen.
13. Búsqueda en assets y estilos.
14. Búsqueda de strings dinámicos que coincidan parcialmente con el nombre del archivo.

Si no tienes acceso directo al sistema de archivos, indica exactamente qué comandos debo ejecutar y cómo interpretar la salida.

FASE 10 — VALIDACIÓN SEGURA PREVIA A LIMPIEZA
No propongas borrar directamente. Debes proponer este flujo seguro:

1. Crear una rama nueva:
   git checkout -b chore/unused-files-analysis

2. Generar un informe con candidatos.

3. Para candidatos de alto riesgo, moverlos temporalmente a una carpeta de cuarentena fuera del build, por ejemplo:
   _quarantine/

   O renombrarlos temporalmente con una extensión no compilable, por ejemplo:
   archivo.ts.disabled

4. Ejecutar validaciones:
   - npm install o npm ci, si corresponde.
   - npx ng build --configuration production
   - npx ng test --watch=false, si hay tests configurados.
   - npx tsc --noEmit, si aplica.
   - Lint, si aplica.

5. Si el build o los tests fallan:
   - Revertir cambios.
   - Marcar el archivo como KEEP o REVIEW_MANUAL.
   - Registrar la referencia que causó el fallo.

6. Si el build y los tests pasan:
   - Mantener el archivo como candidato validado.
   - Aun así, no eliminarlo sin aprobación explícita.

ENTREGABLE FINAL
Debes entregar un informe con estas secciones:

SECCIÓN 1 — RESUMEN EJECUTIVO

- Total de archivos analizados.
- Total KEEP.
- Total REVIEW_MANUAL.
- Total QUARANTINE_CANDIDATE.
- Total SAFE_TO_REMOVE_HIGH_CONFIDENCE.
- Riesgos detectados.
- Nivel de certeza global.

SECCIÓN 2 — TABLA DE RESULTADOS
Genera una tabla Markdown con columnas:

| Archivo | Tipo | Estado | Confianza | Motivo | Referencias encontradas | Posible uso dinámico | Recomendación |

Ejemplo de estados:

- KEEP
- REVIEW_MANUAL
- QUARANTINE_CANDIDATE
- SAFE_TO_REMOVE_HIGH_CONFIDENCE

SECCIÓN 3 — CANDIDATOS DETALLADOS
Para cada candidato no KEEP, incluye:

- Ruta completa.
- Tipo de archivo.
- Razón por la que parece no usado.
- Búsquedas realizadas.
- Referencias encontradas: 0 o lista.
- Si fue referenciado solo por tests.
- Si fue referenciado solo por otro archivo también candidato.
- Si existe riesgo de uso dinámico.
- Validación recomendada.
- Nivel de confianza.

SECCIÓN 4 — ARCHIVOS QUE NO DEBEN BORRARSE
Lista explícita de archivos que deben conservarse aunque parezcan no usados, por ser:

- Entry points.
- Configuración.
- Entornos.
- Estilos globales.
- Assets críticos.
- Soporte de build.
- Soporte de tests.
- Archivos generados necesarios.
- Archivos con posible uso externo.

SECCIÓN 5 — FALSOS POSITIVOS DETECTADOS
Explica qué archivos inicialmente parecían no usados, pero fueron descartados por:

- Uso dinámico.
- Ruta lazy.
- Selector en HTML.
- Provider.
- angular.json.
- Barrel export.
- Test.
- Asset indirecto.

SECCIÓN 6 — PLAN DE LIMPIEZA SEGURA
Propón un plan por fases:

- Fase 1: solo reporte.
- Fase 2: cuarentena de archivos de alta confianza.
- Fase 3: build + tests.
- Fase 4: revisión manual.
- Fase 5: eliminación definitiva opcional.

No ejecutes ninguna fase destructiva.

SECCIÓN 7 — COMANDOS DE VALIDACIÓN SUGERIDOS
Entrega comandos PowerShell seguros para validar referencias, por ejemplo:

- Listar archivos:
  Get-ChildItem -Path "D:\repos\luxuryapp-api\client\angular\src" -Recurse -File | Select-Object FullName

- Buscar texto recursivamente si existe ripgrep:
  rg -n "texto_a_buscar" "D:\repos\luxuryapp-api\client\angular\src"

- Buscar con PowerShell:
  Get-ChildItem -Path "D:\repos\luxuryapp-api\client\angular\src" -Recurse -Include _.ts,_.html,_.json,_.scss,*.css | Select-String -Pattern "texto_a_buscar"

Adapta los comandos según el archivo analizado.

SECCIÓN 8 — SALIDA ESTRUCTURADA OPCIONAL
Además del informe Markdown, genera una versión JSON o CSV con esta estructura mínima:

{
"filePath": "...",
"fileType": "...",
"status": "KEEP | REVIEW_MANUAL | QUARANTINE_CANDIDATE | SAFE_TO_REMOVE_HIGH_CONFIDENCE",
"confidence": "HIGH | MEDIUM | LOW",
"reason": "...",
"referencesFound": [],
"dynamicUsagePossible": true/false,
"referencedOnlyByTests": true/false,
"referencedOnlyByUnusedFiles": true/false,
"validationSuggested": "..."
}

RESTRICCIONES ADICIONALES

- No inventes referencias.
- No asumas que un archivo no se usa solo porque no tiene imports visibles.
- No asumas que un archivo se usa solo porque existe en una carpeta.
- No ignores rutas lazy.
- No ignores componentes standalone.
- No ignores selectores de componentes en HTML.
- No ignores assets usados por CSS o HTML.
- No ignores specs si forman parte de la suite de tests.
- No marques como HIGH un candidato si no comprobaste rutas, templates, angular.json e imports dinámicos.
- Si el repositorio es grande, prioriza exactitud sobre velocidad.
- Si no puedes verificar algo, márcalo como REVIEW_MANUAL.

IMPORTANTE
El objetivo no es solo encontrar archivos huérfanos, sino evitar eliminar accidentalmente código necesario.
La decisión final de limpieza debe tomarse con base en evidencia, validación de build/tests y revisión humana.

Comienza ahora el análisis y entrega primero el resumen ejecutivo y luego la tabla completa de resultados.
