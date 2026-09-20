// presupuestos.interfaces.ts

// Re-exportamos desde Shared para compatibilidad
export {
  AspelBudgetDTO,
  CuentaAspelTercerNivelDTO as CuentaAspelDetalladaDTO,
  CuentaAspelTercerNivelDTO,
} from "../interfaces/presupuesto-shared.models";

export interface PurchaseHistoryDTO {
  ordenCompraId?: string;
  description: string;
  creationAt: string;
  createdBy: string;
  provider: string;
  tipoGasto: string;
  fiscalYear: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  invoices: InvoiceFileDTO[];
  notasEspeciales?: string;
}

export interface InvoiceFileDTO {
  pdfFile: string;
  xmlFile: string;
  factura: string;
  folioFiscal: string;
  fechaFactura: string;
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
