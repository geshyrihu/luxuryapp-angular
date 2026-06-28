# Design System Legacy

## Propósito

Este archivo concentra el valor histórico rescatable de la documentación previa del Design System para evitar que el árbol principal siga acumulando auditorías, planes y propuestas parciales.

No es la fuente de verdad implementada. La fuente de verdad implementada vive en:

- `src/styles/core/_colors.scss`
- `src/styles/core/_typography.scss`
- `src/styles/theme/_variables.scss`
- `src/styles/primeng-overrides.css`

## Documentos consolidados

### `AUDITORIA-COMPLETA.md`

Valor rescatado:

- Historial de correcciones DS entre 2026-06-23 y 2026-06-27.
- Confirmación de que ya hubo limpieza de duplicados como `--ds-border`.
- Contexto sobre hallazgos previos de PrimeNG, Ionic y dark mode.

Limitación:

- Mezcla problemas ya resueltos con pendientes viejos.
- No debe usarse como estado actual sin contrastarlo con código.

### `INVENTARIO-DS-REVISION.md`

Valor rescatado:

- Referencia histórica de la revisión previa.
- Útil para trazabilidad y decisiones de exclusión.

Limitación:

- No sustituye un inventario vivo del catálogo actual.

### `PROPUESTA-APP-TABLE.md`

Valor rescatado:

- La idea de encapsular boilerplate de `p-table` sigue siendo correcta.
- Aporta una dirección válida para estandarizar caption, empty state, paginator y responsive.

Limitación:

- Debe retomarse como RFC técnico o implementación real, no quedarse como documento aislado.

### `PLAN-AUDITORIA-GENERAL.md`

Valor rescatado:

- Visión de deuda estructural del DS.

Limitación:

- Quedó desalineado con el estado real actual.
- Debe considerarse histórico.

### `PLAN-DE-ACCION-ARCHIVO.md`

Valor rescatado:

- Trazabilidad del enfoque anterior.

Limitación:

- Ya fue reemplazado por metodologías más recientes.

### `pages/catalog-charts/DESIGN-SYSTEM.md`

Valor rescatado:

- Contexto de charts y lineamientos visuales específicos.

Limitación:

- La guía no debe vivir fragmentada dentro de una subpágina.
- Su contenido útil debe migrarse al catálogo de patrones u organismos.

## Decisiones vigentes heredadas

- Mantener `src/styles` como única fuente real de tokens.
- Considerar `luxury gold` como acento decorativo, no texto principal.
- No mezclar backlog de auditoría con showcase final del catálogo.
- Reducir demos con hardcodes y moverlos a consumo por tokens.

## Qué sí conservar

- Bitácoras de decisiones.
- RFCs técnicos con valor de arquitectura.
- Evidencia de migraciones DS ya resueltas.

## Qué no volver a dispersar

- Planes duplicados.
- Auditorías desactualizadas en paralelo.
- Guías locales dentro de subcarpetas del catálogo si el contenido aplica al sistema completo.
