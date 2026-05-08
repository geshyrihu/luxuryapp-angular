// Corresponds to the SatFundingDTO in the backend

export interface SatFundingDTO {
  id: string;
  customerId: string;
  fundingPeriod: any; // Consider creating a frontend enum for EFundingPeriod
  year: number;
  periodDisplayName: string;
  invoiceCount: number;
  totalAmount: number;
  inProgress: boolean;
}









