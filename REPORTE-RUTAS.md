# Reporte de Inventario y Propuesta de Rutas — LuxuryApp Angular

> **Fecha:** 2026-06-27
> **Scope:** `client\angular\src\app\`
> **Archivos de rutas analizados:** 54 (1 root + 20 feature-level + 33 centralized)

---

## 1. Arquitectura Actual — El Problema de los Dos Mundos

Conviven **dos arquitecturas de ruteo incompatibles**:

### 1.1. Arquitectura Legacy (Centralizada en `routing/`)

- **33 archivos** en `src/app/routing/*.routing.ts`
- Cargados desde `pages.routing.ts` bajo el `LayoutEmployee`
- Nombres en transición spanglish (ej: `compras.routing.ts`, `human-resources.routing.ts`)
- Cada archivo define rutas planas (sin anidamiento real por feature)

### 1.2. Arquitectura Feature-Based (en `features/`)

- **8 wrappers** en `features/{modulo}/xxx.routing.ts` que re-exportan el routing legacy
- **8+ sub-routings** adicionales en features (contabilidad, committee, direccion, etc.)
- Cargados desde el bloque "RUTAS DE ARQUITECTURA 8 MÓDULOS" en `pages.routing.ts`
- Los wrappers son **indirecciones inútiles**: solo hacen `children: legacyRoutes`

### 1.3. El Resultado

| Path | Carga | Problema |
|---|---|---|
| `/accounting` | `features/accounting/accounting.routing` → wrapper → `routing/accounting.routing` | Doble indirección |
| `/contabilidad` | `features/accounting/general-ledger/contabilidad/contabilidad.routing` | Ruta directa |
| `/purchases` | `routing/compras.routing` (via pages.routing) | Nombre EN, archivo ES |
| `/purchasing` | `features/purchasing/purchasing.routing` → `routing/compras.routing` | Mismo archivo, paths distintos |

### 1.4. Duplicaciones Detectadas

| Archivo | Ruta 1 | Ruta 2 | ¿Idénticos? |
|---|---|---|---|
| `sat-funding.routes.ts` | `features/accounting/fondeos/...` | `features/accounting/general-ledger/...` | ✅ Sí |
| `password-manager.routes.ts` | `features/system/infrastructure/security/vault/...` | `features/system/vault/...` | ✅ Sí |
| `vault.routing.ts` | `features/system/infrastructure/security/vault/...` | `features/system/vault/...` | ✅ Ambos vacíos |
| `committee.routing.ts` | `features/operations/meetings/committee/...` | `features/legal/asuntos-legales/committee/...` | ✅ Estructuralmente idéntico |

---

## 2. Inventario Completo de Rutas

### 2.1. Rutas Públicas (sin autenticación)

| Ruta | Componente | Archivo |
|---|---|---|
| `/auth` → `""` | LoginWrapper | `routing/auth.routing.ts` |
| `/auth/login` | LoginWrapper | ídem |
| `/auth/recovery-password` | RecoveryWrapper | ídem |
| `/auth/reset-password` | ResetPassword | ídem |
| `/auth/update-user-profile` | UpdateProfile | ídem |
| `/publico/reporte-operacion/:customer/:inicio/:final` | ReportClient | `routing/public.routing.ts` |
| `/publico/operation-report-client/:customer/:inicio/:final` | OperationReportClient | ídem |
| `/publico/reporte-minuta/:customer/:id` | ReportMeeting | ídem |
| `/publico/reporte-ticket-pendientes-proveedor/:customerId/:departamentId` | ReporteTicketPendientesProveedor | ídem |
| `/publico/contabilidad-cliente/:customerId/:anio/:mes` | ContabilidadClienteWrapper | ídem |

### 2.2. Rutas Raíz Especiales

| Ruta | Layout | Guard | Hijos |
|---|---|---|---|
| `/committee` | LayoutCommittee | auth + committeeGuard | `committee.routing` (operations/meetings) |
| `/direccion` | LayoutDireccion | auth + direccionGuard | `direccion.routing` |
| `""` (default) | LayoutEmployee | auth + employeeGuard | `pages.routing` |

### 2.3. Committee Routes (`/committee`)

| Ruta | Componente |
|---|---|
| `""` | HomeComite |
| `board-directors/monthly-meetings` | ReunionesMensualesConsejoDirectivo |
| `board-directors/meeting-minutes` | MinutasReunionesConsejoDirectivo |
| `board-directors/meeting-minutes-detail/:id` | MinutasReunionesConsejoDirectivoDetalle |
| `board-directors/building-insurance-policy` | PolizaSeguroEdificio |
| `board-directors/financial-reports` | InformesFinancierosConsejoDirectivo |
| `board-directors/documents` | BibliotecaConsejoDirectivo |
| `board-directors/documents/{tipo}` | Documentos dinámicos |

### 2.4. Direccion Routes (`/direccion`)

| Ruta | Componente |
|---|---|
| `""` | HomeDireccion |
| `profile` | (carga profile.routing) |

### 2.5. Employee Layout (pages.routing) — Dashboard & Misc

| Ruta | Componente/Tipo |
|---|---|
| `""` | ContainerDashboard |
| `dashboard` | ContainerDashboard |
| `notifications` | NotificationsWrapper |
| `home` | HomeMenu |
| `report-financial-statements` | FinancialReportsWrapper |
| `catalog-replica` | CatalogReplica |
| `balance-mensual` | BalanceMensual |
| `catalog-replica` | CatalogReplica |
| `entrega-recepcion-check` | EntregaRecepcionCheck |
| `contabilidad/reportes` | ReportCatalog |
| `contabilidad/reportes/nuevo` | ReportBuilder |
| `contabilidad/reportes/editar/:id` | ReportBuilder |
| `contabilidad/reportes/ver/:id` | ReportViewer |
| `contabilidad/reportes/guia` | ReportGuide |

### 2.6. Módulo Accounting (Contabilidad)

**Rutas canónicas: `/accounting/...`** (via feature wrapper → routing/accounting)

| Ruta | Componente |
|---|---|
| `budget` | PresupuestoWebAspelWrapper |
| `accounting-catalog` | AccountingCatalog |
| `minutes-pendings` | ContListMinutaPendientes |
| `funding-list` | FundingAccountingList |
| `funding-details/:id` | FundingAccountingDetail |
| `legal-minutes-pendings` | LegalPendientesMinuta |
| `budget-execution` | ProjectedExpensesList |
| `financial-report-sending` | ReporteEnvioFinancieros |
| `financial-statements` | EstadoFinancieroList |
| `financial-summary` | FinancialSummary |
| `budget-proposal` | PresupuestoPropuesta |
| `aspel-customer-empresa` | AspelCustomerEmpresaList |
| `aspel-sync` | AspelSyncComponent |

**Rutas canónicas: `/contabilidad/...`** (via contabilidad.routing)

| Ruta | Componente |
|---|---|
| `""` | MasterDashboard |
| `budget` | PresupuestoWebAspelWrapper |
| `accounting-catalog` | AccountingCatalog |
| `minutes-pendings` | ContListMinutaPendientes |
| `funding-list` | FundingAccountingList |
| `funding-details/:id` | FundingAccountingDetail |
| `legal-minutes-pendings` | LegalPendientesMinuta |
| `budget-execution` | ProjectedExpensesList |
| `financial-report-sending` | ReporteEnvioFinancieros |
| `financial-statements` | EstadoFinancieroList |
| `financial-summary` | FinancialSummary |
| `budget-proposal` | PresupuestoPropuesta |
| `collections` | CobranzaOnlineDashboard |
| `collections/inspection` | CobranzaOnlineInspection |
| `collections/analysis` | CobranzaOnlineAnalysis |
| `collections/reporte-financiero` | CobranzaOnlineReporteFinanciero |
| `collections/presupuesto-contabilidad` | PresupuestoContabilidad |
| `collections/exclusions` | CobranzaOnlineExclusions |
| `accounts` | AccountingCatalog |
| `financial-statements-reports` | FinancialReportsWrapper |
| `aspel-cobranza` | AspelCobranzaHaus |
| `espejo-aspel-full` | EspejoAspelFull |
| `autitoria-cuentas-aspel` | AutitoriaCuentasAspel |

**Rutas `/cobranza-nativa/...`**

| Ruta | Componente |
|---|---|
| `""` | CobranzaNativaDashboard |
| `dashboard` | CobranzaDashboard |
| `charge-templates` | ChargeTemplateList |
| `charges` | ChargeList |
| `payments` | Payments |
| `late-fee-policies` | LateFeePolicyList |
| `estado-cuenta` | NativeStatement |
| `properties` | PropiedadesList |
| `members` | MemberList |
| `approvals` | ApprovalInbox |
| `ledger` | LedgerViewer |
| `period-closures` | PeriodClosureDashboard |
| `regulation-articles` | RegulationArticleList |
| `property-fines` | PropertyFineList |
| `collection-cases` | CollectionCaseList |
| `invoices` | InvoiceList |
| `reconciliation` | ReconciliationDashboard |
| `audit` | FinancialAuditLog |
| `automated-services` | AutomatedServices |
| `charge-template-coverage` | ChargeTemplateCoverage |
| `initial-balance` | InitialBalance |
| `system-overview` | SystemOverview |

### 2.7. Módulo HR (Recursos Humanos)

**Rutas debajo de: `/hr/...`**, `/recursos-humanos/...`, `/human-resources/...` (3 alias)

| Ruta | Componente |
|---|---|
| `""` (dashboard) | HRDashboard |
| `my-requests` | MisPermisosListado |
| `solicitar-permiso` | PermisoForm |
| `permiso/:id/detalle` | PermisoDetalleAprobar |
| `approval` | PanelAprobaciones |
| `solicitar-vacaciones` | VacacionesForm |
| `my-vacations` | MisVacacionesListado |
| `vacaciones/:id/detalle` | VacacionSolicitudDetalle |
| `saldo-vacaciones` | VacacionesSaldo |
| `vacation-calendar` | CalendarioVacacionesPermisos |
| `register-past-vacations` | VacacionesPasadasRegistro |
| `requests-history` | SolicitudesHistorial |
| `admin-balances-vacaciones` | AdminVacacionesBalance |
| `auditoria-vacaciones` | VacacionesAdminAuditoria |
| `chekador-empleados` | ChekadorList |
| `contracts` | WorkContractList |
| `contract-templates` | ContractTemplateList |
| `contract-addendums` | ContractAddendumList |
| `addendum-templates` | AddendumTemplateList |
| `incidents` | IncidentList |
| `incident-dashboard` | IncidentDashboard |
| `incident-reports` | IncidentReport |
| `employee-files` | EmployeeFileList |
| `employee-files/:employeeId` | EmployeeFileDetail |
| `sanctions` | SanctionList |
| `bank-data` | EmployeeBankDataList |
| `nomina` | NominaDashboard |
| `nomina/configuracion` | ConfiguracionNomina |
| `nomina/periodos` | PeriodosNomina |
| `nomina/nominas` | Nominas |
| `nomina/nominas/:id/detalle` | NominaDetalle |
| `nomina/incidencias` | IncidenciasNomina |
| `nomina/tiempo-extra` | TiempoExtra |
| `nomina/prestamos` | PrestamosEmpleado |
| `nomina/evidencias` | EvidenciasNomina |
| `nomina/hoja-incidencias` | HojaIncidencias |

### 2.8. Módulo Legal

**Rutas debajo de: `/legal/...`**

| Ruta | Componente |
|---|---|
| `legal-minutes-pendings` | LegalPendientesMinuta |
| `list-ticket-legal` | TicketLegalLista |
| `pendings` | TicketLegalReportesPendientes |
| `reports-internal` | TicketLegalReportesInternos |
| `reports-external` | TicketLegalReportesExternos |
| `committee-directory` | ComitesList |
| `legal-matter` | AsuntoLegalLista |
| `list-ticket-customer` | TicketLegalListaCliente |
| `ticket/:ticketId` | TicketLegalIndividual |
| `documents/{tipo}` | Documentos dinámicos |

### 2.9. Módulo Purchasing (Compras)

**Rutas debajo de: `/purchases/...`**, `/purchasing/...`, `/compras/...`

*(Nota: `compras.routing.ts` es el archivo fuente, cargado desde varios paths)*

| Ruta | Componente |
|---|---|
| `presupuesto` | PresupuestoWebAspelWrapper |
| `products-services` | ProductosList |
| `purchase-requests` | SolicitudCompraList |
| `solicitud-compra/:id` | SolicitudCompra |
| `pdf-solicitud-compra/:id` | PdfSolicitudCompra |
| `cuadro-comparativo/:id` | CuadroComparativoList |
| `solicitud-compra-presentacion` | SolicitudCompraPresentacion |
| `fixed-expenses-catalog` | CatalogoGastosFijosList |
| `catalogo-gastos-fijos-form/:id` | CatalogoGastoFijoForm |
| `purchase-orders` | OrdenCompraList |
| `orden-compra/:id` | OrdenCompra |
| `orden-compra-pdf/:id` | OrdenCompraPdf |
| `solicitud-pago-pdf/:id` | SolicitudPagoPdf |
| `paid` | OrdenCompraPagadas |
| `maintenance-budget` | GastosMantenimiento |

### 2.10. Módulo Operations

**Rutas debajo de: `/operations/...`**

| Ruta | Componente |
|---|---|
| `my-building` | MiEdificio |
| `inventario-productos` | WarehouseStockList |
| `extintores` | InventarioExtintor |
| `extintores-group` | InventarioExtintorGroup |

*(Operations tiene rutas distribuidas en múltiples archivos de routing)*

### 2.11. Módulo Maintenance

**Rutas debajo de: `/maintenance/...`**

| Ruta | Componente |
|---|---|
| `annual-calendar` | CalendarioMttoList |

### 2.12. Módulo Recruitment

**Rutas debajo de: `/recruitment/...`**

| Ruta | Componente |
|---|---|
| `""` → redirect `plantilla-interna` | — |
| `plantilla-interna` | WorkPositionList |
| `requests` | (shell con children) |
| `requests/vacancies` | VacantesList |
| `requests/hirings` | SolicitudAltaList |
| `requests/dismissals` | SolicitudBajaList |
| `requests/salary-increase` | SolicitudModificacionList |
| `status-solicitud-baja` | StatusRequestDismissal |
| `status-solicitud-modificacion-salario` | StatusRequestSalaryModification |
| `solicitudes_cliente` | SolicitudesClienteList |
| `dismissal-requests` | SolicitudBajaList |

### 2.13. Módulo System (Settings)

**Rutas debajo de: `/settings/...`**, `/system/...`

| Ruta | Componente |
|---|---|
| `home` | SettingsHome |
| `application-user` | ApplicationUserList |
| `clientes` | CustomerList |
| `customer-modul` | CustomerModulList |
| `customer-modul-edit/:customerId/:customerName` | CustomerModulEdit |
| `roles` | RolesList |
| `module-app-rol` | ModuleAppRol |
| `module-app` | ModuleAppList |
| `module-app-rol-update/:roleId/:roleName` | ModuleAppRolUpdate |
| `approval-rules` | ApprovalRules |
| `customer-data-company` | CustomerDataCompanyList |
| `datos-email` | EmailDataList |
| `depuration` | UpdateDataBase |
| `banks` | BankList |
| `forma-pago` | PaymentMethodList |
| `metodo-pago` | PaymentTypeList |
| `uso-cfdi` | CfdiUseList |
| `jobs` | JobsDashboard |
| `app-implementation-report` | AppImplementationTrackingManual |
| `meter-category` | MeterCategoryList |
| `product-category` | ProductCategoryList |
| `machinery-classification` | MachineryClassificationList |
| `units-of-measurement` | UnitOfMeasurementList |
| `audit-entries` | AuditEntries |
| `user-activity-history` | UserActivityHistory |
| `incident-types` | IncidentTypeList |
| `sanction-types` | SanctionTypeList |
| `log-api-report` | LogApiReport |
| `brevo-logs` | BrevoEmailLogs |
| `testsignalr` | Testsignalr |
| `test-email` | TextEmail |
| `mini-postman` | MiniPostman |
| `ticket-group-category` | TaskGroupCategoryList |
| `asamblea-checklist-catalog` | AsambleaChecklistTemplateList |
| `juntas-mensuales-conciliacion` | JuntasMensualesBackfill |
| `inspection-reviews-catalog` | CatalogoRevisionesInspeccion |
| `catalog-asset` | CatalogoActivoLista |
| `entrega-recepcion-cliente` | CatalogoDescripcionList |
| `ui-catalog/...` | (sub-rutas de style guide) |
| `ai-knowledge-base` | AiKnowledgeBaseList |
| `vault-secrets` | VaultSecretsList |
| `eleven-labs` | ElevenLabsSettingsComponent |
| `ia-test` | IaTestComponent |

### 2.14. Otros Módulos (multiples paths)

**Announcements** → `/announcements/...`
**Calendars** → `/calendars/...`
**Committee Meetings** → `/committee-meetings/...`
**Delivery Reception** → `/delivery-reception/...`
**Diagrams** → `/diagram/...`
**Directory** → `/directory/...`
**Employee Evaluation** → `/employee-evaluation/...`
**Funding** → `/funding/...`
**Inspections** → `/inspections/...`
**Inventory** → `/inventory/...`
**Library** → `/library/...`
**Logbook** → `/logbook/...`
**Reports** → `/report/...`
**Supervision** → `/supervision/...`
**Tickets** → `/tickets/...`, `/Tasks`, `/tasks`
**Utilities** → `/utilities/...`
**Warehouse** → `/warehouse/...`
**Recurring Tasks** → `/recurring-tasks/...`
**Password Manager** → `/password-manager/...`
**SAT Funding** → `/sat-funding/...`
**Profile** → `/profile/...`
**Permissions** → `/permissions/...`

---

## 3. Problemas Identificados

### 3.1. Duplicación de Archivos de Ruta

| Archivo | # Copias | Impacto |
|---|---|---|
| `sat-funding.routes.ts` | 2 | Confusión de import, posible bug |
| `password-manager.routes.ts` | 2 | Ídem |
| `vault.routing.ts` | 2 | Archivos vacíos, ruido |
| `committee.routing.ts` | 2 | Lógica duplicada en operations y legal |

### 3.2. Indirecciones Innecesarias

- **8 wrappers** en `features/{modulo}/xxx.routing.ts` que solo hacen `children: legacyRoutes`
- Estas rutas **nunca deberían existir**: son un puente temporal que ya debería eliminarse

### 3.3. Múltiples Alias para el Mismo Módulo

| Módulo | Paths activos |
|---|---|
| RH | `/hr`, `/recursos-humanos`, `/human-resources` |
| Accounting | `/accounting`, `/contabilidad`, `/accounting-coi` (redirect) |
| Compras | `/purchases`, `/purchasing`, `/compras` |
| Tickets | `/tickets`, `/Tasks` (uppercase bug), `/tasks` |
| Legal | `/legal` (cargado 2 veces en pages.routing: desde routing/legal Y desde features/legal) |

### 3.4. Inconsistencias de Idioma y Nomenclatura

| Problema | Ejemplo |
|---|---|
| Spanglish en nombres de ruta | `forma-pago` vs `payment-method`, `datos-email` vs `email-data` |
| Verbos mezclados | `solicitar-permiso` vs `my-requests` |
| Parámetros inconsistentes | `:customer` vs `:customerId` vs `:customerId/:customerName` |
| Uso inconsistente de kebab-case vs otros | Mayoría kebab-case bien, pero hay `reporte-ticket-pendientes-proveedor` |
| Typos | `departamentId` (falta la `e`), `customer-modul` (falta `e`) |

### 3.5. Rutas Huérfanas / Sin Categorizar

| Ruta | Módulo lógico real | Ubicación actual |
|---|---|---|
| `entrega-recepcion-check` | Operations | Suelta en pages.routing |
| `report-financial-statements` | Accounting | Suelta en pages.routing |
| `catalog-replica` | Accounting | Suelta en pages.routing |
| `balance-mensual` | Accounting | Suelta en pages.routing |
| `catalog-replica` | Accounting | Suelta en pages.routing |
| `password-manager` | System/Vault | Via feature directo en pages.routing |
| `sat-funding` | Accounting | Via feature directo en pages.routing |

### 3.6. Carga Duplicada del Mismo Archivo

```typescript
// pages.routing.ts línea 234
{ path: "legal", loadChildren: () => import("src/app/routing/legal.routing") }
// pages.routing.ts línea 565
{ path: "legal", loadChildren: () => import("src/app/features/legal/legal.routing") }
// → AMBAS CARGAN EL MISMO CONTENIDO (legal → routing/legal)
```

---

## 4. Propuesta de Estructura Canónica

### 4.1. Principios Rectores

1. **Un solo archivo por módulo**: Cada módulo tiene exactamente UN archivo de routing en `features/{modulo}/{modulo}.routing.ts`
2. **Sin indirecciones**: Feature routing define rutas directamente, sin delegar a `routing/`
3. **Sin alias**: Cada módulo tiene EXACTAMENTE UN path canónico
4. **Idioma único**: Inglés para paths de ruta (estándar de API REST)
5. **Eliminar `routing/` legacy**: Los archivos en `routing/` se consolidan dentro de sus respectivos features
6. **Sin duplicados de archivos**: sat-funding, password-manager, vault, committee en una sola ubicación

### 4.2. Estructura de Archivos Propuesta

```
src/app/
├── app.routes.ts                          ← Solo 4 paths raíz: auth, publico, committee, direccion, (empty → employee)
│
├── features/
│   ├── accounting/
│   │   ├── accounting.routing.ts          ← ÚNICO routing. Path: "accounting"
│   │   ├── general-ledger/contabilidad/
│   │   │   └── contabilidad.routing.ts    ← Sub-rutas (cargado desde accounting.routing)
│   │   ├── cobranza-nativa/
│   │   │   └── cobranza-nativa.routing.ts ← Sub-rutas (cargado desde accounting.routing)
│   │   └── fondeos/sat-funding/
│   │       └── sat-funding.routes.ts      ← Sub-rutas (cargado desde accounting.routing)
│   │
│   ├── hr/
│   │   └── hr.routing.ts                  ← ÚNICO. Path: "hr"
│   │
│   ├── legal/
│   │   └── legal.routing.ts              ← ÚNICO. Path: "legal"
│   │
│   ├── maintenance/
│   │   └── maintenance.routing.ts        ← ÚNICO. Path: "maintenance"
│   │
│   ├── operations/
│   │   ├── operations.routing.ts         ← ÚNICO. Path: "operations"
│   │   ├── meetings/committee/
│   │   │   └── committee.routing.ts      ← SOLO AQUÍ (eliminar duplicado en legal)
│   │   └── direccion/
│   │       └── direccion.routing.ts      ← Path: "direccion" (cargado desde app.routes)
│   │
│   ├── purchasing/
│   │   └── purchasing.routing.ts         ← ÚNICO. Path: "purchasing" (ES: compras)
│   │
│   ├── recruitment/
│   │   └── recruitment.routing.ts        ← ÚNICO. Path: "recruitment"
│   │
│   └── system/
│       └── system.routing.ts             ← ÚNICO. Path: "system"
│       └── vault/
│           └── password-manager.routes.ts ← SOLO AQUÍ
│
└── routing/                               ← ELIMINAR por completo (33 archivos)
```

### 4.3. Paths Canónicos Propuestos

| Módulo | Path Canónico | Eliminar |
|---|---|---|
| Accounting | `/accounting` | `/contabilidad`, `/accounting-coi` |
| HR | `/hr` | `/recursos-humanos`, `/human-resources` |
| Purchasing | `/purchasing` | `/purchases`, `/compras` |
| System | `/system` | (settings se queda como sub-ruta) |
| Tickets | `/tickets` | `/Tasks`, `/tasks` |
| Legal | `/legal` | — |
| Operations | `/operations` | — |
| Maintenance | `/maintenance` | — |
| Recruitment | `/recruitment` | — |

### 4.4. Mapa de Consolidación (routing/ → features/)

| Archivo actual en `routing/` | Destino en `features/` | Notas |
|---|---|---|
| `accounting.routing.ts` | Merge en `features/accounting/accounting.routing.ts` | Contenido duplicado con contabilidad.routing |
| `announcements.routing.ts` | `features/operations/operations.routing.ts` | Es sub-módulo de Operations |
| `calendars.routing.ts` | `features/operations/operations.routing.ts` | Es sub-módulo |
| `committee-meetings.routing.ts` | `features/operations/operations.routing.ts` | Es sub-módulo |
| `compras.routing.ts` | `features/purchasing/purchasing.routing.ts` | Renombrar a inglés |
| `delivery-reception.routing.ts` | `features/operations/operations.routing.ts` | Es sub-módulo |
| `diagram.routing.ts` | `features/operations/operations.routing.ts` | Es sub-módulo |
| `directory.routing.ts` | `features/operations/operations.routing.ts` | Es sub-módulo |
| `employee-evaluation.routing.ts` | `features/hr/hr.routing.ts` | Es sub-módulo de HR |
| `funding.routing.ts` | `features/accounting/accounting.routing.ts` | Es sub-módulo |
| `human-resources.routing.ts` | `features/hr/hr.routing.ts` | Contenido directo |
| `inspection.routing.ts` | `features/operations/operations.routing.ts` | Es sub-módulo |
| `inventories.routing.ts` | `features/operations/operations.routing.ts` | Es sub-módulo |
| `legal.routing.ts` | `features/legal/legal.routing.ts` | Contenido directo |
| `library.routing.ts` | `features/operations/operations.routing.ts` | Es sub-módulo |
| `logbook.routing.ts` | `features/operations/operations.routing.ts` | Es sub-módulo |
| `maintenance-report.routing.ts` | `features/operations/operations.routing.ts` | Es sub-módulo |
| `maintenance.routing.ts` | `features/maintenance/maintenance.routing.ts` | Contenido directo |
| `operations.routing.ts` | `features/operations/operations.routing.ts` | Contenido directo |
| `pages.routing.ts` | `app.routes.ts` (parcial) + features | Desglosar |
| `permissions.routing.ts` | Eliminar (login duplicado) | Carga login, que ya existe en auth |
| `profile.routing.ts` | `features/system/system.routing.ts` | Es sub-módulo de System |
| `public.routing.ts` | Queda en raíz o `features/reports` | Rutas públicas de reportes |
| `recruitment.routing.ts` | `features/recruitment/recruitment.routing.ts` | Contenido directo |
| `recurring-tasks.routing.ts` | `features/operations/operations.routing.ts` | Es sub-módulo |
| `reports.routing.ts` | `features/operations/operations.routing.ts` | Es sub-módulo |
| `settings.routing.ts` | `features/system/system.routing.ts` | Contenido directo |
| `supervision.routing.ts` | `features/operations/operations.routing.ts` | Es sub-módulo |
| `tickets.routing.ts` | `features/operations/operations.routing.ts` | Es sub-módulo |
| `utilities.routing.ts` | `features/operations/operations.routing.ts` | Es sub-módulo |
| `warehouse.routing.ts` | `features/operations/operations.routing.ts` | Es sub-módulo |

### 4.5. Propuesta de Nombres de Ruta Estandarizados

| Concepto | Español (legacy) | Inglés (propuesto) |
|---|---|---|
| Permisos/Vacaciones | `solicitar-permiso`, `mis-vacaciones` | `leave-requests`, `my-vacations` |
| Compras | `solicitud-compra`, `orden-compra` | `purchase-requests`, `purchase-orders` |
| Catálogos | `forma-pago`, `uso-cfdi`, `metodo-pago` | `payment-methods`, `cfdi-uses`, `payment-types` |
| Clientes | `clientes`, `datos-email` | `customers`, `email-settings` |
| RH | `chekador-empleados`, `saldo-vacaciones` | `employee-checker`, `vacation-balance` |
| Contabilidad | `contabilidad`, `cobranza` | `accounting`, `collections` |
| Reportes | `reporte-equipos`, `reporte-tickets` | `equipment-report`, `ticket-reports` |
| Misc | `gimnasio`, `pintura`, `extintores` | `gym`, `paint`, `extinguishers` |

### 4.6. Orden de Migración (Por Prioridad)

| Fase | Acción | Impacto |
|---|---|---|
| **1** | Eliminar archivos duplicados (sat-funding, vault, password-manager) | Bajo (contenido idéntico) |
| **2** | Eliminar committee.routing.ts de legal (dejar solo en operations) | Bajo (espejo exacto) |
| **3** | Fusionar 8 wrappers de features/ con contenido directo | Medio (rompe imports de routing/) |
| **4** | Elegir path canónico por módulo y eliminar alias | Alto (bookmarks, enlaces, BD) |
| **5** | Migrar routing/ → features/ (mover contenido) | Alto (33 archivos → ~8) |
| **6** | Estandarizar nombres de ruta a inglés | Alto (backlinks, endpoints, BD) |

---

## 5. Resumen Estadístico

| Métrica | Valor |
|---|---|
| Archivos de ruta actuales | 54 |
| Archivos propuestos | ~15 |
| Duplicaciones detectadas | 5 pares (10 archivos) |
| Aliases de módulo | 8 activos |
| Rutas individuales contabilizadas | ~210 |
| Typos identificados | 3+ (departamentId, customer-modul, Tasks) |
| Indirecciones innecesarias | 8 wrappers + 1 carga duplicada de legal |
| **Reducción neta de archivos** | **~72%** (54 → 15) |

---

## 6. Match Angular Routes vs API Backend (por módulo)

### 6.1. Backend API Structure

La API backend consta de **2 proyectos** principales:
- **LuxuryApp.Application** (System module — auth, catalogs, customers, AI, audit)
- **LuxuryApp.Application.Tenant** (Tenant modules — Accounting, HR, Legal, Maintenance, Operations, Purchasing, Recruitment + Infrastructure)

La ruta base de la API es `api/` (atributo `[Route("api/[controller]")]` en la mayoría de controllers).

### 6.2. Módulo System (API: `LuxuryApp.Application/System/`)

| API Controller | Route Atributo | Función | Angular Route Match | Status |
|---|---|---|---|---|
| `AuthController` | `api/auth` | Login, refresh, recovery | `/auth/login`, `/auth/recovery-password`, `/auth/reset-password` | ✅ Match |
| `ApplicationUserController` | `api/application-users` | CRUD usuarios | `/settings/application-user` | ✅ Match |
| `ApplicationRolesController` | `api/application-roles` | CRUD roles | `/settings/roles` | ✅ Match |
| `ModuleAppRolController` | `api/module-app-roles` | Asignación rol-módulo | `/settings/module-app-rol` | ✅ Match |
| `ModuleAppController` | `api/module-apps` | Catálogo de módulos | `/settings/module-app` | ✅ Match |
| `ApprovalRulesController` | `api/approval-rules` | Jerarquía de aprobación | `/settings/approval-rules` | ✅ Match |
| `PasswordsController` | `api/password-manager` | Gestor de contraseñas | `/password-manager` (directo) | ✅ Match |
| `UsersController` | `api/users` | Perfil de usuario | `/profile/update-user-profile` | ✅ Match |
| `AccesoCustomersController` | `api/accesocustomers` | Acceso clientes | `/auth/update-user-profile` | ⚠️ Ruta extraña |
| `CustomersController` | `api/customers` | CRUD clientes | `/settings/clientes` | ✅ Match |
| `CustomerModulController` | `api/module-app-customers` | Módulos por cliente | `/settings/customer-modul` | ✅ Match |
| `CustomerDataCompanyController` | `api/customer-data-company` | Datos empresa | `/settings/customer-data-company` | ✅ Match |
| `CustomerAddressesController` | `api/customer-addresses` | Direcciones cliente | ❌ Sin ruta directa | ❌ Missing |
| `CustomerImagesController` | `api/customer-images` | Imágenes cliente | ❌ Sin ruta directa | ❌ Missing |
| `BanksController` | `api/banks` | Catálogo bancos | `/settings/banks` | ✅ Match |
| `PaymentMethodsController` | `api/payment-methods` | Formas de pago | `/settings/forma-pago` | ⚠️ Nombre ES vs EN |
| `MetodoPagoController` | `api/metodo-pago` | Métodos de pago | `/settings/metodo-pago` | ✅ Match |
| `UsoCfdiController` | `api/cfdi-use` | Usos CFDI | `/settings/uso-cfdi` | ✅ Match |
| `EmailDataController` | `api/emaildata` | Datos de correo | `/settings/datos-email` | ✅ Match |
| `UnidadMedidaController` | `api/unidadmedida` | Unidades de medida | `/settings/units-of-measurement` | ⚠️ EN/ES mismatch |
| `TelefonosEmergenciaController` | `api/telefonosemergencia` | Teléfonos emergencia | `/directory/emergency-phones` | ❌ **EN/ES mismatch** |
| `MedidorCategoriaController` | `api/medidorcategoria` | Categorías medidor | `/settings/meter-category` | ✅ Match |
| `MedidorController` | `api/medidor` | Medidores | `/logbook/meter-list` | ✅ Match |
| `MedidorLecturaController` | `api/medidorlectura` | Lectura medidores | `/logbook/lista-medidor-lectura` | ✅ Match |
| `AuditEntriesController` | `api/auditentries` | Auditoría cambios | `/settings/audit-entries` | ✅ Match |
| `LogsController` | `api/logs` | Logs API | `/settings/log-api-report` | ✅ Match |
| `BrevoEmailLogController` | `api/brevo-email-log` | Logs Brevo | `/settings/brevo-logs` | ✅ Match |
| `UserActivityHistoryController` | `api/useractivityhistory` | Actividad usuarios | `/settings/user-activity-history` | ✅ Match |
| `AiChatController` | `api/aichat` | Chat IA | ❌ No hay ruta explícita | ❌ Missing |
| `AiKnowledgeBaseController` | `api/aiknowledgebase` | Base conocimiento IA | `/settings/ai-knowledge-base` | ✅ Match |
| `ElevenLabsController` | `api/eleven-labs` | Config ElevenLabs | `/settings/eleven-labs` | ✅ Match |
| `GeneralCatalogs/CategoriesController` | `api/categories` | Categorías generales | `/settings/product-category` | ⚠️ Match parcial |
| `GeneralCatalogs/CatalogAssetController` | `api/catalogasset` | Catálogo amenidades | `/settings/catalog-asset` | ✅ Match |
| `GeneralCatalogs/ConfiguracionController` | `api/configuracion` | Configuración general | ❌ Sin ruta directa | ❌ Missing |
| `GeneralCatalogs/AddressController` | `api/address` | Direcciones | ❌ Sin ruta directa | ❌ Missing |

### 6.3. Módulo Accounting (API: `Tenant/Accounting/`)

| API Controller | Route | Angular Route | Status |
|---|---|---|---|
| `AccountingCatalogController` | `api/accountingcatalog` | `/accounting/accounting-catalog` | ✅ Match |
| `AspelCobranzaController` | `api/aspel-cobranza` | `/contabilidad/aspel-cobranza` | ✅ Match |
| `PresupuestoController` | `api/presupuesto` | `/accounting/budget` | ✅ Match |
| `FinancialReportController` | `api/financialreport` | `/contabilidad/financial-statements-reports` | ✅ Match |
| `FundingController` | `api/funding` | `/funding/list` | ✅ Match |
| `FundingAccountingController` | `api/fundingaccounting` | `/accounting/funding-list` | ✅ Match |
| `MaintenanceReportController` | `api/maintenancereport` | `/report/maintenance-report/panel` | ⚠️ Cross-module |
| `BudgetProposalController` | `api/budgetproposal` | `/accounting/budget-proposal` | ✅ Match |
| `ProjectedExpensesController` | `api/projectedexpenses` | `/accounting/budget-execution` | ✅ Match |
| `DynamicReportController` | `api/dynamic-reports` | `/contabilidad/reportes/*` | ✅ Match |
| `CobranzaOnlineDashboardController` | `api/accounting-coi/cobranza-online` | `/contabilidad/collections/...` | ✅ Match |
| 17 CobranzaNativa controllers | `api/accounting-coi/native-collection/*` | `/cobranza-nativa/*` | ✅ Match |
| `EspejoAspelFullController` | `api/espejo-aspel-full` | `/contabilidad/espejo-aspel-full` | ✅ Match |
| `AspelSyncController` | `api/accounting-coi/migration/aspel-sync` | `/accounting/aspel-sync` | ✅ Match |
| `AspelCustomerEmpresaController` | `api/aspel-customer-empresa` | `/accounting/aspel-customer-empresa` | ✅ Match |
| `AutitoriaCuentasAspelController` | `api/autitoria-cuentas-aspel` | `/contabilidad/autitoria-cuentas-aspel` | ✅ Match (con typo!) |

### 6.4. Módulo HR (API: `Tenant/Hr/`)

| API Controller | Route | Angular Route | Status |
|---|---|---|---|
| `EmployeesController` | `api/employees` | `/directory/internal-staff` | ✅ Match |
| `EmployeeExternalController` | `api/employeeexternal` | `/directory/external-staff` | ✅ Match |
| `WorkPositionOrgChartController` | `api/workpositionorgchart` | `/directory/work-position-org-chart` | ✅ Match |
| `BirthdayController` | `api/birthday` | `/calendars/birthdays` | ⚠️ Cross-module |
| `ChekadorEmpleadosController` | `api/chekador-empleados` | `/hr/chekador-empleados` | ✅ Match |
| `MyVacationRequestsController` | `api/my-vacation-requests` | `/hr/my-vacations` | ✅ Match |
| `VacationRequestApprovalController` | `api/vacation-request-approvals` | `/hr/vacaciones/:id/detalle` | ✅ Match |
| `PastVacationsController` | `api/past-vacations` | `/hr/register-past-vacations` | ✅ Match |
| `MyLeaveRequestsController` | `api/my-leave-requests` | `/hr/my-requests` | ✅ Match |
| `LeaveRequestApprovalController` | `api/leave-request-approvals` | `/hr/permiso/:id/detalle` | ✅ Match |
| `WorkContractController` | `api/hr/work-contracts` | `/hr/contracts` | ✅ Match |
| `ContractTemplateController` | `api/hr/contract-templates` | `/hr/contract-templates` | ✅ Match |
| `ContractAddendumController` | `api/hr/contract-addendums` | `/hr/contract-addendums` | ✅ Match |
| `AddendumTemplateController` | `api/hr/addendum-templates` | `/hr/addendum-templates` | ✅ Match |
| `EmployeeFileController` | `api/hr/employee-files` | `/hr/employee-files` | ✅ Match |
| `EmployeeBankDataController` | `api/employeebankdata` | `/hr/bank-data` | ✅ Match |
| `IncidentController` | `api/hr/incidents` | `/hr/incidents` | ✅ Match |
| `SanctionController` | `api/hr/sanctions` | `/hr/sanctions` | ✅ Match |
| `IncidentTypeController` | `api/hr/incident-types` | `/settings/incident-types` | ⚠️ Cross-module |
| `SanctionTypeController` | `api/hr/sanction-types` | `/settings/sanction-types` | ⚠️ Cross-module |
| `PerformanceEvaluationsController` | `api/performanceevaluations` | `/employee-evaluation/*` | ⚠️ Cross-module |
| `TemplateEvaluationController` | `api/templateevaluation` | `/employee-evaluation/templates/*` | ⚠️ Cross-module |
| `NominaEncabezadoController` | `api/hr/nomina` | `/hr/nomina` | ✅ Match |
| `NominaDetalleController` | `api/hr/nomina/{nominaId}/detalles` | `/hr/nomina/nominas/:id/detalle` | ✅ Match |
| `PeriodoNominaController` | `api/hr/nomina/periodos` | `/hr/nomina/periodos` | ✅ Match |
| `ConfiguracionNominaController` | `api/hr/nomina/configuracion` | `/hr/nomina/configuracion` | ✅ Match |
| `IncidenciaNominaController` | `api/hr/nomina/incidencias` | `/hr/nomina/incidencias` | ✅ Match |
| `TiempoExtraController` | `api/hr/nomina/tiempo-extra` | `/hr/nomina/tiempo-extra` | ✅ Match |
| `PrestamosController` | `api/hr/nomina/prestamos` | `/hr/nomina/prestamos` | ✅ Match |
| `EvidenciasNominaController` | `api/hr/nomina` | `/hr/nomina/evidencias` | ✅ Match |
| `VacationBalanceAdminController` | `api/admin/vacation-balances` | `/hr/admin-balances-vacaciones` | ✅ Match |

### 6.5. Módulo Legal (API: `Tenant/Legal/`)

| API Controller | Route | Angular Route | Status |
|---|---|---|---|
| `BoardDirectorsController` | `api/boarddirectors` | `/committee/board-directors/...` | ⚠️ Ruta en committee |
| `PolicyContractController` | `api/policycontract` | `/library/maintenance-policies` | ⚠️ Cross-module |
| `LegalDirectoriesController` | `api/legaldirectories` | `/legal/committee-directory` | ✅ Match |
| `LegalMatterController` | `api/legalmatter` | `/legal/legal-matter` | ✅ Match |
| `LegalMinutaController` | `api/legalminuta` | `/legal/legal-minutes-pendings` | ✅ Match |
| `LegalReportController` | `api/legalreport` | `/legal/*` (varios) | ✅ Match |

### 6.6. Módulo Maintenance (API: `Tenant/Maintenance/`)

| API Controller | Route | Angular Route | Status |
|---|---|---|---|
| `CalendarioMaestroController` | `api/calendariomaestro` | `/calendars/maintenance-master` | ⚠️ Cross-module |
| `CalendarioMaestroEquipoController` | `api/calendariomaestroequipo` | `/calendars/team-master-calendar` | ⚠️ Cross-module |
| `MaintenanceCalendarsController` | `api/maintenancecalendars` | `/maintenance/annual-calendar` | ✅ Match |
| `MachineriesController` | `api/machineries` | `/inventory/areas-equipment` | ⚠️ Cross-module |
| `MachineryAssetController` | `api/machineryasset` | `/inventory/reporte-equipos` | ⚠️ Cross-module |
| `InventarioExtintorController` | `api/inventarioextintor` | `/inventory/extinguishers` | ⚠️ Cross-module (ES/EN) |
| `BitacoraExtintorController` | `api/bitacoraextintor` | `/logbook/fire-extinguisher-log/:id` | ✅ Match |
| `InventarioHidranteController` | `api/inventariohidrante` | `/inventory/hydrants` | ⚠️ Cross-module |
| `BitacoraHidranteController` | `api/bitacorahidrante` | `/logbook/hydrant-log/:id` | ✅ Match |
| `PiscinaController` | `api/piscina` | `/logbook/pool` | ✅ Match |
| `PiscinaBitacoraController` | `api/piscinabitacora` | `/logbook/piscina-bitacora/:id` | ✅ Match |
| `RecepcionPipasAguaController` | `api/recepcion-pipas-agua` | `/logbook/water-truck-reception` | ✅ Match |
| `ToolLoan/ControlPrestamoHerramientasController` | `api/controlprestamoherramientas` | `/warehouse/tool-loan`, `/logbook/tool-loan-report` | ⚠️ Múltiples rutas |
| `ElevatorsEmergencyCallController` | `api/elevatorsemergencycall` | `/logbook/elevators-emergency-call` | ✅ Match |
| `ElevatorSparePartsChangeController` | `api/elevatorsparepartschange` | `/logbook/elevator-spare-parts-change` | ✅ Match |
| `EquipmentInspectionDefinitionsController` | `api/equipmentinspectiondefinitions` | `/logbook/equipment-inspection/:code` | ✅ Match |
| `FireInspectionPeriods` (4 controllers) | `api/*` | `/logbook/fire-inspection-*` | ✅ Match |
| `InventarioEstacionManualController` | `api/inventarioestacionmanual` | `/inventory/manual-call-points` | ✅ Match |
| `InventarioDetectorHumoController` | `api/inventariodetectorthumo` | `/inventory/smoke-detectors` | ✅ Match |

### 6.7. Módulo Operations (API: `Tenant/Operations/`)

| API Controller | Route | Angular Route | Status |
|---|---|---|---|
| `DashboardController` | `api/dashboard` | `/dashboard`, `/` | ✅ Match |
| `AnnouncementsController` | `api/announcements` | `/announcements/*` | ✅ Match |
| `PropertyController` | `api/property` | `/directory/properties` | ✅ Match |
| `OwnerController` | `api/owner` | `/directory/condos` | ✅ Match |
| `MiEdificioController` | `api/miedificio` | `/operations/my-building` | ✅ Match |
| `ComiteVigilanciaController` | `api/comitevigilancia` | `/directory/vigilance-committee` | ✅ Match |
| `CustomDocumentController` | `api/customdocument` | `/library/*` (varios) | ⚠️ Cross-module |
| `DiagramDrawController` | `api/diagramdraw` | `/diagram/*` | ✅ Match |
| `EntregaRecepcion*` (4 controllers) | `api/*` | `/delivery-reception/*` | ✅ Match |
| `Inspections*` (5 controllers) | `api/*` | `/inspections/*` | ✅ Match |
| `Inventory*` (6 controllers) | `api/*` | `/inventory/*`, `/warehouse/*` | ✅ Match |
| `Meetings*` (6 controllers) | `api/*` | `/committee-meetings/*` | ✅ Match |
| `JuntaMensualSessionController` | `api/juntamensualsession` | `/committee-meetings/sessions` | ✅ Match |
| `PresentacionJuntaComiteController` | `api/presentacionjuntacomite` | `/committee-meetings/presentations` | ✅ Match |
| `ServiceOrdersController` | `api/serviceorders` | `/logbook/maintenance-orders` | ⚠️ Cross-module |
| `Supervision*` (2 controllers) | `api/*` | `/supervision/*` | ✅ Match |
| `Tasks*` (8 controllers) | `api/tasks/*`, `api/task-groups/*` | `/tickets/*` | ✅ Match |
| `ResumenGeneralController` | `api/resumengeneral` | ❌ Sin ruta directa | ❌ Missing |
| `ResponsablesClienteController` | `api/responsables-cliente` | ❌ Sin ruta directa | ❌ Missing |
| `PropertyOccupantController` | `api/propertyoccupant` | ❌ Sin ruta directa | ❌ Missing |
| `GoogleCalendarEventsController` | `api/google-calendar-events` | `/calendars/google-calendar` | ✅ Match |
| `AgendaSemanalController` | `api/direccion-dashboard` | `/direccion/*` (dashboard) | ✅ Match |

### 6.8. Módulo Purchasing (API: `Tenant/Purchasing/`)

| API Controller | Route | Angular Route | Status |
|---|---|---|---|
| `ProvidersController` | `api/providers` | `/directory/provider` | ⚠️ Cross-module |
| `QualificationProviderController` | `api/qualificationprovider` | ❌ Sin ruta directa | ❌ Missing |
| `SolicitudCompraController` | `api/solicitudcompra` | `/purchases/purchase-requests` | ⚠️ EN/ES mismatch |
| `OrdenCompraController` | `api/ordencompra` | `/purchases/purchase-orders` | ⚠️ EN/ES mismatch |
| `CotizacionProveedorController` | `api/cotizacionproveedor` | `/purchases/cuadro-comparativo/:id` | ⚠️ Match parcial |

### 6.9. Módulo Recruitment (API: `Tenant/Recruitment/`)

| API Controller | Route | Angular Route | Status |
|---|---|---|---|
| `WorkPositionController` | `api/work-positions` | `/recruitment/plantilla-interna` | ✅ Match |
| `SolicitudesReclutamientoController` | `api/solicitudesreclutamiento` | `/recruitment/requests/*` | ✅ Match |
| `RequestPositionController` | `api/requestposition` | `/recruitment/requests` (vacancies) | ✅ Match |
| `RequestEmployeeRegisterController` | `api/requestemployeeregister` | `/recruitment/requests/hirings` | ✅ Match |
| `RequestDismissalController` | `api/requestdismissal` | `/recruitment/requests/dismissals` | ✅ Match |
| `RequestSalaryModificationController` | `api/requestsalarymodification` | `/recruitment/requests/salary-increase` | ✅ Match |
| `CustomerProviderController` | `api/customerprovider` | `/directory/mis-proveedores` | ⚠️ Cross-module |
| `JobDescriptionController` | `api/job-descriptions` | ❌ Sin ruta directa | ❌ Missing |
| `ProviderSupportController` | `api/providersupport` | ❌ Sin ruta directa | ❌ Missing |
| `TaskTemplatesController` | `api/recurring-tasks/templates` | `/recurring-tasks` | ✅ Match |
| `TaskInstancesController` | `api/recurring-tasks/instances` | `/recurring-tasks/my-tasks` | ✅ Match |

### 6.10. Controllers sin Ruta Angular Directa

| API Controller | Ruta API | Propuesta de ruta Angular |
|---|---|---|
| `CustomerAddressesController` | `api/customer-addresses` | `/settings/customer-addresses` |
| `CustomerImagesController` | `api/customer-images` | `/settings/customer-images` (modal desde customers) |
| `QualificationProviderController` | `api/qualificationprovider` | `/purchasing/provider-qualification` |
| `PropertyOccupantController` | `api/propertyoccupant` | `/directory/property-occupants` |
| `ResponsablesClienteController` | `api/responsables-cliente` | `/operations/client-managers` |
| `ResumenGeneralController` | `api/resumengeneral` | `/operations/general-summary` |
| `JobDescriptionController` | `api/job-descriptions` | `/recruitment/job-descriptions` |
| `ProviderSupportController` | `api/providersupport` | `/recruitment/provider-support` |
| `AiChatController` | `api/aichat` | `/ai/chat` |
| `GeneralCatalogs/ConfiguracionController` | `api/configuracion` | `/settings/configuration` |
| `GeneralCatalogs/AddressController` | `api/address` | `/settings/addresses` |
| `VaultSecretsController` | `api/vault-secrets` | `/system/vault-secrets` |
| `RequestDismissalDiscountController` | `api/requestdismissaldiscount` | `/recruitment/dismissal-discounts` |

---

## 7. Diagnóstico de Discrepancias API vs Angular

### 7.1. Cross-Module Contamination (API en módulo A, ruta Angular en módulo B)

| API Controller (en módulo) | Ruta Angular (en módulo) | Problema |
|---|---|---|
| `BirthdayController` (HR) | `/calendars/birthdays` (Operations) | Calendario de cumpleaños en módulo HR de API, ruta en Calendars de FE |
| `IncidentTypeController` (HR) | `/settings/incident-types` (System) | Catálogo de tipos de incidencia en HR de API, ruta en Settings de FE |
| `PerformanceEvaluationsController` (HR) | `/employee-evaluation/*` (ruta suelta) | Evaluaciones son HR, pero tienen ruta independiente |
| `MaintenanceReportController` (Accounting) | `/report/maintenance-report/*` (Reports) | Reportes de mantenimiento en Accounting de API |
| `PolicyContractController` (Legal) | `/library/maintenance-policies` (Operations) | Contratos y pólizas en Legal de API |
| `MaintenanceCalendarsController` (Maintenance) | `/maintenance/annual-calendar` (Maintenance) | ✅ Este sí está bien |
| `ProvidersController` (Purchasing) | `/directory/provider` (Operations) | Directorio de proveedores cruzado |
| `CustomerProviderController` (Recruitment) | `/directory/mis-proveedores` (Operations) | Proveedores de cliente en Recruitment |
| `FireEquipment*` (Maintenance) | `/inventory/*` (Operations) | Equipo contra incendio en Maintenance de API |
| `CalendarioMaestroController` (Maintenance) | `/calendars/maintenance-master` (Operations) | Calendario maestro de mantenimiento |

### 7.2. Inconsistencias de Idioma (API vs Angular)

| API Route (idioma) | Angular Route (idioma) | Gap |
|---|---|---|
| `api/solicitudcompra` (ES) | `/purchasing/purchase-requests` (EN) | ES → EN bridge |
| `api/telefonosemergencia` (ES) | `/directory/emergency-phones` (EN) | ES → EN |
| `api/payment-methods` (EN) | `/settings/forma-pago` (ES) | EN → ES |
| `api/unidadmedida` (ES) | `/settings/units-of-measurement` (EN) | ES → EN |
| `api/inventarioextintor` (ES) | `/inventory/extinguishers` (EN) | ES → EN |

### 7.3. Módulos con Representación Fragmentada en Angular

| Módulo API | Archivos de ruta Angular que lo referencian | # Routings |
|---|---|---|
| **Operations** | `operations.routing`, `announcements.routing`, `calendars.routing`, `committee-meetings.routing`, `delivery-reception.routing`, `diagram.routing`, `directory.routing`, `inspection.routing`, `inventories.routing`, `library.routing`, `logbook.routing`, `maintenance-report.routing`, `recurring-tasks.routing`, `reports.routing`, `supervision.routing`, `tickets.routing`, `warehouse.routing`, `direccion.routing`, `committee.routing` | **18 archivos** |
| **Maintenance** | `maintenance.routing`, `maintenance-report.routing`, `inventories.routing` (parcial), `logbook.routing` (parcial) | **4 archivos** |
| **HR** | `human-resources.routing`, `employee-evaluation.routing`, `directory.routing` (parcial) | **3 archivos** |
| **System** | `settings.routing`, `profile.routing`, `auth.routing` (parcial), `password-manager.routes` | **4 archivos** |

---

## 8. Propuesta de Refactorización Basada en la Estructura de la API

### 8.1. Principio Rector

**La estructura de rutas del frontend debe reflejar la organización de la API backend.** Cada módulo de la API (`Tenant/Xxx`) debe tener su propio archivo de routing frontal con el mismo nombre y paths que correspondan 1:1.

### 8.2. Estructura Propuesta de Frontend (1:1 con API)

```
src/app/features/
├── accounting/              ← LuxuryApp.Application.Tenant/Accounting
│   └── accounting.routing.ts      path: "accounting"
│       ├── accounting-catalog
│       ├── budget
│       ├── budget-proposal
│       ├── budget-execution
│       ├── collections/...         ← CobranzaOnline
│       ├── funding/...
│       ├── cobranza-nativa/...     ← CobranzaNativa (path: "collections/native")
│       ├── dynamic-reports/...
│       └── ... (demás sub-rutas)
│
├── hr/                      ← LuxuryApp.Application.Tenant/Hr
│   └── hr.routing.ts               path: "hr"
│       ├── dashboard
│       ├── employees/...
│       ├── leaves/...
│       ├── vacations/...
│       ├── attendance/             ← ChekadorEmpleados
│       ├── contracts/...
│       ├── incidents/...
│       ├── evaluations/...         ← PerformanceEvaluation / EmployeeEvaluation
│       ├── payroll/...             ← Nomina
│       └── ...
│
├── legal/                   ← LuxuryApp.Application.Tenant/Legal
│   └── legal.routing.ts            path: "legal"
│       ├── tickets/...
│       ├── minutes/...
│       ├── matters/...
│       ├── documents/...
│       ├── committee-directory
│       └── ...
│
├── maintenance/             ← LuxuryApp.Application.Tenant/Maintenance
│   └── maintenance.routing.ts      path: "maintenance"
│       ├── annual-calendar
│       ├── calendars/...
│       ├── machinery/...
│       ├── fire-equipment/...
│       ├── pools/...
│       ├── water-trucks/...
│       ├── tools/...
│       ├── elevators/...
│       ├── inspections/...
│       └── ...
│
├── operations/              ← LuxuryApp.Application.Tenant/Operations
│   └── operations.routing.ts       path: "operations"
│       ├── dashboard
│       ├── announcements
│       ├── properties
│       ├── owners
│       ├── my-building
│       ├── vigilance-committee
│       ├── inspection/...
│       ├── inventory/...
│       ├── warehouse/...
│       ├── meetings/...
│       ├── diagrams/...
│       ├── delivery-reception/...
│       ├── supervision/...
│       ├── tasks/...               ← Tickets
│       ├── service-orders/...
│       ├── directories/...
│       ├── calendar/...
│       └── ...
│
├── purchasing/              ← LuxuryApp.Application.Tenant/Purchasing
│   └── purchasing.routing.ts       path: "purchasing"
│       ├── providers
│       ├── purchase-requests
│       ├── purchase-orders
│       ├── quotations
│       ├── qualifications
│       └── ...
│
├── recruitment/             ← LuxuryApp.Application.Tenant/Recruitment
│   └── recruitment.routing.ts      path: "recruitment"
│       ├── work-positions
│       ├── requests/...
│       │   ├── vacancies
│       │   ├── hirings
│       │   ├── dismissals
│       │   └── salary-increase
│       ├── job-descriptions
│       └── ...
│
└── system/                  ← LuxuryApp.Application/System
    └── system.routing.ts           path: "system"
        ├── users
        ├── roles
        ├── modules
        ├── customers
        ├── catalogs/...
        ├── audit
        ├── ai/...
        ├── email
        ├── password-manager
        └── ...
```

### 8.3. Rutas Cross-Module a Reubicar

| Ruta Actual (Angular) | Módulo API Real | Nueva Ubicación Propuesta |
|---|---|---|
| `/calendars/birthdays` | HR | `/hr/calendar/birthdays` |
| `/settings/incident-types` | HR | `/hr/settings/incident-types` |
| `/employee-evaluation/*` | HR | `/hr/evaluations/...` |
| `/report/maintenance-report/*` | Maintenance | `/maintenance/reports/...` |
| `/library/maintenance-policies` | Legal | `/legal/policies` |
| `/directory/provider` | Purchasing | `/purchasing/providers` |
| `/directory/mis-proveedores` | Recruitment | `/recruitment/my-providers` |
| `/settings/clientes` | System | `/system/customers` |
| `/inventory/extinguishers` | Maintenance | `/maintenance/fire-equipment/extinguishers` |

### 8.4. Eliminación de Redundancias (basado en correspondencia 1:1)

| Acción | Razón |
|---|---|
| Eliminar `routing/compras.routing.ts` | La API usa `api/providers`, `api/solicitudcompra`, `api/ordencompra` → el frontend debe usar `purchasing/*` |
| Eliminar `routing/human-resources.routing.ts` | La API tiene `Tenant/Hr/*` → el FE debe tener un solo `hr/*` |
| Fusionar `routing/legal.routing.ts` + `features/legal/legal.routing.ts` | Archivos duplicados con mismo contenido |
| Eliminar wrappers de `features/{modulo}/xxx.routing.ts` | Deben ser el archivo definitivo, no un proxy |
| Normalizar `settings.routing.ts` → `system.routing.ts` | La API se llama `System/` |
| Eliminar `routing/employee-evaluation.routing.ts` | Mover a `features/hr/hr.routing.ts` |

### 8.5. Tabla de Mapeo 1:1 (API Controller → Angular Route)

```
API Route                             Angular Route (propuesto)
────────────────────────────────────  ────────────────────────────────
api/auth                              /auth/*
api/auth/Login                        /auth/login
api/auth/RecoverPassword              /auth/recovery
api/application-users                 /system/users
api/application-roles                 /system/roles
api/module-apps                       /system/modules
api/module-app-roles                  /system/module-roles
api/customers                         /system/customers
api/module-app-customers              /system/customer-modules
api/customer-data-company             /system/customer-companies
api/banks                             /system/catalogs/banks
api/payment-methods                   /system/catalogs/payment-methods
api/cfdi-use                          /system/catalogs/cfdi-uses
api/approval-rules                    /system/approval-rules
api/password-manager                  /system/password-manager
api/employees                         /hr/employees
api/my-vacation-requests              /hr/vacations/my-requests
api/leave-request-approvals           /hr/leaves/approvals
api/hr/work-contracts                 /hr/contracts
api/hr/incidents                      /hr/incidents
api/hr/nomina                         /hr/payroll
api/hr/nomina/periodos                /hr/payroll/periods
api/dashboard                         /operations/dashboard
api/announcements                     /operations/announcements
api/property                          /operations/properties
api/meetings                          /operations/meetings
api/tasks                             /operations/tickets
api/task-groups                       /operations/ticket-groups
api/customdocument                    /operations/documents
api/diagramdraw                       /operations/diagrams
api/inspection                        /operations/inspections
api/ordencompra                       /purchasing/purchase-orders
api/solicitudcompra                   /purchasing/purchase-requests
api/providers                         /purchasing/providers
api/work-positions                    /recruitment/work-positions
api/requestposition                   /recruitment/requests/vacancies
api/solicitudesreclutamiento          /recruitment/requests
api/accountingcatalog                 /accounting/catalog
api/presupuesto                       /accounting/budget
api/funding                           /accounting/funding
api/dynamic-reports                   /accounting/reports
api/accounting-coi/native-collection  /accounting/collections/native/...
```

### 8.6. Resumen de la Refactorización

| Concepto | Actual | Propuesto | Reducción |
|---|---|---|---|
| Archivos de routing | 54 | ~15 | **-72%** |
| Wrappers innecesarios | 8 | 0 | **-100%** |
| Aliases por módulo | 8 | 0 | **-100%** |
| Cross-module references | ~20 | 0 | **-100%** |
| Archivos duplicados | 5 pares | 0 | **-100%** |
| Inconsistencias EN/ES | ~15 rutas | 0 | **-100%** |
| **Estructura** | Plana y fragmentada | Anidada 1:1 con API | — |

### 8.7. Orden de Migración Recomendado

| Fase | Acción | Dependencias |
|---|---|---|
| **1** | Eliminar archivos duplicados de API (sat-funding, vault, password-manager) | Ninguna |
| **2** | Renombrar `settings.routing.ts` → `system.routing.ts` y reubicar en features | Ajustar imports en pages.routing |
| **3** | Crear `features/hr/hr.routing.ts` con contenido directo (absorber human-resources.routing + employee-evaluation.routing) | Eliminar routing/legacy |
| **4** | Consolidar `features/operations/operations.routing.ts` absorbiendo: announcements, calendars, committee-meetings, delivery-reception, diagram, directory, inspection, inventories, library, logbook, maintenance-report, reports, supervision, tickets, warehouse, recurring-tasks, utilities | Refactor mayor |
| **5** | Elegir path canónico por módulo y redirigir/eliminar los alias | Actualizar sidebar, BD |
| **6** | Estandarizar nombres de ruta a inglés (coherente con API routes) | Actualizar endpoints |
| **7** | Reubicar rutas cross-module | Actualizar imports |
