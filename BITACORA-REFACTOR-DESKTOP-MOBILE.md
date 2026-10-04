# Bitácora — Refactor estructura Desktop/Mobile

> Última actualización: 2026-10-04

Patrón aplicado (módulo de referencia: `shared.luxuryapp/catalogs/banks`):

```
{modulo}/
├── {x}-list.ts / .html        contenedor (datos + @if platformS.isMobile())
├── {x}-form.*                 formulario/dialogo compartido (no se duplica)
├── interfaces/
├── desktop/{x}-list-desktop.ts/.html   vista web (lux-table)
└── mobile/{x}-list-mobile.ts/.html     vista movil (app-data-view-mobile)
```

Criterio de candidato: componente de listado con vista móvil inline (`app-data-view-mobile`) y/o tabla responsive (`d-none d-md-block`) en el mismo template.

---

## Resumen

- ✅ Refactorizados: **43** carpetas de módulo.
- ⏳ Pendientes (candidatos): **167** archivos en **11** dominios.
- ⛔ Omitidos / no candidatos: ver última sección.

---

## ✅ Refactorizados (43)

### accounting (8)
- `accounting.luxuryapp/fundings/funding`
- `accounting.luxuryapp/fundings/funding-accounting`
- `accounting.luxuryapp/fundings/sat-funding/sat-funding-list`
- `accounting.luxuryapp/general-ledger/accounting-accounts`
- `accounting.luxuryapp/general-ledger/accounting-catalog`
- `accounting.luxuryapp/general-ledger/aspel-web-budget`
- `accounting.luxuryapp/general-ledger/financial-statements`
- `accounting.luxuryapp/general-ledger/pending-minutes`

### operations (24)
- `operations.luxuryapp/administrative-incidents/incident`
- `operations.luxuryapp/administrative-incidents/sanction`
- `operations.luxuryapp/announcements/announcement`
- `operations.luxuryapp/custom-documents/custom-document`
- `operations.luxuryapp/custom-documents/custom-document/policy-contract`
- `operations.luxuryapp/customer-providers`
- `operations.luxuryapp/inspection/inspection-list`
- `operations.luxuryapp/inventory/fire-extinguisher-inventory`
- `operations.luxuryapp/inventory/hydrant-inventory`
- `operations.luxuryapp/inventory/key-inventory`
- `operations.luxuryapp/inventory/lighting-inventory`
- `operations.luxuryapp/inventory/manual-call-point-inventory`
- `operations.luxuryapp/inventory/paint-inventory`
- `operations.luxuryapp/inventory/product-entry`
- `operations.luxuryapp/inventory/product-exit`
- `operations.luxuryapp/inventory/radio-communication-inventory`
- `operations.luxuryapp/inventory/smoke-detector-inventory`
- `operations.luxuryapp/inventory/stock-by-warehouse`
- `operations.luxuryapp/inventory/warehouse`
- `operations.luxuryapp/owner`
- `operations.luxuryapp/properties`
- `operations.luxuryapp/providers`
- `operations.luxuryapp/templates`
- `operations.luxuryapp/work-positions`

### recruitment (3)
- `recruitment.luxuryapp/candidates/candidate-applications`
- `recruitment.luxuryapp/candidates/candidate-core`
- `recruitment.luxuryapp/candidates/candidate-interview`

### shared (8)
- `shared.luxuryapp/catalogs/banks`
- `shared.luxuryapp/catalogs/cfdi-usage`
- `shared.luxuryapp/catalogs/document-catalog`
- `shared.luxuryapp/catalogs/onboarding-checklist-options`
- `shared.luxuryapp/catalogs/payment-method`
- `shared.luxuryapp/catalogs/payment-type`
- `shared.luxuryapp/catalogs/recruitment-sources`
- `shared.luxuryapp/catalogs/units-of-measurement`

---

## ⏳ Pendientes — candidatos (167)

### maintenance (27)
- `maintenance.luxuryapp/fire-equipment/extinguisher-log/extintor-bitacora-list.html`
- `maintenance.luxuryapp/fire-equipment/hydrant-log/hidrante-bitacora-list.html`
- `maintenance.luxuryapp/fire-equipment/manual-call-point-log/estacion-manual-bitacora-list.html`
- `maintenance.luxuryapp/fire-equipment/smoke-detector-log/detector-humo-bitacora-list.html`
- `maintenance.luxuryapp/logs/elevator-emergency-call/elevators-emergency-call-list.html`
- `maintenance.luxuryapp/logs/elevator-spare-parts/elevator-spare-parts-change-list.html`
- `maintenance.luxuryapp/logs/logbooks/meters/medidor-lectura-list.html`
- `maintenance.luxuryapp/logs/logbooks/meters/medidores-list.html`
- `maintenance.luxuryapp/logs/logbooks/tool-loan/prestamo-herramientas-control.html`
- `maintenance.luxuryapp/logs/maintenance-log/bitacora-individual.html`
- `maintenance.luxuryapp/logs/maintenance-log/bitacora-mantenimiento.html`
- `maintenance.luxuryapp/logs/pool-logbook/piscina-bitacora-list.html`
- `maintenance.luxuryapp/logs/pool/piscina-list.html`
- `maintenance.luxuryapp/logs/tool-loan/tool-list.html`
- `maintenance.luxuryapp/logs/water-truck-receipts/recepcion-pipas-agua-list.html`
- `maintenance.luxuryapp/machinery/equipment-content/equipment-content-list.html`
- `maintenance.luxuryapp/machinery/machinery/equipos-list.html`
- `maintenance.luxuryapp/maintenance-planning/maintenance-calendar-master/calendario-maestro-lista.html`
- `maintenance.luxuryapp/maintenance-planning/master-equipment-calendar/calendario-maestro-equipo.html`
- `maintenance.luxuryapp/maintenance-reports/maintenance-reports-list.html`
- `maintenance.luxuryapp/maintenance-ticket-catalogs/asset-catalog-list/catalogo-activo-lista.html`
- `maintenance.luxuryapp/maintenance-ticket-catalogs/delivery-reception-catalog/catalogo-descripcion-list.html`
- `maintenance.luxuryapp/maintenance-ticket-catalogs/inspection-revision-catalog/catalogo-revisiones-inspeccion.html`
- `maintenance.luxuryapp/maintenance-ticket-catalogs/machinery-classification/machinery-classification-list.html`
- `maintenance.luxuryapp/maintenance-ticket-catalogs/meter-category/meter-category-list.html`
- `maintenance.luxuryapp/maintenance-ticket-catalogs/product-category/product-category-list.html`
- `maintenance.luxuryapp/maintenance-ticket-catalogs/task-group-category-list/task-group-category-list.html`

### operations (27)
- `operations.luxuryapp/dashboard/unified-pending-dashboard-mobile.html`
- `operations.luxuryapp/dashboard/unified-pending-dashboard.html`
- `operations.luxuryapp/delivery-receptions/client-delivery-reception/entrega-recepcion-cliente.html`
- `operations.luxuryapp/diagram/diagram/diagram-list/diagram-list.html`
- `operations.luxuryapp/google-calendar/calendar/annual-maintenance-list/listado-anual-mantenimiento.html`
- `operations.luxuryapp/google-calendar/google-calendar/google-calendar.html`
- `operations.luxuryapp/inspection/logbook/mis-inspecciones-ejecutar.html`
- `operations.luxuryapp/inspection/logbook/mis-inspecciones-lista.html`
- `operations.luxuryapp/manuals/library/financial-report/informe-financiero-list.html`
- `operations.luxuryapp/manuals/library/manuals-and-processes/manuals-and-processes-list.html`
- `operations.luxuryapp/reports/contracts-policies/contracts-policies.html`
- `operations.luxuryapp/service-orders/service-order/ordenes-servicio-list.html`
- `operations.luxuryapp/supervision/supervision/area-minutes-filter/filtro-minutas-area.html`
- `operations.luxuryapp/supervision/supervision/committee-meeting-presentations/presentaciones-juntas-comite.html`
- `operations.luxuryapp/supervision/supervision/general-result-area-evaluation/resultado-general-evaluacion-areas-detalle.html`
- `operations.luxuryapp/supervision/supervision/supervision-agenda/agenda-supervision.html`
- `operations.luxuryapp/task/recurring-tasks/catalog/recurring-task-catalog-list/recurring-task-catalog-list.html`
- `operations.luxuryapp/task/recurring-tasks/compliance/recurring-task-compliance-dashboard/recurring-task-compliance-dashboard.html`
- `operations.luxuryapp/task/recurring-tasks/instances/task-instance-list/task-instance-list.html`
- `operations.luxuryapp/task/recurring-tasks/templates/task-template-items/task-template-items.html`
- `operations.luxuryapp/task/recurring-tasks/templates/task-template-list/task-template-list.html`
- `operations.luxuryapp/task/tasks/my-tasks/my-assigned-tasks-list.html`
- `operations.luxuryapp/task/tasks/my-tasks/my-requests-task.html`
- `operations.luxuryapp/task/tasks/reports/task-operation-report.html`
- `operations.luxuryapp/task/tasks/reports/task-report-work-plan.html`
- `operations.luxuryapp/task/tasks/task-message/task-list.html`
- `operations.luxuryapp/task/tasks/work-group/task-group-list.html`

### collections (22)
- `collections.luxuryapp/native-collections/core/approvals/approval-inbox.html`
- `collections.luxuryapp/native-collections/core/audit/financial-audit-log.html`
- `collections.luxuryapp/native-collections/core/charge-templates/charge-template-list.html`
- `collections.luxuryapp/native-collections/core/charge-types/charge-type-list.html`
- `collections.luxuryapp/native-collections/core/charges/charge-list.html`
- `collections.luxuryapp/native-collections/core/collection-cases/collection-case-list.html`
- `collections.luxuryapp/native-collections/core/initial-balance/initial-balance.html`
- `collections.luxuryapp/native-collections/core/invoices/invoice-list.html`
- `collections.luxuryapp/native-collections/core/late-fee-policies/late-fee-policy-list.html`
- `collections.luxuryapp/native-collections/core/ledger/ledger-viewer.html`
- `collections.luxuryapp/native-collections/core/members/member-list.html`
- `collections.luxuryapp/native-collections/core/payments/payment-list.html`
- `collections.luxuryapp/native-collections/core/period-closures/period-closure-dashboard.html`
- `collections.luxuryapp/native-collections/core/property-fines/property-fine-list.html`
- `collections.luxuryapp/native-collections/core/reconciliation/reconciliation-dashboard.html`
- `collections.luxuryapp/native-collections/core/regulation-articles/regulation-article-list.html`
- `collections.luxuryapp/online-collections/condo-owners-detail/cobranza-online-detalle-condominos.html`
- `collections.luxuryapp/online-collections/exclusions/cobranza-online-exclusions.html`
- `collections.luxuryapp/online-collections/inspection/cobranza-online-inspection.html`
- `collections.luxuryapp/online-collections/other-charges/cobranza-online-otros-cargos.html`
- `collections.luxuryapp/online-collections/towers/cobranza-online-towers.html`
- `collections.luxuryapp/online-collections/transactions/cobranza-online-movimientos.html`

### accounting (21)
- `accounting.luxuryapp/accounting-catalogs/aspel-customer-company/aspel-customer-empresa-list.html`
- `accounting.luxuryapp/accounting-catalogs/aspel-mirror/projected-expenses-list.html`
- `accounting.luxuryapp/accounting-catalogs/fixed-expense-catalogs/catalogo-gastos-fijos-list.html`
- `accounting.luxuryapp/general-ledger/aspel-customer-company/aspel-customer-empresa-list.html`
- `accounting.luxuryapp/general-ledger/aspel-mirror/projected-expenses-list.html`
- `accounting.luxuryapp/general-ledger/budget-proposals/budget-rule-list/budget-rule-list.html`
- `accounting.luxuryapp/general-ledger/dynamic-reports/report-catalog/report-catalog.html`
- `accounting.luxuryapp/general-ledger/financial-reports/client/client-accounting-budget/presupuesto-contabilidad-cliente.html`
- `accounting.luxuryapp/general-ledger/financial-reports/client/client-budget-statement/cedula-presupuestal-cliente.html`
- `accounting.luxuryapp/general-ledger/financial-reports/client/client-collection-analysis/analisis-cobranza-cliente.html`
- `accounting.luxuryapp/general-ledger/financial-reports/client/client-income-statement-v2/estado-resultados-v2-cliente.html`
- `accounting.luxuryapp/general-ledger/financial-reports/client/client-income-statement/estado-resultados-cliente.html`
- `accounting.luxuryapp/general-ledger/financial-reports/online/accounting-budget/presupuesto-contabilidad.html`
- `accounting.luxuryapp/general-ledger/financial-reports/online/banks-investments/bancos-inversiones.html`
- `accounting.luxuryapp/general-ledger/financial-reports/online/budget-statement/cedula-presupuestal.html`
- `accounting.luxuryapp/general-ledger/financial-reports/online/extraordinary-results/resultados-extraordinarios.html`
- `accounting.luxuryapp/general-ledger/financial-reports/online/income-statement-v2/estado-resultados-v2.html`
- `accounting.luxuryapp/general-ledger/financial-reports/online/income-statement/estado-resultados.html`
- `accounting.luxuryapp/general-ledger/financial-reports/online/monthly-balance/balance-mensual.html`
- `accounting.luxuryapp/general-ledger/fixed-expense-catalogs/catalogo-gastos-fijos-list.html`
- `accounting.luxuryapp/general-ledger/funding-accounting/funding-accounting-list.html`

### admin (16)
- `admin.luxuryapp/email-configuration/customer-data-companies/customer-data-company-list.html`
- `admin.luxuryapp/email-configuration/email-data/email-data-list.html`
- `admin.luxuryapp/reports/customer-provider/mis-proveedores-list.html`
- `admin.luxuryapp/security-permissions/application-roles/roles-list.html`
- `admin.luxuryapp/security-permissions/customer-locations/customer-location-list.html`
- `admin.luxuryapp/security-permissions/customer-modules/customer-modul-list.html`
- `admin.luxuryapp/security-permissions/customer/customer-list.html`
- `admin.luxuryapp/security-permissions/module-app-roles/module-app-rol-list.html`
- `admin.luxuryapp/security-permissions/module-apps/module-app-list.html`
- `admin.luxuryapp/system-audit-logs/audit-entries/audit-entries.html`
- `admin.luxuryapp/system-audit-logs/log-api-report/log-api-report.html`
- `admin.luxuryapp/system-audit-logs/user-activity-history/user-activity-history.html`
- `admin.luxuryapp/system-configuration/assembly-checklist-templates/asamblea-checklist-template-list.html`
- `admin.luxuryapp/system-configuration/database-backup/database-backup-list.html`
- `admin.luxuryapp/system-configuration/knowledge-base/ai-knowledge-base-list.html`
- `admin.luxuryapp/system-configuration/vault-secrets/vault-secrets-list.html`

### human-resources (15)
- `human-resources.luxuryapp/employee-time-clock/chekador-list.html`
- `human-resources.luxuryapp/evaluation/evaluation-template/lista-plantilla-evaluacion.html`
- `human-resources.luxuryapp/evaluation/evaluation-template/performance-evaluation/lista-evaluacion-realizada.html`
- `human-resources.luxuryapp/hr-admin/incident-type-list/incident-type-list.html`
- `human-resources.luxuryapp/hr-admin/sanction-type-list/sanction-type-list.html`
- `human-resources.luxuryapp/payroll/details/nomina-detalle.html`
- `human-resources.luxuryapp/payroll/headers/nominas.html`
- `human-resources.luxuryapp/payroll/incidents/incidencias-nomina.html`
- `human-resources.luxuryapp/payroll/loans/prestamos-empleado.html`
- `human-resources.luxuryapp/payroll/overtime/tiempo-extra.html`
- `human-resources.luxuryapp/payroll/periods/periodos-nomina.html`
- `human-resources.luxuryapp/time-off/admin-vacaciones-balance/admin-vacaciones-balance.html`
- `human-resources.luxuryapp/time-off/leave-request/mis-permisos-listado.html`
- `human-resources.luxuryapp/time-off/my-vacation-requests/mis-vacaciones-listado.html`
- `human-resources.luxuryapp/time-off/request-history/solicitudes-historial.html`

### recruitment (15)
- `recruitment.luxuryapp/employee-bank-data-records/employee-bank-data-list.html`
- `recruitment.luxuryapp/employee-beneficiaries/employee-beneficiary-list.html`
- `recruitment.luxuryapp/employee-clinical-data-records/employee-clinical-data-list.html`
- `recruitment.luxuryapp/employee-dismissal-requests/solicitud-baja-list.html`
- `recruitment.luxuryapp/employee-emergency-contacts/employee-emergency-contact-list.html`
- `recruitment.luxuryapp/employee-file/employees/employee-registry/employee-list.html`
- `recruitment.luxuryapp/employee-file/human-resources/employee-bank-data/employee-bank-data-list.html`
- `recruitment.luxuryapp/employee-file/human-resources/employee-beneficiary/employee-beneficiary-list.html`
- `recruitment.luxuryapp/employee-file/human-resources/employee-registry/employee-file-list.html`
- `recruitment.luxuryapp/employee-registration-requests/solicitud-alta-list.html`
- `recruitment.luxuryapp/external-staffs/employee-external-list.html`
- `recruitment.luxuryapp/provider-supports/provider-support.html`
- `recruitment.luxuryapp/recruitment-requests/recruitment-client-requests/solicitudes-cliente-list.html`
- `recruitment.luxuryapp/salary-modification-requests/solicitud-modificacion-list.html`
- `recruitment.luxuryapp/vacancy-requests/vacantes-list.html`

### legal (14)
- `legal.luxuryapp/employee-contracts/addendum-template/addendum-template-list.html`
- `legal.luxuryapp/employee-contracts/contract-addendum/contract-addendum-list.html`
- `legal.luxuryapp/employee-contracts/contract-template/contract-template-list.html`
- `legal.luxuryapp/employee-contracts/work-contract/work-contract-list.html`
- `legal.luxuryapp/legal/custom-documents/documento-personalizado-lista.html`
- `legal.luxuryapp/legal/legal-matter/asunto-legal-lista.html`
- `legal.luxuryapp/legal/legal-tickets/ticket-legal-lista-cliente.html`
- `legal.luxuryapp/legal/legal-tickets/ticket-legal-lista.html`
- `legal.luxuryapp/legal/legal-tickets/ticket-legal-reportes-externos.html`
- `legal.luxuryapp/legal/legal-tickets/ticket-legal-reportes-internos.html`
- `legal.luxuryapp/legal/legal-tickets/ticket-legal-reportes-pendientes.html`
- `legal.luxuryapp/legal/meeting-minutes/legal-pendientes-minuta.html`
- `legal.luxuryapp/vigilance-committees/comite-vigilancia-list.html`
- `legal.luxuryapp/vigilance-committees/comites-list.html`

### purchases (5)
- `purchases.luxuryapp/products/productos-list.html`
- `purchases.luxuryapp/purchase-history/historial-compras-list.html`
- `purchases.luxuryapp/purchase-orders/purchase-order/orden-compra-list.html`
- `purchases.luxuryapp/purchase-requests/budget-statement/ordenes-compra-cedula-list.html`
- `purchases.luxuryapp/purchase-requests/requests/solicitud-compra-list.html`

### management (4)
- `management.luxuryapp/monthly-meetings/meeting-minutes/resumen-minuta.html`
- `management.luxuryapp/monthly-meetings/meeting-minutes/seguimiento-minutas.html`
- `management.luxuryapp/monthly-meetings/presentation/presentacion-junta-comite-contador.html`
- `management.luxuryapp/monthly-meetings/presentation/presentacion-junta-comite.html`

### auth (1)
- `auth.luxuryapp/password-manager/password-list.html`

---

## ⛔ Omitidos / no candidatos

### Módulos protegidos (no tocar sin autorización)
- `accounting.luxuryapp/general-ledger/budget-proposals/**` — advertencia en el propio código: requiere autorización explícita del Ing. Ricardo Marques.

### Casos especiales (evaluar aparte, no son CRUD simples)
- `accounting.luxuryapp/general-ledger/dynamic-reports/report-catalog` — página con `lux-tabs` + 2 listas (propios/plantillas) por pestaña.
- Reportes financieros densos: `accounting.luxuryapp/general-ledger/financial-reports/**` (cédulas, balance, estado de resultados, bancos, etc.).

### No candidatos (dashboards, reportes, calendarios, agendas, filtros, analíticas, detalles)
- No tienen patrón de listado CRUD; se omiten.
- P. ej. en `operations.luxuryapp`: `dashboard/**`, `google-calendar/**`, `supervision/**`, `task/tasks/reports/**`, `reports/**`, `announcements/announcement/announcement-analytics`, `inspection/logbook/mis-inspecciones-ejecutar`.

### Omitidos por decisión
- `operations.luxuryapp/diagram/diagram/diagram-list`, `manuals/library/financial-report/informe-financiero-list`, `manuals/library/manuals-and-processes/manuals-and-processes-list` — no se consideran candidatos.

