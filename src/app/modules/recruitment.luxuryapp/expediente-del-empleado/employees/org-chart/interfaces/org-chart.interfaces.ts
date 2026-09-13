/**
 * Interfaces para el organigrama jerárquico de roles.
 */

export const ORG_CHART_VIRTUAL_ROOT_ID = "0";

export interface IRoleOrgChartMember {
  workPositionId: string;
  folio: string;
  hasEmployee: boolean;
  employeeName?: string;
  employeeEmail?: string;
  employeePhone?: string;
  employeePhoto?: string;
  state: string;
}

/** Datos del rol en el organigrama (desde backend) */
export interface IRoleOrgChartNode {
  roleId: string;
  roleDisplayName: string;
  departmentName: string;
  hierarchyLevel: number;
  sortOrder: number;
  members: IRoleOrgChartMember[];
  children: IRoleOrgChartNode[];
}

export interface IOrgChartGraphNodeData {
  orgNode: IRoleOrgChartNode;
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

/** Payload para reasignar un rol */
export interface IRoleOrgChartReassignRequest {
  roleId: string;
  newReportsToRoleId: string | null;
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

/**
 * Acentos por departamento como referencias a tokens del design system
 * (--ds-dept-*, definidos en styles/theme/_variables.scss). Se consumen
 * vía la custom property `--org-node-accent`, por lo que el navegador
 * resuelve el var() al pintar. (Regla Crítica 8 — sin hex hardcoded)
 */
export const DEPTO_ACCENT_COLORS: Record<string, string> = {
  Administracion: "var(--ds-dept-administracion)",
  Mantenimiento: "var(--ds-dept-mantenimiento)",
  Limpieza: "var(--ds-dept-limpieza)",
  Operaciones: "var(--ds-dept-operaciones)",
  Jardineria: "var(--ds-dept-jardineria)",
  Sistemas: "var(--ds-dept-sistemas)",
  Seguridad: "var(--ds-dept-seguridad)",
  Reclutamiento: "var(--ds-dept-reclutamiento)",
  RecursosHumanos: "var(--ds-dept-recursos-humanos)",
  Supervision: "var(--ds-dept-supervision)",
  Direcciones: "var(--ds-dept-direcciones)",
  Legal: "var(--ds-dept-legal)",
  Contabilidad: "var(--ds-dept-contabilidad)",
  Constructora: "var(--ds-dept-constructora)",
  Recepcion: "var(--ds-dept-recepcion)",
  Mensajeria: "var(--ds-dept-mensajeria)",
  Ludoteca: "var(--ds-dept-ludoteca)",
};
