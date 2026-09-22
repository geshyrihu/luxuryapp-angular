import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import { AppIcon } from "@ui/shared/app-icon/app-icon.catalog";
import type { AppIconName } from "@ui/shared/app-icon/app-icon.catalog";

export type KpiGrupo = "Operativo" | "Financiero" | "Soporte-SLA" | "Ejecutivo";

export interface KpiConfig {
  id: string;
  nombre: string;
  descripcion: string;
  grupo: KpiGrupo;
  estado: "Implementado en Fase 1" | "Planeado Fase 2" | "Planeado Fase 3" | "Planeado Fase 4";
  fuenteDeDatos: string;
  icono: AppIconName;
  formato: "number" | "currency" | "percent";
  decimales?: number;
  sufijo?: string;
  valorMuestra: number;
  tendenciaMuestra?: number;
  roles: string[];
}

export const CORPORATE_ROLES: string[] = [
  ApplicationRole.Legal,
  ApplicationRole.CoordinacionLegal,
  ApplicationRole.RecursosHumanos,
  ApplicationRole.Reclutamiento,
  ApplicationRole.GerenteMantenimiento,
  ApplicationRole.SistemasGeneral,
  ApplicationRole.Mensajeria,
  ApplicationRole.SupervisionOperativa,
];

export const STAFF_ROLES: string[] = [
  ApplicationRole.Administrador,
  ApplicationRole.GerenteOperaciones,
  ApplicationRole.GerenteAtencion,
  ApplicationRole.Asistente,
  ApplicationRole.Contador,
  ApplicationRole.Cobranza,
  ApplicationRole.JefeMantenimiento,
];

/** SuperUsuario y Direccion: acceso provisional de revisión, se comportan como Corporate (alcance definitivo en Fase 4). */
export const REVIEW_ROLES: string[] = [
  ApplicationRole.SuperUsuario,
  ApplicationRole.Direccion,
];

export const ALL_DASHBOARD_ROLES: string[] = [
  ...REVIEW_ROLES,
  ...CORPORATE_ROLES,
  ...STAFF_ROLES,
];

export const KPI_GRUPOS: KpiGrupo[] = ["Operativo", "Soporte-SLA", "Financiero", "Ejecutivo"];

export const KPI_CATALOG: KpiConfig[] = [
  // OPERACIÓN (Fase 1) — IDs alineados a 20260921-especificacion-operations-dashboard-kpis.md
  {
    id: "KPI-OP-01",
    nombre: "Solicitudes totales",
    descripcion: "Pendientes + concluidas (órdenes de servicio y tickets) en el rango",
    grupo: "Operativo",
    estado: "Implementado en Fase 1",
    fuenteDeDatos: "ServiceOrders + Tasks",
    icono: AppIcon.ClipboardList,
    formato: "number",
    valorMuestra: 248,
    tendenciaMuestra: 4.6,
    roles: ALL_DASHBOARD_ROLES,
  },
  {
    id: "KPI-OP-02",
    nombre: "Solicitudes pendientes",
    descripcion: "Órdenes en Pendiente/Proceso y tickets sin completar",
    grupo: "Operativo",
    estado: "Implementado en Fase 1",
    fuenteDeDatos: "ServiceOrders + Tasks",
    icono: AppIcon.ClockOutline,
    formato: "number",
    valorMuestra: 71,
    tendenciaMuestra: -2.1,
    roles: ALL_DASHBOARD_ROLES,
  },
  {
    id: "KPI-OP-03",
    nombre: "Solicitudes concluidas",
    descripcion: "Órdenes con fecha de ejecución y tickets completados",
    grupo: "Operativo",
    estado: "Implementado en Fase 1",
    fuenteDeDatos: "ServiceOrders + Tasks",
    icono: AppIcon.CheckCircle,
    formato: "number",
    valorMuestra: 177,
    tendenciaMuestra: 3.5,
    roles: ALL_DASHBOARD_ROLES,
  },
  {
    id: "KPI-OP-04",
    nombre: "Tiempo promedio de resolución",
    descripcion: "Promedio en días naturales de las solicitudes concluidas",
    grupo: "Operativo",
    estado: "Implementado en Fase 1",
    fuenteDeDatos: "ServiceOrders (RequestDate→ExecutionDate) + Tasks (CreatedAt→ClosedDate)",
    icono: AppIcon.TimerOutline,
    formato: "number",
    decimales: 1,
    sufijo: " d",
    valorMuestra: 6.4,
    tendenciaMuestra: -8.2,
    roles: ALL_DASHBOARD_ROLES,
  },
  {
    id: "KPI-OP-06",
    nombre: "% de cumplimiento",
    descripcion: "Concluidas / Total de solicitudes",
    grupo: "Operativo",
    estado: "Implementado en Fase 1",
    fuenteDeDatos: "Calculado sobre KPI-OP-01 y KPI-OP-03",
    icono: AppIcon.Percent,
    formato: "percent",
    decimales: 1,
    valorMuestra: 71.4,
    tendenciaMuestra: 1.8,
    roles: ALL_DASHBOARD_ROLES,
  },

  // SOPORTE / SLA (planeado; roles por definir con negocio)
  {
    id: "KPI-TK-01",
    nombre: "Tickets abiertos vs cerrados",
    descripcion: "Estatus de tickets (TaskRecord); no existe entidad Ticket dedicada",
    grupo: "Soporte-SLA",
    estado: "Planeado Fase 2",
    fuenteDeDatos: "TaskRecord (Tasks): Status, ClosedDate",
    icono: AppIcon.TicketOutline,
    formato: "number",
    valorMuestra: 96,
    roles: [],
  },
  {
    id: "KPI-TK-05",
    nombre: "% de SLA cumplido",
    descripcion: "1 − incumplidos / total; tolerancia fija de 5 días en código, sin catálogo de SLA",
    grupo: "Soporte-SLA",
    estado: "Planeado Fase 2",
    fuenteDeDatos: "TaskRecord (Tasks): BreachedAt/BreachedDay",
    icono: AppIcon.ShieldCheck,
    formato: "percent",
    decimales: 1,
    valorMuestra: 88.2,
    roles: [],
  },
  {
    id: "KPI-SG-05",
    nombre: "Roles activos y accesos recientes",
    descripcion: "Auditoría de seguridad y accesos",
    grupo: "Soporte-SLA",
    estado: "Planeado Fase 2",
    fuenteDeDatos: "Por confirmar (no explorado en el análisis)",
    icono: AppIcon.AccountGroup,
    formato: "number",
    valorMuestra: 34,
    roles: [],
  },

  // FINANCIERO (planeado; roles por definir con negocio)
  {
    id: "KPI-FN-01",
    nombre: "Ingresos del periodo",
    descripcion: "Ingresos consolidados (nivel tenant/cliente, sin desglose por operación)",
    grupo: "Financiero",
    estado: "Planeado Fase 3",
    fuenteDeDatos: "Agregados de AccountingLuxuryApp/FinancialAccounting",
    icono: AppIcon.Cash,
    formato: "currency",
    valorMuestra: 1250000,
    roles: [],
  },
  {
    id: "KPI-FN-02",
    nombre: "Costos operativos",
    descripcion: "Costos del periodo; ServiceOrder.Price es el único costo por operación",
    grupo: "Financiero",
    estado: "Planeado Fase 3",
    fuenteDeDatos: "ServiceOrders.Price + agregados contables",
    icono: AppIcon.Cash,
    formato: "currency",
    valorMuestra: 486000,
    roles: [],
  },
  {
    id: "KPI-FN-05",
    nombre: "Margen por operación",
    descripcion: "Ingreso − costo por operación",
    grupo: "Financiero",
    estado: "Planeado Fase 3",
    fuenteDeDatos: "Sin fuente de datos (no existe ingreso por operación)",
    icono: AppIcon.TrendingUp,
    formato: "percent",
    decimales: 1,
    valorMuestra: 22.5,
    roles: [],
  },
];
