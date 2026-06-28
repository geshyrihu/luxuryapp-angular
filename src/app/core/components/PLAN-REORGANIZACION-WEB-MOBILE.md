# Plan de Reorganizacion `core/components`

## Objetivo
- Reorganizar `src/app/core/components` para que exista una separacion clara por plataforma:
  - `web/`
  - `mobile/`
- Mantener fuera de esas carpetas solo lo realmente compartido o transversal:
  - `base/`
  - `shared/` o equivalente
  - utilidades/composicion comun

## Alcance
- Reordenar componentes reutilizables por plataforma.
- Corregir imports y barrels.
- Validar que el catalogo consuma la nueva estructura.
- Evitar perder piezas ya limpias de DS durante la reorganizacion.

## Estado actual detectado
- [x] `inputs/` ya tiene una separacion parcial: `web/`, `mobile/`, `base/`.
- [ ] `buttons/` aun no tiene paridad completa entre `web/` y `mobile/`.
- [ ] Existen multiples componentes raiz fuera de una organizacion por plataforma:
  - `loader/`
  - `status-badge/`
  - `data-view-mobile/`
  - `global-error-alert/`
  - `charts/`
  - `action-menu/`
  - otros
- [x] Ya existe movimiento fisico parcial hacia `mobile/` y `shared/`.
- [x] Se dejaron re-exports de compatibilidad temporal en rutas legacy mientras se terminan de migrar los consumidores.
- [x] Ya se avanzÃ³ en limpieza DS de varias piezas visibles.
- [x] Ya existen vistas objetivo iniciales para catalogo `web` y `mobile`.

## Fase 1. Inventario y clasificacion
- [x] Listar todos los componentes actuales en `core/components`.
- [x] Clasificar cada componente como:
  - `web`
  - `mobile`
  - `shared`
  - `base`
- [x] Detectar componentes duplicados o con naming inconsistente.
- [x] Detectar componentes que hoy estan en una familia incorrecta.

## Inventario clasificado actual

### `base`
- [x] `buttons/base`
- [x] `inputs/base`

### `web`
- [x] `buttons/web`
- [x] `charts`
- [x] `primeng-custom-caption`
- [x] `primeng-custom-global-filter`
- [x] `primeng-custom-table-footer`
- [x] `primeng-custom-toast`
- [x] `touchspin`
- [x] `bitacora-filtro-fecha`
- [x] `rango-calendario-mes-anio`
- [x] `rango-calendario-yyyymmdd`
- [x] `mesanio`
- [x] `report-header`
- [x] `title-page-report`
- [x] `title-page-report-maintenance`
- [x] `title-solicitud-pago-pdf`
- [x] `header-customer`

### `mobile`
- [x] `inputs/mobile`
- [x] `data-view-mobile`
- [x] `action-menu`
- [x] `tap-to-top`

### `shared`
- [x] `app-icon`
- [x] `action-icons-group`
- [x] `empty-state`
- [x] `loader`
- [x] `status-badge`
- [x] `global-error-alert`
- [x] `pdf-viewer-modal`
- [x] `whats-new`

## Hallazgos de Fase 1

### Estructura incompleta o inconsistente
- [x] `buttons` tiene `web` y `base`, pero no `mobile`.
- [x] `inputs` es la familia mas cercana al objetivo final (`web/mobile/base`).
- [x] Existen muchos componentes raiz que siguen fuera de una organizacion por plataforma.

### Naming inconsistente
- [x] `haeder-customer.ts` tiene typo en nombre de archivo dentro de `header-customer`.
- [x] Conviven prefijos distintos para componentes de una misma intencion:
  - `custom-*`
  - `ion-*`
  - `primeng-custom-*`
- [x] Conviven nombres en espanol e ingles dentro del mismo arbol:
  - `mesanio`
  - `report-header`
  - `touchspin`
  - `title-solicitud-pago-pdf`

### Componentes en familia incorrecta o pendientes de decidir
- [x] `action-menu` hoy esta en raiz pero por uso actual parece `mobile-first`.
- [x] `data-view-mobile` hoy esta en raiz pero claramente pertenece a `mobile/`.
- [x] `charts` hoy esta en raiz pero encaja mejor dentro de `web/`.
- [x] `primeng-custom-*` hoy esta en raiz pero encaja mejor dentro de `web/`.
- [x] `loader`, `status-badge`, `app-icon`, `global-error-alert` y `pdf-viewer-modal` deben tratarse como `shared`.

## Fase 2. Estructura objetivo
- [x] Crear estructura objetivo propuesta:
  - [x] `core/components/web/`
  - [x] `core/components/mobile/`
  - [x] `core/components/base/`
  - [x] `core/components/shared/` si aplica
- [x] Definir que familias viven dentro de `web/`.
- [x] Definir que familias viven dentro de `mobile/`.
- [x] Definir que piezas deben quedarse como `shared`.

## Estructura objetivo propuesta

### `core/components/web/`
- [x] `buttons/`
- [x] `inputs/`
- [x] `charts/`
- [x] `primeng-custom-caption/`
- [x] `primeng-custom-global-filter/`
- [x] `primeng-custom-table-footer/`
- [x] `primeng-custom-toast/`
- [x] `touchspin/`
- [x] `bitacora-filtro-fecha/`
- [x] `rango-calendario-mes-anio/`
- [x] `rango-calendario-yyyymmdd/`
- [x] `mesanio/`
- [x] `report-header/`
- [x] `title-page-report/`
- [x] `title-page-report-maintenance/`
- [x] `title-solicitud-pago-pdf/`
- [x] `header-customer/`

### `core/components/mobile/`
- [x] `buttons/`
- [x] `inputs/`
- [x] `data-view-mobile/`
- [x] `action-menu/`
- [x] `tap-to-top/`

### `core/components/base/`
- [x] `buttons/base/`
- [x] `inputs/base/`

### `core/components/shared/`
- [x] `app-icon/`
- [x] `action-icons-group/`
- [x] `empty-state/`
- [x] `loader/`
- [x] `status-badge/`
- [x] `global-error-alert/`
- [x] `pdf-viewer-modal/`
- [x] `whats-new/`

## Orden sugerido de migracion
- [x] 1. `buttons`
- [x] 2. `inputs`
- [x] 3. `data-view-mobile` + `action-menu`
- [x] 4. `charts` + `primeng-custom-*`
- [x] 5. `shared`

## Decision importante
- [x] Se crea el esqueleto fisico inicial:
  - [x] `core/components/web/`
  - [x] `core/components/mobile/`
  - [x] `core/components/shared/`
- [x] La siguiente fase ya puede mover familias reales sobre esta base.

## Fase 3. Migracion de familias

### 3.1 Buttons
- [x] Revisar estructura actual de `buttons/`.
- [x] Completar separacion `web/` y `mobile/`. â€” **Ya existe**: `buttons/base/`, `buttons/web/`, `buttons/mobile/`.
- [ ] Mover wrappers a `web/buttons/` y `mobile/buttons/`. â€” **Pendiente**: mover fisicamente romperia cientos de imports. La estructura actual ya separa por plataforma. Decidir si es necesario (cosmÃ©tico vs. funcional).
- [x] Ajustar exports â€” `index.ts` ya existen y funcionan.
- [x] Validar imports consumidores â€” build no reporta errores relacionados.

### 3.2 Inputs
- [x] Revisar `inputs/` actual.
- [x] Confirmar que `web/`, `mobile/` y `base/` esten consistentes. â€” **Ya existe**: `inputs/base/`, `inputs/web/`, `inputs/mobile/`.
- [ ] Mover cualquier input mal ubicado. â€” **Pendiente**: mismo caso que buttons, mover fisicamente romperia cientos de imports.
- [x] Ajustar barrels â€” ya existen.
- [x] Validar imports consumidores â€” build no reporta errores relacionados.

### 3.3 Componentes mobile-first
- [x] Reubicar componentes claramente mobile a `mobile/`.
  - [x] `data-view-mobile` tiene implementacion real en `mobile/data-view-mobile/`
  - [x] `action-menu` tiene implementacion real en `mobile/action-menu/`
  - [x] `tap-to-top` tiene implementacion real en `mobile/tap-to-top/`
  - [x] la implementacion fisica ya fue movida
  - [x] la raiz tiene re-exports de compatibilidad
  - [ ] retirar compatibilidad legacy cuando ya no existan consumidores viejos

### 3.4 Componentes web-first
- [x] Reubicar componentes claramente web a `web/`.
  - [x] `charts` â€” implementacion fisica MOVIDA a `web/charts/`
  - [x] `primeng-custom-caption` â€” implementacion fisica MOVIDA a `web/primeng-custom-caption/`
  - [x] `primeng-custom-global-filter` â€” implementacion fisica MOVIDA a `web/primeng-custom-global-filter/`
  - [x] `primeng-custom-table-footer` â€” implementacion fisica MOVIDA a `web/primeng-custom-table-footer/`
  - [x] `primeng-custom-toast` â€” implementacion fisica MOVIDA a `web/primeng-custom-toast/`
  - [x] `mesanio` â€” implementacion fisica MOVIDA a `web/mesanio/`
  - [x] `rango-calendario-yyyymmdd` â€” implementacion fisica MOVIDA a `web/rango-calendario-yyyymmdd/`
  - [x] `report-header` â€” implementacion fisica MOVIDA a `web/report-header/`
  - [x] `title-page-report` â€” implementacion fisica MOVIDA a `web/title-page-report/`
  - [x] `title-page-report-maintenance` â€” implementacion fisica MOVIDA a `web/title-page-report-maintenance/`
  - [x] la raiz tiene index.ts de re-export de compatibilidad

### 3.5 Shared / transversales
- [ ] Identificar componentes que deben vivir fuera de `web/` y `mobile/`.
  - [x] `app-icon`
  - [x] `empty-state`
  - [x] `loader`
  - [x] `status-badge`
  - [x] `global-error-alert`
  - [x] `pdf-viewer-modal`
  - [ ] otros
- [x] `app-icon`, `empty-state`, `loader`, `status-badge`, `global-error-alert`, `pdf-viewer-modal`, `action-icons-group` y `whats-new` ya viven en `shared/`.
- [x] Las carpetas legacy en raiz quedan solo como compatibilidad temporal.

## Avance tecnico inicial de Fase 3
- [x] Se crean carpetas por componente dentro de `mobile/`:
  - [x] `mobile/action-menu/`
  - [x] `mobile/data-view-mobile/`
  - [x] `mobile/tap-to-top/`
- [x] Se crean `index.ts` de re-export para transicion segura en `mobile/`.
- [x] Se crea `web/charts/index.ts`.
- [x] Se crean nuevos puntos de entrada en `web/` para:
  - [x] `primeng-custom-caption`
  - [x] `primeng-custom-global-filter`
  - [x] `primeng-custom-table-footer`
  - [x] `primeng-custom-toast`
  - [x] `mesanio`
  - [x] `rango-calendario-yyyymmdd`
  - [x] `report-header`
  - [x] `title-page-report`
  - [x] `title-page-report-maintenance`
- [x] Se crean puntos de entrada iniciales en `shared/`:
  - [x] `app-icon`
  - [x] `empty-state`
  - [x] `loader`
  - [x] `status-badge`
  - [x] `global-error-alert`
  - [x] `pdf-viewer-modal`
  - [x] `action-icons-group`
  - [x] `whats-new`
- [x] Se crea `shared/index.ts`.
- [x] Estrategia elegida para esta fase:
  - [x] primero crear puntos de entrada nuevos
  - [x] despues migrar imports consumidores
  - [x] al final mover implementaciones fisicas
- [x] `empty-state` se mueve a `shared/empty-state/`.

## Fase 4. Imports y compatibilidad
- [x] Corregir imports directos tras mover carpetas â€” 129 archivos actualizados en `operations`, `purchasing`, `accounting`, `hr`.
- [x] Corregir `index.ts` por familia â€” re-exports creados en raiz para todos los componentes movidos.
- [x] Corregir imports del catalogo DS â€” catalog-web y catalog-mobile ya usan rutas correctas.
- [x] Corregir imports en features consumidoras â€” migracion completa de `system`, `maintenance`, `legal`, `operations`, `purchasing`, `accounting`, `hr`.
- [x] Se dejaron re-exports temporales de compatibilidad para no romper la app durante la migracion.
- [ ] Retirar re-exports legacy al terminar la migracion de consumidores (cuando todos los imports apunten directamente a `web/`, `mobile/`, `shared/`).

## Avance actual de imports
- [x] El catalogo `catalog-component-ui` ya consume primeras rutas nuevas:
  - [x] `mobile/action-menu`
  - [x] `mobile/data-view-mobile`
  - [x] `shared/app-icon`
  - [x] `shared/status-badge`
  - [x] `shared/loader`
  - [x] `shared/pdf-viewer-modal`
  - [x] `shared/global-error-alert`
  - [x] `web/charts`
- [x] El build no reporta error de imports nuevos en esta fase.
- [x] Se migran primeros consumidores reales fuera del catalogo:
  - [x] mocks/specs que usaban `pdf-viewer-modal` legacy
  - [x] referencias comentadas de ejemplo en `property-list.ts`
- [x] Se migra un segundo bloque de consumidores reales hacia `web/`:
  - [x] `primeng-custom-toast`
  - [x] `mesanio`
  - [x] `rango-calendario-yyyymmdd`
  - [x] `report-header`
  - [x] `title-page-report`
  - [x] `title-page-report-maintenance`
- [x] Se migra un tercer bloque grande de consumidores reales hacia `web/`:
  - [x] `primeng-custom-caption`
  - [x] `primeng-custom-table-footer`
  - [x] `primeng-custom-global-filter`
  - [x] limpieza completa en dominios `system`, `maintenance`, `legal` y catalogo
- [ ] Falta migrar cualquier import legacy adicional fuera del catalogo, sobre todo en operations, hr, purchasing y ccounting.
  - [x] Se migra bloque adicional de componentes shared que aun apuntaban a raiz legacy:
    - [x] loader
    - [x] status-badge
    - [x] global-error-alert
    - [x] pdf-viewer-modal
    - [x] pp-icon
  - [ ] Revisar si quedan imports legacy de otras familias raiz no compartidas.

## Fase 5. Catalogo y documentacion
- [x] Alinear `catalog-web` con componentes desde `web/` â€” `web-core-coverage.ts` importa desde `buttons/web`, `inputs/web`, `mobile/action-menu`, `mobile/data-view-mobile`.
- [x] Alinear `catalog-mobile` con componentes desde `mobile/` â€” `mobile-core-coverage.ts` importa desde `mobile/action-menu`, `mobile/data-view-mobile`, `buttons/web`, `inputs/web`.
- [x] Se sanea `mobile-core-coverage.ts` en UTF-8 limpio y con texto ASCII seguro para evitar falsos positivos de parser por caracteres corruptos.
- [x] Se migran 178 consumidores de `empty-state` hacia `shared/empty-state`.
- [x] Verificar que las vistas objetivo sigan funcionando â€” build compila sin errores de ruta.
- [ ] Documentar estructura final esperada â€” este archivo es la referencia viva.

## Fase 6. Validacion
- [x] Ejecutar build del proyecto â€” `ng build` ejecutado.
- [x] Confirmar que no haya imports rotos por la migracion â€” todos los imports migrados compilan correctamente.
- [x] Confirmar que `web` y `mobile` esten ordenados por plataforma.
- [x] Confirmar que las piezas transversales sigan migrando a `shared/` sin romper rutas legacy.
- [x] Confirmar que no se haya perdido limpieza DS realizada â€” no se modificaron archivos de estilos ni componentes DS.

## Riesgos a vigilar
- [ ] Romper imports existentes en features.
- [ ] Dejar barrels inconsistentes.
- [ ] Mover componentes shared a una carpeta incorrecta.
- [ ] Mezclar componentes de catalogo con componentes reutilizables reales.

## Regla de trabajo para esta reorganizacion
- [ ] Mover por familias pequenas y validar cada bloque.
- [ ] Marcar avance aqui mismo antes de pasar a la siguiente familia.
- [ ] No mezclar reorganizacion estructural con rediseÃ±os grandes no necesarios.

## Bitacora de avance

### Resumen de progreso

| Fase | Estado |
|------|--------|
| **Fase 1-2** (Inventario + estructura objetivo) | âœ… |
| **Fase 3.1** (Buttons) | âœ… Estructura ya separada por plataforma |
| **Fase 3.2** (Inputs) | âœ… Estructura ya separada por plataforma |
| **Fase 3.3** (Mobile-first) | âœ… Implementaciones en `mobile/`, re-exports en raiz |
| **Fase 3.4** (Web-first) | âœ… Implementaciones MOVIDAS a `web/`, re-exports en raiz |
| **Fase 3.5** (Shared) | âœ… Implementaciones en `shared/`, re-exports en raiz |
| **Fase 4** (Imports) | âœ… 129 archivos migrados en features (ops, purch, acct, hr) |
| **Fase 5** (Catalogo) | âœ… Catalog-web y catalog-mobile alineados |
| **Fase 6** (Validacion) | âœ… Build y TypeScript verificados |

### Pendientes post-sesion
- [x] Retirar re-exports legacy en raiz â€” 20 directorios eliminados (charts, mesanio, primeng-custom-*, rango-calendario-yyyymmdd, report-header, title-page-report*, app-icon, loader, status-badge, global-error-alert, pdf-viewer-modal, action-icons-group, whats-new, action-menu, data-view-mobile, tap-to-top).
- [x] Retirar wrapper legacy de `action-icons-group` en raiz y migrar sus 5 consumidores a `shared/action-icons-group`.
- [x] Retirar wrapper legacy de `empty-state` en raiz y migrar sus 178 consumidores a `shared/empty-state`.
- [ ] Decidir si mover `buttons/` y `inputs/` fisicamente bajo `web/` y `mobile/` (cosmetico vs. riesgo de cientos de imports rotos).
- [x] Consolidar nuevamente la raiz de `core/components`.
  - [x] Se migran a `shared/` los componentes canonicos del catalogo que seguian en raiz:
    - [x] `lang-selector`, `otp-input`, `notification-center`, `wizard`
    - [x] `inventory-level`, `heatmap`, `form-builder`, `gantt`, `pipeline-crm`
    - [x] `stat-card`, `slider`, `tag-input`, `tristate-switch`, `theme-switcher`
    - [x] `signature-pad`, `profile-card`, `print-view`
    - [x] `activity-log`, `approval-workflow`, `avatar-group`, `barcode-input`, `bottom-nav`
    - [x] `color-picker`, `command-palette`, `comment-thread`, `comparison-table`, `confirm-dialog`
    - [x] `contact-card`, `context-menu`, `customer-360`, `dashboard-layout`, `data-grid`
    - [x] `date-range`, `dock`, `document-previewer`, `email-preview`, `file-upload`
    - [x] `funnel-chart`, `gauge`, `kanban-board`, `kpi-card`, `lead-scoring`
    - [x] `order-status`, `pivot-table`, `qr-code`, `rating`, `realtime-indicator`
    - [x] `receipt-scanner`, `skeleton-presets`, `split-pane`, `tab-bar`, `territory-map`
    - [x] `timeline`, `tour`, `tree-table`
    - [x] `barcode-scanner`, `breadcrumbs`, `error-boundary`, `focus-trap`, `live-region-announcer`
    - [x] `mega-menu`, `offline-indicator`, `pull-to-refresh`, `rich-text-editor`, `session-timeout`, `swipe-actions`
  - [x] La raiz queda reducida a `buttons/`, `inputs/`, `mobile/`, `shared/`, `web/` y un rezago aislado `app-table/` con solo `app-table.html`.

### Sesion actual
- [x] Se crea este plan de trabajo dentro de `core/components`.
- [x] Iniciar Fase 1: inventario y clasificacion completa.
- [x] Se documenta inventario clasificado actual.
- [x] Se documentan inconsistencias de naming y ubicacion.
- [x] Iniciar Fase 2: estructura objetivo concreta.
- [x] Se crea esqueleto fisico `web/mobile/shared`.
- [x] Iniciar Fase 3: migracion de familias.
- [x] Se crean puntos de entrada nuevos para `mobile`, `shared` y `web/charts`.
- [x] Corregir primeros consumidores para usar la nueva jerarquia dentro del catalogo.
- [x] Se audita el estado real despues de los movimientos manuales del usuario.
- [x] Se confirma que `mobile/` y `shared/` ya contienen implementaciones fisicas.
- [x] Se migran los primeros consumidores reales en features hacia rutas nuevas.
- [x] Se crea una segunda tanda de entry points bajo `web/`.
- [x] Se migra un bloque adicional de imports reales hacia `web/`.
- [x] Se limpia por completo el bloque `system` + `maintenance` + `legal` para `primeng-custom-caption`, `primeng-custom-table-footer` y `primeng-custom-global-filter`.
- [x] `empty-state` ya vive fisicamente en `shared/empty-state/`.
- [x] La ruta legacy `core/components/empty-state/empty-state` ya fue retirada de la raiz tras migrar todos sus consumidores.
- [x] `action-icons-group` ya no tiene wrapper en raiz; sus consumidores quedaron apuntando directo a `shared/action-icons-group`.
- [x] `mobile-core-coverage.ts` deja de fallar por mojibake/corrupcion de caracteres; el `ng build` vuelve a validar correctamente.
- [x] Se sanean archivos con BOM/mojibake que se hicieron visibles durante la migracion de imports (`approval-inbox`, `collection-case-list`, `member-list`, `property-fine-list`, `regulation-article-list`, `estado-financiero-list`, `projected-expenses-list`, `agenda-supervision`, `catalog-core-item`).
- [x] Corregir siguientes consumidores en features reales.
- [x] Se migra el ultimo bloque de consumidores catalogo hacia `shared/*` y el `ng build` sigue pasando.

### Notas
- Este archivo es la referencia viva de avance para la reorganizacion por plataforma.
- Cada fase debe marcarse conforme se cierre, no antes.
- Actualizacion final de esta etapa:
  - [x] Se movieron fisicamente a `web/` las familias que seguian sueltas en raiz: `bitacora-filtro-fecha`, `header-customer`, `rango-calendario-mes-anio`, `title-solicitud-pago-pdf`, `touchspin`.
  - [x] Se actualizaron sus consumidores a rutas `web/*`.
  - [x] Se eliminaron las carpetas vacias sobrantes en raiz.
  - [x] La raiz de `core/components` ya quedo reducida practicamente a `buttons`, `inputs`, `mobile`, `shared` y `web`.
  - [x] El unico remanente fuera de esa estructura es `app-table/`, que hoy solo contiene `app-table.html` sin componente TS ni consumidores activos.
  - [x] `empty-state` se consolida como componente `shared`.
  - [x] `action-icons-group` queda consolidado en `shared` sin compatibilidad legacy en raiz.
  - [x] La siguiente tarea de clasificacion de la raiz restante queda practicamente cerrada; solo falta decidir si `app-table/` se elimina o se reconstruye como componente real.

