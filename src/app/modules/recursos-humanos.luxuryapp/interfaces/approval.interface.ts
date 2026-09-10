export type ApprovalRequestType = "Permiso" | "Vacaciones";

export interface ApprovalPanelRequest {
  id: string;
  employeeId: string;
  employeeFullName: string;
  customerId: string;
  customerName: string;
  roleName: string;
  requestType: ApprovalRequestType;
  requestTypeName: string;
  requestDate: string;
  startDate: string;
  endDate: string;
  attachmentPath?: string | null;
}

export interface LeaveHistorySummaryDTO {
  recentRequests: number;
}

export interface OverlappingApprovalRequestDTO {
  id: string;
  fullName: string;
  startDate: string;
  endDate: string;
}

export interface ApprovalConfirmationResult {
  approved: boolean;
  paidStatus?: number;
}
