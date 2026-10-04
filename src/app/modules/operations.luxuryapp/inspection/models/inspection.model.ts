/**
 * Modelos TypeScript para el módulo de Inspecciones
 * Alineados con DTOs del backend
 */

/**
 * Resumen de inspección para listados
 * Corresponde a: InspectionSummaryDTO (backend)
 */
export interface InspectionSummary {
  id: string;
  name: string;
  recurrenceUnit: number;
  recurrenceUnitDisplayName: string;
  recurrenceInterval: number;
  isActive: boolean;
}

/**
 * Grupo de inspecciones por departamento
 * Corresponde a: InspectionListItemDTO (backend)
 */
export interface InspectionListItem {
  departament: string;
  areaResponsable: string;
  inspecciones: InspectionSummary[];
}

/**
 * Inspección completa para edición en formulario
 * Corresponde a: InspectionEditDTO (backend)
 * IMPORTANTE: Frequency siempre viene normalizado: "daily", "weekly", "monthly"
 */
export interface InspectionEdit {
  id: string;
  name: string;
  customerId: string;
  departament: number;  // Valor numérico del enum Departament
  recurrenceUnit: number;
  recurrenceInterval: number;
  weeklyDays?: number[];  // Solo si frequency = "weekly"
  dayOfMonth?: number | null;  // Solo si frequency = "monthly"
  isActive: boolean;
  createdAt: string;  // ISO 8601 datetime
}

/**
 * DTO para crear/editar inspección
 * Corresponde a: InspectionAddOrEditDTO (backend)
 */
export interface InspectionAddOrEdit {
  customerId: string;
  departament: number;  // Valor numérico del enum Departament
  name: string;
  recurrenceUnit: number;
  recurrenceInterval: number;
  weeklyDays?: number[];
  dayOfMonth?: number | null;
  isActive: boolean;
  createdAt: string;
}

/**
 * Imagen de evidencia dentro de un resultado de inspección
 * Corresponde a: ReportImageDTO (backend)
 */
export interface InspectionResultImageDTO {
  photoPath: string;
}

/**
 * Resultado individual de una inspección
 * Corresponde a: ReportResultItemDTO (backend)
 */
export interface InspectionResultItemDTO {
  state: boolean;
  observations: string;
  inspectionDescription: string;
  images: InspectionResultImageDTO[];
}

/**
 * Reporte completo de una ejecución de inspección
 * Corresponde a: CustomerInspectionReportDTO (backend)
 */
export interface InspectionResultDTO {
  name: string;
  departament: string;
  frequency: string;
  user: string;
  results: InspectionResultItemDTO[];
}

/**
 * Response genérico del API
 */
export interface ApiResponse<T> {
  isSuccess: boolean;
  data?: T;
  message?: string;
  statusCode?: number;
  errors?: string[];
}

/**
 * Fila de listado de ejecuciones de levantamiento/mayor/anexo
 * Corresponde a: InspectionExecutionListItemDTO (backend)
 */
export interface InspectionExecutionListItem {
  id: string;
  inspectionName: string;
  inspectionType: number;
  inspectionTypeDisplayName: string;
  folio: string | null;
  approvalStatus: number;
  approvalStatusDisplayName: string;
  isAnnex: boolean;
  equipmentCount: number;
  createdAt: string;
  submittedAt: string | null;
  approvedAt: string | null;
}

/**
 * Evento auditable del ciclo de firma
 * Corresponde a: InspectionApprovalEventDTO (backend)
 */
export interface InspectionApprovalEvent {
  id: string;
  action: number;
  actionDisplayName: string;
  actorUserId: string;
  actorRole: string;
  occurredAt: string;
  reason: string | null;
  version: number;
}

/**
 * Acta de revisión y firma digital
 * Corresponde a: InspectionApprovalDTO (backend)
 */
export interface InspectionApproval {
  id: string;
  inspectionExecutionId: string;
  folio: string | null;
  status: number;
  statusDisplayName: string;
  version: number;
  submittedAt: string | null;
  submittedByUserId: string | null;
  reviewedAt: string | null;
  reviewedByUserId: string | null;
  returnReason: string | null;
  approvedAt: string | null;
  approvedByUserId: string | null;
  approvedByRole: string | null;
  reopenedAt: string | null;
  reopenedByUserId: string | null;
  reopenReason: string | null;
  isAnnex: boolean;
  annexOfApprovalId: string | null;
  annexOfFolio: string | null;
  events: InspectionApprovalEvent[];
}

/**
 * Snapshot de cobertura de un equipo dentro de una ejecución
 * Corresponde a: InspectionExecutionSnapshotDTO (backend)
 */
export interface InspectionExecutionSnapshot {
  id: string;
  equipmentId: string;
  equipmentName: string;
  inventoryCategory: number;
  inventoryCategoryDisplayName: string;
  brand: string | null;
  model: string | null;
  serialNumber: string | null;
  localCode: string | null;
  location: string | null;
  evaluationState: number;
  exceptionReason: string | null;
  condition: number | null;
  findings: {
    id: string;
    criterionDescription: string;
    severity: number;
    recommendation: number;
    technicalNotes: string | null;
    createdAt: string;
    imagePaths: string[];
  }[];
}

/** Estados del acta (InspectionApprovalStatus backend). */
export const INSPECTION_APPROVAL_STATUS = {
  DRAFT: 1,
  PENDING_REVIEW: 2,
  RETURNED: 3,
  APPROVED: 4,
  REOPENED: 5,
} as const;

