// Corresponds to the SatFundingDto in the backend

export interface SatFundingDto {
  id: string;
  customerId: string;
  fundingPeriod: any; // Consider creating a frontend enum for EFundingPeriod
  year: number;
  periodDisplayName: string;
  invoiceCount: number;
  totalAmount: number;
  inProgress: boolean;
}









