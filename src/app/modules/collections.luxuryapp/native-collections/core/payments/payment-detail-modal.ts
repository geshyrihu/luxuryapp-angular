import { CurrencyPipe } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogConfig,
} from "@core/services/dialog-handler.service";
import { LxCard } from "@ui/adaptive/card/card";
import { LxTag } from "@ui/adaptive/tag/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { ApiDatePipe } from "src/app/shared/pipes/api-date.pipe";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import {
  CobranzaPaymentAllocationDetailDTO,
  CobranzaPaymentResponseDTO,
} from "../../interfaces/cobranza-payment.dto";
import { EPaymentMethod, EPaymentStatus } from "../../interfaces/enums";
import { ChargeForm } from "../charges/charge-form";

@Component({
  selector: "app-payment-detail-modal",
  imports: [
    ApiDatePipe,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    CurrencyPipe,

    LxCard,
    LxTag,
    MobileListItem,
    LxIcon,
    TableEmptyMessage,
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
      Endpoints.CobranzaCore.Payments.getById(id),
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

  getStatusSeverity(payment: CobranzaPaymentResponseDTO) {
    switch (payment.status) {
      case EPaymentStatus.Verificado:
        return "success" as const;
      case EPaymentStatus.Rechazado:
        return "danger" as const;
      case EPaymentStatus.Cancelado:
        return "contrast" as const;
      case EPaymentStatus.Revertido:
        return "warning" as const;
      case EPaymentStatus.NoIdentificado:
        return "info" as const;
      default:
        return "secondary" as const;
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
      this.dialogHandlerS.sizeXl,
    );
  }
}
