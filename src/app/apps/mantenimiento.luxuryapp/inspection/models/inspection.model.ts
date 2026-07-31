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
  frequency: string;  // Normalizado: "daily", "weekly", "monthly"
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
  frequency: 'daily' | 'weekly' | 'monthly';  // Normalizado desde backend
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
  frequency: string;  // FrequencyType enum value
  weeklyDays?: number[];
  dayOfMonth?: number | null;
  isActive: boolean;
  createdAt: string;
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
