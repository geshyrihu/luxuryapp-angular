🧠 PROMPT MEJORADO: Auditoría + Estandarización de Listados Móviles Ionic (Sobre Implementación Existente)
🎭 Rol

Eres un Arquitecto Frontend Senior (Angular + Ionic) con experiencia en:

Refactorización de sistemas en producción
Auditoría de código existente
Definición de estándares escalables basados en implementaciones reales (no teóricos)
Performance en aplicaciones híbridas (Web + Mobile)
📍 Contexto del Proyecto
Ruta base:
D:\repos\luxuryapp-api\client\angular
Arquitectura: Angular (Web) + Ionic (Mobile híbrido)
Estado actual:
Ionic ya está parcialmente implementado
Se utiliza principalmente en listados/tablas
Existen múltiples implementaciones (no necesariamente consistentes)
🔑 Componentes clave

Componente base móvil:

src/app/core/components/data-view-mobile/data-view-mobile.ts

Menú de acciones:

src/app/core/components/action-menu/action-menu.ts

Catálogo de botones permitido:

src/app/core/components/buttons/mobile
🎯 Objetivo Principal

Realizar una auditoría completa del sistema existente para:

Detectar TODOS los usos reales de data-view-mobile en el proyecto
Analizar cómo se está implementando actualmente (variantes, anti-patrones, inconsistencias)
Definir un ESTÁNDAR OFICIAL basado en la realidad del código, no en teoría
Establecer mecanismos para:
Forzar consistencia
Validar uso correcto de Ionic
Restringir malas prácticas
Facilitar escalabilidad futura
🔍 ALCANCE CRÍTICO DEL ANÁLISIS

1. 🧭 Búsqueda Global (OBLIGATORIO)

Recorre TODO el proyecto y:

Encuentra todos los archivos donde se use:
data-view-mobile
<app-action-menu>
Identifica:
Variantes de implementación
Diferencias en estructura HTML
Uso (o mal uso) de componentes Ionic (ion-\*)
Uso incorrecto de botones fuera de buttons/mobile 2. 🧪 Análisis de Implementaciones Reales

Para cada implementación encontrada:

Evalúa:
Estructura del template
Flujo de datos (@Input, @Output, servicios)
Manejo de eventos (clicked, confirmed, etc.)
Uso de Ionic (correcto vs incorrecto)
Nivel de reutilización vs duplicación
Detecta:
❌ Anti-patrones
⚠️ Riesgos (performance, acoplamiento, mantenimiento)
🔁 Código repetido
🔓 Violaciones al uso de buttons/mobile 3. 🧱 Análisis de Componentes Base

Analiza en profundidad:

data-view-mobile
Responsabilidad real vs teórica
Nivel de acoplamiento
Flexibilidad actual
Problemas de escalabilidad
action-menu
Cómo renderiza contenido
Qué tan controlado está lo que recibe
Riesgos de uso libre (sin restricciones)
buttons/mobile
Estandarización actual (o falta de ella)
Consistencia en naming, eventos y payloads
📐 DEFINICIÓN DEL ESTÁNDAR (BASADO EN LO EXISTENTE)

Construye un estándar que:

✔ NO rompa lo actual (enfoque evolutivo)
✔ Corrija inconsistencias
✔ Unifique criterios

Debe incluir:

1. 📦 Estructura Oficial de Listados Móviles
   Cómo debe construirse un listado usando data-view-mobile
   Estructura HTML clara (Ionic-first)
   Separación de responsabilidades
2. 🔘 Estándar de Botones Móviles
   Convenciones obligatorias:
   Naming
   Inputs/Outputs
   Payloads tipados
   Catálogo oficial (edit, delete, custom, etc.)
   Cuándo crear nuevos botones vs reutilizar
3. ⚡ Manejo de Eventos
   Convención única para:
   (clicked)
   (confirmed)
   (dismissed)
   Estructura de handlers en el componente padre
   Validación de payloads
4. 🔗 Integración con data-view-mobile
   Cómo pasar configuración correctamente
   Cómo inyectar acciones
   Flujo de comunicación estándar
5. 🚀 Performance y Buenas Prácticas
   ChangeDetectionStrategy.OnPush
   trackBy
   Manejo de observables (RxJS)
   Prevención de renders innecesarios
   🚫 REGLAS ESTRICTAS (CRÍTICO)
   Dentro de <app-action-menu>:

✔ PERMITIDO:

Solo componentes de buttons/mobile

❌ PROHIBIDO:

ion-button directo
Botones custom fuera del catálogo
HTML libre
🔒 MECANISMOS DE CONTROL (OBLIGATORIO)

Define cómo forzar esto técnicamente:

Tipado estricto en Angular
Directivas de validación
Content projection controlado
Reglas ESLint personalizadas
Validación en build o runtime
💻 EJEMPLOS REALES

Basados en el código encontrado:

✅ Caso correcto (extraído o adaptado del proyecto)
❌ Casos incorrectos (reales detectados)
Explica por qué están mal
Cómo corregirlos
🔄 GUÍA DE REFACTORIZACIÓN
Cómo migrar implementaciones actuales al estándar
Estrategia incremental (sin romper producción)
Priorización (quick wins vs cambios profundos)
🛠️ VALIDACIÓN Y AUTOMATIZACIÓN
Reglas @angular-eslint propuestas
Validaciones específicas:
Uso indebido de app-action-menu
Uso incorrecto de Ionic
Snippets VS Code
PR Checklist enfocado en listados móviles
📊 ADOPCIÓN Y GOBERNANZA
Cómo agregar nuevos botones al catálogo
Flujo de revisión técnica
Métricas de éxito:
Reducción de inconsistencias
Menos bugs UI
Mayor velocidad de desarrollo
⚠️ DETECCIÓN DE RIESGOS

Marca explícitamente como:

⚠️ RIESGO:
[Descripción]
[Impacto]
[Recomendación]
📤 FORMATO DE SALIDA
Documento Markdown profesional
Listo para wiki técnica
Con:
Código con syntax highlighting
Tablas comparativas
Ejemplos reales del sistema
🚀 INICIO

Analiza el repositorio completo, enfócate en el uso real de:

data-view-mobile
app-action-menu
buttons/mobile

Y genera el estándar basado en evidencia del código, no suposiciones.

💡 NOTA CLAVE

Este prompt NO busca diseñar desde cero, sino:

ordenar, estandarizar y escalar lo que ya existe sin romper el sistema actual.
