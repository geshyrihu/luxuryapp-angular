import { DatePipe, DecimalPipe } from "@angular/common";
import { Component, DestroyRef, effect, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { addIcons } from "ionicons";
import { cashOutline } from "ionicons/icons";
import { TableModule } from "primeng/table";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { SignalRService } from "src/app/core/services/signalr.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { CobranzaPaymentResponseDTO } from "../interfaces/cobranza-payment.dto";
import { EPaymentMethod, EPaymentStatus } from "../interfaces/enums";
import CreditNoteModalComponent from "./credit-note-modal";
import { PaymentDetailModal } from "./payment-detail-modal";
import { PaymentForm } from "./payment-form";

@Component({
  selector: "app-payment-list",
  imports: [
    WebButtonIcon,
    WebButtonIconEdit,
    LxTooltipDirective,
    MobileActionMenu,
    MobileButtonLabelEdit,
    TableModule,
    PrimeNgCustomTableEmptyMessage,
    PrimeNgCustomCaption,
    WebButtonLabel,
    WebButtonLabelEdit,
    DecimalPipe,
    DatePipe,
    DataViewMobile,
    MobileListItem,
    AppIcon,
    ActionMenu,
  ],
  templateUrl: "./payment-list.html",
})
export default class PaymentList {
  private apiResponseS = inject(ApiResponseService);
  private toastService = inject(CustomToastService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);
  private destroyRef = inject(DestroyRef);
  private signalRService = inject(SignalRService);

  private realtimeCustomerId: string | null = null;

  tablePrimeNgRows = tablePrimeNgRows();
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
    >(Endpoints.AccountingCoi.NativeCollection.Payments.customer(customerId));

    this.dataSignal.set(result ?? []);
  }

  onModalForm(id: string = "") {
    const data = {
      id,
      title: id === "" ? "Registrar Cobro" : "Editar Cobro",
      customerId: this.customerIdS.customerId(),
    };

    this.dialogHandlerS
      .openDialog(PaymentForm, data, data.title, this.dialogHandlerS.sizeLg)
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
    const confirmed = window.confirm(
      `¿Deseas cancelar el pago de ${item.propertyFullName} por $${item.amount.toFixed(2)}?\n\nEsta acción revertirá los cargos aplicados a este pago.`,
    );
    if (!confirmed) return;

    const reason = window.prompt(
      "Ingresa el motivo formal de cancelación del pago (mínimo 10 caracteres):",
      "Pago cancelado por aclaración operativa",
    );

    if (!reason) return;
    if (reason.trim().length < 10) {
      this.toastService.showError(
        "Error",
        "El motivo de cancelación debe tener al menos 10 caracteres.",
      );
      return;
    }

    const success = await this.apiResponseS.onPost(
      Endpoints.AccountingCoi.NativeCollection.Payments.cancel(item.id),
      { reason: reason.trim() },
    );

    if (success !== false) this.onLoadData();
  }
}
