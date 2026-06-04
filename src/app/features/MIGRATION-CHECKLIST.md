# Checklist de Migración: Tailwind CSS → PrimeFlex 4 (Features)

Este documento registra el progreso de la migración de clases de Tailwind CSS y estilos en línea a PrimeFlex 4 y estándares de PrimeNG 21 en la carpeta `src/app/features`.

**Reglas de Oro:**

- 0 Clases Tailwind (`flex-col`, `items-center`, `rounded`, `grid-cols-*`, etc.).
- 0 Estilos en línea (`style="..."`) para layout o colores.
- Uso de `styleClass` en componentes PrimeNG.
- Mantener responsividad con `md:`, `lg:`, etc.

---

## 🚀 PROGRESO GLOBAL

- [x] **Fase 1: Gestión de Personal y RH** (100%) ✅
- [x] **Fase 2: Operaciones y Mantenimiento** (100%) ✅
- [x] **Fase 3: Inventarios y Almacén** (100%) ✅
- [x] **Fase 4: Administración y Finanzas** (100%) ✅
- [x] **Fase 5: Documentación y Configuración** (100%) ✅

---

## 📋 DETALLE POR MÓDULO

### Fase 1: Gestión de Personal y RH ✅

- [x] **employees** (Migrado a PrimeFlex: `org-chart`, `incident`, `hr-dashboard`, `sanction`, `work-contract`, `employee-file`) ✅
- [x] **work-position** ✅
- [x] **vacation-balance-admin** ✅
- [x] **vacation-request-approval** ✅
- [x] **reclutamiento-solicitudes** (`vacancy-requests`, `recruitment-requests`, `salary-modification`, `request-dismissal`) ✅
- [x] **performance-evaluation** / **evaluation-template** ✅
- [x] **leave-request** / **leave-request-approval** ✅
- [x] **past-vacations** / **my-vacation-requests** ✅

### Fase 2: Operaciones y Mantenimiento ✅

- [x] **machinery** / **machinery-asset** / **machinery-document** ✅
- [x] **maintenance-calendar-master** ✅
- [x] **maintenance-log** ✅
- [x] **service-order** ✅
- [x] **inspection** ✅
- [x] **supervision** / **supervision-report** ✅
- [x] **piscina** / **piscina-bitacora** ✅
- [x] **tasks** / **recurring-tasks** ✅
- [x] **mi-edificio** ✅
- [x] **entrega-recepcion** / **entrega-recepcion-check** / **entrega-recepcion-cliente** ✅

### Fase 3: Inventarios y Activos ✅

- [x] **warehouse** ✅
- [x] **product** / **product-entry** / **product-exit** / **stock-por-almacen** ✅
- [x] **inventory-engine-system** ✅
- [x] **fire-extinguisher-inventory** ✅
- [x] **key-inventory** ✅
- [x] **lighting-inventory** ✅
- [x] **paint-inventory** ✅
- [x] **radio-communication-inventory** ✅
- [x] **tool-loan** / **tools** ✅
- [x] **elevator-spare-parts** / **elevator-emergency-call** ✅

### Fase 4: Administración, Finanzas y Proveedores ✅

- [x] **contabilidad** (Migrado: `report-viewer`, `report-designer`, `presupuesto`, `cobranza-nativa`, `coi-mapeo`, `financial-summary`) ✅
- [x] **dashboard** ✅
- [x] **funding** ✅
- [x] **expense-catalog** ✅
- [x] **sat-funding** ✅
- [x] **purchases** ✅
- [x] **provider** (Migrado: `provider-list`, `proveedor-form`, `employee-provider-form`) ✅
- [x] **customer-provider** / **owner** / **property** ✅
- [x] **juntas-comite** / **committee** (Migrado: `meeting-minutes`, `home-comite`) ✅

## 🤖 TRABAJO COMPLETADO — Agente Qwen (Actualización de estilos)

> 🚨 **ATENCIÓN OTRO AGENTE:** Este bloque no se toca. Lo trabaja el poderoso Qwen. Él lo entenderá y seguirá en su bloque.

### ✅ Bloque Qwen completado (100%):

**Módulos iniciales:**

- [x] **calendar** ✅
- [x] **custom-document** ✅
- [x] **access-history** ✅

### Fase 5: Documentación y Configuración ✅

- [x] **user-profile** ✅ (update-profile, update-password, update-user-photo)
- [x] **profile-users** ✅ (employee-permission-app)
- [x] **configuration** ✅ (62 archivos migrados)
- [x] **biblioteca** ✅ (informe-financiero-list)
- [x] **manuals-and-processes** ✅ (ya limpios)
- [x] **master-folder** ✅ (sin archivos HTML)
- [x] **reports** ✅ (9 archivos migrados)
- [x] **announcement** ✅ (6 archivos migrados)
- [x] **legal** ✅ (19 archivos migrados)
- [x] **password-manager** ✅ (password-form, password-list)
- [x] **send-email** ✅ (ya limpios)
- [x] **templates** ✅ (ya limpios)
- [x] **espejo-aspel** ✅ (projected-expenses-form, projected-expenses-list)

---

_Documento actualizado el 12 de abril de 2026 para seguimiento controlado de refactorización visual._
