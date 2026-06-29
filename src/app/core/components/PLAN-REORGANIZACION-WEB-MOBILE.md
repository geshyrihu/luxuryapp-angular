# Plan de Reorganizacion `core/components`

## Objetivo final
- [x] Eliminar `src/app/core/components/buttons`.
- [x] Eliminar `src/app/core/components/inputs`.
- [x] Dejar la raiz de `core/components` unicamente con:
  - [x] `web/`
  - [x] `mobile/`
  - [x] `shared/`
  - [x] archivos `.md` de soporte

## Regla definitiva de arquitectura
- [x] Todo componente `web-first` vive en `src/app/core/components/web/...`.
- [x] Todo componente `mobile-first` vive en `src/app/core/components/mobile/...`.
- [x] Todo componente transversal o base vive en `src/app/core/components/shared/...`.
- [x] Los componentes base de botones viven en `shared/buttons/base/`.
- [x] Los componentes base de inputs viven en `shared/inputs/base/`.
- [x] No se deben volver a crear carpetas raiz `buttons/` ni `inputs/`.

## Estado actual confirmado
- [x] La raiz fisica de `core/components` ya solo contiene `web`, `mobile`, `shared` y documentos.
- [x] `web/buttons/` contiene la implementacion canonica web de botones.
- [x] `web/inputs/` contiene la implementacion canonica web de inputs.
- [x] `mobile/buttons/` contiene la implementacion canonica mobile de botones.
- [x] `mobile/inputs/` contiene la implementacion canonica mobile de inputs.
- [x] `shared/buttons/base/` contiene bases compartidas de botones.
- [x] `shared/inputs/base/` contiene bases compartidas de inputs.
- [x] No se detectan imports activos apuntando a `core/components/buttons` o `core/components/inputs`.

## Estructura canonica

### `web/`
- [x] `buttons/`
- [x] `inputs/`
- [x] `charts/`
- [x] `bitacora-filtro-fecha/`
- [x] `header-customer/`
- [x] `mesanio/`
- [x] `primeng-custom-caption/`
- [x] `primeng-custom-global-filter/`
- [x] `primeng-custom-table-footer/`
- [x] `primeng-custom-toast/`
- [x] `rango-calendario-mes-anio/`
- [x] `rango-calendario-yyyymmdd/`
- [x] `report-header/`
- [x] `title-page-report/`
- [x] `title-page-report-maintenance/`
- [x] `title-solicitud-pago-pdf/`
- [x] `touchspin/`

### `mobile/`
- [x] `buttons/`
- [x] `inputs/`
- [x] `action-menu/`
- [x] `data-view-mobile/`
- [x] `tap-to-top/`

### `shared/`
- [x] `buttons/base/`
- [x] `inputs/base/`
- [x] Componentes transversales (`app-icon`, `empty-state`, `loader`, `status-badge`, `pdf-viewer-modal`, etc.)

## Validacion tecnica
- [x] `ng build` compila despues de la reorganizacion.
- [x] Se reconstruyeron las bases compartidas necesarias para que `web/buttons` y `web/inputs` no dependan de rutas legacy.
- [x] Se consolidaron exports locales en `web/buttons/index.ts` y `web/inputs/index.ts`.
- [x] Se corrigieron incompatibilidades de `input()` y `output()` heredados en clases base decoradas.

## Pendientes reales

### Fase 1. Catalogo vivo
- [ ] Validar manualmente el catalogo en navegador dentro de `features/system/catalogs/catalog-component-ui`.
- [ ] Confirmar que las demos de `web/buttons` y `web/inputs` se vean correctas.
- [ ] Confirmar que las demos de `mobile/buttons` y `mobile/inputs` se vean correctas.

### Fase 2. Gobierno
- [ ] Documentar en el catalogo el import recomendado por componente.
- [ ] Agregar una regla de revision para rechazar nuevos componentes fuera de `web`, `mobile` o `shared`.
- [ ] Revisar si `haeder-customer.ts` debe renombrarse a `header-customer.ts` en una fase separada.

### Fase 3. Deuda menor
- [ ] Limpiar warnings no bloqueantes de Angular en componentes tocados.
- [ ] Revisar archivos auxiliares sobrantes como `test.txt` o `documentacionprimeng.txt`.

## Definicion de terminado
- [x] La raiz de `core/components` ya no muestra `buttons/` ni `inputs/`.
- [x] La app compila con la estructura nueva.
- [ ] El catalogo se valida visualmente en vivo.
- [ ] Quedan documentadas las reglas para que la estructura no se vuelva a degradar.
