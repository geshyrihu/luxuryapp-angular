# Inventario — `p-button` y `<button>` nativo en `features/`

> **Regla:** dentro de `src/app/features/` los botones de acción deben usar los
> componentes de `src/app/core/components/buttons/` (`il-*` / `iw-*`), **no**
> `<p-button>` de PrimeNG ni `<button>` nativo estilizado.
>
> **Fecha del levantamiento:** 2026-07-01 · Rama: `fix/ds-audit-phase1`
> **Método:** `grep` sobre `src/app/features` (`.html` + templates inline `.ts`).

## Resumen

| Patrón                                   | Total | Exento (showcase/demo) | ⚠️ A migrar | Archivos a migrar |
| ---------------------------------------- | ----: | ---------------------: | ----------: | ----------------: |
| `<p-button>` (`.html`)                   |    95 |                     52 |      **43** |            **15** |
| `<button>` nativo (`.html`)              |    24 |                      0 |      **24** |            **13** |
| `pButton` (directiva)                    |     4 |                      0 |       **4** |             **2** |
| `<p-button>` / `<button>` inline (`.ts`) |  ~191 |                   ~191 |       **0** |                 0 |

- **Exento — showcase/demo:** `system/catalogs/catalog-component-ui/**` y
  `system/infrastructure/samples/demo-app/**` renderizan PrimeNG crudo a propósito
  (catálogo de UI). Todos los usos inline en `.ts` viven ahí. Se tratan en la **Fase 4**
  del [PLAN-MIGRACION-BOTONES.md](./PLAN-MIGRACION-BOTONES.md).
- **Total real a migrar:** **~71 ocurrencias** en **~28 archivos** (algunos solapan
  `p-button` + nativo + `pButton`).

---

## A) `<p-button>` a migrar — 43 ocurrencias / 15 archivos

| #   | Archivo                                                                                                                  | Ocurr. | Líneas                                                   |
| --- | ------------------------------------------------------------------------------------------------------------------------ | -----: | -------------------------------------------------------- |
| 1   | `accounting/general-ledger/contabilidad/dynamic-reports/pages/report-builder/report-builder.html`                        |     15 | 44,51,58,103,133,162,183,207,210,248,274,305,340,354,355 |
| 2   | `maintenance/fire-equipment/inspection-periods/period-detail-estacion/fire-inspection-period-estacion-detail.html`       |      7 | 3,27,36,37,49,83,84                                      |
| 3   | `maintenance/fire-equipment/inspection-periods/period-detail-extintor/fire-inspection-period-extintor-detail.html`       |      7 | 3,31,45,51,68,102,109                                    |
| 4   | `operations/manuals/biblioteca/manuals-and-processes/pages/manuals-and-processes-detail.html`                            |      2 | 349,415                                                  |
| 5   | `operations/manuals/biblioteca/manuals-and-processes/pages/manuals-and-processes-guide/manuals-and-processes-guide.html` |      2 | 5,287                                                    |
| 6   | `accounting/fondeos-y-reporteo/funding/funding-detail.html`                                                              |      1 | 124                                                      |
| 7   | `accounting/fondeos-y-reporteo/funding-accounting/funding-accounting-detail.html`                                        |      1 | 85                                                       |
| 8   | `accounting/general-ledger/funding/funding-detail.html`                                                                  |      1 | 124                                                      |
| 9   | `accounting/general-ledger/funding-accounting/funding-accounting-detail.html`                                            |      1 | 85                                                       |
| 10  | `accounting/general-ledger/contabilidad/cobranza-online/pages/inspection/cobranza-online-inspection-history-modal.html`  |      1 | 13                                                       |
| 11  | `operations/supervision/supervision/presentaciones-juntas-comite/presentaciones-juntas-comite.html`                      |      1 | 104                                                      |
| 12  | `purchasing/po/purchase-order/orden-compra-presupuesto/orden-compra-presupuesto.html`                                    |      1 | 126                                                      |
| 13  | `purchasing/purchases/purchase-order/orden-compra-presupuesto/orden-compra-presupuesto.html`                             |      1 | 124                                                      |
| 14  | `system/access/user-profile/update-user-photo.html`                                                                      |      1 | 28                                                       |
| 15  | `system/ai/ia-test/ia-test.component.html`                                                                               |      1 | 27                                                       |

> **Nota:** los pares `funding*/*-detail.html` y `orden-compra-presupuesto.html` están
> duplicados en dos rutas (`fondeos-y-reporteo` vs `general-ledger`, `po` vs `purchases`).
> Ambas copias deben migrarse.

**Naturaleza:** casi todos son botones de acción estándar (Agregar, Crear, Eliminar,
navegar atrás, subir/bajar). Mapean directo a `il-button-*` / `iw-button-*`.

---

## B) `<button>` nativo a migrar — 24 ocurrencias / 13 archivos

| #   | Archivo                                                                                                                 | Ocurr. | Tipo / clase                                 |
| --- | ----------------------------------------------------------------------------------------------------------------------- | -----: | -------------------------------------------- |
| 1   | `operations/google-calendar/calendar/mantenimiento-preventivo/cronograma-anual-mantenimiento.html`                      |      4 | Export `btn-luxury-excel` / `btn-luxury-pdf` |
| 2   | `maintenance/fire-equipment/qr-scanner/qr-scanner.html`                                                                 |      3 | `<button pButton>` + acción                  |
| 3   | `maintenance/fire-equipment/inspection-periods/cycle-detail/fire-inspection-cycle-detail.html`                          |      3 | Acción                                       |
| 4   | `operations/supervision/supervision/presentaciones-juntas-comite/presentacion-contable.html`                            |      2 | Acción                                       |
| 5   | `operations/field-service/service-order/service-order-form.html`                                                        |      2 | Acción                                       |
| 6   | `hr/expediente-del-empleado/hr-employees/staff-board/staff-board.html`                                                  |      2 | ⚠️ Toggle/tab (`btn btn-sm`)                 |
| 7   | `hr/expediente-del-empleado/employees/staff-board/staff-board.html`                                                     |      2 | ⚠️ Toggle/tab (`btn btn-sm`) — copia         |
| 8   | `operations/task-engine/tasks/task-message/pages/task-list.html`                                                        |      1 | Acción                                       |
| 9   | `operations/announcements/announcement/components/image-generation-dialog/image-generation-dialog.html`                 |      1 | Acción                                       |
| 10  | `hr/expediente-del-empleado/recursos-humanos/nomina/pages/hoja-incidencias/hoja-incidencias.html`                       |      1 | `hoja-badge-btn`                             |
| 11  | `accounting/general-ledger/contabilidad/presupuesto-propuesta/presupuesto-propuesta.html`                               |      1 | `<button pButton>`                           |
| 12  | `accounting/general-ledger/contabilidad/cobranza-nativa/pages/payments/payments.html`                                   |      1 | Acción                                       |
| 13  | `accounting/general-ledger/contabilidad/cobranza-nativa/pages/cobranza-nativa-dashboard/cobranza-nativa-dashboard.html` |      1 | Acción                                       |

### Subcategorías (requieren criterio antes de migrar)

- **Exports estilizados** (`btn-luxury-excel` / `btn-luxury-pdf`): en cronograma (×4).
  Candidatos a `iw-button-download` / un botón de export dedicado.
- **Toggles / segmented controls** (`staff-board` ×2 archivos): NO son botones de
  acción; son pestañas (`inactivosTab.set(...)`). **No** mapean a `il-*`/`iw-*`;
  decidir si se dejan como toggle nativo o se usa otro componente.
- **`<button pButton>`** (directiva PrimeNG): `qr-scanner.html`, `presupuesto-propuesta.html`
  → migrar a componente core.
- **Resto** (`mic-button`, `hoja-badge-btn`, links `p-link`/`text-xs`): íconos/enlaces
  puntuales; evaluar caso a caso (algunos pueden quedar como link, no botón).

---

## C) Exentos (Fase 4 del plan — no migrar aún)

Renderizan PrimeNG/HTML crudo como catálogo de UI:

- `system/catalogs/catalog-component-ui/**` — 52 `<p-button>` en `.html` + la totalidad
  de los usos inline en `.ts` (~191).
- `system/infrastructure/samples/demo-app/demo-app.html` — 31 `<p-button>`.

---

## Recomendación de orden (bajo → alto esfuerzo)

1. **Duplicados triviales** (1 c/u): `funding*/*-detail`, `orden-compra-presupuesto`,
   `cobranza-online-inspection-history-modal`, `update-user-photo`, `ia-test`,
   `presentaciones-juntas-comite`. → swaps mecánicos.
2. **`<button pButton>` + acciones nativas** simples: qr-scanner, service-order-form,
   fire-inspection-cycle-detail, payments, cobranza-nativa-dashboard, task-list,
   image-generation-dialog, presupuesto-propuesta, presentacion-contable, hoja-incidencias.
3. **Fire-equipment detail** (extintor/estación, 7 c/u) y **manuals** (2 c/u).
4. **report-builder** (15) — el más grande.
5. **Exports `btn-luxury-*`** y **toggles `staff-board`** — requieren decisión de diseño.
6. **Fase 4** (showcase/demo) — junto con la migración del catálogo.

---

## Progreso de migración (2026-07-01)

> **Corrección importante:** el `grep` inicial contó ocurrencias **dentro de comentarios
> HTML** (`<!-- ... -->`). Tras descontar código muerto, los conteos **activos** reales
> eran: `p-button = 36`, `<button pButton> = 3`, nativos = 23.

### ✅ Migrado a `il-button` / `iw-button`

| Archivo | Botones |
|---------|--------|
| `cobranza-online-inspection-history-modal.html` | 1 |
| `system/access/user-profile/update-user-photo.html` | 1 |
| `system/ai/ia-test/ia-test.component.html` | 1 |
| `maintenance/fire-equipment/qr-scanner/qr-scanner.html` | 3 (`<button pButton>`) |
| `maintenance/.../cycle-detail/fire-inspection-cycle-detail.html` | 3 |
| `maintenance/.../period-detail-extintor/...html` | 7 |
| `maintenance/.../period-detail-estacion/...html` | 7 |
| `operations/manuals/.../manuals-and-processes-guide.html` | 2 (+`RouterLink`) |
| `operations/manuals/.../manuals-and-processes-detail.html` | 2 |
| `accounting/.../dynamic-reports/.../report-builder.html` | 9 restantes |

En cada `.ts` se reemplazó `ButtonModule` → `WebButtonLabel` / `WebButtonIcon`.
Conversión aplicada: `icon`→`iconClass`, `(onClick)/(click)`→`(clicked)`,
`pTooltip`→`title`. Iconos-solo → `iw-button`; con label → `il-button`.

> **`report-builder`** estaba en un **estado roto** de una migración parcial previa:
> el header ya usaba `il-button`/`iw-button` pero sin importar `WebButtonIcon`, y el
> cuerpo conservaba 9 `<p-button>` sin `ButtonModule` importado. Se dejó consistente.

### ✅ Grupo 5 migrado (15 `<button>` nativos → `il-button`/`iw-button`)

| Archivo | Botones | Mapeo |
|---------|--------|-------|
| `cronograma-anual-mantenimiento.html` | 4 | Exports → `il-button` + `styleClass="btn-luxury-*"` |
| `staff-board.html` (×2 rutas) | 4 | Toggles → `il-button` con `severity`/`variant` según estado activo |
| `service-order-form.html` | 2 | `btn-opt` → `il-button` con `severity`/`variant` |
| `cobranza-nativa-dashboard.html` | 1 | Toggle "Ver detalle" → `il-button variant="link"` |
| `payments.html` | 1 | Link "Auto-asignar" → `il-button variant="link"` |
| `image-generation-dialog.html` | 1 | `mic-button` → `iw-button` (estado `listening` vía `styleClass`) |
| `task-list.html` | 1 | Ícono ayuda `?` → `il-button` |
| `hoja-incidencias.html` | 1 | `hoja-badge-btn` → `il-button variant="text"` + `[style.background]` |

> **⚠️ Ajustes de CSS pendientes (compilan, handlers OK, aspecto por afinar):**
> `mic-button`, `task-help-btn` (círculo 1.4rem se pierde: el tamaño estaba en `style`
> inline que ahora no llega al `<button>` interno), y `hoja-badge-btn` (color dinámico
> depende de que `.hoja-badge-btn` no defina `background` propio). Revisar visualmente
> y afinar las clases si hace falta.

### ⛔ NO migrado — no es un template Angular

- **`presentacion-contable.html`** (`nav-button` ×2): es un **documento HTML estático
  completo** (`<!DOCTYPE html>` + `<head>` + `<style>` + `<script>` funcional). Su `.ts`
  está **vacío (0 bytes)** y ningún `@Component` lo referencia. Sus `<button onclick="changeSlide()">`
  son HTML nativo correcto; convertirlos a `il-button` **rompería el archivo**. No es una
  violación de la regla (no es UI Angular).

### 🧹 Código muerto eliminado (botones comentados)

`funding-detail` (×2 rutas), `funding-accounting-detail` (×2 rutas),
`presentaciones-juntas-comite`, `orden-compra-presupuesto` (×2 rutas),
`presupuesto-propuesta`. En `funding-detail` también se quitó el `@if(isRolSuperUsuario){}`
que quedaba vacío.

---

## Estado final

**Migrado a design system:** 100 % de los botones de acción (`<p-button>`, `<button pButton>`,
`<button>` nativo) en `features/`, **excepto**: (1) el showcase `catalog-component-ui/` +
`demo-app/` (Fase 4 del plan), y (2) `presentacion-contable.html` (HTML estático, no Angular).
