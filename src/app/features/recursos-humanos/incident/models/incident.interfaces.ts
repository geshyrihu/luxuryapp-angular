export type EInvestigationStatus = 'Reportado' | 'EnInvestigacion' | 'ResueltoSinSancion' | 'ResueltoConSancion' | 'Archivado';
export type ESeverityLevel = 'Low' | 'Moderate' | 'Medium' | 'High';
export type EIncidentCategory = 'Conducta' | 'Desempeno' | 'Seguridad' | 'Asistencia' | 'Etica';

export interface IncidentListDTO {
  id: string;
  employeeId: string;
  employeeName: string;
  incidentTypeName: string;
  category: string;
  severityLevel: string;
  investigationStatus: EInvestigationStatus;
  incidentDateTime: string;
  sanctionApplied: boolean;
  isCancelled: boolean;
  cancellationReason?: string;
  isActGenerated: boolean;
  administrativeActPdfUrl?: string;
  createdAt: string;
}

export interface IncidentDetailDTO {
  id: string;
  employeeId: string;
  employeeName: string;
  incidentTypeName: string;
  incidentTypeId: string;
  workContractId?: string;
  description: string;
  witnesses?: string;
  evidencePaths?: string;
  investigationNotes?: string;
  decisionRationale?: string;
  resolutionDate?: string;
  reportedByUserId: string;
  category: number;
  severityLevel: number;
  investigationStatus: number;
  incidentDateTime: string;
  sanctionApplied: boolean;
  isCancelled: boolean;
  cancellationReason?: string;
  cancelledAt?: string;
  isActGenerated: boolean;
  administrativeActPdfPath?: string;
  createdAt: string;
}

export interface IncidentAddOrEditDTO {
  employeeId: string;
  customerId: string;
  incidentTypeId: string;
  workContractId?: string;
  description: string;
  incidentDateTime: string;
  severityLevel: number;
  witnesses?: string;
  sanctionTypeId?: string;
}

export interface IncidentResolveDTO {
  investigationStatus: number;
  investigationNotes?: string;
  sanctionApplied: boolean;
  decisionRationale?: string;
}

export interface IncidentCancelDTO {
  cancellationReason: string;
}

// ─── Adjuntos ────────────────────────────────────────────────────────────────

export interface IncidentAttachmentListDTO {
  id: string;
  incidentId: string;
  fileType: string;
  originalFileName: string;
  fileSizeKB: number;
  mimeType: string;
  description?: string;
  downloadUrl: string;
  createdAt: string;
}

export interface IncidentAttachmentDetailDTO extends IncidentAttachmentListDTO {
  fileTypeValue: number;
}

// ─── Testigos ─────────────────────────────────────────────────────────────────

export interface IncidentWitnessListDTO {
  id: string;
  incidentId: string;
  fullName: string;
  position?: string;
  phone?: string;
  createdAt: string;
}

export interface IncidentWitnessDetailDTO extends IncidentWitnessListDTO {
  statement?: string;
}

export interface IncidentWitnessAddOrEditDTO {
  incidentId: string;
  fullName: string;
  position?: string;
  phone?: string;
  statement?: string;
}

// ─── Días de Suspensión ───────────────────────────────────────────────────────

export interface SuspensionDayDetailDTO {
  id: string;
  incidentId: string;
  suspensionDate: string;
  notes?: string;
  createdAt: string;
}

export interface SuspensionDayAddDTO {
  incidentId: string;
  suspensionDates: Date[];
  notes?: string;
}

// ─── Dashboard ─────────────────────────────────────────────────────────────────

export interface IncidentDashboardFilterDTO {
  startDate?: string;
  endDate?: string;
}

export interface IncidentDashboardDTO {
  totalIncidents: number;
  resolvedIncidents: number;
  pendingIncidents: number;
  sanctionedIncidents: number;
  averageResolutionDays: number;
  bySeverity: IncidentDashboardCountDTO[];
  byType: IncidentDashboardCountDTO[];
  byMonth: IncidentDashboardMonthCountDTO[];
  topEmployees: IncidentDashboardEmployeeCountDTO[];
}

export interface IncidentDashboardCountDTO {
  name: string;
  count: number;
}

export interface IncidentDashboardMonthCountDTO {
  month: string;
  count: number;
}

export interface IncidentDashboardEmployeeCountDTO {
  employeeName: string;
  count: number;
}
