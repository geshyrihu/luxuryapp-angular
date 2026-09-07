export type ESanctionStatus = 'Activa' | 'Apelada' | 'Suspendida' | 'Cumplida' | 'Revocada';

export interface SanctionListDTO {
  id: string;
  incidentId: string;
  employeeName: string;
  sanctionTypeName: string;
  sanctionStatus: ESanctionStatus;
  appliedDate: string;
  effectiveStartDate: string;
  effectiveEndDate?: string;
  allowAppeal: boolean;
  appealDeadline?: string;
  createdAt: string;
}

export interface SanctionDetailDTO extends SanctionListDTO {
  sanctionTypeId: string;
  appliedByUserId: string;
  conditions?: string;
  internalNotes?: string;
  completedDate?: string;
}

export interface SanctionAddOrEditDTO {
  incidentId: string;
  sanctionTypeId: string;
  effectiveStartDate: string;
  effectiveEndDate?: string;
  allowAppeal: boolean;
  appealDeadline?: string;
  conditions?: string;
  internalNotes?: string;
}

export interface SanctionChangeStatusDTO {
  sanctionStatus: ESanctionStatus;
  internalNotes?: string;
}
