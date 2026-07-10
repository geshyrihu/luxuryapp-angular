export interface VacationBalanceAdminViewDto {
  employeeId: string;
  fullName: string;
  hireDate: string;
  seniorityYears: number;
  entitledDaysByLaw: number;
  takenDays: number;
  pendingDays: number;
  currentSystemBalance: number;
  isDiscrepant: boolean;
  isEligibleForAdvance: boolean;
  allowedAdvanceDays: number;
  availableAdvanceDays: number;
}
