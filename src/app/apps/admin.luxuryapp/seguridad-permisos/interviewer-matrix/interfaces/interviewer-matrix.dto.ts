export interface InterviewerMatrixItemDto {
  id: string;
  customerId: string;
  workPositionRole: number;
  interviewerRole: number;
  isActive: boolean;
}

export interface InterviewerMatrixCreateOrUpdateDto {
  id?: string;
  customerId: string;
  workPositionRole: number;
  interviewerRole: number;
  isActive: boolean;
}
