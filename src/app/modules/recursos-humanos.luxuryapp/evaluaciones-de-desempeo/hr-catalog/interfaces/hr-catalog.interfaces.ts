// Tipos para formularios (envían valores tócnicos del enum al backend)
export type EIncidentCategory = 'Conducta' | 'Desempeno' | 'Seguridad' | 'Asistencia' | 'Etica';
export type ESeverityLevel = 'Low' | 'Moderate' | 'Medium' | 'High';
export type ESanctionStatus = 'Activa' | 'Apelada' | 'Suspendida' | 'Cumplida' | 'Revocada';

// DTOs de lista (reciben DisplayName del backend en español)
export interface IncidentTypeListDTO {
  id: string;
  name: string;
  description?: string;
  category: string; // DisplayName del enum (ej: "Conducta", "Seguridad")
  defaultSeverity: string; // DisplayName del enum (ej: "Leve", "Grave")
  isActive: boolean;
}

export interface SanctionTypeListDTO {
  id: string;
  name: string;
  description?: string;
  severityLevel: string; // DisplayName del enum (ej: "Leve", "Moderado")
  isTermination: boolean;
  requiresHRApproval: boolean;
  isActive: boolean;
}

// DTOs para crear/editar (envían valores tócnicos del enum)
export interface IncidentTypeFormDTO {
  name: string;
  description?: string;
  category: EIncidentCategory;
  defaultSeverity: ESeverityLevel;
  isActive: boolean;
}

export interface SanctionTypeFormDTO {
  name: string;
  description?: string;
  severityLevel: ESeverityLevel;
  isTermination: boolean;
  requiresHRApproval: boolean;
  isActive: boolean;
}

// DTOs para edición (reciben valor numórico del enum del backend)
export interface IncidentTypeDetailDTO {
  id: string;
  name: string;
  description?: string;
  category: number; // Valor numórico del enum (ej: 0, 1, 2...)
  defaultSeverity: number; // Valor numórico del enum (ej: 0, 1, 2...)
  isActive: boolean;
  createdAt: string;
}

export interface SanctionTypeDetailDTO {
  id: string;
  name: string;
  description?: string;
  severityLevel: number; // Valor numórico del enum (ej: 0, 1, 2...)
  isTermination: boolean;
  requiresHRApproval: boolean;
  isActive: boolean;
  createdAt: string;
}
