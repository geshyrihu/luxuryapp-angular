export interface CobranzaOnlineExcludedAccountRow {
  accountNumber: string;
  accountName: string;
  accountLevel: number;
  parentAccountNumber: string;
  hasPropertyMatch: boolean;
  propertyId: string | null;
  propertyTower: string;
  propertyDepartment: string;
  propertyFullName: string;
  isExcluded: boolean;
  reason: string;
  notes: string;
}

export interface CobranzaOnlineExcludedAccountListResponse {
  customerId: string;
  year: number;
  dataSource: string;
  totalAccounts: number;
  totalExcluded: number;
  rows: CobranzaOnlineExcludedAccountRow[];
}

export interface CobranzaOnlineExcludedAccountUpsert {
  accountNumber: string;
  accountName: string;
  isExcluded: boolean;
  reason: string;
  notes: string;
}
