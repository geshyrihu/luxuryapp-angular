/**
 * Interfaces para el organigrama jerírquico de puestos.
 */

export const ORG_CHART_VIRTUAL_ROOT_ID = "0";

/** Datos del puesto de trabajo (desde backend) */
export interface IWorkPositionOrgChartNode {
  workPositionId: string;
  folio: string;
  roleDisplayName: string;
  departmentName: string;
  hierarchyLevel: number;
  sortOrder: number;
  hasEmployee: boolean;
  employeeName?: string;
  employeeEmail?: string;
  employeePhone?: string;
  employeePhoto?: string;
  reportsToWorkPositionId?: string;
  state: string;
  children: IWorkPositionOrgChartNode[];
}

/** Nodo para PrimeNG OrganizationChart */
export interface IOrgChartTreeNode {
  type?: "root" | "manager" | "staff" | "vacant";
  label: string;
  data: IWorkPositionOrgChartNode;
  expanded?: boolean;
  children?: IOrgChartTreeNode[];
}

export interface IOrgChartGraphNodeData {
  orgNode: IWorkPositionOrgChartNode;
  accentColor: string;
  secondaryLabel: string;
  isVacant: boolean;
  isVirtualRoot: boolean;
  selectionState: "none" | "origin" | "destination";
}

export interface IOrgChartGraphNode {
  id: string;
  label: string;
  dimension?: {
    width: number;
    height: number;
  };
  data: IOrgChartGraphNodeData;
}

export interface IOrgChartGraphLink {
  id: string;
  source: string;
  target: string;
  data: {
    sourceId: string;
    targetId: string;
  };
}

/** Payload para reasignar un puesto */
export interface IWorkPositionReassignRequest {
  workPositionId: string;
  newReportsToWorkPositionId: string | null;
  sortOrder: number;
}

/** Respuesta de reasignación */
export interface IWorkPositionReassignResponse {
  success: boolean;
  message: string;
}

/** Resultado de validación de reasignación */
export interface ReassignmentValidation {
  valid: boolean;
  reason?: string;
}

/** Mapeo de colores por departamento */
export const DEPTO_BORDER_COLORS: Record<string, string> = {
  Administracion: "border-blue-500",
  Mantenimiento: "border-orange-500",
  Limpieza: "border-cyan-500",
  Operaciones: "border-green-500",
  Jardineria: "border-emerald-500",
  Sistemas: "border-indigo-500",
  Seguridad: "border-red-500",
  Reclutamiento: "border-purple-500",
  RecursosHumanos: "border-pink-500",
  Supervision: "border-yellow-500",
  Direcciones: "border-amber-500",
  Legal: "border-slate-500",
  Contabilidad: "border-teal-500",
  Constructora: "border-stone-500",
  Recepcion: "border-lime-500",
  Mensajeria: "border-violet-500",
  Ludoteca: "border-fuchsia-500",
};

export const DEPTO_ACCENT_COLORS: Record<string, string> = {
  Administracion: "#3b82f6",
  Mantenimiento: "#f97316",
  Limpieza: "#06b6d4",
  Operaciones: "#22c55e",
  Jardineria: "#10b981",
  Sistemas: "#6366f1",
  Seguridad: "#ef4444",
  Reclutamiento: "#a855f7",
  RecursosHumanos: "#ec4899",
  Supervision: "#eab308",
  Direcciones: "#f59e0b",
  Legal: "#64748b",
  Contabilidad: "#14b8a6",
  Constructora: "#78716c",
  Recepcion: "#84cc16",
  Mensajeria: "#8b5cf6",
  Ludoteca: "#d946ef",
};
