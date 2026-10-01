import { PurchaseOrderAuthorizationStatus } from "@core/enums/purchase-order-authorization-status.enum";
import { SelectItemDto } from "@core/interfaces/select-item.dto";

export interface PurchaseOrderBudgetTotal {
  amount: number;
}

export interface PurchaseOrderDetailTotal {
  total: number;
}

export interface PurchaseOrderListBudget {
  accountName: string;
  accountNumber: string;
}

export interface PurchaseOrderListItem {
  id: string;
  folio: string;
  proveedor: string;
  indice: string;
  equipoOInstalacion: string;
  justificacionGasto: string;
  observaciones: string;
  fullName: string;
  budgets: PurchaseOrderListBudget[];
  fechaSolicitud: string;
  fechaAutorizacion: string | null;
  isFunded: boolean;
  fundingPeriodName: string;
  fundingYear: number | null;
  total: number;
  isFueraFondeo: boolean;
}

export interface PurchaseOrderAuth {
  id: string;
  ordenCompraId: string;
  fechaAutorizacion: string | null;
  statusOrdenCompra: PurchaseOrderAuthorizationStatus | string;
  observaciones: string;
  revisadoPorResidente: string | null;
  applicationUserAuth: string | null;
}

export interface PurchaseOrderStatus {
  id: string;
  ordenCompraId: string;
  sePago: boolean;
  seRecibio: boolean;
  recibidoPor: string | null;
  factura: string | null;
  fechaFactura: string | null;
  folioFiscal: string | null;
  pdfFile: string | null;
  xmlFile: string | null;
  facturas: PurchaseOrderInvoice[];
}

export interface PurchaseOrderPaymentData {
  id: string;
  provider: string;
  usoCFDI: string;
  metodoDePago: string;
  formaDePago: string;
  tipoGasto: string;
  sendToFunding: boolean;
  fundingPeriod: string | null;
}

export interface PurchaseOrderPaymentFormData {
  id: string;
  ordenCompraId: string;
  formaDePagoId: number | null;
  metodoDePagoId: number | null;
  providerId: number | null;
  usoCFDIId: number | null;
  tipoGasto: number | null;
  provider: string | null;
  fundingPeriod: number | null;
  fundingYear: number | null;
  reference: string | null;
  cuentaClave: string | null;
}

export interface PurchaseOrderProviderData {
  referencia: string | null;
  interbankCode: string | null;
}

export interface PurchaseOrderInvoice {
  id: string;
  tipoComprobante: "I" | "E";
  pdfFile?: string | null;
  xmlFile?: string | null;
}

export interface PurchaseOrderDetailLine {
  id: string;
  ordenCompraId: string;
  productoId: string | null;
  productName: string;
  cantidad: number;
  unitOfMeasure: string;
  unidadMedida: string;
  unidadMedidaId: string;
  precio: number;
  descuento: number;
  ivaAplicado: number;
  iva: number;
  retencionIVAPorcentaje: number;
  retencionIVACalculada: number;
  retencionISRPorcentaje: number;
  retencionISRCalculada: number;
  total: number;
}

export interface PurchaseOrderBudget {
  id: string;
  ordenCompraId: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  totalGastosPendientes: number;
  presupuestoRestante: number;
}

export interface PurchaseOrderView {
  id: string;
  customerId: string;
  folio: string;
  indice: string;
  fechaSolicitud: string;
  solicitudCompraId: string | null;
  folioSolicitudCompra: string | null;
  isDevolucion: boolean;
  urlFile: string | null;
  equipoOInstalacion: string;
  isLockedForModification: boolean;
  lockReason: string | null;
  justificacionGasto: string;
  notasEspeciales: string | null;
  ordenCompraAuth: PurchaseOrderAuth | null;
  ordenCompraDatosPago: PurchaseOrderPaymentData;
  ordenCompraStatus: PurchaseOrderStatus;
  ordenCompraDetalle: PurchaseOrderDetailLine[];
  ordenCompraPresupuestoUtilizado: Record<string, unknown>[];
  purchaseOrderBudget: PurchaseOrderBudget[];
  applicationUserId: string | null;
  facturas: Record<string, unknown>[];
}

export interface PurchaseOrderValidationResult {
  isValid: boolean;
  message: string;
  invoiceTotal?: number;
  purchaseOrderTotal?: number;
}

export interface PurchaseOrderProductDraft {
  productoId: string | null;
  unidadMedidaId: string | null;
  productName: string;
  image?: string;
  quantity: number;
  unitPrice: number;
  descuento: number;
  ivaAplicado: number;
  retencionIVAPorcentaje: number;
  retencionISRPorcentaje: number;
}

export interface PurchaseOrderFundingData {
  year: number;
  fundingPeriod: number;
}

export interface PurchaseOrderFundingPeriodGroup {
  monthName: string;
  quincenas: SelectItemDto[];
}

export interface PurchaseOrderBudgetAccount {
  accountNumber: string;
  accountName: string;
  availableBudget: number;
  budgetSpent: number;
  budgetMonth: number;
  pendingPayments: number;
  hasAvailableBudget: boolean;
  dineroUsado?: number;
}

export interface PurchaseOrderBudgetAccountsResponse {
  accounts: PurchaseOrderBudgetAccount[];
}

export interface PurchaseOrderCreateResult {
  id: string;
}
