/**
 * Interfaces para el organigrama jerárquico de puestos.
 */

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
  type?: 'root' | 'manager' | 'staff' | 'vacant';
  label: string;
  data: IWorkPositionOrgChartNode;
  expanded?: boolean;
  children?: IOrgChartTreeNode[];
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
  'Administracion': 'border-blue-500',
  'Mantenimiento': 'border-orange-500',
  'Limpieza': 'border-cyan-500',
  'Operaciones': 'border-green-500',
  'Jardineria': 'border-emerald-500',
  'Sistemas': 'border-indigo-500',
  'Seguridad': 'border-red-500',
  'Reclutamiento': 'border-purple-500',
  'RecursosHumanos': 'border-pink-500',
  'Supervision': 'border-yellow-500',
  'Direcciones': 'border-amber-500',
  'Legal': 'border-slate-500',
  'Contabilidad': 'border-teal-500',
  'Constructora': 'border-stone-500',
  'Recepcion': 'border-lime-500',
  'Mensajeria': 'border-violet-500',
  'Ludoteca': 'border-fuchsia-500',
};
