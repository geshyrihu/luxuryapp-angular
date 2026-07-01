# Migración `#emptymessage` → `primeng-custom-table-emptymessage`

## Objetivo

Reemplazar todas las ocurrencias de `<app-empty-state>` dentro de `<ng-template #emptymessage>` por el nuevo componente genérico `<primeng-custom-table-emptymessage>`.

## Cambios requeridos por archivo

### HTML
```diff
-<ng-template #emptymessage>
-  <tr>
-    <td colspan="N">
-      <app-empty-state icon="..." title="..." message="..." />
-    </td>
-  </tr>
-</ng-template>
+<ng-template #emptymessage>
+  <primeng-custom-table-emptymessage [colspan]="N" />
+</ng-template>
```

### TS
1. Agregar import: `import { PrimeNgCustomTableEmptyMessage } from "src/app/core/components/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";`
2. Agregar a `imports: [ ..., PrimeNgCustomTableEmptyMessage ]`
3. Remover `EmptyState` de imports si ya no se usa en el template

---

## Inventario por área

### 📁 ACCOUNTING

#### AR (3)
- [x] `src/app/features/accounting/ar/aspel-customer-empresa/aspel-customer-empresa-list.html` — colspan: 4
- [x] `src/app/features/accounting/ar/catalogo-gastos-fijos/catalogo-gastos-fijos-list.html` — colspan: 8
- [x] `src/app/features/accounting/ar/espejo-aspel/projected-expenses-list.html` — colspan: 7

#### Fondeos y Reporteo (3)
- [x] `src/app/features/accounting/fondeos-y-reporteo/funding/funding-list.html` — colspan: 5
- [x] `src/app/features/accounting/fondeos-y-reporteo/funding-accounting/funding-accounting-list.html` — colspan: 6
- [x] `src/app/features/accounting/fondeos-y-reporteo/sat-funding/sat-funding-list/sat-funding-list.html` — colspan: 4

#### General Ledger (23)
- [x] `src/app/features/accounting/general-ledger/accounting-accounts/level-three-account-list.html` — colspan: 5
- [x] `src/app/features/accounting/general-ledger/aspel-customer-empresa/aspel-customer-empresa-list.html` — colspan: 4
- [x] `src/app/features/accounting/general-ledger/catalogo-gastos-fijos/catalogo-gastos-fijos-list.html` — colspan: 8
- [x] `src/app/features/accounting/general-ledger/contabilidad/cobranza-nativa/pages/approvals/approval-inbox.html` — colspan: 6
- [x] `src/app/features/accounting/general-ledger/contabilidad/cobranza-nativa/pages/charge-templates/charge-template-list.html` — colspan: 7
- [x] `src/app/features/accounting/general-ledger/contabilidad/cobranza-nativa/pages/charges/charge-list.html` — colspan: 8
- [x] `src/app/features/accounting/general-ledger/contabilidad/cobranza-nativa/pages/collection-cases/collection-case-list.html` — colspan: 8
- [x] `src/app/features/accounting/general-ledger/contabilidad/cobranza-nativa/pages/members/member-list.html` — colspan: 8
- [x] `src/app/features/accounting/general-ledger/contabilidad/cobranza-nativa/pages/payments/payment-list.html` — colspan: 7
- [x] `src/app/features/accounting/general-ledger/contabilidad/cobranza-nativa/pages/properties/property-list.html` — colspan: 8
- [x] `src/app/features/accounting/general-ledger/contabilidad/cobranza-nativa/pages/property-fines/property-fine-list.html` — colspan: 8
- [x] `src/app/features/accounting/general-ledger/contabilidad/cobranza-nativa/pages/regulation-articles/regulation-article-list.html` — colspan: 5
- [x] `src/app/features/accounting/general-ledger/contabilidad/cobranza-online/pages/exclusions/cobranza-online-exclusions.html` — colspan: 6
- [x] `src/app/features/accounting/general-ledger/contabilidad/estados-financieros/estado-financiero-list.html` — colspan: 6
- [x] `src/app/features/accounting/general-ledger/contabilidad/pendientes-minuta/cont-minuta-seguimientos.html` — colspan: 3
- [x] `src/app/features/accounting/general-ledger/contabilidad/pendientes-minuta/minuta-pendientes-list.html` — colspan: 8
- [x] `src/app/features/accounting/general-ledger/contabilidad/reporte-envio-financieros/reporte-envio-financieros.html` — colspan: 13
- [x] `src/app/features/accounting/general-ledger/espejo-aspel/projected-expenses-list.html` — colspan: 7
- [x] `src/app/features/accounting/general-ledger/expense-catalog-detail/gasto-fijo-servicios.html` — colspan: 6 *(2 emptymessage blocks)*
- [x] `src/app/features/accounting/general-ledger/funding/funding-list.html` — colspan: 5
- [x] `src/app/features/accounting/general-ledger/funding/components/funding-order-invoices/funding-order-invoices.html` — colspan: 3
- [x] `src/app/features/accounting/general-ledger/funding-accounting/funding-accounting-list.html` — colspan: 7
- [x] `src/app/features/accounting/general-ledger/sat-funding/sat-funding-list/sat-funding-list.html` — colspan: 4

---

### 📁 HR

#### Chekador (1)
- [x] `src/app/features/hr/chekador-empleados/pages/chekador-list.html` — colspan: 10

#### Evaluaciones de Desempeño (4)
- [x] `src/app/features/hr/evaluaciones-de-desempeo/evaluation-template/lista-plantilla-evaluacion.html` — colspan: 6
- [x] `src/app/features/hr/evaluaciones-de-desempeo/evaluation-template/performance-evaluation/lista-evaluacion-realizada.html` — colspan: 7
- [x] `src/app/features/hr/evaluaciones-de-desempeo/hr-catalog/pages/incident-type-list.html` — colspan: 5
- [x] `src/app/features/hr/evaluaciones-de-desempeo/hr-catalog/pages/sanction-type-list.html` — colspan: 6

#### Employees (5)
- [x] `src/app/features/hr/expediente-del-empleado/employees/employee-bank-data/pages/employee-bank-data-list.html` — colspan: 7
- [x] `src/app/features/hr/expediente-del-empleado/employees/employee-clinical-data/pages/employee-clinical-data-list.html` — colspan: 3
- [x] `src/app/features/hr/expediente-del-empleado/employees/employee-emergency-contact/pages/employee-emergency-contact-list.html` — colspan: 8
- [x] `src/app/features/hr/expediente-del-empleado/employees/employees/pages/employee-list.html` — colspan: 7
- [x] `src/app/features/hr/expediente-del-empleado/employees/staff-board/staff-board.html` — colspan: 7

#### hr-employees (5)
- [x] `src/app/features/hr/expediente-del-empleado/hr-employees/employee-bank-data/pages/employee-bank-data-list.html` — colspan: 7
- [x] `src/app/features/hr/expediente-del-empleado/hr-employees/employee-clinical-data/pages/employee-clinical-data-list.html` — colspan: 3
- [x] `src/app/features/hr/expediente-del-empleado/hr-employees/employee-emergency-contact/pages/employee-emergency-contact-list.html` — colspan: 8
- [x] `src/app/features/hr/expediente-del-empleado/hr-employees/employees/pages/employee-list.html` — colspan: 7
- [x] `src/app/features/hr/expediente-del-empleado/hr-employees/staff-board/staff-board.html` — colspan: 7

#### Recursos Humanos (21)
- [x] `src/app/features/hr/expediente-del-empleado/recursos-humanos/addendum-template/pages/addendum-template-list.html` — colspan: 6
- [x] `src/app/features/hr/expediente-del-empleado/recursos-humanos/admin-vacaciones-balance/admin-vacaciones-balance.html` — colspan: 11
- [x] `src/app/features/hr/expediente-del-empleado/recursos-humanos/contract-addendum/pages/contract-addendum-list.html` — colspan: 7
- [x] `src/app/features/hr/expediente-del-empleado/recursos-humanos/contract-template/pages/contract-template-list.html` — colspan: 6
- [x] `src/app/features/hr/expediente-del-empleado/recursos-humanos/employee-bank-data/pages/employee-bank-data-list.html` — colspan: 7
- [x] `src/app/features/hr/expediente-del-empleado/recursos-humanos/employee-file/pages/employee-file-list.html` — colspan: 7
- [x] `src/app/features/hr/expediente-del-empleado/recursos-humanos/historial-solicitudes/solicitudes-historial.html` — colspan: 8
- [x] `src/app/features/hr/expediente-del-empleado/recursos-humanos/incidencias-sanciones/incident/components/incident-attachments/incident-attachments.html` — colspan: 5
- [x] `src/app/features/hr/expediente-del-empleado/recursos-humanos/incidencias-sanciones/incident/components/incident-witnesses/incident-witnesses.html` — colspan: 5
- [x] `src/app/features/hr/expediente-del-empleado/recursos-humanos/incidencias-sanciones/incident/components/suspension-days-manager/suspension-days-manager.html` — colspan: 3
- [x] `src/app/features/hr/expediente-del-empleado/recursos-humanos/incidencias-sanciones/incident/pages/incident-list.html` — colspan: 9
- [x] `src/app/features/hr/expediente-del-empleado/recursos-humanos/incidencias-sanciones/sanction/pages/sanction-list.html` — colspan: 7
- [x] `src/app/features/hr/expediente-del-empleado/recursos-humanos/leave-request/mis-permisos-listado.html` — colspan: 7
- [x] `src/app/features/hr/expediente-del-empleado/recursos-humanos/my-vacation-requests/mis-vacaciones-listado.html` — colspan: 6
- [x] `src/app/features/hr/expediente-del-empleado/recursos-humanos/nomina/pages/incidencias-nomina/incidencias-nomina.html` — colspan: 8
- [x] `src/app/features/hr/expediente-del-empleado/recursos-humanos/nomina/pages/nomina-detalle/nomina-detalle.html` — colspan: 8
- [x] `src/app/features/hr/expediente-del-empleado/recursos-humanos/nomina/pages/nominas/nominas.html` — colspan: 8
- [x] `src/app/features/hr/expediente-del-empleado/recursos-humanos/nomina/pages/periodos-nomina/periodos-nomina.html` — colspan: 9
- [x] `src/app/features/hr/expediente-del-empleado/recursos-humanos/nomina/pages/prestamos-empleado/prestamos-empleado.html` — colspan: 7
- [x] `src/app/features/hr/expediente-del-empleado/recursos-humanos/nomina/pages/tiempo-extra/tiempo-extra.html` — colspan: 9
- [x] `src/app/features/hr/expediente-del-empleado/recursos-humanos/work-contract/pages/work-contract-list.html` — colspan: 7

---

### 📁 LEGAL (5)
- [x] `src/app/features/legal/asuntos-legales-y-seguros/asunto-legal/asunto-legal-lista.html` — colspan: 4
- [x] `src/app/features/legal/asuntos-legales-y-seguros/documento-personalizado/documento-personalizado-lista.html` — colspan: 5
- [x] `src/app/features/legal/asuntos-legales-y-seguros/minutas/legal-pendientes-minuta.html` — colspan: 6
- [x] `src/app/features/legal/asuntos-legales-y-seguros/ticket-legal/ticket-legal-lista-cliente.html` — colspan: 9
- [x] `src/app/features/legal/asuntos-legales-y-seguros/ticket-legal/ticket-legal-lista.html` — colspan: 10

---

### 📁 MAINTENANCE (20)

#### Equipos y Maquinaria (3)
- [x] `src/app/features/maintenance/equipos-y-maquinaria/equipment-inspections/equipment-inspection-definitions-list.html` — colspan: 4
- [x] `src/app/features/maintenance/equipos-y-maquinaria/machinery/equipos-list.html` — colspan: 7
- [x] `src/app/features/maintenance/equipos-y-maquinaria/machinery/service-history-machinery.html` — colspan: 6

#### Fire Equipment (6)
- [x] `src/app/features/maintenance/fire-equipment/extinguisher-log/extintor-bitacora-list.html` — colspan: 8
- [x] `src/app/features/maintenance/fire-equipment/hydrant-log/hidrante-bitacora-list.html` — colspan: 5
- [x] `src/app/features/maintenance/fire-equipment/inspection-periods/cycle-list/fire-inspection-cycle-list.html` — colspan: 6
- [x] `src/app/features/maintenance/fire-equipment/inspection-periods/period-list/fire-inspection-period-list.html` — colspan: 5
- [x] `src/app/features/maintenance/fire-equipment/manual-call-point-log/estacion-manual-bitacora-list.html` — colspan: 6
- [x] `src/app/features/maintenance/fire-equipment/smoke-detector-log/detector-humo-bitacora-list.html` — colspan: 7

#### Logs (8)
- [x] `src/app/features/maintenance/logs/bitacoras/medidores/medidor-lectura-list.html` — colspan: 8
- [x] `src/app/features/maintenance/logs/bitacoras/prestamo-herramienta/prestamo-herramientas-control.html` — colspan: 6
- [x] `src/app/features/maintenance/logs/elevator-emergency-call/elevators-emergency-call-list.html` — colspan: 5
- [x] `src/app/features/maintenance/logs/elevator-spare-parts/elevator-spare-parts-change-list.html` — colspan: 5
- [x] `src/app/features/maintenance/logs/maintenance-log/bitacora-mantenimiento.html` — colspan: 9
- [x] `src/app/features/maintenance/logs/piscina/piscina-list.html` — colspan: 6
- [x] `src/app/features/maintenance/logs/piscina-bitacora/piscina-bitacora-list.html` — colspan: 7
- [x] `src/app/features/maintenance/logs/recepcion-pipas-agua/recepcion-pipas-agua-list.html` — colspan: 13
- [x] `src/app/features/maintenance/logs/recepcion-pipas-agua/recepcion-pipas-agua-reporte.html` — colspan: 8
- [x] `src/app/features/maintenance/logs/tool-loan/tool-list.html` — colspan: 4

#### Planificación (1)
- [x] `src/app/features/maintenance/planificacin-de-mantenimiento/calendario-maestro-equipo/calendario-maestro-equipo.html` — colspan: 3

---

### 📁 OPERATIONS (53)
- [x] `operations/announcements/announcement/announcement-admin-list.html` — colspan: 6
- [x] `operations/asambleas-y-planificacin/asamblea-checklist-template/asamblea-checklist-template-list.html` — colspan: 9
- [x] `operations/custom-documents/custom-document/acta-constitutiva-list.html` — colspan: 4
- [x] `operations/custom-documents/custom-document/asambleas-list.html` — colspan: 5
- [x] `operations/custom-documents/custom-document/reglamentos-list.html` — colspan: 5
- [x] `operations/custom-documents/custom-document/special-document-list.html` — colspan: 5
- [x] `operations/custom-documents/custom-document/policy-contract/policy-contract-list.html` — colspan: 9
- [x] `operations/diagrams/diagram/diagram-list/diagram-list.html` — colspan: 3
- [x] `operations/directorios/comite-vigilancia/comite-vigilancia-list.html` — colspan: 6
- [x] `operations/directorios/comite-vigilancia/comites-list.html` — colspan: 5
- [x] `operations/directorios/employee-external/employee-external-list.html` — colspan: 7
- [x] `operations/field-service/service-order/ordenes-servicio-list.html` — colspan: 8
- [x] `operations/field-service/service-order/ordenes-servicio-reporte-proveedor.html` — colspan: 7
- [x] `operations/google-calendar/calendar/listado-anual-mantenimiento/listado-anual-mantenimiento.html` — colspan: 8
- [x] `operations/google-calendar/google-calendar/google-calendar.html` — colspan: 11
- [x] `operations/inspecciones-y-auditora/inspection/bitacora/mis-inspecciones-lista.html` — colspan: 5
- [x] `operations/inspecciones-y-auditora/inspection/catalogo/catalogo-activo-lista.html` — colspan: 4
- [x] `operations/inspecciones-y-auditora/inspection/catalogo/catalogo-revisiones-inspeccion.html` — colspan: 3
- [x] `operations/inspecciones-y-auditora/reports-mantenance/maintenance-reports-list.html` — colspan: 2
- [x] `operations/inventarios-y-almacn/fire-extinguisher-inventory/inventario-extintor.html` — colspan: 6
- [x] `operations/inventarios-y-almacn/hydrant-inventory/inventario-hidrante.html` — colspan: 6
- [x] `operations/inventarios-y-almacn/key-inventory/inventario-llaves-list.html` — colspan: 6
- [x] `operations/inventarios-y-almacn/lighting-inventory/inventario-iluminacion.html` — colspan: 4
- [x] `operations/inventarios-y-almacn/manual-call-point-inventory/inventario-estacion-manual.html` — colspan: 5
- [x] `operations/inventarios-y-almacn/paint-inventory/inventario-pintura.html` — colspan: 3
- [x] `operations/inventarios-y-almacn/product/productos-list.html` — colspan: 6
- [x] `operations/inventarios-y-almacn/product-entry/product-entry-list.html` — colspan: 7
- [x] `operations/inventarios-y-almacn/product-exit/product-output-list.html` — colspan: 7
- [x] `operations/inventarios-y-almacn/radio-communication-inventory/radio-comunicacion-list.html` — colspan: 10
- [x] `operations/inventarios-y-almacn/smoke-detector-inventory/inventario-detector-humo.html` — colspan: 5
- [x] `operations/inventarios-y-almacn/stock-por-almacen/warehouse-stock-list.html` — colspan: 7
- [x] `operations/inventarios-y-almacn/warehouse/warehouse-list.html` — colspan: 4
- [x] `operations/meetings/committee/board-directors-library/biblioteca-consejo-directivo-detalle.html` — colspan: 5
- [x] `operations/meetings/juntas-comite/junta-comite-minutas/meeting-area-table/meeting-area-table.html` — colspan: 6
- [x] `operations/meetings/juntas-comite/junta-comite-minutas/minutas-list.html` — colspan: 7
- [x] `operations/meetings/juntas-comite/junta-comite-minutas/seguimiento-minutas.html` — colspan: 6
- [x] `operations/meetings/juntas-comite/juntas-mensuales-session/juntas-mensuales-session.html` — colspan: 3
- [x] `operations/properties/delivery-reception-catalog/catalogo-descripcion-list.html` — colspan: 5
- [x] `operations/properties/entrega-recepcion-cliente/entrega-recepcion-cliente.html` — colspan: 8
- [x] `operations/properties/owner/owner-list.html` — colspan: 9
- [x] `operations/properties/property/propiedades-list.html` — colspan: 11
- [x] `operations/supervision/supervision/agenda-supervision/agenda-supervision.html` — colspan: 9
- [x] `operations/supervision/supervision/filtro-minutas-area/filtro-minutas-area.html` — colspan: 7
- [x] `operations/supervision/supervision/presentaciones-juntas-comite/presentaciones-juntas-comite.html` — colspan: 8
- [x] `operations/supervision/supervision/reporte-tickets/reporte-tickets.html` — colspan: 4
- [x] `operations/supervision/supervision/resultado-general-evaluacion-areas/resultado-general-evaluacion-areas.html` — colspan: 11
- [x] `operations/task-engine/recurring-tasks/instances/task-instance-list/task-instance-list.html` — colspan: 5
- [x] `operations/task-engine/recurring-tasks/templates/task-template-list/task-template-list.html` — colspan: 4
- [x] `operations/task-engine/tasks/my-tasks/pages/my-assigned-tasks-list.html` — colspan: 19
- [x] `operations/task-engine/tasks/my-tasks/pages/my-tasks-list.html` — colspan: 10
- [x] `operations/task-engine/tasks/send-operation-report/pages/send-operation-report.html` — colspan: 5
- [x] `operations/task-engine/tasks/task-message/pages/task-list.html` — colspan: 17
- [x] `operations/task-engine/tasks/work-group/pages/task-group-list.html` — colspan: 5
- [x] `operations/task-engine/tasks/work-group-categories/pages/task-group-category-list.html` — colspan: 6
- [x] `operations/templates/templates-list.html` — colspan: 4

### 📁 PURCHASING (29)
- [x] `purchasing/customer-provider/mis-proveedores-list.html` — colspan: 3
- [x] `purchasing/po/purchase-order/components/payment-voucher-modal/payment-voucher-modal.html` — colspan: 3
- [x] `purchasing/po/purchase-order/forms/orden-compra-factura-form.html` — colspan: 7
- [x] `purchasing/po/purchase-order/orden-compra-list.html` — colspan: 9
- [x] `purchasing/po/purchase-order/orden-compra-pagadas/orden-compra-pagadas.html` — colspan: 8
- [x] `purchasing/po/purchase-order/orden-compra-presupuesto/orden-compra-presupuesto.html` — colspan: 7
- [x] `purchasing/po/purchase-order/orden-compra.html` — colspan: 16
- [x] `purchasing/pr/cedula-presupuestal/cedula-cliente-list.html` — colspan: 12
- [x] `purchasing/pr/cedula-presupuestal/ordenes-compra-cedula-list.html` — colspan: 5
- [x] `purchasing/pr/purchase-request/purchase-request-list.html` — colspan: 6
- [x] `purchasing/pr/purchase-request/purchase-request-products.html` — colspan: 4
- [x] `purchasing/pr/solicitud-compra/solicitud-compra-detalle.html` — colspan: 4
- [x] `purchasing/pr/solicitud-compra/solicitud-compra-list.html` — colspan: 9
- [x] `purchasing/provider-support/provider-support.html` — colspan: 5
- [x] `purchasing/provider/provider-list.html` — colspan: 3
- [x] `purchasing/providers/provider-support/provider-support.html` — colspan: 5
- [x] `purchasing/providers/provider/provider-list.html` — colspan: 3
- [x] `purchasing/purchases/cedula-presupuestal/cedula-cliente-list.html` — colspan: 12
- [x] `purchasing/purchases/cedula-presupuestal/ordenes-compra-cedula-list.html` — colspan: 5
- [x] `purchasing/purchases/purchase-order/components/payment-voucher-modal/payment-voucher-modal.html` — colspan: 3
- [x] `purchasing/purchases/purchase-order/forms/orden-compra-factura-form.html` — colspan: 7
- [x] `purchasing/purchases/purchase-order/orden-compra-list.html` — colspan: 9
- [x] `purchasing/purchases/purchase-order/orden-compra-pagadas/orden-compra-pagadas.html` — colspan: 8
- [x] `purchasing/purchases/purchase-order/orden-compra-presupuesto/orden-compra-presupuesto.html` — colspan: 7
- [x] `purchasing/purchases/purchase-order/orden-compra.html` — colspan: 16
- [x] `purchasing/purchases/purchase-request/purchase-request-list.html` — colspan: 6
- [x] `purchasing/purchases/purchase-request/purchase-request-products.html` — colspan: 4
- [x] `purchasing/purchases/solicitud-compra/solicitud-compra-detalle.html` — colspan: 4
- [x] `purchasing/purchases/solicitud-compra/solicitud-compra-list.html` — colspan: 9

### 📁 RECRUITMENT (6)
- [x] `recruitment/estructura-organizacional/work-position/pages/work-position-list.html` — colspan: 7
- [x] `recruitment/reclutamiento-y-altas-bajas/recruitment-client-requests/solicitudes-cliente-list.html` — colspan: 6
- [x] `recruitment/reclutamiento-y-altas-bajas/recruitment-requests/pages/solicitud-alta-list.html` — colspan: 8
- [x] `recruitment/reclutamiento-y-altas-bajas/request-dismissal/pages/solicitud-baja-list.html` — colspan: 9
- [x] `recruitment/reclutamiento-y-altas-bajas/salary-modification/pages/solicitud-modificacion-list.html` — colspan: 10
- [x] `recruitment/reclutamiento-y-altas-bajas/vacancy-requests/pages/vacantes-list.html` — colspan: 9

### 📁 SYSTEM (26)
- [x] `system/access/application-role/pages/roles-list.html` — colspan: 6
- [x] `system/access/application-user/pages/application-user-list.html` — colspan: 6
- [x] `system/access/audit-entries/audit-entries.html` — colspan: 6
- [x] `system/access/module-app/pages/module-app-list.html` — colspan: 8
- [x] `system/access/vault-secrets/vault-secrets-list.html` — colspan: 7
- [x] `system/ai/ai-knowledge-base/ai-knowledge-base-list.html` — colspan: 6
- [x] `system/ai/knowledge-base/ai-knowledge-base-list.html` — colspan: 6
- [x] `system/asamblea-checklist-template/asamblea-checklist-template-list.html` — colspan: 9
- [x] `system/audit-logs/log-api-report/log-api-report.html` — colspan: 5
- [x] `system/catalogs/banks/bank-list.html` — colspan: 4 ✅ *(ya migrado)*
- [x] `system/catalogs/cfdi-use/pages/cfdi-use-list.html` — colspan: 3
- [x] `system/catalogs/machinery-classification/machinery-classification-list.html` — colspan: 3
- [x] `system/catalogs/meter-category/meter-category-list.html` — colspan: 3
- [x] `system/catalogs/payment-method/pages/payment-method-list.html` — colspan: 3
- [x] `system/catalogs/payment-type/payment-type-list.html` — colspan: 3
- [x] `system/catalogs/product-category/product-category-list.html` — colspan: 3
- [x] `system/catalogs/units-of-measurement/unit-of-measurement-list.html` — colspan: 3
- [x] `system/gestin-de-cliente/customer-provider/mis-proveedores-list.html` — colspan: 3
- [x] `system/gestin-de-cliente/customer-data-company/customer-data-company-list.html` — colspan: 6
- [x] `system/gestin-de-cliente/customer-modul/pages/customer-modul-list.html` — colspan: 5
- [x] `system/gestin-de-cliente/customer/pages/customer-list.html` — colspan: 5
- [x] `system/gestin-de-cliente/delivery-reception-catalog/catalogo-descripcion-list.html` — colspan: 5
- [x] `system/gestin-de-cliente/email-data/email-data-list.html` — colspan: 5
- [x] `system/infrastructure/communication/email-data/email-data-list.html` — colspan: 5
- [x] `system/infrastructure/security/vault/password-manager/pages/password-list.html` — colspan: 5
- [x] `system/infrastructure/settings/settings-menu/vault-secrets/vault-secrets-list.html` — colspan: 7
- [x] `system/vault/password-manager/pages/password-list.html` — colspan: 5

---

## Progreso

| Área | Total | ✅ Migrado | ⬜ Pendiente |
|------|-------|-----------|-------------|
| accounting/ar | 3 | 3 | — |
| accounting/fondeos | 3 | 3 | — |
| accounting/general-ledger | 23 | 23 | — |
| hr/chekador | 1 | 1 | — |
| hr/evaluaciones | 4 | 4 | — |
| hr/expediente/employees | 5 | 5 | — |
| hr/expediente/hr-employees | 5 | 5 | — |
| hr/expediente/recursos-humanos | 21 | 21 | — |
| legal | 5 | 5 | — |
| maintenance | 20 | 20 | — |
| operations | 53 | 53 | — |
| purchasing | 29 | 29 | — |
| recruitment | 6 | 6 | — |
| system | 27 | 27 | — |
| **Total** | **~205** | **~205** | **0** |

## Cierre de la migración (2026-07-01)

Migración completada de forma masiva (script + revisión) sobre el árbol de archivos actual. Notas importantes:

- **206 archivos `.html`** fueron migrados de `<app-empty-state>` dentro de `<ng-template #emptymessage>` a `<primeng-custom-table-emptymessage [colspan]="N" />`. Siguiendo el precedente ya aplicado en `bank-list.html` (el único ✅ previo), **se descartó el `icon`/`title`/`message` personalizado por lista** y se estandarizó al texto genérico por defecto del componente ("Sin registros" / "No hay registros que mostrar."). Esto es un cambio de texto visible en toda la app, confirmado con el usuario antes de aplicarlo.
- Los `.ts` correspondientes se actualizaron para importar `PrimeNgCustomTableEmptyMessage` en vez de `EmptyState` (o junto a él, si `EmptyState` seguía usándose en otra parte del mismo template).
- **Bug latente encontrado y corregido de paso:** ~40 archivos usaban `<app-empty-state>` en el template sin declarar `EmptyState` en el array `imports` del componente (elemento no registrado). Se aprovechó el mismo cambio para agregar el import de `PrimeNgCustomTableEmptyMessage` correctamente.
- **Casos especiales:**
  - `catalogo-gastos-fijos-list-moduls.ts` (variante `accounting/ar`): el array de imports vive en un archivo `-moduls.ts` separado, no en el `.ts` del componente; se corrigió ahí.
  - `accounting/general-ledger/contabilidad/cobranza-nativa/pages/properties/property-list.ts`: el `@Component` está completamente comentado (código muerto); no se tocó el `.ts`, solo se migró el `.html` por consistencia.
  - `operations/task-engine/tasks/my-tasks/pages/my-tasks-list.html`: no tiene `.ts` que lo referencie (`templateUrl` huérfano, no está enrutado); se migró el `.html` mismo pero no hay componente que arreglar.
  - `accounting/general-ledger/contabilidad/pendientes-minuta/minuta-pendientes-list.html`: su dueño real es `cont-list-minuta-pendientes.ts` (nombre de archivo distinto al del template).
- **Fuera de alcance (no tocados):** `legal/asuntos-legales-y-seguros/ticket-legal/ticket-legal-reportes-{internos,externos,pendientes}.html` usan `<app-empty-state>` como bloque condicional de página (no dentro de un `<ng-template #emptymessage>` de `p-table`), por lo que no aplica este patrón de migración.
- `tsc --noEmit` sobre `tsconfig.app.json` pasa sin errores tras todos los cambios.
- Nota: varias rutas de este inventario quedaron desactualizadas por la reorganización de componentes en curso en esta rama (`fix/ds-audit-phase1`); los checkboxes se marcaron con base en el árbol de archivos real, no en las rutas literales del documento original.
