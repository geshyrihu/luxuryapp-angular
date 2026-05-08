export interface CobranzaOnlineInspectionMovement {
  policyKey: string;
  policyDate: string;
  policyType: string;
  policyNumber: string;
  policyConcept: string;
  movementType: string;
  amount: number;
  signedAmount: number;
  concept: string;
  related401Accounts: string;
  related401DebitTotal: number;
  related401CreditTotal: number;
}

export interface CobranzaOnlineInspectionRow {
  accountNumber: string;
  departmentCode: string;
  ownerName: string;
  displayName: string;
  towerAccountNumber: string;
  towerName: string;
  chargesAmount: number;
  paymentsAmount: number;
  netAmount: number;
  visibleBalance: number | null;
  movementCount: number;
  lastPolicyDate: string | null;
  lastPolicyType: string;
  lastPolicyNumber: string;
  lastConcept: string;
  movements: CobranzaOnlineInspectionMovement[];
}

export interface CobranzaOnlineInspectionResponse {
  customerId: string;
  year: number;
  month: number;
  dataSource: string;
  totalRows: number;
  totalMovements: number;
  totalCharges: number;
  totalPayments: number;
  netTotal: number;
  rows: CobranzaOnlineInspectionRow[];
}

export interface CobranzaOnlineInspectionHistoryResponse {
  customerId: string;
  year: number;
  accountNumber: string;
  departmentCode: string;
  ownerName: string;
  displayName: string;
  towerAccountNumber: string;
  towerName: string;
  initialBalance: number | null;
  visibleBalance: number | null;
  totalCharges: number;
  totalPayments: number;
  netTotal: number;
  movementCount: number;
  dataSource: string;
  movements: CobranzaOnlineInspectionMovement[];
}

export interface CobranzaOnlineInspectionRelated401Summary {
  related401Accounts: string;
  debitTotal: number;
  creditTotal: number;
  netTotal: number;
  movementCount: number;
}
