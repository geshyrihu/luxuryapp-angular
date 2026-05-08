import { EIncidentCategory, ESeverityLevel, EInvestigationStatus } from '../../incident/models/incident.interfaces';

export interface IncidentReportFilterDTO {
  from?: string;
  to?: string;
  category?: EIncidentCategory;
  severity?: ESeverityLevel;
}

export interface IncidentStatsDTO {
  total: number;
  pending: number;
  inInvestigation: number;
  withSanction: number;
  withoutSanction: number;
  archived: number;
  byCategory: IncidentStatGroupDTO[];
  bySeverity: IncidentStatGroupDTO[];
  byType: IncidentStatGroupDTO[];
}

export interface IncidentStatGroupDTO {
  key: string;
  count: number;
}

export interface IncidentPendingDTO {
  id: string;
  employeeName: string;
  incidentTypeName: string;
  category: EIncidentCategory;
  severityLevel: ESeverityLevel;
  investigationStatus: EInvestigationStatus;
  incidentDateTime: string;
  hoursWithoutAttention: number;
  requiresAlert: boolean;
}
