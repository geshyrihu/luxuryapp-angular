// presupuestos.interfaces.ts

// Re-exportamos desde Shared para compatibilidad
export {
  AspelBudgetDTO,
  CuentaAspelTercerNivelDTO as CuentaAspelDetalladaDTO,
  CuentaAspelTercerNivelDTO,
} from "../models/presupuesto-shared.models";

export interface PurchaseHistoryDTO {
  description: string;
  creationAt: string;
  createdBy: string;
  provider: string;
  tipoGasto: string;
  fiscalYear: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  invoiceUrl: string;
}
// ... (interfaces existentes)

export interface BudgetAccountRuleDataDTO {
  id: string;
  customerId: string;
  ruleType: number; // 0 = ExtraAccount, 1 = ExcludedAccount
  accountNumber: string;
  accountName?: string;
}

export interface BudgetAccountRuleCreateDTO {
  customerId: string;
  ruleType: number;
  accountNumber: string;
  accountName?: string;
}

export interface BudgetAccountRuleUpdateDTO {
  ruleType: number;
  accountNumber: string;
  accountName?: string;
}
