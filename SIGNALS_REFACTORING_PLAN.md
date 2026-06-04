# Plan de Refactorización Frontend (Angular 21)

## 1. Objetivo General
Cumplir estrictamente con las directrices establecidas en el archivo `GEMINI.md` para el código base de Angular (Frontend):
1. **Uso exclusivo de Signals:** Prohibido el uso de `@Input()` y `@Output()`. Forzar adopción de `input()`, `input.required()`, y `output()`.
2. **Listados Móviles:** Implementar siempre la versión móvil `app-data-view-mobile` en cada listado.
3. **Formularios Estándar:** Usar obligatoriamente `FormHelper.submitCrud()` para todos los formularios.

---

## 2. Bitácora de Refactorización de Signals (@Input / @Output)

Tras el análisis, se encontraron incidencias distribuidas en los siguientes archivos. Marca con una `x` cada checkbox `[ ]` conforme vayas refactorizando el archivo.

### Fase 1: Core y Componentes Compartidos (Prioridad Alta)
Son los cimientos de la UI. Refactorizarlos primero asegura que las nuevas vistas que se construyan utilicen las APIs correctas.
- [x] `src/app/core/components/data-view-mobile/data-view-mobile.ts`
- [x] `src/app/core/components/mesanio/mesanio.ts`
- [x] `src/app/core/components/primeng-custom-caption/primeng-custom-caption.ts`
- [x] `src/app/core/components/status-badge/status-badge.ts`
- [x] `src/app/core/components/touchspin/touchspin.ts`
- [x] `src/app/core/directives/click-outside.directive.ts`
- [x] `src/app/shared/components/image-analysis-dialog/image-analysis-dialog.component.ts`

### Fase 2: Módulo de Compras (Alta concentración)
- [x] `src/app/features/purchases/purchase-order/parcials/orden-compra-datos-auth-parcial.ts`
- [x] `src/app/features/purchases/purchase-order/parcials/orden-compra-datos-cotizacion.ts`
- [x] `src/app/features/purchases/purchase-order/parcials/orden-compra-datos-pago-parcial.ts`
- [x] `src/app/features/purchases/purchase-order/parcials/orden-compra-facturas-parcial.ts`
- [x] `src/app/features/purchases/purchase-order/parcials/orden-compra-status-parcial.ts`
- [x] `src/app/features/purchases/purchase-request/purchase-request-add-product.ts`
- [x] `src/app/features/purchases/purchase-request/purchase-request-products.ts`
- [x] `src/app/features/purchases/solicitud-compra/product-add.ts`
- [x] `src/app/features/purchases/solicitud-compra/solicitud-compra-detalle.ts`

### Fase 3: Juntas y Comités (Alta complejidad de comunicación)
- [x] `src/app/features/juntas-comite/junta-comite-minutas/administration-form-list.ts`
- [x] `src/app/features/juntas-comite/junta-comite-minutas/comite-form.ts`
- [x] `src/app/features/juntas-comite/junta-comite-minutas/invited-form.ts`
- [x] `src/app/features/juntas-comite/junta-comite-minutas/meeting-area-table/meeting-area-table.ts`
- [x] `src/app/features/juntas-comite/presentacion-junta-comite/file-section.ts`

### Fase 4: Recursos Humanos y Empleados
- [x] `src/app/features/configuration/application-user/pages/update-role.ts`
- [x] `src/app/features/directorios/employee-external/employee-external-app-user.ts`
- [x] `src/app/features/employees/employee-emergency-contact/pages/employee-emergency-contact-list.ts`
- [x] `src/app/features/employees/employee-internal/pages/employee-address-form.ts`
- [x] `src/app/features/employees/employee-internal/pages/employee-avatar-form.ts`
- [x] `src/app/features/employees/employee-internal/pages/employee-laboral-data-form.ts`
- [x] `src/app/features/employees/employee-internal/pages/employee-personal-data-form.ts`
- [x] `src/app/features/employees/employee-internal/pages/employee-principal-data-form.ts`
- [x] `src/app/features/profile-users/pages/employee-permission-app.ts`
- [x] `src/app/features/recruitment/pages/employee-reclutamiento.ts`
- [x] `src/app/features/recruitment/recruitment-shared/filter-requests.ts`
- [x] `src/app/features/recursos-humanos/incidencias-sanciones/incident/pages/incident-list.ts`
- [x] `src/app/features/recursos-humanos/shared/generic-approval-panel.ts`
- [x] `src/app/features/recursos-humanos/work-contract/pages/work-contract-list.ts`

### Fase 5: Resto de Funcionalidades (Dashboard, Tareas, Calendarios)
- [x] `src/app/features/biblioteca/manuals-and-processes/components/diagram-preview.ts`
- [x] `src/app/features/calendar/mantenimiento-preventivo/calendario-mtto-list.ts`
- [x] `src/app/features/calendar/mantenimiento-preventivo/cronograma-anual-mantenimiento.ts`
- [x] `src/app/features/dashboard/unified-pending-dashboard-mobile.ts`
- [x] `src/app/features/dashboard/unified-pending-dashboard.ts`
- [x] `src/app/features/recurring-tasks/instances/recurrence-input/recurrence-input.ts`
- [x] `src/app/features/tasks/components/task-date-range-selector/task-date-range-selector.ts`
- [x] `src/app/features/tasks/components/task-report-actions/task-report-actions.ts`
- [x] `src/app/features/tasks/components/task-status/task-status.ts`
- [x] `src/app/layout/employee-view/monitor/header-employee-monitor/header-employee-monitor.ts`
- [x] `src/app/layout/employee-view/movil/home-menu-mobile/home-menu-mobile.ts`

---

## 3. Bitácora de Refactorización: Implementación Móvil en Listados

*Tarea: Auditar todos los listados de la aplicación para asegurar que implementan la vista móvil usando el componente `app-data-view-mobile`.*

- [x] Auditar e implementar `app-data-view-mobile` en Listados de Compras
  - `ordenes-compra-cedula-list`, `cedula-cliente-list`, `purchase-request-list`, `orden-compra-list`, `solicitud-compra-list` — ya tenían mobile view.
- [x] Auditar e implementar `app-data-view-mobile` en Listados de Recursos Humanos
  - Implementado: `work-contract-list`, `incident-list`, `sanction-list`, `addendum-template-list`, `contract-addendum-list`, `contract-template-list`, `employee-file-list`, `mis-vacaciones-listado`.
  - Omitidos (justificado): `vacaciones-saldo` y `vacaciones-admin-auditoria` (dashboards con cards, no listas simples); `mis-permisos-listado` (ya tenía mobile); `employee-file-detail` (detalle, no listado).
- [x] Auditar e implementar `app-data-view-mobile` en Listados de Juntas y Comités
  - Implementado: `seguimiento-minutas`.
  - Omitidos (justificado): `resumen-minuta` (vista de presentación con datos anidados complejos).
- [x] Auditar e implementar `app-data-view-mobile` en Listados de Tareas / Calendarios
  - Omitido (justificado): `cronograma-anual-mantenimiento` (ya tiene mobile propio con `IonSegment` por mes); `my-assigned-tasks-list` (ya tiene `<div class="block md:hidden">` custom).

---

## 4. Bitácora de Refactorización: Formularios Centralizados

*Tarea: Reemplazar llamadas manuales a `onPost`/`onPut` en `onSubmit()` por `FormHelper.submitCrud()`. 84 archivos identificados.*

*Patrón de referencia: `src/app/core/helpers/form-helper.ts` + `meter-category-form.ts`.*

*Leyenda: `[x]` migrado · `[~]` omitido con justificación · `[ ]` pendiente*

### announcement
- [~] `announcement/announcement-admin-form.ts` — FormData (archivos adjuntos)

### biblioteca
- [x] `biblioteca/manuals-and-processes/pages/manuals-and-processes-form.ts`

### bitacoras
- [~] `bitacoras/medidores/medidor-form.ts` — `id = signal<number>(0)`, incompatible con FormHelper
- [x] `bitacoras/medidores/medidor-lectura-admin-form.ts`
- [x] `bitacoras/medidores/medidor-lectura-form.ts`

### calendar
- [x] `calendar/mantenimiento-preventivo/mantenimiento-preventivo-form.ts`

### catalogo-gastos-fijos
- [~] `catalogo-gastos-fijos/catalogo-gasto-fijo-form.ts` — sin DynamicDialogRef (usa router), recarga tras submit

### configuration (17 archivos)
- [~] `configuration/ai-knowledge-base/ai-knowledge-base-form.ts` — PUT a `AiKnowledgeBase` sin id en URL (id va en body)
- [~] `configuration/application-user/pages/application-user-form.ts` — endpoints no estándar (`createAccount`, `updateAccount`)
- [x] `configuration/aspel-customer-empresa/aspel-customer-empresa-form.ts`
- [x] `configuration/banks/pages/bank-form.ts`
- [x] `configuration/calendario-maestro-equipo/calendario-maestro-equipo-form.ts`
- [x] `configuration/cfdi-use/pages/cfdi-use-form.ts`
- [x] `configuration/customer-data-company/customer-data-company-form.ts`
- [~] `configuration/customer/pages/customer-form.ts` — FormData (imagen)
- [x] `configuration/email-data/email-data-form.ts`
- [x] `configuration/entrega-recepcion/catalogo-descripcion-form.ts`
- [~] `configuration/entrega-recepcion/entrega-recepcion-cliente-form.ts` — FormData; PUT con userId/customerId extra en URL
- [x] `configuration/machinery-classification/machinery-classification-form.ts`
- [x] `configuration/module-app/pages/module-app-form.ts`
- [x] `configuration/payment-method/pages/payment-method-form.ts`
- [x] `configuration/payment-type/payment-type-form.ts`
- [x] `configuration/product-category/product-category-form.ts`
- [x] `configuration/units-of-measurement/unit-of-measurement-form.ts`

### contabilidad (10 archivos)
- [~] `contabilidad/cobranza-nativa/pages/charge-templates/charge-template-form.ts` — `submitting` es `boolean` (no signal); endpoints separados por función
- [x] `contabilidad/cobranza-nativa/pages/charges/charge-form.ts`
- [x] `contabilidad/cobranza-nativa/pages/late-fee-policies/late-fee-policy-form.ts`
- [~] `contabilidad/cobranza-nativa/pages/members/member-form.ts` — wizard 2 pasos: paso 1 crea usuario y obtiene userId; paso 2 lo usa en POST
- [x] `contabilidad/cobranza-nativa/pages/payments/payment-form.ts`
- [~] `contabilidad/cobranza-nativa/pages/properties/property-form.ts` — archivo completamente comentado
- [x] `contabilidad/cobranza-nativa/pages/property-fines/issue-fine-charge-form.ts`
- [x] `contabilidad/cobranza-nativa/pages/property-fines/property-fine-form.ts`
- [x] `contabilidad/cobranza-nativa/pages/regulation-articles/regulation-article-form.ts`
- [x] `contabilidad/presupuesto-propuesta/budget-rule-list/budget-rule-form.ts`

### custom-document
- [~] `custom-document/policy-contract/policy-contract-form.ts` — FormData (documento); `id = signal<number>(0)`

### customer-provider
- [x] `customer-provider/customer-provider-form.ts`

### directorios
- [x] `directorios/comite-vigilancia/comite-vigilancia-form.ts`
- [~] `directorios/employee-external/employee-external-form.ts` — FormData (foto)
- [~] `directorios/telefonos-emergencia/telefonos-emergencia-form.ts` — FormData (logo)

### elevator
- [x] `elevator-emergency-call/elevators-emergency-call-form.ts`
- [x] `elevator-spare-parts/elevator-spare-parts-change-form.ts`

### employees (6 archivos)
- [x] `employees/employee-emergency-contact/pages/employee-emergency-contact-form.ts`
- [~] `employees/employee-internal/pages/employee-address-form.ts` — sin DynamicDialogRef (usa `input<string>()`); PUT a URL de acción; queda abierto
- [~] `employees/employee-internal/pages/employee-avatar-form.ts` — sin formulario reactivo; FormData; sin DynamicDialogRef
- [~] `employees/employee-internal/pages/employee-laboral-data-form.ts` — sin DynamicDialogRef; PUT a URL de acción; queda abierto
- [~] `employees/employee-internal/pages/employee-personal-data-form.ts` — sin DynamicDialogRef; PUT a URL de acción; queda abierto
- [~] `employees/employee-internal/pages/employee-principal-data-form.ts` — sin DynamicDialogRef; PUT a URL de acción; queda abierto

### espejo-aspel
- [~] `espejo-aspel/projected-expenses-form.ts` — tres ramas: POST a URL de acción, POST estándar, PUT no estándar

### fire-extinguisher-inventory
- [~] `fire-extinguisher-inventory/inventario-extintor-form.ts` — FormData (foto)

### funding
- [~] `funding/funding-form.ts` — siempre POST independientemente del id

### inspection
- [x] `inspection/catalogo/catalogo-activo-form.ts`
- [x] `inspection/catalogo/catalogo-revisiones-inspeccion-form.ts`
- [x] `inspection/inspecciones-agregar-editar/inspecciones-form.ts`

### juntas-comite
- [~] `juntas-comite/junta-comite-minutas/comite-form.ts` — POST a URL con IDs en path; queda abierto
- [~] `juntas-comite/junta-comite-minutas/invited-form.ts` — POST a URL de acción; queda abierto
- [~] `juntas-comite/junta-comite-minutas/meeting-form.ts` — queda abierto (flujo en dos fases)
- [~] `juntas-comite/junta-comite-minutas/minuta-detalle-form.ts` — inyecta GUID cero en payload de creación
- [~] `juntas-comite/presentacion-junta-comite/presentacion-junta-comite-form.ts` — FormData; POST a URL de acción

### key-inventory
- [x] `key-inventory/inventario-llave-form.ts`

### legal
- [x] `legal/asunto-legal/asunto-legal-form.ts`
- [x] `legal/asunto-legal/categoria-asunto-legal-form.ts`
- [~] `legal/documento-personalizado/documento-personalizado-form.ts` — FormData (archivo)
- [~] `legal/ticket-legal/ticket-legal-form.ts` — FormData (campos individuales)

### lighting-inventory
- [x] `lighting-inventory/inventario-iluminacion-form.ts`

### machinery-asset
- [~] `machinery-asset/activos-form.ts` — FormData (foto); `submitting` es `boolean` (no signal)

### maintenance
- [x] `maintenance-calendar-master/calendario-maestro-form.ts`
- [x] `maintenance-log/bitacora-mantenimiento-form.ts`

### owner
- [x] `owner/owner-form.ts`

### paint-inventory
- [x] `paint-inventory/inventario-pintura-form.ts`

### piscina
- [x] `piscina-bitacora/piscina-bitacora-form.ts`
- [~] `piscina/piscina-form.ts` — FormData (imagen)

### product
- [~] `product-entry/product-entry-form.ts` — PUT con segmento extra en URL (`/${id}/${cantidadActual()}`)
- [~] `product-exit/product-output-form.ts` — PUT con segmento extra en URL (`/${id}/${cantidadActualUsada()}`)
- [~] `product/productos-form.ts` — FormData (imagen)

### property
- [x] `property/propiedades-form.ts`

### provider
- [~] `provider/pages/employee-provider-form.ts` — FormData; flujo multifase (fase 1 crea empleado, fase 2 asigna)
- [~] `provider/proveedor-form.ts` — FormData (foto + constancia fiscal)

### purchases
- [~] `purchases/purchase-order/forms/orden-compra-factura-form.ts` — FormData (PDF/XML); multi-acción (agregar/editar/eliminar); queda abierto
- [~] `purchases/purchase-request/purchase-request-add-product-form.ts` — FormArray; queda abierto; recarga por fila
- [x] `purchases/purchase-request/purchase-request-form.ts`

### radio-communication-inventory
- [~] `radio-communication-inventory/radio-comunicacion-form.ts` — FormData (foto)

### reclutamiento-solicitudes
- [~] `reclutamiento-solicitudes/recruitment-requests/components/solicitud-alta-form.ts` — POST exclusivo a URL de acción con userId en path
- [~] `reclutamiento-solicitudes/recruitment-requests/components/solicitud-alta-status-form.ts` — PUT exclusivo a URL de acción (`/${id}/status`)
- [x] `reclutamiento-solicitudes/request-dismissal-discount/status-request-dismissal-discount-form.ts`
- [~] `reclutamiento-solicitudes/request-dismissal/components/solicitud-baja-form.ts` — FormData; FormArray; POST a URL de acción con IDs en path
- [x] `reclutamiento-solicitudes/salary-modification/components/modificacion-salario-form.ts`
- [~] `reclutamiento-solicitudes/salary-modification/components/solicitud-modificacion-salario-form.ts` — FormData; POST exclusivo a URL con customerId/userId en path
- [x] `reclutamiento-solicitudes/salary-modification/status-request-salary-modification-form.ts`
- [~] `reclutamiento-solicitudes/vacancy-requests/components/solicitud-vacante-form.ts` — POST exclusivo a URL de acción con userId en path
- [x] `reclutamiento-solicitudes/vacancy-requests/components/vacante-form.ts`

### recurring-tasks

### warehouse
- [~] `warehouse/warehouse-form.ts` — submit en dos pasos: guarda almacén y luego PUT a `almacen/assign-responsibles`

---

## 5. Criterios de Validación (DoD)
1. Cero coincidencias de la expresión regular `@(Input|Output)\b` en el código fuente de Angular.
2. La compilación estricta de TypeScript (`npx tsc --noEmit`) pasa sin errores en la carpeta Angular.
3. Se verificó que los listados de PrimeNG/Tablas muestran su contraparte móvil correctamente en pantallas pequeñas.
4. Los envíos de formularios ya no contienen llamadas directas de `HttpClient` o `subscriptions` aisladas en el componente, dependiendo ahora de `FormHelper.submitCrud()`.
