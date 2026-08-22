export interface ComplianceDashboardDTO {
  groups: ComplianceGroupDTO[];
  totalGroupsWithoutTemplates: number;
}

export interface ComplianceGroupDTO {
  workGroupId: string;
  workGroupName: string;
  categoryName: string;
  hasActiveTemplates: boolean;
  onTimeCount: number;
  overdueCount: number;
  breachedCount: number;
  carriedOverCount: number;
  criticalClosedTotal: number;
  criticalClosedWithAttachmentCount: number;
}
