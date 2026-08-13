export interface InterviewerMatrixItemDto {
  id: string;
  customerId: string;
  workPositionRole: number;
  interviewerRole: number;
  isActive: boolean;
}

export interface InterviewerMatrixRoleOptionDto {
  value: number;
  label: string;
}

export interface InterviewerMatrixBoardDto {
  workPositionRoles: InterviewerMatrixRoleOptionDto[];
  interviewerRoles: InterviewerMatrixRoleOptionDto[];
  rules: InterviewerMatrixItemDto[];
}

export interface InterviewerMatrixCreateOrUpdateDto {
  id?: string;
  customerId: string;
  workPositionRole: number;
  interviewerRole: number;
  isActive: boolean;
}
