export interface RegisterPastVacationDTO {
  employeeId: number;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface PastVacationHistoryItemDTO {
  requestDate: string;
  startDate: string;
  endDate: string;
  seniorityYearDescription: string;
  requestedDays: number;
  statusName: string;
  approverName: string | null;
}









