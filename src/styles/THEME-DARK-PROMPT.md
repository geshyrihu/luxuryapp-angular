# Prompt: Corrección integral del tema oscuro en LuxuryApp

Actúa como arquitecto frontend senior especializado en Angular 21, PrimeNG 21 y SCSS.

Tenemos una app Angular que ya usa `body.theme-dark`, tokens CSS del Design System y overrides globales de PrimeNG, pero todavía hay componentes que no invierten correctamente sus colores en modo oscuro.

Tu objetivo es auditar y corregir el tema oscuro de forma integral, sin romper el modo claro ni la accesibilidad.

## Contexto real del proyecto

- Stack: Angular 21.0.8, PrimeNG 21.0.2, SCSS.
- Entradas de estilos:
  - `client/angular/src/styles/ds-entry.scss`
  - `client/angular/src/styles/styles.scss`
  - `client/angular/src/styles/theme/_dark-mode.scss`
- El tema oscuro se activa con `body.theme-dark`.
- PrimeNG debe gobernarse por tokens CSS, no por overrides agresivos por selector.

## Lo que debes corregir

### 1. Diagnóstico

- Detecta qué componentes y páginas no invierten bien en dark mode.
- Identifica colores hardcodeados y tokens de superficie que no se invierten correctamente.
- Identifica overrides con `!important` que estén bloqueando la inversión del tema.
- Revisa usos de `::ng-deep` y determina si pueden resolverse con tokens, `styleClass` o wrappers.
- Revisa si `ViewEncapsulation.None` está causando fugas de estilo.

### 2. Corrección técnica

- Prioriza arreglos en tokens CSS y variables de tema antes que reglas específicas.
- Ajusta `client/angular/src/styles/prime-overrides/_prime-tokens.scss` para que los tokens de PrimeNG reflejen bien light y dark.
- Ajusta `client/angular/src/styles/theme/_dark-mode.scss` para invertir superficies claras, bordes y textos secundarios.
- Corrige componentes DS custom para que consuman `--ds-*` y no colores fijos.
- Corrige componentes PrimeNG críticos:
  - `p-button`
  - `p-dialog`
  - `p-table`
  - `p-dropdown` / `p-select`
  - `p-inputtext`
  - `p-calendar`
- Corrige también superficies genéricas de layout y tarjetas.

### 3. Reglas obligatorias

- No rompas el modo claro.
- No introduzcas más `!important` salvo que sea estrictamente inevitable y quede documentado.
- No expandas `::ng-deep`; si ya existe, reduce su alcance.
- No uses colores hardcodeados si existe un token equivalente.
- No cambies la arquitectura base de estilos si el problema se puede resolver con tokens o cascada.

### 4. Criterios de corrección

- El fondo de página debe cambiar correctamente en dark mode.
- Las tarjetas y paneles deben usar superficies oscuras coherentes.
- El texto primario y secundario debe mantener contraste legible.
- Los bordes deben adaptar su color al tema.
- Los controles interactivos deben conservar estados visibles de hover, focus, disabled e invalid.
- Las tablas y overlays deben verse consistentes en ambas variantes.

### 5. Estrategia de implementación

- Primero audita tokens y variables compartidas.
- Después corrige overrides globales.
- Luego corrige componentes específicos o páginas con excepciones.
- Finalmente verifica vistas reales en escritorio y mobile.

### 6. Verificación final

- Revisa pantallas con cards, formularios, tablas, diálogos, dropdowns, calendarios y badges.
- Comprueba que no queden colores claros aislados dentro de `body.theme-dark`.
- Comprueba que no se haya roto contraste en textos secundarios ni en estados deshabilitados.
- Comprueba que no aparezcan regresiones visuales en light mode.

## Entregable esperado

Devuélveme:

- Lista de causas encontradas.
- Archivos a modificar.
- Cambios concretos aplicados.
- Riesgos residuales.
- Verificación recomendada para QA visual.

Trabaja sobre el repositorio real y usa el estado actual del sistema de estilos como fuente de verdad.
