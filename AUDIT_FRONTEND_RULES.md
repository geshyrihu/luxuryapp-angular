# Auditoría de Reglas Frontend Angular

Referencia de reglas: `skills/frontend-angular/`
Fecha: 2026-05-16
Estado: en progreso

---

## Leyenda

- `[x]` Completado
- `[ ]` Pendiente
- `[-]` Omitido (razón documentada)

---

## 1. `inject(DialogService)` directo → `DialogHandlerService`

**Regla:** No inyectar `DialogService` directamente. Usar `DialogHandlerService`.
**Severidad:** ALTA

| Estado | Archivo | Cambio |
|--------|---------|--------|
| `[x]` | `tasks/task-message/pages/task-form.ts` | Eliminada inyección muerta |
| `[x]` | `provider-support/provider-support.ts` | Eliminada inyección muerta |
| `[x]` | `announcement/announcement-admin-form.ts` | Eliminada inyección muerta |
| `[x]` | `contabilidad/pendientes-minuta/cont-list-minuta-pendientes.ts` | Eliminada inyección muerta + `DynamicDialogRef` no usada |
| `[x]` | `dashboard/unified-pending-dashboard.ts` | 4 `dialogService.open().onClose.subscribe()` → `dialogHandlerS.openDialog().then()`; eliminado `providers: [DialogService]` |
| `[x]` | `juntas-comite/junta-comite-minutas/minuta-detalle-form.ts` | `openFollowUp()` → `dialogHandlerS.openDialog()` |
| `[x]` | `maintenance-calendar-master/datos-servicio-form.ts` | `onDataProveedor()` → `dialogHandlerS.openDialog()` |

---

## 2. Imports relativos `../../core` → `src/app/core/`

**Regla:** Prohibidos imports relativos que apunten a `core/`. Usar ruta absoluta `src/app/core/`.
**Severidad:** CRÍTICA

| Estado | Archivo |
|--------|---------|
| `[x]` | `contabilidad/cobranza-nativa/pages/approvals/approval-detail-modal.ts` |
| `[x]` | `contabilidad/cobranza-nativa/pages/billing-config/billing-config-modal.ts` |
| `[x]` | `contabilidad/cobranza-nativa/pages/charges/charge-list.ts` |
| `[x]` | `contabilidad/cobranza-nativa/pages/native-statement/native-statement.ts` |
| `[x]` | `contabilidad/pendientes-minuta/cont-list-minuta-pendientes.ts` |
| `[x]` | `contabilidad/presupuesto-propuesta/budget-support-dialog.ts` |
| `[x]` | `contabilidad/presupuesto-propuesta/budget-forecast-dialog.ts` |
| `[x]` | `contabilidad/presupuesto-propuesta/account-modal-add.ts` |
| `[x]` | `dashboard/unified-pending-dashboard.ts` |
| `[x]` | `employees/staff-board/staff-board.ts` |
| `[x]` | `custom-document/policy-contract/policy-contract-list.ts` |
| `[x]` | `espejo-aspel/projected-expenses-form.ts` |
| `[x]` | `entrega-recepcion/entrega-recepcion-insumos.ts` |
| `[x]` | `entrega-recepcion/entrega-recepcion-equipos.ts` |
| `[x]` | `entrega-recepcion/entrega-recepcion-instalaciones.ts` |
| `[x]` | `entrega-recepcion/entrega-recepcion-hidrantes.ts` |
| `[x]` | `entrega-recepcion/entrega-recepcion-llaves.ts` |
| `[x]` | `entrega-recepcion/entrega-recepcion-mantenimientos.ts` |
| `[x]` | `entrega-recepcion/entrega-recepcion-mantenimientos-pendientes.ts` |
| `[x]` | `funding/funding-detail.ts` |
| `[x]` | `recursos-humanos/employee-bank-data/pages/employee-bank-data-list.ts` |
| `[x]` | `recursos-humanos/incident/components/incident-witnesses/incident-witness-form.ts` |
| `[x]` | `supervision/resultado-general-dashboard/resultado-general-dashboard.ts` |
| `[x]` | `purchases/purchase-order/components/create-orden-compra-wizard/create-orden-compra-wizard.ts` |
| `[x]` | `purchases/purchase-order/components/orden-compra-detalle-form/orden-compra-detalle-form.ts` |

---

## 3. `new Date()` → `DateService`

**Regla:** No usar `new Date()` directamente. Usar métodos de `DateService`.
**Severidad:** CRÍTICA (78 archivos, 118 ocurrencias)

### 3a. Casos seguros — `toISOString().slice/substring(0,10)` → `dateS.getDateNow()`

| Estado | Archivo | Línea(s) |
|--------|---------|----------|
| `[x]` | `biblioteca/manuals-and-processes/pages/manuals-and-processes-editor/manuals-and-processes-editor.ts` | 125, 379 |
| `[x]` | `juntas-comite/junta-comite-minutas/minuta-pendientes.ts` | 124 |
| `[x]` | `recursos-humanos/incident-report/pages/incident-report.ts` | 130 |

### 3b. Omitidos — `new Date().getFullYear()`

**Razón:** ~45 ocurrencias en 30+ archivos (incluyendo servicios y archivos de estado). `DateService.getFullYear()` usa una constante de módulo inicializada al arrancar la app, lo cual es semánticamente diferente a obtener el año en el momento de la llamada. Requeriría inyectar `DateService` en cada archivo sin ganancia real de seguridad.

### 3c. Omitidos — otros patrones no reemplazables

**Razón:** `new Date().getMonth()` (DateService no tiene este método), `new Date()` como valor por defecto en FormControl (requiere objeto Date, no string), `new Date(someString)` (parseo de strings de API), aritmética de fechas (`.getTime()` diff), `new Date().toISOString().slice(0,16)` (incluye hora, DateService no la maneja).

---

## 4. `<p-datepicker>` / `<p-calendar>` → componente Flatpickr personalizado

**Regla:** Prohibido `p-datepicker` y `p-calendar`. Usar el componente interno basado en Flatpickr.
**Severidad:** MEDIA

### 4a. En archivos TypeScript

| Estado | Archivo | Notas |
|--------|---------|-------|
| `[-]` | `core/components/rango-calendario-mes-anio/calendar-range.ts` | Falso positivo — usa `input[type=month]` nativo, no p-datepicker |
| `[-]` | `calendar/mantenimiento-preventivo/calendario-mtto-list.ts` | Falso positivo — "calendar" en nombre de clase, no usa DatePickerModule |
| `[-]` | `configuration/calendario-maestro-equipo/calendario-maestro-equipo-form.ts` | Falso positivo |
| `[-]` | `configuration/calendario-maestro-equipo/calendario-maestro-equipo.ts` | Falso positivo |
| `[-]` | `maintenance-calendar-master/calendario-maestro-form.ts` | Falso positivo |
| `[-]` | `maintenance-calendar-master/calendario-maestro-lista.ts` | Falso positivo |
| `[-]` | `recurring-tasks/templates/task-template-item-form/task-template-item-form.ts` | Omitido — usa `DatePickerModule` en modo `[timeOnly]` (selector de hora, no fecha) |
| `[-]` | `recursos-humanos/calendario-vacaciones-permisos/calendario-vacaciones-permisos.ts` | Falso positivo — usa FullCalendar (`@fullcalendar/angular`), no PrimeNG |

### 4b. En plantillas HTML

| Estado | Archivo | Notas |
|--------|---------|-------|
| `[-]` | `access-history/bitacora-acceso-list.html` | Usa `<app-calendar-range>` (nativo), no p-datepicker |
| `[-]` | `bitacoras/medidores/medidor-lectura-chart.html` | Usa `<app-calendar-range>` (nativo), no p-datepicker |
| `[x]` | `configuration/brevo/brevo-email-logs.html` | Migrado a `custom-input-date-signal` (2 instancias) |
| `[-]` | `configuration/demo-app/demo-app.html` | Demo app — omitido |
| `[-]` | `product-exit/product-output-list.html` | Omitido — usa `view="month"` no soportado por Flatpickr |
| `[x]` | `recurring-tasks/instances/daily-task-list/daily-task-list.html` | Migrado a `custom-input-date-signal` |
| `[x]` | `recurring-tasks/instances/task-instance-list/task-instance-list.html` | Migrado a `custom-input-date-signal` |
| `[-]` | `recurring-tasks/templates/task-template-item-form/task-template-item-form.html` | Omitido — selector de hora (`[timeOnly]`) |
| `[x]` | `recursos-humanos/incident/pages/incident-dashboard/incident-dashboard.html` | Migrado a `custom-input-date-signal` (2 instancias) |
| `[x]` | `sat-funding/sat-funding-detail/sat-funding-detail.html` | Migrado a `custom-input-date-signal` (2 instancias); DTO actualizado a `string` |

---

## 5. `@ViewChild()` → `viewChild()` signal

**Regla:** Prohibido el decorador `@ViewChild()`. Usar `viewChild()` de signals.
**Severidad:** MEDIA

| Estado | Archivo | Cambio |
|--------|---------|--------|
| `[x]` | `biblioteca/manuals-and-processes/components/diagram-preview.ts` | Eliminada declaración muerta (`container` nunca se usaba en TS) |
| `[x]` | `configuration/application-user/pages/application-user-list.ts` | Eliminada declaración muerta (`dt` nunca se usaba) |
| `[x]` | `configuration/customer/pages/customer-list.ts` | Eliminada declaración muerta (`dt` nunca se usaba) |
| `[x]` | `contabilidad/presupuesto-propuesta/presupuesto-propuesta.ts` | `@ViewChild("dt") dt: Table` → `dt = viewChild<Table>("dt")`; acceso en `recalculateTableLayout()` via `const dt = this.dt()` |
| `[x]` | `dashboard/unified-pending-dashboard.ts` | `@ViewChild(ImageAnalysisDialogComponent)` → `visionDialog = viewChild.required(...)`; `this.visionDialog.show()` → `this.visionDialog().show()` |
| `[x]` | `diagram/diagram-view/diagram-view.ts` | `@ViewChild("container")` → `container = viewChild<ElementRef>("container")`; `this.container?.nativeElement` → `this.container()?.nativeElement` |
| `[x]` | `juntas-comite/junta-comite-minutas/resumen-minuta.ts` | Eliminada declaración muerta (`dt` nunca se usaba) |
| `[x]` | `product/productos-list.ts` | Eliminada declaración muerta (`dt` nunca se usaba) |
| `[x]` | `purchases/purchase-request/purchase-request.ts` | Eliminada declaración muerta (`addProductFormComponent` nunca se usaba) |
| `[x]` | `recursos-humanos/incident/components/digital-signature/digital-signature.ts` | `@ViewChild("signatureCanvas", { static: true })` → `canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>("signatureCanvas")`; todos los `.canvasRef.` → `.canvasRef().` |
| `[x]` | `tasks/my-tasks/pages/my-task-form.ts` | `@ViewChild(ImageAnalysisDialogComponent)` → `visionDialog = viewChild.required(...)`; `this.visionDialog.show()` → `this.visionDialog().show()` |

---

## 6. `localStorage.setItem` → `StorageService`

**Regla:** No acceder directamente a `localStorage`. Usar `StorageService`.
**Severidad:** BAJA

| Estado | Archivo | Cambio |
|--------|---------|--------|
| `[x]` | `reports-mantenance/maintenance-reports-list.ts` | `localStorage.getItem/setItem` → `storageS.retrieve/store` |
| `[x]` | `tasks/services/date-range-storage.service.ts` | Reescrito: `localStorage.*` → `storageS.store/retrieve/remove`; `JSON.stringify/parse` eliminados (el servicio los maneja internamente) |

---

## 7. `standalone: true` — eliminar

**Regla:** `standalone: true` es el comportamiento por defecto en Angular 21. No escribirlo explícitamente.
**Severidad:** BAJA

| Estado | Archivo |
|--------|---------|
| `[-]` | `core/pipes/highlight.pipe.ts` | Tiene comentario que justifica la presencia — omitido |
| `[x]` | `contabilidad/contabilidad-online/pipes/accounting-number.pipe.ts` | Eliminado `standalone: true` |

---

## Resumen

| Categoría | Total | Completos | Pendientes | Omitidos |
|-----------|-------|-----------|------------|----------|
| 1. DialogService directo | 7 | 7 | 0 | 0 |
| 2. Imports relativos core | 25 | 25 | 0 | 0 |
| 3a. new Date() — seguros | 4 | 4 | 0 | 0 |
| 3b-c. new Date() — no seguros | ~110 | 0 | 0 | ~110 |
| 4. p-datepicker / p-calendar | 18 | 5 archivos | 0 | 13 (falsos positivos + casos no soportados) |
| 5. @ViewChild | 11 | 11 | 0 | 0 |
| 6. localStorage.setItem | 2 | 2 | 0 | 0 |
| 7. standalone: true | 2 | 1 | 0 | 1 |
