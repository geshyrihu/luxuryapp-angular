export interface VacationBalanceDTO {
  id: string;
  userId: string;
  userName: string;
  year: number;
  seniorityYears: number;
  actualSeniorityYears: number;
  totalDays: number;
  usedDays: number;
  usedAdvanceDays: number;
  usedNormalDays: number;

  pendingDays: number;
  pendingAdvanceDays: number;
  pendingNormalDays: number;

  availableDays: number;
  vacationBonusPercentage: number;
  lastUpdated: string;
  employeeAdmissionDate: string;

  // From advance vacation policy
  isAdvancePeriod?: boolean;
  allowedAdvanceDays?: number;
  availableAdvanceDays?: number;
  availableLftDays?: number;
  
  // Original legal baseline
  totalLftDays?: number;
}









