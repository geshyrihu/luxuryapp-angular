# Reporte Forense `core/components`

## Resumen
- La reorganizacion por plataforma **sí existe en commits** de esta rama.
- El plan **sí existió** en el repo principal, pero fue creado con un nombre incorrecto y luego eliminado.
- El estado actual quedó mezclado con muchos cambios posteriores en working tree, por eso hoy se ve desorganizado.

## Commits clave
- `c5e747c` — reorganiza `buttons/` e `inputs/` por plataforma.
- `89f1170` — mueve `action-menu`, `data-view-mobile`, `tap-to-top` a `mobile/`.
- `4ab615c` — mueve componentes `web-first` y `shared`, y crea el plan.
- `baeb7a0` — borra el plan mal nombrado.

## Hallazgo importante del plan
- En `4ab615c` el archivo se creó como:
  - `src/app/core/components/PLAN-REORGANIZACION-WEB-MOBILE.md)`
- El paréntesis final `)` sobraba.
- En `baeb7a0` ese archivo fue eliminado, no renombrado.
- Este archivo `PLAN-REORGANIZACION-WEB-MOBILE.md` fue recuperado manualmente el `2026-06-28`.

## Qué se ve roto hoy respecto a `4ab615c`
- Faltan varios `index.ts` de compatibilidad en rutas raíz, por ejemplo:
  - `action-menu/index.ts`
  - `data-view-mobile/index.ts`
  - `app-icon/index.ts`
  - `charts/index.ts`
  - `global-error-alert/index.ts`
  - `loader/index.ts`
  - `mesanio/index.ts`
  - `pdf-viewer-modal/index.ts`
  - `primeng-custom-caption/index.ts`
  - `primeng-custom-global-filter/index.ts`
  - `primeng-custom-table-footer/index.ts`
  - `primeng-custom-toast/index.ts`
  - `report-header/index.ts`
  - `status-badge/index.ts`
  - `title-page-report/index.ts`
  - `title-page-report-maintenance/index.ts`
  - `title-solicitud-pago-pdf/index.ts`
  - `touchspin/index.ts`
  - `whats-new/index.ts`
- Además hay muchas carpetas `??` no trackeadas en `src/app/core/components`, lo que indica recreación/copias posteriores no consolidadas.

## Estado actual de la raíz
- Hoy la raíz de `src/app/core/components` volvió a llenarse con muchas carpetas además de `web/`, `mobile/` y `shared/`.
- Eso contradice el estado objetivo documentado en el plan recuperado.

## Conclusión
- Los commits base de reorganización **no se perdieron**.
- Lo que se desordenó fue el **working tree actual** y parte de la compatibilidad de rutas.
- La ruta más segura es comparar y reparar desde `89f1170` + `4ab615c`, no improvisar sobre el estado actual.
