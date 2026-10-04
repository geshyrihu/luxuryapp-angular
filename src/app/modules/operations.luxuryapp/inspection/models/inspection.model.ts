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
