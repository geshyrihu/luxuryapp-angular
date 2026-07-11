export interface PeriodClosureResponseDTO {
  id: string;
  customerId: string;
  year: number;
  month: number;
  isClosed: boolean;
  closedBy: string | null;
  closedAt: string | null;
  closureNotes: string | null;
}
