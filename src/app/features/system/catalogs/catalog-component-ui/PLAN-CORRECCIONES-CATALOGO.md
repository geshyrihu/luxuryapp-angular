# Plan de Correcciones del Catálogo

**Base:** `FASE-0-AUDITORIA-ESTADO-ACTUAL.md`  
**Objetivo:** Convertir `catalog-component-ui/` en el escaparate oficial de componentes reutilizables, sin estilos hardcodeados y con ejemplos fieles a los componentes reales del sistema.

## 1. Alineación de criterio

Este plan parte de estas decisiones:

- El catálogo **no** debe ser una colección de demos ad hoc.
- El catálogo **sí** debe mostrar cómo se verán los componentes reutilizables reales.
- No debe haber colores, bordes, sombras, tamaños o tipografías hardcodeadas dentro del catálogo, salvo casos documentados de visualización de token.
- Los ejemplos deben consumir:
  - componentes de `core/components/`
  - wrappers DS (`custom-button-*`, `custom-input-*-signal`, `app-empty-state`, etc.)
  - tokens `--ds-*`
- El catálogo debe servir para validar consistencia visual en web y mobile, no para inventar una segunda UI paralela.

---

## 2. Meta de salida

Al terminar estas correcciones, el catálogo debe quedar así:

- Cada componente importante tiene una página clara de showcase.
- La apariencia sale de tokens y componentes reales, no de estilos inline.
- Los ejemplos muestran variantes verdaderas de uso:
  - default
  - disabled
  - error
  - success / info / warning / danger cuando aplique
  - responsive o mobile cuando aplique
- El catálogo deja explícito qué es:
  - Foundation
  - Componente reutilizable
  - Patrón
  - Layout
  - Legacy

---

## 3. Problemas a corregir

## 3.1 Hardcodes visuales

Corregir cualquier uso de:

- hex directos
- `style=""` con color, borde, fondo, radius o sombra
- `backgroundColor`, `borderColor`, `textColor` embebidos en demos
- fallbacks visuales innecesarios dentro del catálogo

### Archivos prioritarios

- `pages/catalog-web-item/catalog-web-item.ts`
- `pages/catalog-core-item/catalog-core-item.ts`
- componentes mobile con bloques `.mobile-card` repetidos

## 3.2 Catálogo basado en demos, no en componentes reales

Corregir páginas donde hoy se renderiza PrimeNG raw o HTML de muestra en lugar del wrapper oficial del sistema.

### Regla

- Si existe wrapper DS, el catálogo debe mostrar el wrapper DS.
- PrimeNG raw solo debe mostrarse cuando:
  - todavía no exista wrapper
  - se esté documentando explícitamente una excepción

## 3.3 Mezcla de niveles

Separar lo que hoy está mezclado:

- tokens
- componentes
- patrones
- layouts
- auditoría / docs históricas

## 3.4 Duplicación de estilos de showcase

Eliminar estilos repetidos tipo:

- `.mobile-card`
- `.mobile-card-header`
- bloques inline de borde/radius/fondo

y moverlos a una capa reutilizable de showcase dentro del catálogo.

---

## 4. Plan de ejecución

## Fase 1 - Higiene visual del catálogo

**Objetivo:** eliminar hardcodes y estilos inline del escaparate.

### Tareas

1. Reemplazar hex directos por `var(--ds-*)`.
2. Reemplazar `style=""` repetidos por clases SCSS del catálogo.
3. Consolidar contenedores de demo en estilos comunes del catálogo.
4. Eliminar fallbacks de color donde ya exista token obligatorio.

### Resultado esperado

- El catálogo deja de “pintarse solo”.
- Empieza a verse como consumidor real del DS.

## Fase 2 - Showcase basado en reutilización real

**Objetivo:** que el catálogo enseñe componentes reutilizables reales y no imitaciones.

### Tareas

1. Revisar cada página de `catalog-web-item`.
2. Donde exista wrapper DS, sustituir demo raw por wrapper real.
3. Revisar `catalog-core-item` y separar:
   - core reusable real
   - widgets de negocio o showcase avanzado
4. Documentar excepciones donde todavía se use PrimeNG raw.

### Resultado esperado

- El catálogo se vuelve referencia de implementación.
- Lo que se ve en catálogo coincide con lo que debe usarse en features.

## Fase 3 - Reorganización por taxonomía

**Objetivo:** ordenar el catálogo por sistema de diseño, no por tecnología o backlog.

### Estructura objetivo

- Foundations
- Atoms
- Molecules
- Organisms
- Templates / Layouts
- Patterns
- Legacy

### Resultado esperado

- Navegación clara
- Menos mezcla entre docs, demo y auditoría

## Fase 4 - Dualidad Web / Mobile con criterio

**Objetivo:** mostrar paridad real cuando exista.

### Regla

- No forzar dualidad fake.
- Si un componente existe en web y mobile, mostrar ambas variantes.
- Si solo existe en web, marcarlo claramente.
- Si mobile aún no existe, marcarlo como pendiente, no simularlo.

### Resultado esperado

- El catálogo comunica estado real de madurez.

---

## 5. Orden recomendado de trabajo

### Bloque A - primero

- `catalog-web-item.ts`
- `catalog-core-item.ts`

Porque concentran la mayor deuda.

### Bloque B - después

- `pages/catalog-mobile/components/*`

Porque ahí hay mucha repetición de estilos de showcase.

### Bloque C - después

- `sidebar.ts`
- rutas / taxonomía de navegación

Porque primero hay que corregir el contenido antes del índice.

---

## 6. Criterios de aceptación

Cada corrección se considera completa solo si cumple esto:

- no deja hardcodes visuales evitables
- usa tokens DS
- usa componente reusable real cuando exista
- no agrega una segunda variante visual paralela
- no mezcla guía histórica con showcase vigente

---

## 7. Primera tanda concreta de correcciones

### Lote 1

- tokenizar `calendarDemoEvents`
- tokenizar `avatarList`
- tokenizar `emailHtml`
- quitar estilos inline repetidos de icon button demo

### Lote 2

- consolidar `.mobile-card` y `.mobile-card-header`
- mover estilos repetidos de mobile showcase a una capa común

### Lote 3

- revisar páginas web donde debe usarse wrapper DS antes que PrimeNG raw

---

## 8. Decisión operativa

Sí: vamos en la misma línea.

La línea correcta es esta:

- menos demo decorativa
- más componente reusable real
- cero hardcode visual evitable
- catálogo como contrato visual del sistema

El siguiente paso de ejecución debe arrancar por el **Lote 1**.
