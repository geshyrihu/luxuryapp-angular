import { CommonModule, CurrencyPipe, DatePipe } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import {
  CobranzaPaymentAllocationDetailDTO,
  CobranzaPaymentResponseDTO,
} from "../../models/cobranza-payment.dto";
import { EPaymentMethod, EPaymentStatus } from "../../models/enums";
import { ChargeForm } from "../charges/charge-form";

@Component({
  selector: "app-payment-detail-modal",
  imports: [
    CommonModule,
    TableModule,
    CurrencyPipe,
    DatePipe,
    MobileListItem,
    AppIcon,
    PrimeNgCustomTableEmptyMessage,
    WebButtonIcon,
    LxTooltipDirective,
  ],
  templateUrl: "./payment-detail-modal.html",
})
export class PaymentDetailModal implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private config = inject(DynamicDialogConfig);
  private dialogHandlerS = inject(DialogHandlerService);

  payment = signal<CobranzaPaymentResponseDTO | null>(null);
  loading = signal(true);

  EPaymentStatus = EPaymentStatus;
  EPaymentMethod = EPaymentMethod;

  ngOnInit() {
    void this.loadData();
  }

  async loadData() {
    const id = this.config.data.id as string;
    const res = await this.apiResponseS.onGetItem<CobranzaPaymentResponseDTO>(
      Endpoints.AccountingCoi.NativeCollection.Payments.getById(id),
    );
    this.payment.set(res ?? null);
    this.loading.set(false);
  }

  getMethodLabel(method: EPaymentMethod): string {
    switch (method) {
      case EPaymentMethod.Cash:
        return "Efectivo";
      case EPaymentMethod.ElectronicTransfer:
        return "Transferencia";
      case EPaymentMethod.NominativeCheck:
        return "Cheque";
      case EPaymentMethod.CreditCard:
        return "Tarjeta crédito";
      case EPaymentMethod.DebitCard:
        return "Tarjeta débito";
      default:
        return "Por definir";
    }
  }

  getStatusLabel(payment: CobranzaPaymentResponseDTO): string {
    if (payment.status === EPaymentStatus.Registrado) {
      if (
        (payment.unappliedAmount ?? 0) > 0.009 &&
        (payment.allocatedAmount ?? 0) > 0.009
      ) {
        return "Parcialmente aplicado";
      }
      if ((payment.unappliedAmount ?? 0) > 0.009) {
        return "Sin aplicar";
      }
      return "Aplicado";
    }

    switch (payment.status) {
      case EPaymentStatus.Verificado:
        return "Verificado";
      case EPaymentStatus.Rechazado:
        return "Rechazado";
      case EPaymentStatus.Cancelado:
        return "Cancelado";
      case EPaymentStatus.Revertido:
        return "Revertido";
      case EPaymentStatus.NoIdentificado:
        return "No identificado";
      default:
        return String(payment.status);
    }
  }

  getChargeTypeMeta(item: CobranzaPaymentAllocationDetailDTO): string {
    const parts = [item.chargeTypeAccountNumber, item.chargeTypeCode].filter(
      (value): value is string => !!value,
    );
    return parts.join(" · ");
  }

  openCharge(item: CobranzaPaymentAllocationDetailDTO): void {
    this.dialogHandlerS.openDialog(
      ChargeForm,
      {
        id: item.chargeId,
        customerId: this.payment()?.customerId,
      },
      "Cargo Relacionado",
      this.dialogHandlerS.sizeLg,
    );
  }
}
