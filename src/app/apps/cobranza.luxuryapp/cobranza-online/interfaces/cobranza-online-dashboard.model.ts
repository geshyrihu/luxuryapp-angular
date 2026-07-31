import type { CobranzaOnlineSyncMetadata } from "./cobranza-online-sync.model";

export interface CobranzaOnlineResumenItem {
  titulo: string;
  descripcion: string;
}

export interface CobranzaOnlineDashboardCategory {
  categoryId: string;
  title: string;
  count: number;
  total: number;
}

export interface CobranzaOnlineDashboardSummary {
  accountId: string;
  accountNumber: string;
  accountName: string;
  balance: number;
  departmentCount: number;
  movementCount: number;
}

export interface CobranzaOnlineDashboardDepartment {
  summaryAccountId: string;
  summaryAccountNumber: string;
  summaryAccountName: string;
  accountId: string;
  accountNumber: string;
  accountName: string;
  propertyId: string | null;
  propertyFullName: string | null;
  balance: number;
  maintenanceBalance: number;
  extraordinaryBalance: number;
  categoryId: string;
  movementCount: number;
}

export interface CobranzaOnlineDashboardKpis {
  totalDepartments: number;
  totalDueCurrentMonth: number;
  totalCollectedCurrentMonth: number;
  netBalanceCurrentMonth: number;
}

export interface CobranzaOnlineCurrentChargeTemplate {
  id: string;
  name: string;
  chargeType: string;
  calculationMethod: string;
  amount: number;
  dayOfMonth: number;
  startDate: string;
  endDate: string | null;
  applyToAllProperties: boolean;
  isActive: boolean;
}

export interface CobranzaOnlineCurrentCharges {
  maintenanceFee: number;
  maintenanceCollected: number;
  extraordinaryFee: number;
  monthlyFeeTotal: number;
  totalDepartmentsByProperty: number;
  activeTemplates: CobranzaOnlineCurrentChargeTemplate[];
}

export interface CobranzaOnlineDashboardResponse {
  customerId: string;
  year: number;
  month: number;
  kpis: CobranzaOnlineDashboardKpis;
  summaries: CobranzaOnlineDashboardSummary[];
  departments: CobranzaOnlineDashboardDepartment[];
  categories: CobranzaOnlineDashboardCategory[];
  topDebtors: CobranzaOnlineDashboardDepartment[];
  currentCharges: CobranzaOnlineCurrentCharges;
  syncMetadata: CobranzaOnlineSyncMetadata;
  diagnostics?: Record<string, unknown>;
}

export interface CobranzaOnlineStatementMonth {
  mes: number;
  nombreMes: string;
  cargos: number;
  abonos: number;
  saldoMes: number;
  saldoAcumulado: number;
}

export interface CobranzaOnlineStatementMovement {
  id: string;
  policyDate: string;
  policyType: string;
  policyNumber: number;
  policyConcept: string;
  concept: string;
  amount: number;
  natureLabel: string;
  numPart: string;
}

export interface CobranzaOnlineStatementResponse {
  accountId: string;
  accountNumber: string;
  accountName: string;
  propertyId: string | null;
  propertyFullName: string | null;
  year: number;
  initialBalance: number;
  totalDebits: number;
  totalCredits: number;
  finalBalance: number;
  meses: CobranzaOnlineStatementMonth[];
  movimientos: CobranzaOnlineStatementMovement[];
}
