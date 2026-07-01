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
- [ ] `src/app/features/accounting/ar/aspel-customer-empresa/aspel-customer-empresa-list.html` — colspan: 4
- [ ] `src/app/features/accounting/ar/catalogo-gastos-fijos/catalogo-gastos-fijos-list.html` — colspan: 8
- [ ] `src/app/features/accounting/ar/espejo-aspel/projected-expenses-list.html` — colspan: 7

#### Fondeos y Reporteo (3)
- [ ] `src/app/features/accounting/fondeos-y-reporteo/funding/funding-list.html` — colspan: 5
- [ ] `src/app/features/accounting/fondeos-y-reporteo/funding-accounting/funding-accounting-list.html` — colspan: 6
- [ ] `src/app/features/accounting/fondeos-y-reporteo/sat-funding/sat-funding-list/sat-funding-list.html` — colspan: 4

#### General Ledger (23)
- [ ] `src/app/features/accounting/general-ledger/accounting-accounts/level-three-account-list.html` — colspan: 5
- [ ] `src/app/features/accounting/general-ledger/aspel-customer-empresa/aspel-customer-empresa-list.html` — colspan: 4
- [ ] `src/app/features/accounting/general-ledger/catalogo-gastos-fijos/catalogo-gastos-fijos-list.html` — colspan: 8
- [ ] `src/app/features/accounting/general-ledger/contabilidad/cobranza-nativa/pages/approvals/approval-inbox.html` — colspan: 6
- [ ] `src/app/features/accounting/general-ledger/contabilidad/cobranza-nativa/pages/charge-templates/charge-template-list.html` — colspan: 7
- [ ] `src/app/features/accounting/general-ledger/contabilidad/cobranza-nativa/pages/charges/charge-list.html` — colspan: 8
- [ ] `src/app/features/accounting/general-ledger/contabilidad/cobranza-nativa/pages/collection-cases/collection-case-list.html` — colspan: 8
- [ ] `src/app/features/accounting/general-ledger/contabilidad/cobranza-nativa/pages/members/member-list.html` — colspan: 8
- [ ] `src/app/features/accounting/general-ledger/contabilidad/cobranza-nativa/pages/payments/payment-list.html` — colspan: 7
- [ ] `src/app/features/accounting/general-ledger/contabilidad/cobranza-nativa/pages/properties/property-list.html` — colspan: 8
- [ ] `src/app/features/accounting/general-ledger/contabilidad/cobranza-nativa/pages/property-fines/property-fine-list.html` — colspan: 8
- [ ] `src/app/features/accounting/general-ledger/contabilidad/cobranza-nativa/pages/regulation-articles/regulation-article-list.html` — colspan: 5
- [ ] `src/app/features/accounting/general-ledger/contabilidad/cobranza-online/pages/exclusions/cobranza-online-exclusions.html` — colspan: 6
- [ ] `src/app/features/accounting/general-ledger/contabilidad/estados-financieros/estado-financiero-list.html` — colspan: 6
- [ ] `src/app/features/accounting/general-ledger/contabilidad/pendientes-minuta/cont-minuta-seguimientos.html` — colspan: 3
- [ ] `src/app/features/accounting/general-ledger/contabilidad/pendientes-minuta/minuta-pendientes-list.html` — colspan: 8
- [ ] `src/app/features/accounting/general-ledger/contabilidad/reporte-envio-financieros/reporte-envio-financieros.html` — colspan: 13
- [ ] `src/app/features/accounting/general-ledger/espejo-aspel/projected-expenses-list.html` — colspan: 7
- [ ] `src/app/features/accounting/general-ledger/expense-catalog-detail/gasto-fijo-servicios.html` — colspan: 6 *(2 emptymessage blocks)*
- [ ] `src/app/features/accounting/general-ledger/funding/funding-list.html` — colspan: 5
- [ ] `src/app/features/accounting/general-ledger/funding/components/funding-order-invoices/funding-order-invoices.html` — colspan: 3
- [ ] `src/app/features/accounting/general-ledger/funding-accounting/funding-accounting-list.html` — colspan: 7
- [ ] `src/app/features/accounting/general-ledger/sat-funding/sat-funding-list/sat-funding-list.html` — colspan: 4

---

### 📁 HR

#### Chekador (1)
- [ ] `src/app/features/hr/chekador-empleados/pages/chekador-list.html` — colspan: 10

#### Evaluaciones de Desempeño (4)
- [ ] `src/app/features/hr/evaluaciones-de-desempeo/evaluation-template/lista-plantilla-evaluacion.html` — colspan: 6
- [ ] `src/app/features/hr/evaluaciones-de-desempeo/evaluation-template/performance-evaluation/lista-evaluacion-realizada.html` — colspan: 7
- [ ] `src/app/features/hr/evaluaciones-de-desempeo/hr-catalog/pages/incident-type-list.html` — colspan: 5
- [ ] `src/app/features/hr/evaluaciones-de-desempeo/hr-catalog/pages/sanction-type-list.html` — colspan: 6

#### Employees (5)
- [ ] `src/app/features/hr/expediente-del-empleado/employees/employee-bank-data/pages/employee-bank-data-list.html` — colspan: 7
- [ ] `src/app/features/hr/expediente-del-empleado/employees/employee-clinical-data/pages/employee-clinical-data-list.html` — colspan: 3
- [ ] `src/app/features/hr/expediente-del-empleado/employees/employee-emergency-contact/pages/employee-emergency-contact-list.html` — colspan: 8
- [ ] `src/app/features/hr/expediente-del-empleado/employees/employees/pages/employee-list.html` — colspan: 7
- [ ] `src/app/features/hr/expediente-del-empleado/employees/staff-board/staff-board.html` — colspan: 7

#### hr-employees (5)
- [ ] `src/app/features/hr/expediente-del-empleado/hr-employees/employee-bank-data/pages/employee-bank-data-list.html` — colspan: 7
- [ ] `src/app/features/hr/expediente-del-empleado/hr-employees/employee-clinical-data/pages/employee-clinical-data-list.html` — colspan: 3
- [ ] `src/app/features/hr/expediente-del-empleado/hr-employees/employee-emergency-contact/pages/employee-emergency-contact-list.html` — colspan: 8
- [ ] `src/app/features/hr/expediente-del-empleado/hr-employees/employees/pages/employee-list.html` — colspan: 7
- [ ] `src/app/features/hr/expediente-del-empleado/hr-employees/staff-board/staff-board.html` — colspan: 7

#### Recursos Humanos (21)
- [ ] `src/app/features/hr/expediente-del-empleado/recursos-humanos/addendum-template/pages/addendum-template-list.html` — colspan: 6
- [ ] `src/app/features/hr/expediente-del-empleado/recursos-humanos/admin-vacaciones-balance/admin-vacaciones-balance.html` — colspan: 11
- [ ] `src/app/features/hr/expediente-del-empleado/recursos-humanos/contract-addendum/pages/contract-addendum-list.html` — colspan: 7
- [ ] `src/app/features/hr/expediente-del-empleado/recursos-humanos/contract-template/pages/contract-template-list.html` — colspan: 6
- [ ] `src/app/features/hr/expediente-del-empleado/recursos-humanos/employee-bank-data/pages/employee-bank-data-list.html` — colspan: 7
- [ ] `src/app/features/hr/expediente-del-empleado/recursos-humanos/employee-file/pages/employee-file-list.html` — colspan: 7
- [ ] `src/app/features/hr/expediente-del-empleado/recursos-humanos/historial-solicitudes/solicitudes-historial.html` — colspan: 8
- [ ] `src/app/features/hr/expediente-del-empleado/recursos-humanos/incidencias-sanciones/incident/components/incident-attachments/incident-attachments.html` — colspan: 5
- [ ] `src/app/features/hr/expediente-del-empleado/recursos-humanos/incidencias-sanciones/incident/components/incident-witnesses/incident-witnesses.html` — colspan: 5
- [ ] `src/app/features/hr/expediente-del-empleado/recursos-humanos/incidencias-sanciones/incident/components/suspension-days-manager/suspension-days-manager.html` — colspan: 3
- [ ] `src/app/features/hr/expediente-del-empleado/recursos-humanos/incidencias-sanciones/incident/pages/incident-list.html` — colspan: 9
- [ ] `src/app/features/hr/expediente-del-empleado/recursos-humanos/incidencias-sanciones/sanction/pages/sanction-list.html` — colspan: 7
- [ ] `src/app/features/hr/expediente-del-empleado/recursos-humanos/leave-request/mis-permisos-listado.html` — colspan: 7
- [ ] `src/app/features/hr/expediente-del-empleado/recursos-humanos/my-vacation-requests/mis-vacaciones-listado.html` — colspan: 6
- [ ] `src/app/features/hr/expediente-del-empleado/recursos-humanos/nomina/pages/incidencias-nomina/incidencias-nomina.html` — colspan: 8
- [ ] `src/app/features/hr/expediente-del-empleado/recursos-humanos/nomina/pages/nomina-detalle/nomina-detalle.html` — colspan: 8
- [ ] `src/app/features/hr/expediente-del-empleado/recursos-humanos/nomina/pages/nominas/nominas.html` — colspan: 8
- [ ] `src/app/features/hr/expediente-del-empleado/recursos-humanos/nomina/pages/periodos-nomina/periodos-nomina.html` — colspan: 9
- [ ] `src/app/features/hr/expediente-del-empleado/recursos-humanos/nomina/pages/prestamos-empleado/prestamos-empleado.html` — colspan: 7
- [ ] `src/app/features/hr/expediente-del-empleado/recursos-humanos/nomina/pages/tiempo-extra/tiempo-extra.html` — colspan: 9
- [ ] `src/app/features/hr/expediente-del-empleado/recursos-humanos/work-contract/pages/work-contract-list.html` — colspan: 7

---

### 📁 LEGAL (5)
- [ ] `src/app/features/legal/asuntos-legales-y-seguros/asunto-legal/asunto-legal-lista.html` — colspan: 4
- [ ] `src/app/features/legal/asuntos-legales-y-seguros/documento-personalizado/documento-personalizado-lista.html` — colspan: 5
- [ ] `src/app/features/legal/asuntos-legales-y-seguros/minutas/legal-pendientes-minuta.html` — colspan: 6
- [ ] `src/app/features/legal/asuntos-legales-y-seguros/ticket-legal/ticket-legal-lista-cliente.html` — colspan: 9
- [ ] `src/app/features/legal/asuntos-legales-y-seguros/ticket-legal/ticket-legal-lista.html` — colspan: 10

---

### 📁 MAINTENANCE (20)

#### Equipos y Maquinaria (3)
- [ ] `src/app/features/maintenance/equipos-y-maquinaria/equipment-inspections/equipment-inspection-definitions-list.html` — colspan: 4
- [ ] `src/app/features/maintenance/equipos-y-maquinaria/machinery/equipos-list.html` — colspan: 7
- [ ] `src/app/features/maintenance/equipos-y-maquinaria/machinery/service-history-machinery.html` — colspan: 6

#### Fire Equipment (6)
- [ ] `src/app/features/maintenance/fire-equipment/extinguisher-log/extintor-bitacora-list.html` — colspan: 8
- [ ] `src/app/features/maintenance/fire-equipment/hydrant-log/hidrante-bitacora-list.html` — colspan: 5
- [ ] `src/app/features/maintenance/fire-equipment/inspection-periods/cycle-list/fire-inspection-cycle-list.html` — colspan: 6
- [ ] `src/app/features/maintenance/fire-equipment/inspection-periods/period-list/fire-inspection-period-list.html` — colspan: 5
- [ ] `src/app/features/maintenance/fire-equipment/manual-call-point-log/estacion-manual-bitacora-list.html` — colspan: 6
- [ ] `src/app/features/maintenance/fire-equipment/smoke-detector-log/detector-humo-bitacora-list.html` — colspan: 7

#### Logs (8)
- [ ] `src/app/features/maintenance/logs/bitacoras/medidores/medidor-lectura-list.html` — colspan: 8
- [ ] `src/app/features/maintenance/logs/bitacoras/prestamo-herramienta/prestamo-herramientas-control.html` — colspan: 6
- [ ] `src/app/features/maintenance/logs/elevator-emergency-call/elevators-emergency-call-list.html` — colspan: 5
- [ ] `src/app/features/maintenance/logs/elevator-spare-parts/elevator-spare-parts-change-list.html` — colspan: 5
- [ ] `src/app/features/maintenance/logs/maintenance-log/bitacora-mantenimiento.html` — colspan: 9
- [ ] `src/app/features/maintenance/logs/piscina/piscina-list.html` — colspan: 6
- [ ] `src/app/features/maintenance/logs/piscina-bitacora/piscina-bitacora-list.html` — colspan: 7
- [ ] `src/app/features/maintenance/logs/recepcion-pipas-agua/recepcion-pipas-agua-list.html` — colspan: 13
- [ ] `src/app/features/maintenance/logs/recepcion-pipas-agua/recepcion-pipas-agua-reporte.html` — colspan: 8
- [ ] `src/app/features/maintenance/logs/tool-loan/tool-list.html` — colspan: 4

#### Planificación (1)
- [ ] `src/app/features/maintenance/planificacin-de-mantenimiento/calendario-maestro-equipo/calendario-maestro-equipo.html` — colspan: 3

---

### 📁 OPERATIONS (53)
- [ ] `operations/announcements/announcement/announcement-admin-list.html` — colspan: 6
- [ ] `operations/asambleas-y-planificacin/asamblea-checklist-template/asamblea-checklist-template-list.html` — colspan: 9
- [ ] `operations/custom-documents/custom-document/acta-constitutiva-list.html` — colspan: 4
- [ ] `operations/custom-documents/custom-document/asambleas-list.html` — colspan: 5
- [ ] `operations/custom-documents/custom-document/reglamentos-list.html` — colspan: 5
- [ ] `operations/custom-documents/custom-document/special-document-list.html` — colspan: 5
- [ ] `operations/custom-documents/custom-document/policy-contract/policy-contract-list.html` — colspan: 9
- [ ] `operations/diagrams/diagram/diagram-list/diagram-list.html` — colspan: 3
- [ ] `operations/directorios/comite-vigilancia/comite-vigilancia-list.html` — colspan: 6
- [ ] `operations/directorios/comite-vigilancia/comites-list.html` — colspan: 5
- [ ] `operations/directorios/employee-external/employee-external-list.html` — colspan: 7
- [ ] `operations/field-service/service-order/ordenes-servicio-list.html` — colspan: 8
- [ ] `operations/field-service/service-order/ordenes-servicio-reporte-proveedor.html` — colspan: 7
- [ ] `operations/google-calendar/calendar/listado-anual-mantenimiento/listado-anual-mantenimiento.html` — colspan: 8
- [ ] `operations/google-calendar/google-calendar/google-calendar.html` — colspan: 11
- [ ] `operations/inspecciones-y-auditora/inspection/bitacora/mis-inspecciones-lista.html` — colspan: 5
- [ ] `operations/inspecciones-y-auditora/inspection/catalogo/catalogo-activo-lista.html` — colspan: 4
- [ ] `operations/inspecciones-y-auditora/inspection/catalogo/catalogo-revisiones-inspeccion.html` — colspan: 3
- [ ] `operations/inspecciones-y-auditora/reports-mantenance/maintenance-reports-list.html` — colspan: 2
- [ ] `operations/inventarios-y-almacn/fire-extinguisher-inventory/inventario-extintor.html` — colspan: 6
- [ ] `operations/inventarios-y-almacn/hydrant-inventory/inventario-hidrante.html` — colspan: 6
- [ ] `operations/inventarios-y-almacn/key-inventory/inventario-llaves-list.html` — colspan: 6
- [ ] `operations/inventarios-y-almacn/lighting-inventory/inventario-iluminacion.html` — colspan: 4
- [ ] `operations/inventarios-y-almacn/manual-call-point-inventory/inventario-estacion-manual.html` — colspan: 5
- [ ] `operations/inventarios-y-almacn/paint-inventory/inventario-pintura.html` — colspan: 3
- [ ] `operations/inventarios-y-almacn/product/productos-list.html` — colspan: 6
- [ ] `operations/inventarios-y-almacn/product-entry/product-entry-list.html` — colspan: 7
- [ ] `operations/inventarios-y-almacn/product-exit/product-output-list.html` — colspan: 7
- [ ] `operations/inventarios-y-almacn/radio-communication-inventory/radio-comunicacion-list.html` — colspan: 10
- [ ] `operations/inventarios-y-almacn/smoke-detector-inventory/inventario-detector-humo.html` — colspan: 5
- [ ] `operations/inventarios-y-almacn/stock-por-almacen/warehouse-stock-list.html` — colspan: 7
- [ ] `operations/inventarios-y-almacn/warehouse/warehouse-list.html` — colspan: 4
- [ ] `operations/meetings/committee/board-directors-library/biblioteca-consejo-directivo-detalle.html` — colspan: 5
- [ ] `operations/meetings/juntas-comite/junta-comite-minutas/meeting-area-table/meeting-area-table.html` — colspan: 6
- [ ] `operations/meetings/juntas-comite/junta-comite-minutas/minutas-list.html` — colspan: 7
- [ ] `operations/meetings/juntas-comite/junta-comite-minutas/seguimiento-minutas.html` — colspan: 6
- [ ] `operations/meetings/juntas-comite/juntas-mensuales-session/juntas-mensuales-session.html` — colspan: 3
- [ ] `operations/properties/delivery-reception-catalog/catalogo-descripcion-list.html` — colspan: 5
- [ ] `operations/properties/entrega-recepcion-cliente/entrega-recepcion-cliente.html` — colspan: 8
- [ ] `operations/properties/owner/owner-list.html` — colspan: 9
- [ ] `operations/properties/property/propiedades-list.html` — colspan: 11
- [ ] `operations/supervision/supervision/agenda-supervision/agenda-supervision.html` — colspan: 9
- [ ] `operations/supervision/supervision/filtro-minutas-area/filtro-minutas-area.html` — colspan: 7
- [ ] `operations/supervision/supervision/presentaciones-juntas-comite/presentaciones-juntas-comite.html` — colspan: 8
- [ ] `operations/supervision/supervision/reporte-tickets/reporte-tickets.html` — colspan: 4
- [ ] `operations/supervision/supervision/resultado-general-evaluacion-areas/resultado-general-evaluacion-areas.html` — colspan: 11
- [ ] `operations/task-engine/recurring-tasks/instances/task-instance-list/task-instance-list.html` — colspan: 5
- [ ] `operations/task-engine/recurring-tasks/templates/task-template-list/task-template-list.html` — colspan: 4
- [ ] `operations/task-engine/tasks/my-tasks/pages/my-assigned-tasks-list.html` — colspan: 19
- [ ] `operations/task-engine/tasks/my-tasks/pages/my-tasks-list.html` — colspan: 10
- [ ] `operations/task-engine/tasks/send-operation-report/pages/send-operation-report.html` — colspan: 5
- [ ] `operations/task-engine/tasks/task-message/pages/task-list.html` — colspan: 17
- [ ] `operations/task-engine/tasks/work-group/pages/task-group-list.html` — colspan: 5
- [ ] `operations/task-engine/tasks/work-group-categories/pages/task-group-category-list.html` — colspan: 6
- [ ] `operations/templates/templates-list.html` — colspan: 4

### 📁 PURCHASING (29)
- [ ] `purchasing/customer-provider/mis-proveedores-list.html` — colspan: 3
- [ ] `purchasing/po/purchase-order/components/payment-voucher-modal/payment-voucher-modal.html` — colspan: 3
- [ ] `purchasing/po/purchase-order/forms/orden-compra-factura-form.html` — colspan: 7
- [ ] `purchasing/po/purchase-order/orden-compra-list.html` — colspan: 9
- [ ] `purchasing/po/purchase-order/orden-compra-pagadas/orden-compra-pagadas.html` — colspan: 8
- [ ] `purchasing/po/purchase-order/orden-compra-presupuesto/orden-compra-presupuesto.html` — colspan: 7
- [ ] `purchasing/po/purchase-order/orden-compra.html` — colspan: 16
- [ ] `purchasing/pr/cedula-presupuestal/cedula-cliente-list.html` — colspan: 12
- [ ] `purchasing/pr/cedula-presupuestal/ordenes-compra-cedula-list.html` — colspan: 5
- [ ] `purchasing/pr/purchase-request/purchase-request-list.html` — colspan: 6
- [ ] `purchasing/pr/purchase-request/purchase-request-products.html` — colspan: 4
- [ ] `purchasing/pr/solicitud-compra/solicitud-compra-detalle.html` — colspan: 4
- [ ] `purchasing/pr/solicitud-compra/solicitud-compra-list.html` — colspan: 9
- [ ] `purchasing/provider-support/provider-support.html` — colspan: 5
- [ ] `purchasing/provider/provider-list.html` — colspan: 3
- [ ] `purchasing/providers/provider-support/provider-support.html` — colspan: 5
- [ ] `purchasing/providers/provider/provider-list.html` — colspan: 3
- [ ] `purchasing/purchases/cedula-presupuestal/cedula-cliente-list.html` — colspan: 12
- [ ] `purchasing/purchases/cedula-presupuestal/ordenes-compra-cedula-list.html` — colspan: 5
- [ ] `purchasing/purchases/purchase-order/components/payment-voucher-modal/payment-voucher-modal.html` — colspan: 3
- [ ] `purchasing/purchases/purchase-order/forms/orden-compra-factura-form.html` — colspan: 7
- [ ] `purchasing/purchases/purchase-order/orden-compra-list.html` — colspan: 9
- [ ] `purchasing/purchases/purchase-order/orden-compra-pagadas/orden-compra-pagadas.html` — colspan: 8
- [ ] `purchasing/purchases/purchase-order/orden-compra-presupuesto/orden-compra-presupuesto.html` — colspan: 7
- [ ] `purchasing/purchases/purchase-order/orden-compra.html` — colspan: 16
- [ ] `purchasing/purchases/purchase-request/purchase-request-list.html` — colspan: 6
- [ ] `purchasing/purchases/purchase-request/purchase-request-products.html` — colspan: 4
- [ ] `purchasing/purchases/solicitud-compra/solicitud-compra-detalle.html` — colspan: 4
- [ ] `purchasing/purchases/solicitud-compra/solicitud-compra-list.html` — colspan: 9

### 📁 RECRUITMENT (6)
- [ ] `recruitment/estructura-organizacional/work-position/pages/work-position-list.html` — colspan: 7
- [ ] `recruitment/reclutamiento-y-altas-bajas/recruitment-client-requests/solicitudes-cliente-list.html` — colspan: 6
- [ ] `recruitment/reclutamiento-y-altas-bajas/recruitment-requests/pages/solicitud-alta-list.html` — colspan: 8
- [ ] `recruitment/reclutamiento-y-altas-bajas/request-dismissal/pages/solicitud-baja-list.html` — colspan: 9
- [ ] `recruitment/reclutamiento-y-altas-bajas/salary-modification/pages/solicitud-modificacion-list.html` — colspan: 10
- [ ] `recruitment/reclutamiento-y-altas-bajas/vacancy-requests/pages/vacantes-list.html` — colspan: 9

### 📁 SYSTEM (26)
- [ ] `system/access/application-role/pages/roles-list.html` — colspan: 6
- [ ] `system/access/application-user/pages/application-user-list.html` — colspan: 6
- [ ] `system/access/audit-entries/audit-entries.html` — colspan: 6
- [ ] `system/access/module-app/pages/module-app-list.html` — colspan: 8
- [ ] `system/access/vault-secrets/vault-secrets-list.html` — colspan: 7
- [ ] `system/ai/ai-knowledge-base/ai-knowledge-base-list.html` — colspan: 6
- [ ] `system/ai/knowledge-base/ai-knowledge-base-list.html` — colspan: 6
- [ ] `system/asamblea-checklist-template/asamblea-checklist-template-list.html` — colspan: 9
- [ ] `system/audit-logs/log-api-report/log-api-report.html` — colspan: 5
- [ ] `system/catalogs/banks/bank-list.html` — colspan: 4 ✅ *(ya migrado)*
- [ ] `system/catalogs/cfdi-use/pages/cfdi-use-list.html` — colspan: 3
- [ ] `system/catalogs/machinery-classification/machinery-classification-list.html` — colspan: 3
- [ ] `system/catalogs/meter-category/meter-category-list.html` — colspan: 3
- [ ] `system/catalogs/payment-method/pages/payment-method-list.html` — colspan: 3
- [ ] `system/catalogs/payment-type/payment-type-list.html` — colspan: 3
- [ ] `system/catalogs/product-category/product-category-list.html` — colspan: 3
- [ ] `system/catalogs/units-of-measurement/unit-of-measurement-list.html` — colspan: 3
- [ ] `system/gestin-de-cliente/customer-provider/mis-proveedores-list.html` — colspan: 3
- [ ] `system/gestin-de-cliente/customer-data-company/customer-data-company-list.html` — colspan: 6
- [ ] `system/gestin-de-cliente/customer-modul/pages/customer-modul-list.html` — colspan: 5
- [ ] `system/gestin-de-cliente/customer/pages/customer-list.html` — colspan: 5
- [ ] `system/gestin-de-cliente/delivery-reception-catalog/catalogo-descripcion-list.html` — colspan: 5
- [ ] `system/gestin-de-cliente/email-data/email-data-list.html` — colspan: 5
- [ ] `system/infrastructure/communication/email-data/email-data-list.html` — colspan: 5
- [ ] `system/infrastructure/security/vault/password-manager/pages/password-list.html` — colspan: 5
- [ ] `system/infrastructure/settings/settings-menu/vault-secrets/vault-secrets-list.html` — colspan: 7
- [ ] `system/vault/password-manager/pages/password-list.html` — colspan: 5

---

## Progreso

| Área | Total | ✅ Migrado | ⬜ Pendiente |
|------|-------|-----------|-------------|
| accounting/ar | 3 | — | 3 |
| accounting/fondeos | 3 | — | 3 |
| accounting/general-ledger | 23 | — | 23 |
| hr/chekador | 1 | — | 1 |
| hr/evaluaciones | 4 | — | 4 |
| hr/expediente/employees | 5 | — | 5 |
| hr/expediente/hr-employees | 5 | — | 5 |
| hr/expediente/recursos-humanos | 21 | — | 21 |
| legal | 5 | — | 5 |
| maintenance | 20 | — | 20 |
| operations | 53 | — | 53 |
| purchasing | 29 | — | 29 |
| recruitment | 6 | — | 6 |
| system | 27 | 1 | 26 |
| **Total** | **~205** | **1** | **~204** |
