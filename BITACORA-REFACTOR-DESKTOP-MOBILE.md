# 🧭 Bitácora — Refactor estructura Desktop / Mobile

> Última actualización: **2026-10-04**

Patrón (referencia: `shared.luxuryapp/catalogs/banks`):

```
{modulo}/
├── {x}-list.ts / .html        contenedor (datos + @if platformS.isMobile())
├── {x}-form.*                 formulario/dialogo compartido
├── interfaces/
├── desktop/{x}-list-desktop.ts/.html   vista web (lux-table)
└── mobile/{x}-list-mobile.ts/.html     vista movil (app-data-view-mobile)
```

**Criterio de candidato:** listado con vista móvil inline (`app-data-view-mobile`) y/o tabla responsive (`d-none d-md-block`) en el mismo template.

**Leyenda:** ✅ aplica · · no aplica

| Estado | Total |
|---|:---:|
| ✅ Refactorizado | **76** |
| ⏳ Pendiente | **108** |
| ⛔ Omitido / no candidato | **28** |
| **Total** | **212** |

---

| # | Módulo | Dominio | ✅ Refactorizado | ⏳ Pendiente | ⛔ Omitido | Nota |
|:---:|---|:---:|:---:|:---:|:---:|---|
| 1 | `accounting-catalogs/aspel-customer-company/aspel-customer-empresa-list.html` | accounting | · | ✅ | · |  |
| 2 | `accounting-catalogs/aspel-mirror/projected-expenses-list.html` | accounting | · | ✅ | · |  |
| 3 | `accounting-catalogs/fixed-expense-catalogs/catalogo-gastos-fijos-list.html` | accounting | · | ✅ | · |  |
| 4 | `cfdi-download/cfdi-list` | accounting | ✅ | · | · |  |
| 5 | `fundings/funding` | accounting | ✅ | · | · |  |
| 6 | `fundings/funding-accounting` | accounting | ✅ | · | · |  |
| 7 | `fundings/sat-funding/sat-funding-list` | accounting | ✅ | · | · |  |
| 8 | `general-ledger/accounting-accounts` | accounting | ✅ | · | · |  |
| 9 | `general-ledger/accounting-catalog` | accounting | ✅ | · | · |  |
| 10 | `general-ledger/aspel-customer-company/aspel-customer-empresa-list.html` | accounting | · | ✅ | · |  |
| 11 | `general-ledger/aspel-mirror/projected-expenses-list.html` | accounting | · | ✅ | · |  |
| 12 | `general-ledger/aspel-web-budget` | accounting | ✅ | · | · |  |
| 13 | `general-ledger/budget-proposals/budget-rule-list/budget-rule-list.html` | accounting | · | · | ✅ | Protegido: autorización Ing. Ricardo Marques |
| 14 | `general-ledger/dynamic-reports/report-catalog/report-catalog.html` | accounting | · | · | ✅ | Página con tabs + 2 listas (caso especial) |
| 15 | `general-ledger/financial-reports/client/client-accounting-budget/presupuesto-contabilidad-cliente.html` | accounting | · | · | ✅ | Reporte denso (evaluar aparte) |
| 16 | `general-ledger/financial-reports/client/client-budget-statement/cedula-presupuestal-cliente.html` | accounting | · | · | ✅ | Reporte denso (evaluar aparte) |
| 17 | `general-ledger/financial-reports/client/client-collection-analysis/analisis-cobranza-cliente.html` | accounting | · | · | ✅ | Reporte denso (evaluar aparte) |
| 18 | `general-ledger/financial-reports/client/client-income-statement-v2/estado-resultados-v2-cliente.html` | accounting | · | · | ✅ | Reporte denso (evaluar aparte) |
| 19 | `general-ledger/financial-reports/client/client-income-statement/estado-resultados-cliente.html` | accounting | · | · | ✅ | Reporte denso (evaluar aparte) |
| 20 | `general-ledger/financial-reports/online/accounting-budget/presupuesto-contabilidad.html` | accounting | · | · | ✅ | Reporte denso (evaluar aparte) |
| 21 | `general-ledger/financial-reports/online/banks-investments/bancos-inversiones.html` | accounting | · | · | ✅ | Reporte denso (evaluar aparte) |
| 22 | `general-ledger/financial-reports/online/budget-statement/cedula-presupuestal.html` | accounting | · | · | ✅ | Reporte denso (evaluar aparte) |
| 23 | `general-ledger/financial-reports/online/extraordinary-results/resultados-extraordinarios.html` | accounting | · | · | ✅ | Reporte denso (evaluar aparte) |
| 24 | `general-ledger/financial-reports/online/income-statement-v2/estado-resultados-v2.html` | accounting | · | · | ✅ | Reporte denso (evaluar aparte) |
| 25 | `general-ledger/financial-reports/online/income-statement/estado-resultados.html` | accounting | · | · | ✅ | Reporte denso (evaluar aparte) |
| 26 | `general-ledger/financial-reports/online/monthly-balance/balance-mensual.html` | accounting | · | · | ✅ | Reporte denso (evaluar aparte) |
| 27 | `general-ledger/financial-statements` | accounting | ✅ | · | · |  |
| 28 | `general-ledger/fixed-expense-catalogs/catalogo-gastos-fijos-list.html` | accounting | · | ✅ | · |  |
| 29 | `general-ledger/funding-accounting/funding-accounting-list.html` | accounting | · | ✅ | · |  |
| 30 | `general-ledger/pending-minutes` | accounting | ✅ | · | · |  |
| 31 | `email-configuration/customer-data-companies/customer-data-company-list.html` | admin | · | ✅ | · |  |
| 32 | `email-configuration/email-data/email-data-list.html` | admin | · | ✅ | · |  |
| 33 | `reports/customer-provider/mis-proveedores-list.html` | admin | · | ✅ | · |  |
| 34 | `security-permissions/application-roles/roles-list.html` | admin | · | ✅ | · |  |
| 35 | `security-permissions/customer-locations/customer-location-list.html` | admin | · | ✅ | · |  |
| 36 | `security-permissions/customer-modules/customer-modul-list.html` | admin | · | ✅ | · |  |
| 37 | `security-permissions/customer/customer-list.html` | admin | · | ✅ | · |  |
| 38 | `security-permissions/module-app-roles/module-app-rol-list.html` | admin | · | ✅ | · |  |
| 39 | `security-permissions/module-apps/module-app-list.html` | admin | · | ✅ | · |  |
| 40 | `system-audit-logs/audit-entries/audit-entries.html` | admin | · | ✅ | · |  |
| 41 | `system-audit-logs/log-api-report/log-api-report.html` | admin | · | ✅ | · |  |
| 42 | `system-audit-logs/user-activity-history/user-activity-history.html` | admin | · | ✅ | · |  |
| 43 | `system-configuration/assembly-checklist-templates/asamblea-checklist-template-list.html` | admin | · | ✅ | · |  |
| 44 | `system-configuration/database-backup/database-backup-list.html` | admin | · | ✅ | · |  |
| 45 | `system-configuration/knowledge-base/ai-knowledge-base-list.html` | admin | · | ✅ | · |  |
| 46 | `system-configuration/vault-secrets/vault-secrets-list.html` | admin | · | ✅ | · |  |
| 47 | `password-manager/password-list.html` | auth | · | ✅ | · |  |
| 48 | `native-collections/core/approvals/approval-inbox.html` | collections | · | ✅ | · |  |
| 49 | `native-collections/core/audit/financial-audit-log.html` | collections | · | ✅ | · |  |
| 50 | `native-collections/core/charge-templates/charge-template-list.html` | collections | · | ✅ | · |  |
| 51 | `native-collections/core/charge-types/charge-type-list.html` | collections | · | ✅ | · |  |
| 52 | `native-collections/core/charges/charge-list.html` | collections | · | ✅ | · |  |
| 53 | `native-collections/core/collection-cases/collection-case-list.html` | collections | · | ✅ | · |  |
| 54 | `native-collections/core/initial-balance/initial-balance.html` | collections | · | ✅ | · |  |
| 55 | `native-collections/core/invoices/invoice-list.html` | collections | · | ✅ | · |  |
| 56 | `native-collections/core/late-fee-policies/late-fee-policy-list.html` | collections | · | ✅ | · |  |
| 57 | `native-collections/core/ledger/ledger-viewer.html` | collections | · | ✅ | · |  |
| 58 | `native-collections/core/members/member-list.html` | collections | · | ✅ | · |  |
| 59 | `native-collections/core/payments/payment-list.html` | collections | · | ✅ | · |  |
| 60 | `native-collections/core/period-closures/period-closure-dashboard.html` | collections | · | ✅ | · |  |
| 61 | `native-collections/core/property-fines/property-fine-list.html` | collections | · | ✅ | · |  |
| 62 | `native-collections/core/reconciliation/reconciliation-dashboard.html` | collections | · | ✅ | · |  |
| 63 | `native-collections/core/regulation-articles/regulation-article-list.html` | collections | · | ✅ | · |  |
| 64 | `online-collections/condo-owners-detail/cobranza-online-detalle-condominos.html` | collections | · | ✅ | · |  |
| 65 | `online-collections/exclusions/cobranza-online-exclusions.html` | collections | · | ✅ | · |  |
| 66 | `online-collections/inspection/cobranza-online-inspection.html` | collections | · | ✅ | · |  |
| 67 | `online-collections/other-charges/cobranza-online-otros-cargos.html` | collections | · | ✅ | · |  |
| 68 | `online-collections/towers/cobranza-online-towers.html` | collections | · | ✅ | · |  |
| 69 | `online-collections/transactions/cobranza-online-movimientos.html` | collections | · | ✅ | · |  |
| 70 | `employee-time-clock/chekador-list.html` | human-resources | · | ✅ | · |  |
| 71 | `evaluation/evaluation-template/lista-plantilla-evaluacion.html` | human-resources | · | ✅ | · |  |
| 72 | `evaluation/evaluation-template/performance-evaluation/lista-evaluacion-realizada.html` | human-resources | · | ✅ | · |  |
| 73 | `hr-admin/incident-type-list/incident-type-list.html` | human-resources | · | ✅ | · |  |
| 74 | `hr-admin/sanction-type-list/sanction-type-list.html` | human-resources | · | ✅ | · |  |
| 75 | `payroll/details/nomina-detalle.html` | human-resources | · | ✅ | · |  |
| 76 | `payroll/headers/nominas.html` | human-resources | · | ✅ | · |  |
| 77 | `payroll/incidents/incidencias-nomina.html` | human-resources | · | ✅ | · |  |
| 78 | `payroll/loans/prestamos-empleado.html` | human-resources | · | ✅ | · |  |
| 79 | `payroll/overtime/tiempo-extra.html` | human-resources | · | ✅ | · |  |
| 80 | `payroll/periods/periodos-nomina.html` | human-resources | · | ✅ | · |  |
| 81 | `time-off/admin-vacaciones-balance/admin-vacaciones-balance.html` | human-resources | · | ✅ | · |  |
| 82 | `time-off/leave-request/mis-permisos-listado.html` | human-resources | · | ✅ | · |  |
| 83 | `time-off/my-vacation-requests/mis-vacaciones-listado.html` | human-resources | · | ✅ | · |  |
| 84 | `time-off/request-history/solicitudes-historial.html` | human-resources | · | ✅ | · |  |
| 85 | `employee-contracts/addendum-template/addendum-template-list.html` | legal | · | ✅ | · |  |
| 86 | `employee-contracts/contract-addendum/contract-addendum-list.html` | legal | · | ✅ | · |  |
| 87 | `employee-contracts/contract-template/contract-template-list.html` | legal | · | ✅ | · |  |
| 88 | `employee-contracts/work-contract/work-contract-list.html` | legal | · | ✅ | · |  |
| 89 | `legal/custom-documents/documento-personalizado-lista.html` | legal | · | ✅ | · |  |
| 90 | `legal/legal-matter/asunto-legal-lista.html` | legal | · | ✅ | · |  |
| 91 | `legal/legal-tickets/ticket-legal-lista-cliente.html` | legal | · | ✅ | · |  |
| 92 | `legal/legal-tickets/ticket-legal-lista.html` | legal | · | ✅ | · |  |
| 93 | `legal/legal-tickets/ticket-legal-reportes-externos.html` | legal | · | ✅ | · |  |
| 94 | `legal/legal-tickets/ticket-legal-reportes-internos.html` | legal | · | ✅ | · |  |
| 95 | `legal/legal-tickets/ticket-legal-reportes-pendientes.html` | legal | · | ✅ | · |  |
| 96 | `legal/meeting-minutes/legal-pendientes-minuta.html` | legal | · | ✅ | · |  |
| 97 | `vigilance-committees/comite-vigilancia-list.html` | legal | · | ✅ | · |  |
| 98 | `vigilance-committees/comites-list.html` | legal | · | ✅ | · |  |
| 99 | `fire-equipment/extinguisher-log` | maintenance | ✅ | · | · |  |
| 100 | `fire-equipment/extinguisher-log/extintor-bitacora-list` | maintenance | ✅ | · | · |  |
| 101 | `fire-equipment/hydrant-log` | maintenance | ✅ | · | · |  |
| 102 | `fire-equipment/hydrant-log/hidrante-bitacora-list` | maintenance | ✅ | · | · |  |
| 103 | `fire-equipment/manual-call-point-log` | maintenance | ✅ | · | · |  |
| 104 | `fire-equipment/manual-call-point-log/estacion-manual-bitacora-list` | maintenance | ✅ | · | · |  |
| 105 | `fire-equipment/smoke-detector-log` | maintenance | ✅ | · | · |  |
| 106 | `fire-equipment/smoke-detector-log/detector-humo-bitacora-list` | maintenance | ✅ | · | · |  |
| 107 | `logs/elevator-emergency-call` | maintenance | ✅ | · | · |  |
| 108 | `logs/elevator-spare-parts` | maintenance | ✅ | · | · |  |
| 109 | `logs/logbooks/meters` | maintenance | ✅ | · | · |  |
| 110 | `logs/logbooks/tool-loan` | maintenance | ✅ | · | · |  |
| 111 | `logs/maintenance-log` | maintenance | ✅ | · | · |  |
| 112 | `logs/pool` | maintenance | ✅ | · | · |  |
| 113 | `logs/pool-logbook` | maintenance | ✅ | · | · |  |
| 114 | `logs/tool-loan` | maintenance | ✅ | · | · |  |
| 115 | `logs/water-truck-receipts` | maintenance | ✅ | · | · |  |
| 116 | `machinery/equipment-content/equipment-content-list.html` | maintenance | · | ✅ | · |  |
| 117 | `machinery/machinery/equipos-list.html` | maintenance | · | ✅ | · |  |
| 118 | `maintenance-planning/maintenance-calendar-master/calendario-maestro-lista.html` | maintenance | · | ✅ | · |  |
| 119 | `maintenance-planning/master-equipment-calendar/calendario-maestro-equipo.html` | maintenance | · | ✅ | · |  |
| 120 | `maintenance-reports/maintenance-reports-list.html` | maintenance | · | ✅ | · |  |
| 121 | `maintenance-ticket-catalogs/asset-catalog-list` | maintenance | ✅ | · | · |  |
| 122 | `maintenance-ticket-catalogs/delivery-reception-catalog` | maintenance | ✅ | · | · |  |
| 123 | `maintenance-ticket-catalogs/inspection-revision-catalog` | maintenance | ✅ | · | · |  |
| 124 | `maintenance-ticket-catalogs/machinery-classification` | maintenance | ✅ | · | · |  |
| 125 | `maintenance-ticket-catalogs/meter-category` | maintenance | ✅ | · | · |  |
| 126 | `maintenance-ticket-catalogs/product-category` | maintenance | ✅ | · | · |  |
| 127 | `maintenance-ticket-catalogs/task-group-category-list` | maintenance | ✅ | · | · |  |
| 128 | `monthly-meetings/meeting-minutes/resumen-minuta.html` | management | · | ✅ | · |  |
| 129 | `monthly-meetings/meeting-minutes/seguimiento-minutas.html` | management | · | ✅ | · |  |
| 130 | `monthly-meetings/presentation/presentacion-junta-comite-contador.html` | management | · | ✅ | · |  |
| 131 | `monthly-meetings/presentation/presentacion-junta-comite.html` | management | · | ✅ | · |  |
| 132 | `administrative-incidents/incident` | operations | ✅ | · | · |  |
| 133 | `administrative-incidents/sanction` | operations | ✅ | · | · |  |
| 134 | `announcements/announcement` | operations | ✅ | · | · |  |
| 135 | `custom-documents/custom-document` | operations | ✅ | · | · |  |
| 136 | `custom-documents/custom-document/policy-contract` | operations | ✅ | · | · |  |
| 137 | `customer-providers` | operations | ✅ | · | · |  |
| 138 | `dashboard/unified-pending-dashboard-mobile.html` | operations | · | · | ✅ | No candidato (dashboard) |
| 139 | `dashboard/unified-pending-dashboard.html` | operations | · | · | ✅ | No candidato (dashboard) |
| 140 | `delivery-receptions/client-delivery-reception/entrega-recepcion-cliente.html` | operations | · | ✅ | · |  |
| 141 | `diagram/diagram/diagram-list/diagram-list.html` | operations | · | · | ✅ | No candidato (omitido) |
| 142 | `google-calendar/calendar/annual-maintenance-list/listado-anual-mantenimiento.html` | operations | · | · | ✅ | No candidato (calendario) |
| 143 | `google-calendar/google-calendar/google-calendar.html` | operations | · | · | ✅ | No candidato (calendario) |
| 144 | `inspection/inspection-list` | operations | ✅ | · | · |  |
| 145 | `inspection/logbook/mis-inspecciones-ejecutar.html` | operations | · | · | ✅ | No candidato (detalle) |
| 146 | `inspection/logbook/mis-inspecciones-lista.html` | operations | · | ✅ | · |  |
| 147 | `inventory/fire-extinguisher-inventory` | operations | ✅ | · | · |  |
| 148 | `inventory/hydrant-inventory` | operations | ✅ | · | · |  |
| 149 | `inventory/key-inventory` | operations | ✅ | · | · |  |
| 150 | `inventory/lighting-inventory` | operations | ✅ | · | · |  |
| 151 | `inventory/manual-call-point-inventory` | operations | ✅ | · | · |  |
| 152 | `inventory/paint-inventory` | operations | ✅ | · | · |  |
| 153 | `inventory/product-entry` | operations | ✅ | · | · |  |
| 154 | `inventory/product-exit` | operations | ✅ | · | · |  |
| 155 | `inventory/radio-communication-inventory` | operations | ✅ | · | · |  |
| 156 | `inventory/smoke-detector-inventory` | operations | ✅ | · | · |  |
| 157 | `inventory/stock-by-warehouse` | operations | ✅ | · | · |  |
| 158 | `inventory/warehouse` | operations | ✅ | · | · |  |
| 159 | `manuals/library/financial-report/informe-financiero-list.html` | operations | · | · | ✅ | No candidato (omitido) |
| 160 | `manuals/library/manuals-and-processes/manuals-and-processes-list.html` | operations | · | · | ✅ | No candidato (omitido) |
| 161 | `owner` | operations | ✅ | · | · |  |
| 162 | `properties` | operations | ✅ | · | · |  |
| 163 | `providers` | operations | ✅ | · | · |  |
| 164 | `reports/contracts-policies/contracts-policies.html` | operations | · | ✅ | · |  |
| 165 | `service-orders/service-order` | operations | ✅ | · | · |  |
| 166 | `supervision/supervision/area-minutes-filter/filtro-minutas-area.html` | operations | · | · | ✅ | No candidato (reportes/agendas) |
| 167 | `supervision/supervision/committee-meeting-presentations/presentaciones-juntas-comite.html` | operations | · | · | ✅ | No candidato (reportes/agendas) |
| 168 | `supervision/supervision/general-result-area-evaluation/resultado-general-evaluacion-areas-detalle.html` | operations | · | · | ✅ | No candidato (reportes/agendas) |
| 169 | `supervision/supervision/supervision-agenda/agenda-supervision.html` | operations | · | · | ✅ | No candidato (reportes/agendas) |
| 170 | `task/recurring-tasks/catalog/recurring-task-catalog-list` | operations | ✅ | · | · |  |
| 171 | `task/recurring-tasks/compliance/recurring-task-compliance-dashboard/recurring-task-compliance-dashboard.html` | operations | · | ✅ | · |  |
| 172 | `task/recurring-tasks/instances/task-instance-list` | operations | ✅ | · | · |  |
| 173 | `task/recurring-tasks/templates/task-template-items` | operations | ✅ | · | · |  |
| 174 | `task/recurring-tasks/templates/task-template-list` | operations | ✅ | · | · |  |
| 175 | `task/tasks/my-tasks` | operations | ✅ | · | · |  |
| 176 | `task/tasks/reports/task-operation-report.html` | operations | · | · | ✅ | No candidato (reporte) |
| 177 | `task/tasks/reports/task-report-work-plan.html` | operations | · | · | ✅ | No candidato (reporte) |
| 178 | `task/tasks/task-message` | operations | ✅ | · | · |  |
| 179 | `task/tasks/work-group` | operations | ✅ | · | · |  |
| 180 | `templates` | operations | ✅ | · | · |  |
| 181 | `work-positions` | operations | ✅ | · | · |  |
| 182 | `products/productos-list.html` | purchases | · | ✅ | · |  |
| 183 | `purchase-history/historial-compras-list.html` | purchases | · | ✅ | · |  |
| 184 | `purchase-orders/purchase-order/orden-compra-list.html` | purchases | · | ✅ | · |  |
| 185 | `purchase-requests/budget-statement/ordenes-compra-cedula-list.html` | purchases | · | ✅ | · |  |
| 186 | `purchase-requests/requests/solicitud-compra-list.html` | purchases | · | ✅ | · |  |
| 187 | `candidates/candidate-applications` | recruitment | ✅ | · | · |  |
| 188 | `candidates/candidate-core` | recruitment | ✅ | · | · |  |
| 189 | `candidates/candidate-interview` | recruitment | ✅ | · | · |  |
| 190 | `employee-bank-data-records/employee-bank-data-list.html` | recruitment | · | ✅ | · |  |
| 191 | `employee-beneficiaries/employee-beneficiary-list.html` | recruitment | · | ✅ | · |  |
| 192 | `employee-clinical-data-records/employee-clinical-data-list.html` | recruitment | · | ✅ | · |  |
| 193 | `employee-dismissal-requests/solicitud-baja-list.html` | recruitment | · | ✅ | · |  |
| 194 | `employee-emergency-contacts/employee-emergency-contact-list.html` | recruitment | · | ✅ | · |  |
| 195 | `employee-file/employees/employee-registry/employee-list.html` | recruitment | · | ✅ | · |  |
| 196 | `employee-file/human-resources/employee-bank-data/employee-bank-data-list.html` | recruitment | · | ✅ | · |  |
| 197 | `employee-file/human-resources/employee-beneficiary/employee-beneficiary-list.html` | recruitment | · | ✅ | · |  |
| 198 | `employee-file/human-resources/employee-registry/employee-file-list.html` | recruitment | · | ✅ | · |  |
| 199 | `employee-registration-requests/solicitud-alta-list.html` | recruitment | · | ✅ | · |  |
| 200 | `external-staffs/employee-external-list.html` | recruitment | · | ✅ | · |  |
| 201 | `provider-supports/provider-support.html` | recruitment | · | ✅ | · |  |
| 202 | `recruitment-requests/recruitment-client-requests/solicitudes-cliente-list.html` | recruitment | · | ✅ | · |  |
| 203 | `salary-modification-requests/solicitud-modificacion-list.html` | recruitment | · | ✅ | · |  |
| 204 | `vacancy-requests/vacantes-list.html` | recruitment | · | ✅ | · |  |
| 205 | `catalogs/banks` | shared | ✅ | · | · |  |
| 206 | `catalogs/cfdi-usage` | shared | ✅ | · | · |  |
| 207 | `catalogs/document-catalog` | shared | ✅ | · | · |  |
| 208 | `catalogs/onboarding-checklist-options` | shared | ✅ | · | · |  |
| 209 | `catalogs/payment-method` | shared | ✅ | · | · |  |
| 210 | `catalogs/payment-type` | shared | ✅ | · | · |  |
| 211 | `catalogs/recruitment-sources` | shared | ✅ | · | · |  |
| 212 | `catalogs/units-of-measurement` | shared | ✅ | · | · |  |
