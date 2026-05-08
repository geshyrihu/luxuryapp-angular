# Auditoría: Migración a Componentes Custom (Botones)

> **Objetivo:** Eliminar `<p-button>`, `<button pButton>`, `<a pButton>`, `pRipple`, `ButtonModule` y `ButtonGroupModule`
> de todos los archivos en `features/`. Reemplazar con componentes custom de `core/components/buttons/web`.
>
> **Reglas de reemplazo:**
>
> - `<p-button>` / `<button pButton>` → `<custom-button>`
> - `<a pButton routerLink>` → `<a [routerLink]="..." class="btn btn-secondary btn-sm">`
> - `<p-buttongroup>` → `<div class="flex gap-1 flex-wrap">` + `<custom-button>` individuales
> - `pTooltip` → `ngbTooltip`
> - Output `(onClick)` → `(clicked)` | Prop `icon` → `iconClass` | `size="small"` → `size="sm"`
> - **Dos pasos en `.ts`:** (1) `import` statement, (2) array `imports[]`

---

## 📊 ESTADO GLOBAL (auditado: 2026-04-12)

- **Ocurrencias HTML iniciales:** ~225 en 60 archivos
- **Ocurrencias TS iniciales:** ~204 en 91 archivos
- **Completados:** 80+ archivos HTML + TS ✅
- **Pendientes HTML:** ~0 archivos ✅
- **Pendientes solo-TS:** ~0 archivos ✅
- **Estado general:** MIGRACIÓN COMPLETADA ✅

---

## ✅ COMPLETADOS

### Operaciones / Mantenimiento

- [x] `entrega-recepcion-check/entrega-recepcion-check` — ButtonModule → CustomButton
- [x] `machinery/equipos-list` — ButtonModule → CustomButton
- [x] `inspection/bitacora/mis-inspecciones-lista` — ButtonModule → CustomButton
- [x] `inspection/bitacora/mis-inspecciones-agregar-imagenes` — ButtonModule → CustomButton
- [x] `inspection/bitacora/mis-inspecciones-ejecutar` — ButtonModule → CustomButton
- [x] `inspection/lista-reportes-inspeccion/lista-informe-inspeccion` — ButtonModule → CustomButton

### Legal

- [x] `legal/ticket-legal/ticket-legal-actualizar-estado` — ButtonModule → CustomButton
- [x] `legal/minutas/legal-pendientes-minuta` — ButtonModule+ButtonGroupModule → CustomButton

### Juntas / Comité

- [x] `juntas-comite/junta-comite-minutas/seguimiento-minutas` — ButtonModule+ButtonGroupModule → CustomButton
- [x] `juntas-comite/junta-comite-minutas/minutas-list` — ButtonModule → CustomButton
- [x] `juntas-comite/presentacion-junta-comite/presentacion-junta-comite` — ButtonModule → CustomButton
- [x] `juntas-comite/junta-comite-minutas/meeting-management` — ButtonModule → CustomButton

### Compras / Propiedad

- [x] `expense-catalog-budget/gasto-fijo-presupuesto` — ButtonModule → CustomButton
- [x] `property/property-occupant-manager` — ButtonModule → CustomButton
- [x] `property/propiedades-list` — ButtonModule → CustomButton
- [x] `purchases/purchase-order/orden-compra-list` — ButtonModule+ButtonGroupModule → CustomButton
- [x] `purchases/purchase-order/orden-compra` — ButtonModule removido
- [x] `purchases/purchase-request/purchase-request-list` (17 HTML) + `.ts`
- [x] `purchases/purchase-order/components/create-orden-compra-wizard/create-orden-compra-wizard` (17 HTML) + `.ts`
- [x] `purchases/purchase-order/components/orden-compra-detalle-form/orden-compra-detalle-form` (5) + `.ts`
- [x] `purchases/cedula-presupuestal/cedula-cliente-list` (5) + `.ts`
- [x] `purchases/purchase-order/orden-compra-presupuesto/orden-compra-presupuesto` (3) + `.ts`
- [x] `purchases/solicitud-compra/solicitud-compra` (1) + `.ts`
- [x] `purchases/purchase-request/purchase-request-add-product-form` (1) + `.ts`

### Empleados / RRHH

- [x] `work-position/pages/job-description-form` — ButtonModule → CustomButton
- [x] `employees/org-chart/components/org-chart/org-chart` — ButtonModule → CustomButton

### Acceso / Documentos / Diagrama

- [x] `access-history/bitacora-acceso-list` — ButtonModule removido
- [x] `custom-document/reglamentos-list` — ButtonModule → CustomButton
- [x] `diagram/diagram-list/diagram-list` — ButtonModule → CustomButton
- [x] `diagram/diagram-view/diagram-view.ts` — ButtonModule → CustomButton
- [x] `diagram/diagram-gallery/diagram-gallery.ts` — ButtonModule → CustomButton

### Anuncios

- [x] `announcement/announcement-admin-form` — ButtonModule → CustomButton
- [x] `announcement/announcement-analytics` — ButtonModule removido
- [x] `announcement/announcement-detail` — ButtonModule removido
- [x] `announcement/components/image-generation-dialog/image-generation-dialog` — ButtonModule → CustomButton

### Configuración

- [x] `configuration/brevo-email-logs` — ButtonModule → CustomButton
- [x] `configuration/log-api-report/log-api-report` — ButtonModule → CustomButton
- [x] `configuration/testsignalr` — ButtonModule → CustomButton
- [x] `configuration/theme-designer` — ButtonModule → CustomButton
- [x] `configuration/user-activity-history/user-activity-history` (1) + `.ts`
- [x] `configuration/approval-rules/pages/approval-rules` (1) + `.ts`

### Dashboard

- [x] `dashboard/unified-pending-dashboard` — ButtonModule → CustomButton

---

### contabilidad / edicion-presupuesto

- [x] `contabilidad/edicion-presupuesto/presupuesto-list` (10 HTML) + `.ts`
- [x] `contabilidad/edicion-presupuesto/presupuesto-individual` (4 HTML) + `.ts`
- [x] `contabilidad/edicion-presupuesto/presupuesto-edition-file` (3 HTML) + `.ts`

### contabilidad / migration-test

- [x] `contabilidad/migration-test/migration-test` (5 HTML) + `.ts`

### contabilidad / estados-financieros

- [x] `contabilidad/estados-financieros/estado-financiero-list` (13 HTML) + `.ts`

### contabilidad / contabilidad-online (7 archivos)

- [x] `contabilidad/contabilidad-online/pages/analisis-cobranza/analisis-cobranza` + `.ts`
- [x] `contabilidad/contabilidad-online/pages/monthly-balance/balance-mensual` + `.ts`
- [x] `contabilidad/contabilidad-online/pages/flujo-caja/flujo-efectivo` + `.ts`
- [x] `contabilidad/contabilidad-online/pages/estado-resultados/estado-resultados` + `.ts`
- [x] `contabilidad/contabilidad-online/pages/estado-posicion-financiera/estado-posicion-financiera` + `.ts`
- [x] `contabilidad/contabilidad-online/pages/cedula-extraordinaria/cedula-extraordinaria` + `.ts`
- [x] `contabilidad/contabilidad-online/pages/cedula-presupuestal/cedula-presupuestal` + `.ts`

### contabilidad / presupuesto-propuesta

- [x] `contabilidad/presupuesto-propuesta/budget-support-dialog` (7) + `.ts`
- [x] `contabilidad/presupuesto-propuesta/budget-forecast-dialog` (6) + `.ts`
- [x] `contabilidad/presupuesto-propuesta/account-modal-add` (4) + `.ts`
- [x] `contabilidad/presupuesto-propuesta/budget-audit-dialog` (3) + `.ts`
- [x] `contabilidad/presupuesto-propuesta/presupuesto-propuesta` (1) + `.ts`

### contabilidad / cobranza-nativa

- [x] `contabilidad/cobranza-nativa/pages/billing-config/billing-config-modal` (3) + `.ts`
- [x] `contabilidad/cobranza-nativa/pages/charges/charge-list` (3) + `.ts`
- [x] `contabilidad/cobranza-nativa/pages/payments/payments` (1) + `.ts`
- [x] `contabilidad/cobranza-nativa/pages/native-statement/native-statement` (2) + `.ts`
- [x] `contabilidad/cobranza-nativa/pages/payments/payment-list` (2) + `.ts`

### contabilidad / accounting-catalog

- [x] `contabilidad/accounting-catalog/pages/accounting-catalog` (3) + `.ts`

### contabilidad / presupuesto-web-aspel

- [x] `contabilidad/presupuesto-web-aspel/presupuesto-aspel-ejercicio-fiscal` (2) + `.ts`

### contabilidad / pendientes-minuta

- [x] `contabilidad/pendientes-minuta/minuta-pendientes-list` (2) + `.ts`

### contabilidad / reportes-estados-financieros

- [x] `contabilidad/reportes-estados-financieros/pages/report-designer/report-designer` (5 - TS comentado)
- [x] `contabilidad/reportes-estados-financieros/pages/report-designer/components/report-row-form/report-row-form` (4 - TS comentado)

### contabilidad / legacy-collection

- [x] `contabilidad/legacy-collection/pages/coi-cobranza/coi-cobranza-saldos.ts` (ya limpio)

### supervision

- [x] `supervision/presentaciones-juntas-comite/presentaciones-juntas-comite` (3) + `.ts`

### funding

- [x] `funding/funding-detail` (3) + `.ts`
- [x] `funding-accounting/funding-accounting-detail` (2 comentados) + `.ts`
- [x] `funding/components/funding-upload-invoices-modal` (1) + `.ts`
- [x] `funding/components/funding-order-invoices/funding-order-invoices.ts` (ya limpio)
- [x] `funding/components/funding-group-files/funding-group-files.ts` (ya limpio)

### inventory-engine-system

- [x] `inventory-engine-system/inventory-engine-system` (5) + `.ts`

### leave-request-approval

- [x] `leave-request-approval/permiso-detalle-aprobar` (3) + `.ts`

### expense-catalog

- [x] `expense-catalog/catalogo-gasto-fijo-form` (2 comentados) + `.ts`

### owner

- [x] `owner/owner-list` (1) + `.ts`

### provider

- [x] `provider/provider-list` (1) + `.ts`

### tasks

- [x] `tasks/my-tasks/pages/my-assigned-tasks-list` (4) + `.ts`
- [x] `tasks/my-tasks/pages/my-tasks-list` (4 HTML)
- [x] `tasks/send-operation-report/pages/send-operation-report` (4) + `.ts`
- [x] `tasks/reports/pages/task-report-work-plan` (1 - ya migrado)

---

## 🟣 Solo `.ts` — COMPLETADOS (ya limpios o migrados)

- [x] `biblioteca/financial-report/informe-financiero-list.ts`
- [x] `bitacoras/medidores/medidor-lectura-chart.ts`
- [x] `calendar/fiestas-judias/fiestas-judias.ts`
- [x] `custom-document/special-document-list.ts`
- [x] `custom-document/policy-contract/policy-contract-list.ts`
- [x] `custom-document/asambleas-list.ts`
- [x] `custom-document/acta-constitutiva-list.ts`
- [x] `expense-catalog/catalogo-gastos-fijos-list-moduls.ts`
- [x] `employees/staff-board/staff-board.ts`
- [x] `tool-loan/tool-list.ts`
- [x] `legal/ticket-legal/ticket-legal-seguimiento.ts`
- [x] `legal/asunto-legal/asunto-legal-lista.ts`
- [x] `sat-funding/sat-funding-list/sat-funding-list.ts`
- [x] `sat-funding/sat-funding-detail/sat-funding-detail.ts`
- [x] `firebis-data/firebis-reportes-wrapper.ts`
- [x] `firebis-data/firebis-reporte-financiero.ts`
- [x] `firebis-data/firebis-gastos-vs-presupuesto.ts`
- [x] `firebis-data/firebis-data-main.ts`
- [x] `firebis-data/firebis-cxp-proveedores.ts`
- [x] `recursos-humanos/shared/modal-approval-confirmation.ts`
- [x] `recursos-humanos/admin-vacaciones-balance/modal-admin-vacaciones-edit.ts`
- [x] `recurring-tasks/instances/recurrence-input/recurrence-input.ts`
- [x] `contabilidad/reportes-estados-financieros/components/account-tree-selector/account-tree-selector.ts` (comentado)
- [x] `contabilidad/reportes-estados-financieros/pages/report-viewer/report-viewer.ts` (comentado)
- [x] `contabilidad/reportes-estados-financieros/pages/report-form/modal-financial-report-send.ts` (comentado)
- [x] `configuration/application-user/pages/update-password-account.ts`
- [x] `configuration/customer-data-company/customer-data-company-list.ts`
- [x] `purchases/purchase-link-manager/purchase-link-manager.ts`
- [x] `purchases/purchase-order/parcials/orden-compra-facturas-parcial.ts`
- [x] `purchases/purchase-order/orden-compra-pagadas/orden-compra-pagadas.ts`
- [x] `purchases/purchase-order/forms/orden-compra-status.ts`
- [x] `purchases/purchase-order/forms/orden-compra-factura-form.ts`
- [x] `purchases/purchase-order/components/payment-voucher-modal/payment-voucher-modal.ts`

---

_Última actualización: 2026-04-12 — MIGRACIÓN COMPLETADA ✅_
