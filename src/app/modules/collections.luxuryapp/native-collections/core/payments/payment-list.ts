import { DecimalPipe } from "@angular/common";
import { Component, DestroyRef, effect, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { SignalRService } from "@core/services/signalr.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { LxTag } from "@ui/adaptive/tag/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { ButtonMobile } from "@ui/buttons/mobile";
import { ButtonWeb } from "@ui/buttons/web";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { addIcons } from "ionicons";
import { cashOutline } from "ionicons/icons";
import { ApiDatePipe } from "src/app/shared/pipes/api-date.pipe";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { CobranzaPaymentResponseDTO } from "../../interfaces/cobranza-payment.dto";
import { EPaymentMethod, EPaymentStatus } from "../../interfaces/enums";
import CreditNoteModalComponent from "./credit-note-modal";
import PaymentCancelModal from "./payment-cancel-modal";
import { PaymentDetailModal } from "./payment-detail-modal";
import { PaymentForm } from "./payment-form";

@Component({
  selector: "app-payment-list",
  imports: [
    ButtonWeb,
    LxTooltipDirective,
    LxTag,
    MobileActionMenu,
    ButtonMobile,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    TableEmptyMessage,
    LuxTableCaption,
    DecimalPipe,
    ApiDatePipe,
    LuxDataViewMobile,
    MobileListItem,
    LxIcon,
    ActionMenu,
  ],
  templateUrl: "./payment-list.html",
})
export default class PaymentList {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);
  private destroyRef = inject(DestroyRef);
  private signalRService = inject(SignalRService);

  private realtimeCustomerId: string | null = null;

  tableRows = tableRows();
  rowsPerPageOptions = rowsPerPageOptions();
  scrollHeight = inject(TableScrollHeightService).scrollHeight;

  dataSignal = signal<CobranzaPaymentResponseDTO[]>([]);

  EPaymentStatus = EPaymentStatus;
  EPaymentMethod = EPaymentMethod;

  getPaymentFlowLabel(item: CobranzaPaymentResponseDTO): string {
    if (item.unappliedAmount > 0.009 && item.allocatedAmount > 0.009) {
      return "Parcialmente aplicado";
    }

    if (item.unappliedAmount > 0.009) {
      return "Sin aplicar";
    }

    return "Aplicado";
  }

  constructor() {
    addIcons({ cashOutline });
    this.signalRService.nativeCollectionUpdate$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        void this.onLoadData();
      });

    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) {
        this.setupRealtime(customerId);
        void this.onLoadData();
      }
    });
  }

  private setupRealtime(customerId: string) {
    if (this.realtimeCustomerId === customerId) return;

    if (this.realtimeCustomerId) {
      void this.signalRService.leaveNativeCollectionGroup(
        this.realtimeCustomerId,
      );
    }

    this.realtimeCustomerId = customerId;
    this.signalRService.start();
    void this.signalRService.joinNativeCollectionGroup(customerId);

    this.destroyRef.onDestroy(() => {
      if (this.realtimeCustomerId) {
        void this.signalRService.leaveNativeCollectionGroup(
          this.realtimeCustomerId,
        );
      }
    });
  }

  async onLoadData() {
    const customerId = this.customerIdS.customerId();
    if (!customerId) return;

    const result = await this.apiResponseS.onGetItem<
      CobranzaPaymentResponseDTO[]
    >(Endpoints.CobranzaCore.Payments.customer(customerId));

    this.dataSignal.set(result ?? []);
  }

  onModalForm(id: string = "") {
    const data = {
      id,
      title: id === "" ? "Registrar Cobro" : "Editar Cobro",
      customerId: this.customerIdS.customerId(),
    };

    this.dialogHandlerS
      .openDialog(PaymentForm, data, data.title, this.dialogHandlerS.sizeXl)
      .then((res: boolean) => {
        if (res) this.onLoadData();
      });
  }

  onViewDetail(item: CobranzaPaymentResponseDTO) {
    this.dialogHandlerS.openDialog(
      PaymentDetailModal,
      { id: item.id },
      "Detalle del Pago",
      this.dialogHandlerS.sizeMd,
    );
  }

  onCreditNote() {
    const customerId = this.customerIdS.customerId();
    if (!customerId) return;

    this.dialogHandlerS
      .openDialog(
        CreditNoteModalComponent,
        { customerId },
        "Emitir Nota de Crédito / Condonación",
        this.dialogHandlerS.sizeMd,
      )
      .then((res: boolean) => {
        if (res) this.onLoadData();
      });
  }

  async onCancelPayment(item: CobranzaPaymentResponseDTO) {
    const reason = await this.dialogHandlerS.openDialog<string | null>(
      PaymentCancelModal,
      {
        summary: `Pago de ${item.propertyFullName} por $${item.amount.toFixed(2)}. Esta acción revertirá los cargos aplicados.`,
      },
      "Cancelar pago",
      this.dialogHandlerS.sizeXl,
    );
    if (!reason) return;

    const success = await this.apiResponseS.onPost(
      Endpoints.CobranzaCore.Payments.cancel(item.id),
      { reason },
    );

    if (success !== false) this.onLoadData();
  }

  paymentMethodLabel(method: EPaymentMethod): string {
    switch (method) {
      case EPaymentMethod.Cash:
        return "Efectivo";
      case EPaymentMethod.ElectronicTransfer:
        return "Transferencia";
      case EPaymentMethod.NominativeCheck:
        return "Cheque";
      case EPaymentMethod.CreditCard:
        return "Tarjeta Cto.";
      case EPaymentMethod.DebitCard:
        return "Tarjeta Dto.";
      case EPaymentMethod.ToBeDefined:
        return "Por Definir";
      default:
        return String(method);
    }
  }

  paymentStatusMeta(item: CobranzaPaymentResponseDTO) {
    switch (item.status) {
      case EPaymentStatus.Registrado:
        return {
          label: this.getPaymentFlowLabel(item),
          severity: "warning" as const,
        };
      case EPaymentStatus.Verificado:
        return { label: "Verificado", severity: "success" as const };
      case EPaymentStatus.Rechazado:
        return { label: "Rechazado", severity: "danger" as const };
      case EPaymentStatus.Cancelado:
        return { label: "Cancelado", severity: "contrast" as const };
      case EPaymentStatus.Revertido:
        return { label: "Revertido", severity: "secondary" as const };
      case EPaymentStatus.NoIdentificado:
        return { label: "No identificado", severity: "info" as const };
      default:
        return { label: String(item.status), severity: "contrast" as const };
    }
  }
}
