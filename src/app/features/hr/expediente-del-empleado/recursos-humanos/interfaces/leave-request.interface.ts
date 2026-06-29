export enum EPaidStatus {
  ConGozedeSueldo = 0,
  SinGozedeSueldo = 1,
}

export interface LeaveRequestDTO {
  id: string;
  requestTypeId: string;
  requestTypeName: string;
  applicationUserId: string;
  employeeFullName: string;
  startDate: string; // DateOnly ? string en JSON ("2025-04-10")
  endDate: string;
  startTime: string | null; // "09:00:00"
  endTime: string | null;
  reason: string | null;
  status: string;
  requestDate: string; // DateTime
  approverId: string | null;
  approverFullName: string | null;
  approvalDate: string | null;
  rejectionReason: string | null;
  attachmentPath: string | null;
  customerId: string;
}

export interface LeaveRequestMyDTO {
  id: string;
  requestTypeName: string;
  userName?: string;
  startDate: string;
  endDate: string;
  startTime: string | null;
  endTime: string | null;
  status: string;
  requestDate: string;
  approverName: string | null;
  approvalDate: string | null;
  attachmentPath: string | null;
}

export interface LeaveRequestAddOrEditDTO {
  requestTypeId: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  reason?: string;
  attachment?: File;
}

export interface LeaveRequestApproveDTO {
  approved: boolean;
  rejectionReason?: string;
  paidStatus?: EPaidStatus;
}

export interface LeaveRequestDetailDTO {
  id: string;
  requestTypeName: string;
  userName: string;
  status: string;
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









