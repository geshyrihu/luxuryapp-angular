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
| ✅ Refactorizado | **58** |
| ⏳ Pendiente | **123** |
| ⛔ Omitido / no candidato | **28** |
| **Total** | **209** |

---

| # | Módulo | Dominio | ✅ Refactorizado | ⏳ Pendiente | ⛔ Omitido | Nota |
|:---:|---|:---:|:---:|:---:|:---:|---|
| 1 | `accounting-catalogs/aspel-customer-company/aspel-customer-empresa-list.html` | accounting | · | ✅ | · |  |
| 2 | `accounting-catalogs/aspel-mirror/projected-expenses-list.html` | accounting | · | ✅ | · |  |
| 3 | `accounting-catalogs/fixed-expense-catalogs/catalogo-gastos-fijos-list.html` | accounting | · | ✅ | · |  |
| 4 | `fundings/funding` | accounting | ✅ | · | · |  |
| 5 | `fundings/funding-accounting` | accounting | ✅ | · | · |  |
| 6 | `fundings/sat-funding/sat-funding-list` | accounting | ✅ | · | · |  |
| 7 | `general-ledger/accounting-accounts` | accounting | ✅ | · | · |  |
| 8 | `general-ledger/accounting-catalog` | accounting | ✅ | · | · |  |
| 9 | `general-ledger/aspel-customer-company/aspel-customer-empresa-list.html` | accounting | · | ✅ | · |  |
| 10 | `general-ledger/aspel-mirror/projected-expenses-list.html` | accounting | · | ✅ | · |  |
| 11 | `general-ledger/aspel-web-budget` | accounting | ✅ | · | · |  |
| 12 | `general-ledger/budget-proposals/budget-rule-list/budget-rule-list.html` | accounting | · | · | ✅ | Protegido: autorización Ing. Ricardo Marques |
| 13 | `general-ledger/dynamic-reports/report-catalog/report-catalog.html` | accounting | · | · | ✅ | Página con tabs + 2 listas (caso especial) |
| 14 | `general-ledger/financial-reports/client/client-accounting-budget/presupuesto-contabilidad-cliente.html` | accounting | · | · | ✅ | Reporte denso (evaluar aparte) |
| 15 | `general-ledger/financial-reports/client/client-budget-statement/cedula-presupuestal-cliente.html` | accounting | · | · | ✅ | Reporte denso (evaluar aparte) |
| 16 | `general-ledger/financial-reports/client/client-collection-analysis/analisis-cobranza-cliente.html` | accounting | · | · | ✅ | Reporte denso (evaluar aparte) |
| 17 | `general-ledger/financial-reports/client/client-income-statement-v2/estado-resultados-v2-cliente.html` | accounting | · | · | ✅ | Reporte denso (evaluar aparte) |
| 18 | `general-ledger/financial-reports/client/client-income-statement/estado-resultados-cliente.html` | accounting | · | · | ✅ | Reporte denso (evaluar aparte) |
| 19 | `general-ledger/financial-reports/online/accounting-budget/presupuesto-contabilidad.html` | accounting | · | · | ✅ | Reporte denso (evaluar aparte) |
| 20 | `general-ledger/financial-reports/online/banks-investments/bancos-inversiones.html` | accounting | · | · | ✅ | Reporte denso (evaluar aparte) |
| 21 | `general-ledger/financial-reports/online/budget-statement/cedula-presupuestal.html` | accounting | · | · | ✅ | Reporte denso (evaluar aparte) |
| 22 | `general-ledger/financial-reports/online/extraordinary-results/resultados-extraordinarios.html` | accounting | · | · | ✅ | Reporte denso (evaluar aparte) |
| 23 | `general-ledger/financial-reports/online/income-statement-v2/estado-resultados-v2.html` | accounting | · | · | ✅ | Reporte denso (evaluar aparte) |
| 24 | `general-ledger/financial-reports/online/income-statement/estado-resultados.html` | accounting | · | · | ✅ | Reporte denso (evaluar aparte) |
| 25 | `general-ledger/financial-reports/online/monthly-balance/balance-mensual.html` | accounting | · | · | ✅ | Reporte denso (evaluar aparte) |
| 26 | `general-ledger/financial-statements` | accounting | ✅ | · | · |  |
| 27 | `general-ledger/fixed-expense-catalogs/catalogo-gastos-fijos-list.html` | accounting | · | ✅ | · |  |
| 28 | `general-ledger/funding-accounting/funding-accounting-list.html` | accounting | · | ✅ | · |  |
| 29 | `general-ledger/pending-minutes` | accounting | ✅ | · | · |  |
| 30 | `email-configuration/customer-data-companies/customer-data-company-list.html` | admin | · | ✅ | · |  |
| 31 | `email-configuration/email-data/email-data-list.html` | admin | · | ✅ | · |  |
| 32 | `reports/customer-provider/mis-proveedores-list.html` | admin | · | ✅ | · |  |
| 33 | `security-permissions/application-roles/roles-list.html` | admin | · | ✅ | · |  |
| 34 | `security-permissions/customer-locations/customer-location-list.html` | admin | · | ✅ | · |  |
| 35 | `security-permissions/customer-modules/customer-modul-list.html` | admin | · | ✅ | · |  |
| 36 | `security-permissions/customer/customer-list.html` | admin | · | ✅ | · |  |
| 37 | `security-permissions/module-app-roles/module-app-rol-list.html` | admin | · | ✅ | · |  |
| 38 | `security-permissions/module-apps/module-app-list.html` | admin | · | ✅ | · |  |
| 39 | `system-audit-logs/audit-entries/audit-entries.html` | admin | · | ✅ | · |  |
| 40 | `system-audit-logs/log-api-report/log-api-report.html` | admin | · | ✅ | · |  |
| 41 | `system-audit-logs/user-activity-history/user-activity-history.html` | admin | · | ✅ | · |  |
| 42 | `system-configuration/assembly-checklist-templates/asamblea-checklist-template-list.html` | admin | · | ✅ | · |  |
| 43 | `system-configuration/database-backup/database-backup-list.html` | admin | · | ✅ | · |  |
| 44 | `system-configuration/knowledge-base/ai-knowledge-base-list.html` | admin | · | ✅ | · |  |
| 45 | `system-configuration/vault-secrets/vault-secrets-list.html` | admin | · | ✅ | · |  |
| 46 | `password-manager/password-list.html` | auth | · | ✅ | · |  |
| 47 | `native-collections/core/approvals/approval-inbox.html` | collections | · | ✅ | · |  |
| 48 | `native-collections/core/audit/financial-audit-log.html` | collections | · | ✅ | · |  |
| 49 | `native-collections/core/charge-templates/charge-template-list.html` | collections | · | ✅ | · |  |
| 50 | `native-collections/core/charge-types/charge-type-list.html` | collections | · | ✅ | · |  |
| 51 | `native-collections/core/charges/charge-list.html` | collections | · | ✅ | · |  |
| 52 | `native-collections/core/collection-cases/collection-case-list.html` | collections | · | ✅ | · |  |
| 53 | `native-collections/core/initial-balance/initial-balance.html` | collections | · | ✅ | · |  |
| 54 | `native-collections/core/invoices/invoice-list.html` | collections | · | ✅ | · |  |
| 55 | `native-collections/core/late-fee-policies/late-fee-policy-list.html` | collections | · | ✅ | · |  |
| 56 | `native-collections/core/ledger/ledger-viewer.html` | collections | · | ✅ | · |  |
| 57 | `native-collections/core/members/member-list.html` | collections | · | ✅ | · |  |
| 58 | `native-collections/core/payments/payment-list.html` | collections | · | ✅ | · |  |
| 59 | `native-collections/core/period-closures/period-closure-dashboard.html` | collections | · | ✅ | · |  |
| 60 | `native-collections/core/property-fines/property-fine-list.html` | collections | · | ✅ | · |  |
| 61 | `native-collections/core/reconciliation/reconciliation-dashboard.html` | collections | · | ✅ | · |  |
| 62 | `native-collections/core/regulation-articles/regulation-article-list.html` | collections | · | ✅ | · |  |
| 63 | `online-collections/condo-owners-detail/cobranza-online-detalle-condominos.html` | collections | · | ✅ | · |  |
| 64 | `online-collections/exclusions/cobranza-online-exclusions.html` | collections | · | ✅ | · |  |
| 65 | `online-collections/inspection/cobranza-online-inspection.html` | collections | · | ✅ | · |  |
| 66 | `online-collections/other-charges/cobranza-online-otros-cargos.html` | collections | · | ✅ | · |  |
| 67 | `online-collections/towers/cobranza-online-towers.html` | collections | · | ✅ | · |  |
| 68 | `online-collections/transactions/cobranza-online-movimientos.html` | collections | · | ✅ | · |  |
| 69 | `employee-time-clock/chekador-list.html` | human-resources | · | ✅ | · |  |
| 70 | `evaluation/evaluation-template/lista-plantilla-evaluacion.html` | human-resources | · | ✅ | · |  |
| 71 | `evaluation/evaluation-template/performance-evaluation/lista-evaluacion-realizada.html` | human-resources | · | ✅ | · |  |
| 72 | `hr-admin/incident-type-list/incident-type-list.html` | human-resources | · | ✅ | · |  |
| 73 | `hr-admin/sanction-type-list/sanction-type-list.html` | human-resources | · | ✅ | · |  |
| 74 | `payroll/details/nomina-detalle.html` | human-resources | · | ✅ | · |  |
| 75 | `payroll/headers/nominas.html` | human-resources | · | ✅ | · |  |
| 76 | `payroll/incidents/incidencias-nomina.html` | human-resources | · | ✅ | · |  |
| 77 | `payroll/loans/prestamos-empleado.html` | human-resources | · | ✅ | · |  |
| 78 | `payroll/overtime/tiempo-extra.html` | human-resources | · | ✅ | · |  |
| 79 | `payroll/periods/periodos-nomina.html` | human-resources | · | ✅ | · |  |
| 80 | `time-off/admin-vacaciones-balance/admin-vacaciones-balance.html` | human-resources | · | ✅ | · |  |
| 81 | `time-off/leave-request/mis-permisos-listado.html` | human-resources | · | ✅ | · |  |
| 82 | `time-off/my-vacation-requests/mis-vacaciones-listado.html` | human-resources | · | ✅ | · |  |
| 83 | `time-off/request-history/solicitudes-historial.html` | human-resources | · | ✅ | · |  |
| 84 | `employee-contracts/addendum-template/addendum-template-list.html` | legal | · | ✅ | · |  |
| 85 | `employee-contracts/contract-addendum/contract-addendum-list.html` | legal | · | ✅ | · |  |
| 86 | `employee-contracts/contract-template/contract-template-list.html` | legal | · | ✅ | · |  |
| 87 | `employee-contracts/work-contract/work-contract-list.html` | legal | · | ✅ | · |  |
| 88 | `legal/custom-documents/documento-personalizado-lista.html` | legal | · | ✅ | · |  |
| 89 | `legal/legal-matter/asunto-legal-lista.html` | legal | · | ✅ | · |  |
| 90 | `legal/legal-tickets/ticket-legal-lista-cliente.html` | legal | · | ✅ | · |  |
| 91 | `legal/legal-tickets/ticket-legal-lista.html` | legal | · | ✅ | · |  |
| 92 | `legal/legal-tickets/ticket-legal-reportes-externos.html` | legal | · | ✅ | · |  |
| 93 | `legal/legal-tickets/ticket-legal-reportes-internos.html` | legal | · | ✅ | · |  |
| 94 | `legal/legal-tickets/ticket-legal-reportes-pendientes.html` | legal | · | ✅ | · |  |
| 95 | `legal/meeting-minutes/legal-pendientes-minuta.html` | legal | · | ✅ | · |  |
| 96 | `vigilance-committees/comite-vigilancia-list.html` | legal | · | ✅ | · |  |
| 97 | `vigilance-committees/comites-list.html` | legal | · | ✅ | · |  |
| 98 | `fire-equipment/extinguisher-log/extintor-bitacora-list.html` | maintenance | · | ✅ | · |  |
| 99 | `fire-equipment/hydrant-log/hidrante-bitacora-list.html` | maintenance | · | ✅ | · |  |
| 100 | `fire-equipment/manual-call-point-log/estacion-manual-bitacora-list.html` | maintenance | · | ✅ | · |  |
| 101 | `fire-equipment/smoke-detector-log/detector-humo-bitacora-list.html` | maintenance | · | ✅ | · |  |
| 102 | `logs/elevator-emergency-call/elevators-emergency-call-list.html` | maintenance | · | ✅ | · |  |
| 103 | `logs/elevator-spare-parts/elevator-spare-parts-change-list.html` | maintenance | · | ✅ | · |  |
| 104 | `logs/logbooks/meters/medidor-lectura-list.html` | maintenance | · | ✅ | · |  |
| 105 | `logs/logbooks/meters/medidores-list.html` | maintenance | · | ✅ | · |  |
| 106 | `logs/logbooks/tool-loan/prestamo-herramientas-control.html` | maintenance | · | ✅ | · |  |
| 107 | `logs/maintenance-log/bitacora-individual.html` | maintenance | · | ✅ | · |  |
| 108 | `logs/maintenance-log/bitacora-mantenimiento.html` | maintenance | · | ✅ | · |  |
| 109 | `logs/pool-logbook/piscina-bitacora-list.html` | maintenance | · | ✅ | · |  |
| 110 | `logs/pool/piscina-list.html` | maintenance | · | ✅ | · |  |
| 111 | `logs/tool-loan/tool-list.html` | maintenance | · | ✅ | · |  |
| 112 | `logs/water-truck-receipts/recepcion-pipas-agua-list.html` | maintenance | · | ✅ | · |  |
| 113 | `machinery/equipment-content/equipment-content-list.html` | maintenance | · | ✅ | · |  |
| 114 | `machinery/machinery/equipos-list.html` | maintenance | · | ✅ | · |  |
| 115 | `maintenance-planning/maintenance-calendar-master/calendario-maestro-lista.html` | maintenance | · | ✅ | · |  |
| 116 | `maintenance-planning/master-equipment-calendar/calendario-maestro-equipo.html` | maintenance | · | ✅ | · |  |
| 117 | `maintenance-reports/maintenance-reports-list.html` | maintenance | · | ✅ | · |  |
| 118 | `maintenance-ticket-catalogs/asset-catalog-list` | maintenance | ✅ | · | · |  |
| 119 | `maintenance-ticket-catalogs/delivery-reception-catalog` | maintenance | ✅ | · | · |  |
| 120 | `maintenance-ticket-catalogs/inspection-revision-catalog` | maintenance | ✅ | · | · |  |
| 121 | `maintenance-ticket-catalogs/machinery-classification` | maintenance | ✅ | · | · |  |
| 122 | `maintenance-ticket-catalogs/meter-category` | maintenance | ✅ | · | · |  |
| 123 | `maintenance-ticket-catalogs/product-category` | maintenance | ✅ | · | · |  |
| 124 | `maintenance-ticket-catalogs/task-group-category-list` | maintenance | ✅ | · | · |  |
| 125 | `monthly-meetings/meeting-minutes/resumen-minuta.html` | management | · | ✅ | · |  |
| 126 | `monthly-meetings/meeting-minutes/seguimiento-minutas.html` | management | · | ✅ | · |  |
| 127 | `monthly-meetings/presentation/presentacion-junta-comite-contador.html` | management | · | ✅ | · |  |
| 128 | `monthly-meetings/presentation/presentacion-junta-comite.html` | management | · | ✅ | · |  |
| 129 | `administrative-incidents/incident` | operations | ✅ | · | · |  |
| 130 | `administrative-incidents/sanction` | operations | ✅ | · | · |  |
| 131 | `announcements/announcement` | operations | ✅ | · | · |  |
| 132 | `custom-documents/custom-document` | operations | ✅ | · | · |  |
| 133 | `custom-documents/custom-document/policy-contract` | operations | ✅ | · | · |  |
| 134 | `customer-providers` | operations | ✅ | · | · |  |
| 135 | `dashboard/unified-pending-dashboard-mobile.html` | operations | · | · | ✅ | No candidato (dashboard) |
| 136 | `dashboard/unified-pending-dashboard.html` | operations | · | · | ✅ | No candidato (dashboard) |
| 137 | `delivery-receptions/client-delivery-reception/entrega-recepcion-cliente.html` | operations | · | ✅ | · |  |
| 138 | `diagram/diagram/diagram-list/diagram-list.html` | operations | · | · | ✅ | No candidato (omitido) |
| 139 | `google-calendar/calendar/annual-maintenance-list/listado-anual-mantenimiento.html` | operations | · | · | ✅ | No candidato (calendario) |
| 140 | `google-calendar/google-calendar/google-calendar.html` | operations | · | · | ✅ | No candidato (calendario) |
| 141 | `inspection/inspection-list` | operations | ✅ | · | · |  |
| 142 | `inspection/logbook/mis-inspecciones-ejecutar.html` | operations | · | · | ✅ | No candidato (detalle) |
| 143 | `inspection/logbook/mis-inspecciones-lista.html` | operations | · | ✅ | · |  |
| 144 | `inventory/fire-extinguisher-inventory` | operations | ✅ | · | · |  |
| 145 | `inventory/hydrant-inventory` | operations | ✅ | · | · |  |
| 146 | `inventory/key-inventory` | operations | ✅ | · | · |  |
| 147 | `inventory/lighting-inventory` | operations | ✅ | · | · |  |
| 148 | `inventory/manual-call-point-inventory` | operations | ✅ | · | · |  |
| 149 | `inventory/paint-inventory` | operations | ✅ | · | · |  |
| 150 | `inventory/product-entry` | operations | ✅ | · | · |  |
| 151 | `inventory/product-exit` | operations | ✅ | · | · |  |
| 152 | `inventory/radio-communication-inventory` | operations | ✅ | · | · |  |
| 153 | `inventory/smoke-detector-inventory` | operations | ✅ | · | · |  |
| 154 | `inventory/stock-by-warehouse` | operations | ✅ | · | · |  |
| 155 | `inventory/warehouse` | operations | ✅ | · | · |  |
| 156 | `manuals/library/financial-report/informe-financiero-list.html` | operations | · | · | ✅ | No candidato (omitido) |
| 157 | `manuals/library/manuals-and-processes/manuals-and-processes-list.html` | operations | · | · | ✅ | No candidato (omitido) |
| 158 | `owner` | operations | ✅ | · | · |  |
| 159 | `properties` | operations | ✅ | · | · |  |
| 160 | `providers` | operations | ✅ | · | · |  |
| 161 | `reports/contracts-policies/contracts-policies.html` | operations | · | ✅ | · |  |
| 162 | `service-orders/service-order` | operations | ✅ | · | · |  |
| 163 | `supervision/supervision/area-minutes-filter/filtro-minutas-area.html` | operations | · | · | ✅ | No candidato (reportes/agendas) |
| 164 | `supervision/supervision/committee-meeting-presentations/presentaciones-juntas-comite.html` | operations | · | · | ✅ | No candidato (reportes/agendas) |
| 165 | `supervision/supervision/general-result-area-evaluation/resultado-general-evaluacion-areas-detalle.html` | operations | · | · | ✅ | No candidato (reportes/agendas) |
| 166 | `supervision/supervision/supervision-agenda/agenda-supervision.html` | operations | · | · | ✅ | No candidato (reportes/agendas) |
| 167 | `task/recurring-tasks/catalog/recurring-task-catalog-list` | operations | ✅ | · | · |  |
| 168 | `task/recurring-tasks/compliance/recurring-task-compliance-dashboard/recurring-task-compliance-dashboard.html` | operations | · | ✅ | · |  |
| 169 | `task/recurring-tasks/instances/task-instance-list` | operations | ✅ | · | · |  |
| 170 | `task/recurring-tasks/templates/task-template-items` | operations | ✅ | · | · |  |
| 171 | `task/recurring-tasks/templates/task-template-list` | operations | ✅ | · | · |  |
| 172 | `task/tasks/my-tasks` | operations | ✅ | · | · |  |
| 173 | `task/tasks/reports/task-operation-report.html` | operations | · | · | ✅ | No candidato (reporte) |
| 174 | `task/tasks/reports/task-report-work-plan.html` | operations | · | · | ✅ | No candidato (reporte) |
| 175 | `task/tasks/task-message` | operations | ✅ | · | · |  |
| 176 | `task/tasks/work-group` | operations | ✅ | · | · |  |
| 177 | `templates` | operations | ✅ | · | · |  |
| 178 | `work-positions` | operations | ✅ | · | · |  |
| 179 | `products/productos-list.html` | purchases | · | ✅ | · |  |
| 180 | `purchase-history/historial-compras-list.html` | purchases | · | ✅ | · |  |
| 181 | `purchase-orders/purchase-order/orden-compra-list.html` | purchases | · | ✅ | · |  |
| 182 | `purchase-requests/budget-statement/ordenes-compra-cedula-list.html` | purchases | · | ✅ | · |  |
| 183 | `purchase-requests/requests/solicitud-compra-list.html` | purchases | · | ✅ | · |  |
| 184 | `candidates/candidate-applications` | recruitment | ✅ | · | · |  |
| 185 | `candidates/candidate-core` | recruitment | ✅ | · | · |  |
| 186 | `candidates/candidate-interview` | recruitment | ✅ | · | · |  |
| 187 | `employee-bank-data-records/employee-bank-data-list.html` | recruitment | · | ✅ | · |  |
| 188 | `employee-beneficiaries/employee-beneficiary-list.html` | recruitment | · | ✅ | · |  |
| 189 | `employee-clinical-data-records/employee-clinical-data-list.html` | recruitment | · | ✅ | · |  |
| 190 | `employee-dismissal-requests/solicitud-baja-list.html` | recruitment | · | ✅ | · |  |
| 191 | `employee-emergency-contacts/employee-emergency-contact-list.html` | recruitment | · | ✅ | · |  |
| 192 | `employee-file/employees/employee-registry/employee-list.html` | recruitment | · | ✅ | · |  |
| 193 | `employee-file/human-resources/employee-bank-data/employee-bank-data-list.html` | recruitment | · | ✅ | · |  |
| 194 | `employee-file/human-resources/employee-beneficiary/employee-beneficiary-list.html` | recruitment | · | ✅ | · |  |
| 195 | `employee-file/human-resources/employee-registry/employee-file-list.html` | recruitment | · | ✅ | · |  |
| 196 | `employee-registration-requests/solicitud-alta-list.html` | recruitment | · | ✅ | · |  |
| 197 | `external-staffs/employee-external-list.html` | recruitment | · | ✅ | · |  |
| 198 | `provider-supports/provider-support.html` | recruitment | · | ✅ | · |  |
| 199 | `recruitment-requests/recruitment-client-requests/solicitudes-cliente-list.html` | recruitment | · | ✅ | · |  |
| 200 | `salary-modification-requests/solicitud-modificacion-list.html` | recruitment | · | ✅ | · |  |
| 201 | `vacancy-requests/vacantes-list.html` | recruitment | · | ✅ | · |  |
| 202 | `catalogs/banks` | shared | ✅ | · | · |  |
| 203 | `catalogs/cfdi-usage` | shared | ✅ | · | · |  |
| 204 | `catalogs/document-catalog` | shared | ✅ | · | · |  |
| 205 | `catalogs/onboarding-checklist-options` | shared | ✅ | · | · |  |
| 206 | `catalogs/payment-method` | shared | ✅ | · | · |  |
| 207 | `catalogs/payment-type` | shared | ✅ | · | · |  |
| 208 | `catalogs/recruitment-sources` | shared | ✅ | · | · |  |
| 209 | `catalogs/units-of-measurement` | shared | ✅ | · | · |  |
