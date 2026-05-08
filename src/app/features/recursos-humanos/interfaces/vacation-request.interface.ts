export interface VacationRequestMyDTO {
  id: string;
  startDate: string;
  endDate: string;
  requestedDays: number;
  status: string;
  requestDate: string;
  approverFullName: string;
  approvalDate: string;
}

export interface VacationRequestDetailDTO {
  id: string;
  employeeId: string;
  employeeFullName: string;
  status: string;
  requestTypeName: string;
  requestDate: string;
  period: string;
  timeRange: string;
  reason: string;
  approverName: string;
  approvalDate: string;
  rejectionReason: string;
  attachmentUrl: string;
  canEdit: boolean;
  canDelete: boolean;
}









