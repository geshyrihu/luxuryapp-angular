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

export interface CobranzaOnlineDashboardTower {
  towerId: string;
  towerAccountNumber: string;
  towerName: string;
  totalBalance: number;
  maintenanceBalance: number;
  extraordinaryBalance: number;
  finesBalance: number;
  departmentCount: number;
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
  finesBalance: number;
  /** Cargo de mantenimiento (-001) aplicado en el mes de consulta. Umbral para clasificar JUDICIAL/MOROSO. 0 = sin cargo vigente. */
  currentMonthCharge: number;
  categoryId: string;
  movementCount: number;
  classification: string;
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

export interface CobranzaOnlineMetric {
    total: number;
    collected: number;
    pending: number;
}

export interface CobranzaOnlineChargeItem {
  concept: string;
  amount: number;
  rawAccount: string;
}

export interface CobranzaOnlineDepartmentCharges {
  accountNumber: string;
  accountName: string;
  charges: CobranzaOnlineChargeItem[];
  totalCharges: number;
}

export interface CobranzaOtroCargo {
    conceptName: string;
    total: number;
    collected: number;
    pending: number;
}

export interface CobranzaOnlineCurrentCharges {
    maintenance: CobranzaOnlineMetric;
    extraordinary: CobranzaOnlineMetric;
    monthlyFeeTotal: number;
    totalDepartmentsByProperty: number;
    activeTemplates: CobranzaOnlineCurrentChargeTemplate[];
    additionalIncomes?: CobranzaOtroCargo[];  // @deprecated – usar otrosCargos
    otrosCargos: CobranzaOtroCargo[];
}

export interface CobranzaOnlineDashboardResponse {
  customerId: string;
  year: number;
  month: number;
  kpis: CobranzaOnlineDashboardKpis;
  summaries: CobranzaOnlineDashboardSummary[];
  departments: CobranzaOnlineDashboardDepartment[];
  towers: CobranzaOnlineDashboardTower[];
  advances: CobranzaOnlineDashboardDepartment[];
  departmentCharges?: CobranzaOnlineDepartmentCharges[];
  departmentPayments?: CobranzaOnlineDepartmentCharges[];
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
