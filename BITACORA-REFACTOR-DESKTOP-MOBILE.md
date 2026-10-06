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
| ✅ Refactorizado | **158** |
| ⏳ Pendiente | **0** |
| ⛔ Omitido / no candidato | **52** |
| **Total** | **210** |

---

| # | Módulo | Dominio | ✅ Refactorizado | ⏳ Pendiente | ⛔ Omitido | Nota |
|:---:|---|:---:|:---:|:---:|:---:|---|
| 1 | `accounting-catalogs/aspel-customer-company` | accounting | ✅ | · | · |  |
| 2 | `accounting-catalogs/aspel-mirror` | accounting | ✅ | · | · |  |
| 3 | `accounting-catalogs/fixed-expense-catalogs` | accounting | ✅ | · | · |  |
| 4 | `cfdi-download/cfdi-list` | accounting | ✅ | · | · |  |
| 5 | `fundings/funding` | accounting | ✅ | · | · |  |
| 6 | `fundings/funding-accounting` | accounting | ✅ | · | · |  |
| 7 | `fundings/sat-funding/sat-funding-list` | accounting | ✅ | · | · |  |
| 8 | `general-ledger/accounting-accounts` | accounting | ✅ | · | · |  |
| 9 | `general-ledger/accounting-catalog` | accounting | ✅ | · | · |  |
| 10 | `general-ledger/aspel-customer-company/aspel-customer-empresa-list.html` | accounting | · | · | ✅ | Código muerto (comentado, sin rutas) |
| 11 | `general-ledger/aspel-mirror` | accounting | ✅ | · | · |  |
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
| 28 | `general-ledger/fixed-expense-catalogs/catalogo-gastos-fijos-list.html` | accounting | · | · | ✅ | Código muerto (comentado, sin rutas) |
| 29 | `general-ledger/funding-accounting` | accounting | ✅ | · | · |  |
| 30 | `general-ledger/pending-minutes` | accounting | ✅ | · | · |  |
| 31 | `email-configuration/customer-data-companies` | admin | ✅ | · | · |  |
| 32 | `email-configuration/email-data` | admin | ✅ | · | · |  |
| 33 | `reports/customer-provider` | admin | ✅ | · | · |  |
| 34 | `security-permissions/application-roles` | admin | ✅ | · | · |  |
| 35 | `security-permissions/customer` | admin | ✅ | · | · |  |
| 36 | `security-permissions/customer-locations` | admin | ✅ | · | · |  |
| 37 | `security-permissions/customer-modules` | admin | ✅ | · | · |  |
| 38 | `security-permissions/module-app-roles` | admin | ✅ | · | · |  |
| 39 | `security-permissions/module-apps` | admin | ✅ | · | · |  |
| 40 | `system-audit-logs/audit-entries` | admin | ✅ | · | · |  |
| 41 | `system-audit-logs/log-api-report` | admin | ✅ | · | · |  |
| 42 | `system-audit-logs/user-activity-history` | admin | ✅ | · | · |  |
| 43 | `system-configuration/assembly-checklist-templates` | admin | ✅ | · | · |  |
| 44 | `system-configuration/database-backup` | admin | ✅ | · | · |  |
| 45 | `system-configuration/knowledge-base` | admin | ✅ | · | · |  |
| 46 | `system-configuration/vault-secrets` | admin | ✅ | · | · |  |
| 47 | `password-manager` | auth | ✅ | · | · |  |
| 48 | `native-collections/core/approvals/approval-inbox.html` | collections | · | · | ✅ | Omitido por decisión |
| 49 | `native-collections/core/audit/financial-audit-log.html` | collections | · | · | ✅ | Omitido por decisión |
| 50 | `native-collections/core/charge-templates/charge-template-list.html` | collections | · | · | ✅ | Omitido por decisión |
| 51 | `native-collections/core/charge-types/charge-type-list.html` | collections | · | · | ✅ | Omitido por decisión |
| 52 | `native-collections/core/charges/charge-list.html` | collections | · | · | ✅ | Omitido por decisión |
| 53 | `native-collections/core/collection-cases/collection-case-list.html` | collections | · | · | ✅ | Omitido por decisión |
| 54 | `native-collections/core/initial-balance/initial-balance.html` | collections | · | · | ✅ | Omitido por decisión |
| 55 | `native-collections/core/invoices/invoice-list.html` | collections | · | · | ✅ | Omitido por decisión |
| 56 | `native-collections/core/late-fee-policies/late-fee-policy-list.html` | collections | · | · | ✅ | Omitido por decisión |
| 57 | `native-collections/core/ledger/ledger-viewer.html` | collections | · | · | ✅ | Omitido por decisión |
| 58 | `native-collections/core/members/member-list.html` | collections | · | · | ✅ | Omitido por decisión |
| 59 | `native-collections/core/payments/payment-list.html` | collections | · | · | ✅ | Omitido por decisión |
| 60 | `native-collections/core/period-closures/period-closure-dashboard.html` | collections | · | · | ✅ | Omitido por decisión |
| 61 | `native-collections/core/property-fines/property-fine-list.html` | collections | · | · | ✅ | Omitido por decisión |
| 62 | `native-collections/core/reconciliation/reconciliation-dashboard.html` | collections | · | · | ✅ | Omitido por decisión |
| 63 | `native-collections/core/regulation-articles/regulation-article-list.html` | collections | · | · | ✅ | Omitido por decisión |
| 64 | `online-collections/condo-owners-detail/cobranza-online-detalle-condominos.html` | collections | · | · | ✅ | Omitido por decisión |
| 65 | `online-collections/exclusions/cobranza-online-exclusions.html` | collections | · | · | ✅ | Omitido por decisión |
| 66 | `online-collections/inspection/cobranza-online-inspection.html` | collections | · | · | ✅ | Omitido por decisión |
| 67 | `online-collections/other-charges/cobranza-online-otros-cargos.html` | collections | · | · | ✅ | Omitido por decisión |
| 68 | `online-collections/towers/cobranza-online-towers.html` | collections | · | · | ✅ | Omitido por decisión |
| 69 | `online-collections/transactions/cobranza-online-movimientos.html` | collections | · | · | ✅ | Omitido por decisión |
| 70 | `employee-time-clock` | human-resources | ✅ | · | · |  |
| 71 | `evaluation/evaluation-template` | human-resources | ✅ | · | · |  |
| 72 | `evaluation/evaluation-template/performance-evaluation` | human-resources | ✅ | · | · |  |
| 73 | `hr-admin/incident-type-list` | human-resources | ✅ | · | · |  |
| 74 | `hr-admin/sanction-type-list` | human-resources | ✅ | · | · |  |
| 75 | `payroll/details` | human-resources | ✅ | · | · |  |
| 76 | `payroll/details/nomina-detalle` | human-resources | ✅ | · | · |  |
| 77 | `payroll/headers` | human-resources | ✅ | · | · |  |
| 78 | `payroll/headers/nominas` | human-resources | ✅ | · | · |  |
| 79 | `payroll/incidents` | human-resources | ✅ | · | · |  |
| 80 | `payroll/incidents/incidencias-nomina` | human-resources | ✅ | · | · |  |
| 81 | `payroll/loans` | human-resources | ✅ | · | · |  |
| 82 | `payroll/loans/prestamos-empleado` | human-resources | ✅ | · | · |  |
| 83 | `payroll/overtime` | human-resources | ✅ | · | · |  |
| 84 | `payroll/overtime/tiempo-extra` | human-resources | ✅ | · | · |  |
| 85 | `payroll/periods` | human-resources | ✅ | · | · |  |
| 86 | `payroll/periods/periodos-nomina` | human-resources | ✅ | · | · |  |
| 87 | `time-off/admin-vacaciones-balance` | human-resources | ✅ | · | · |  |
| 88 | `time-off/leave-request` | human-resources | ✅ | · | · |  |
| 89 | `time-off/my-vacation-requests` | human-resources | ✅ | · | · |  |
| 90 | `time-off/request-history` | human-resources | ✅ | · | · |  |
| 91 | `employee-contracts/addendum-template` | legal | ✅ | · | · |  |
| 92 | `employee-contracts/contract-addendum` | legal | ✅ | · | · |  |
| 93 | `employee-contracts/contract-template` | legal | ✅ | · | · |  |
| 94 | `employee-contracts/work-contract` | legal | ✅ | · | · |  |
| 95 | `legal/custom-documents` | legal | ✅ | · | · |  |
| 96 | `legal/legal-matter` | legal | ✅ | · | · |  |
| 97 | `legal/legal-tickets` | legal | ✅ | · | · |  |
| 98 | `legal/meeting-minutes` | legal | ✅ | · | · |  |
| 99 | `vigilance-committees` | legal | ✅ | · | · |  |
| 100 | `fire-equipment/extinguisher-log` | maintenance | ✅ | · | · |  |
| 101 | `fire-equipment/extinguisher-log/extintor-bitacora-list` | maintenance | ✅ | · | · |  |
| 102 | `fire-equipment/hydrant-log` | maintenance | ✅ | · | · |  |
| 103 | `fire-equipment/hydrant-log/hidrante-bitacora-list` | maintenance | ✅ | · | · |  |
| 104 | `fire-equipment/manual-call-point-log` | maintenance | ✅ | · | · |  |
| 105 | `fire-equipment/manual-call-point-log/estacion-manual-bitacora-list` | maintenance | ✅ | · | · |  |
| 106 | `fire-equipment/smoke-detector-log` | maintenance | ✅ | · | · |  |
| 107 | `fire-equipment/smoke-detector-log/detector-humo-bitacora-list` | maintenance | ✅ | · | · |  |
| 108 | `logs/elevator-emergency-call` | maintenance | ✅ | · | · |  |
| 109 | `logs/elevator-spare-parts` | maintenance | ✅ | · | · |  |
| 110 | `logs/logbooks/meters` | maintenance | ✅ | · | · |  |
| 111 | `logs/logbooks/tool-loan` | maintenance | ✅ | · | · |  |
| 112 | `logs/maintenance-log` | maintenance | ✅ | · | · |  |
| 113 | `logs/pool` | maintenance | ✅ | · | · |  |
| 114 | `logs/pool-logbook` | maintenance | ✅ | · | · |  |
| 115 | `logs/tool-loan` | maintenance | ✅ | · | · |  |
| 116 | `logs/water-truck-receipts` | maintenance | ✅ | · | · |  |
| 117 | `machinery/equipment-content` | maintenance | ✅ | · | · |  |
| 118 | `machinery/machinery` | maintenance | ✅ | · | · |  |
| 119 | `maintenance-planning/maintenance-calendar-master` | maintenance | ✅ | · | · |  |
| 120 | `maintenance-planning/master-equipment-calendar` | maintenance | ✅ | · | · |  |
| 121 | `maintenance-reports` | maintenance | ✅ | · | · |  |
| 122 | `maintenance-ticket-catalogs/asset-catalog-list` | maintenance | ✅ | · | · |  |
| 123 | `maintenance-ticket-catalogs/delivery-reception-catalog` | maintenance | ✅ | · | · |  |
| 124 | `maintenance-ticket-catalogs/inspection-revision-catalog` | maintenance | ✅ | · | · |  |
| 125 | `maintenance-ticket-catalogs/machinery-classification` | maintenance | ✅ | · | · |  |
| 126 | `maintenance-ticket-catalogs/meter-category` | maintenance | ✅ | · | · |  |
| 127 | `maintenance-ticket-catalogs/product-category` | maintenance | ✅ | · | · |  |
| 128 | `maintenance-ticket-catalogs/task-group-category-list` | maintenance | ✅ | · | · |  |
| 129 | `monthly-meetings/meeting-minutes` | management | ✅ | · | · |  |
| 130 | `monthly-meetings/presentation` | management | ✅ | · | · |  |
| 131 | `administrative-incidents/incident` | operations | ✅ | · | · |  |
| 132 | `administrative-incidents/sanction` | operations | ✅ | · | · |  |
| 133 | `announcements/announcement` | operations | ✅ | · | · |  |
| 134 | `custom-documents/custom-document` | operations | ✅ | · | · |  |
| 135 | `custom-documents/custom-document/policy-contract` | operations | ✅ | · | · |  |
| 136 | `customer-providers` | operations | ✅ | · | · |  |
| 137 | `dashboard/unified-pending-dashboard-mobile.html` | operations | · | · | ✅ | No candidato (dashboard) |
| 138 | `dashboard/unified-pending-dashboard.html` | operations | · | · | ✅ | No candidato (dashboard) |
| 139 | `delivery-receptions/client-delivery-reception` | operations | ✅ | · | · |  |
| 140 | `diagram/diagram/diagram-list/diagram-list.html` | operations | · | · | ✅ | No candidato (omitido) |
| 141 | `google-calendar/calendar/annual-maintenance-list/listado-anual-mantenimiento.html` | operations | · | · | ✅ | No candidato (calendario) |
| 142 | `google-calendar/google-calendar/google-calendar.html` | operations | · | · | ✅ | No candidato (calendario) |
| 143 | `inspection/inspection-list` | operations | ✅ | · | · |  |
| 144 | `inspection/logbook` | operations | ✅ | · | · |  |
| 145 | `inventory/fire-extinguisher-inventory` | operations | ✅ | · | · |  |
| 146 | `inventory/hydrant-inventory` | operations | ✅ | · | · |  |
| 147 | `inventory/key-inventory` | operations | ✅ | · | · |  |
| 148 | `inventory/lighting-inventory` | operations | ✅ | · | · |  |
| 149 | `inventory/manual-call-point-inventory` | operations | ✅ | · | · |  |
| 150 | `inventory/paint-inventory` | operations | ✅ | · | · |  |
| 151 | `inventory/product-entry` | operations | ✅ | · | · |  |
| 152 | `inventory/product-exit` | operations | ✅ | · | · |  |
| 153 | `inventory/radio-communication-inventory` | operations | ✅ | · | · |  |
| 154 | `inventory/smoke-detector-inventory` | operations | ✅ | · | · |  |
| 155 | `inventory/stock-by-warehouse` | operations | ✅ | · | · |  |
| 156 | `inventory/warehouse` | operations | ✅ | · | · |  |
| 157 | `manuals/library/financial-report/informe-financiero-list.html` | operations | · | · | ✅ | No candidato (omitido) |
| 158 | `manuals/library/manuals-and-processes/manuals-and-processes-list.html` | operations | · | · | ✅ | No candidato (omitido) |
| 159 | `owner` | operations | ✅ | · | · |  |
| 160 | `properties` | operations | ✅ | · | · |  |
| 161 | `providers` | operations | ✅ | · | · |  |
| 162 | `reports/contracts-policies` | operations | ✅ | · | · |  |
| 163 | `service-orders/service-order` | operations | ✅ | · | · |  |
| 164 | `supervision/supervision/area-minutes-filter/filtro-minutas-area.html` | operations | · | · | ✅ | No candidato (reportes/agendas) |
| 165 | `supervision/supervision/committee-meeting-presentations/presentaciones-juntas-comite.html` | operations | · | · | ✅ | No candidato (reportes/agendas) |
| 166 | `supervision/supervision/general-result-area-evaluation/resultado-general-evaluacion-areas-detalle.html` | operations | · | · | ✅ | No candidato (reportes/agendas) |
| 167 | `supervision/supervision/supervision-agenda/agenda-supervision.html` | operations | · | · | ✅ | No candidato (reportes/agendas) |
| 168 | `task/recurring-tasks/catalog/recurring-task-catalog-list` | operations | ✅ | · | · |  |
| 169 | `task/recurring-tasks/compliance/recurring-task-compliance-dashboard/recurring-task-compliance-dashboard.html` | operations | · | · | ✅ | No candidato (dashboard) |
| 170 | `task/recurring-tasks/instances/task-instance-list` | operations | ✅ | · | · |  |
| 171 | `task/recurring-tasks/templates/task-template-items` | operations | ✅ | · | · |  |
| 172 | `task/recurring-tasks/templates/task-template-list` | operations | ✅ | · | · |  |
| 173 | `task/tasks/my-tasks` | operations | ✅ | · | · |  |
| 174 | `task/tasks/reports/task-operation-report.html` | operations | · | · | ✅ | No candidato (reporte) |
| 175 | `task/tasks/reports/task-report-work-plan.html` | operations | · | · | ✅ | No candidato (reporte) |
| 176 | `task/tasks/task-message` | operations | ✅ | · | · |  |
| 177 | `task/tasks/work-group` | operations | ✅ | · | · |  |
| 178 | `templates` | operations | ✅ | · | · |  |
| 179 | `work-positions` | operations | ✅ | · | · |  |
| 180 | `products` | purchases | ✅ | · | · |  |
| 181 | `purchase-history` | purchases | ✅ | · | · |  |
| 182 | `purchase-orders/purchase-order` | purchases | ✅ | · | · |  |
| 183 | `purchase-requests/budget-statement` | purchases | ✅ | · | · |  |
| 184 | `purchase-requests/requests` | purchases | ✅ | · | · |  |
| 185 | `candidates/candidate-applications` | recruitment | ✅ | · | · |  |
| 186 | `candidates/candidate-core` | recruitment | ✅ | · | · |  |
| 187 | `candidates/candidate-interview` | recruitment | ✅ | · | · |  |
| 188 | `employee-bank-data-records` | recruitment | ✅ | · | · |  |
| 189 | `employee-beneficiaries` | recruitment | ✅ | · | · |  |
| 190 | `employee-clinical-data-records` | recruitment | ✅ | · | · |  |
| 191 | `employee-dismissal-requests` | recruitment | ✅ | · | · |  |
| 192 | `employee-emergency-contacts` | recruitment | ✅ | · | · |  |
| 193 | `employee-file/employees/employee-registry` | recruitment | ✅ | · | · |  |
| 194 | `employee-file/human-resources/employee-bank-data` | recruitment | ✅ | · | · |  |
| 195 | `employee-file/human-resources/employee-beneficiary` | recruitment | ✅ | · | · |  |
| 196 | `employee-file/human-resources/employee-registry` | recruitment | ✅ | · | · |  |
| 197 | `employee-registration-requests` | recruitment | ✅ | · | · |  |
| 198 | `external-staffs` | recruitment | ✅ | · | · |  |
| 199 | `provider-supports` | recruitment | ✅ | · | · |  |
| 200 | `recruitment-requests/recruitment-client-requests` | recruitment | ✅ | · | · |  |
| 201 | `salary-modification-requests` | recruitment | ✅ | · | · |  |
| 202 | `vacancy-requests` | recruitment | ✅ | · | · |  |
| 203 | `catalogs/banks` | shared | ✅ | · | · |  |
| 204 | `catalogs/cfdi-usage` | shared | ✅ | · | · |  |
| 205 | `catalogs/document-catalog` | shared | ✅ | · | · |  |
| 206 | `catalogs/onboarding-checklist-options` | shared | ✅ | · | · |  |
| 207 | `catalogs/payment-method` | shared | ✅ | · | · |  |
| 208 | `catalogs/payment-type` | shared | ✅ | · | · |  |
| 209 | `catalogs/recruitment-sources` | shared | ✅ | · | · |  |
| 210 | `catalogs/units-of-measurement` | shared | ✅ | · | · |  |

---

## Fase 4 - Limpieza de botones legacy: `operations.luxuryapp` (2026-10-05)

Migracion estructural de residuales de botones legacy en `operations` (Agente A, Fase 4). Contrato: consumidor inyecta `ConfirmService`/`SwalService`; `ButtonWeb`/`ButtonMobile` solo emiten `(clicked)`.

- **`active-desactive` (9)**: `iw/ili-button-active-desactive` -> `lux-button-web`/`lux-button-mobile kind="active-desactive"`, con `[icon]`/`[label]` dinamicos segun estado (`material-symbols-light:visibility`/`visibility-off`) y `(clicked)` emitiendo el estado alternado (`!state`) o el id en toggles de fila.
  - `custom-documents/custom-document/policy-contract/desktop`
  - `task/recurring-tasks/catalog/recurring-task-catalog-list/{desktop,mobile}`
  - `task/recurring-tasks/templates/task-template-list/{desktop,mobile}`
  - `task/tasks/work-group/{desktop,mobile}`
- **Residuales `[routerLink]` (2)**: `service-orders/service-order/ordenes-servicio-list-{desktop,mobile}` -> `lux-button-web`/`lux-button-mobile kind="item" variant="outline" [routerLink]` (ruteo preservado via `RouterModule`).
- **Residuales sin evento (4)**: `inventory/product-exit/{desktop,mobile}` (`iw/ili-button-item` con `(clicked)` no capturado antes por un `>=` en `[disabled]`) y `task/tasks/send-operation-report/{web,mobile}` (`il/ili-button-add` de submit).
- **Codigo muerto**: sin hallazgos en `operations` (no habia botones legacy comentados).
- **Specs de cancelacion**: mocks + pruebas de la rama `if (!await confirm) return;` en specs de `task` (template-items, template-list, group-participant, followup, checklist-panel, task-list, group-list, instance-list, work-plan-preview) y en `properties`, `providers`, `supervision`, `google-calendar`.
- **Gap cerrado**: `task-template-items.onDeleteItem` y `task-checklist-panel.onDeleteChecklistItem/onDeleteAttachment` recibieron el gate de `ConfirmService`.
- **Pendiente (fuera de alcance)**: `view-pdf` (9) -> Agente 3 / `lux-pdf-viewer-trigger`.

Estado: 0 botones legacy no-`view-pdf` en `operations`. `npm run audit:ui` y `npm run build` en verde.
