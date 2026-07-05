/**
 * ============================================================================
 * ?? ADVERTENCIA CRóTICA / CRITICAL WARNING ??
 * ============================================================================
 * Este módulo (Presupuesto Propuesta y sus modales) se encuentra 100% 
 * FUNCIONAL y ESTABLE. 
 * 
 * Queda ESTRICTAMENTE PROHIBIDO modificar su lígica, estructura o flujos de IA
 * sin antes consultar y obtener autorización explócita del Ing. Ricardo Marques.
 * 
 * Por favor, NO rompan el código.
 * ============================================================================
 */
export enum EProposalStatus {
  Draft = "Draft",
  Approved = "Approved",
  Rejected = "Rejected",
}

export interface CreateBudgetProposalDTO {
  customerId: string;
  name: string;
  fiscalYear: number;
  baseBudgetYear: number;
}

export interface UpdateProposalItemDTO {
  proposedAmount: number;
  justification: string;
}

export interface BudgetProposalDTO {
  id: string;
  customerId: string;
  name: string;
  fiscalYear: number;
  status: EProposalStatus;
  totalAmount: number;
  createdDate: Date;
  items: BudgetProposalItemDTO[];
  projectedExpenseItems: ProjectedExpenseItemDTO[];
}

export interface ProjectedExpenseItemDTO {
  key: string;
  budgetExecutionId: string;
}

export interface BudgetProposalItemDTO {
  id: string;
  accountNumber: string;
  accountName: string;
  nivelCuenta: number;
  cuentaPadre: string;
  providerName: string;
  comment: string;
  esFilaAgrupadora: boolean;
  currentAmount: number;
  proposedAmount: number;
  difference: number;
  percentageIncrease: number;
  justification: string;
  gastoEnero: number;
  gastoFebrero: number;
  gastoMarzo: number;
  gastoAbril: number;
  gastoMayo: number;
  gastoJunio: number;
  gastoJulio: number;
  gastoAgosto: number;
  gastoSeptiembre: number;
  gastoOctubre: number;
  gastoNoviembre: number;
  gastoDiciembre: number;
  presupuestoEnero: number;
  presupuestoFebrero: number;
  presupuestoMarzo: number;
  presupuestoAbril: number;
  presupuestoMayo: number;
  presupuestoJunio: number;
  presupuestoJulio: number;
  presupuestoAgosto: number;
  presupuestoSeptiembre: number;
  presupuestoOctubre: number;
  presupuestoNoviembre: number;
  presupuestoDiciembre: number;
}

export interface BudgetProposalItemHistoryDTO {
  id: string;
  budgetProposalItemId: string;
  oldAmount: number;
  newAmount: number;
  changedByUserName: string;
  changedAt: Date;
  justification: string;
}

export interface BudgetProposalItemSupportFileDTO {
  id: string;
  budgetProposalItemSupportId: string;
  fileName: string;
  fileUrl: string;
  uploadedByUserName: string;
  uploadedAt: Date;
}

export interface BudgetProposalItemSupportDTO {
  id: string;
  budgetProposalItemId: string;
  providerName: string;
  totalAmount: number;
  comment: string;
  files: BudgetProposalItemSupportFileDTO[];
}

export interface CreateBudgetProposalItemSupportDTO {
  budgetProposalItemId: string;
  providerName: string;
  totalAmount: number;
  comment: string;
  files: File[];
}









