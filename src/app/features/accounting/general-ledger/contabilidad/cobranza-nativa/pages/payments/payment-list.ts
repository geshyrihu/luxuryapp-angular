import { DatePipe, DecimalPipe } from "@angular/common";
import { Component, DestroyRef, effect, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { cashOutline } from "ionicons/icons";
import { ConfirmationService } from "primeng/api";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { TableModule } from "primeng/table";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { SignalRService } from "src/app/core/services/signalr.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { CobranzaPaymentResponseDTO } from "../../models/cobranza-payment.dto";
import { EPaymentMethod, EPaymentStatus } from "../../models/enums";
import CreditNoteModalComponent from "./credit-note-modal";
import { PaymentDetailModal } from "./payment-detail-modal";
import { PaymentForm } from "./payment-form";

import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";

import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { TooltipModule } from "primeng/tooltip";

import { WebButtonIcon } from "@ui/buttons/web-icon/button";

@Component({
  selector: "app-payment-list",
  imports: [
    WebButtonIcon,
    WebButtonIconEdit,
    TooltipModule,
    MobileActionMenu,
    MobileButtonLabelEdit,
    TableModule,
    PrimeNgCustomTableEmptyMessage,
    PrimeNgCustomCaption,
    WebButtonLabel,
    WebButtonLabelEdit,
    ConfirmDialogModule,
    DecimalPipe,
    DatePipe,
    DataViewMobile,
    ActionMenu,
    IonItem,
    IonLabel,
  ],
  providers: [ConfirmationService],
  templateUrl: "./payment-list.html",
})
export default class PaymentList {
  private apiResponseS = inject(ApiResponseService);
  private toastService = inject(CustomToastService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);
  private confirmationS = inject(ConfirmationService);
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
      void this.signalRService.leaveNativeCollectionGroup(this.realtimeCustomerId);
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

  onCancelPayment(item: CobranzaPaymentResponseDTO) {
    this.confirmationS.confirm({
      message: `¿Deseas cancelar el pago de <strong>${item.propertyFullName}</strong> por <strong>$${item.amount.toFixed(2)}</strong>?<br/><span class="text-sm text-gray-500">Esta acción revertirá los cargos aplicados a este pago.</span>`,
      header: "Cancelar Pago",
      icon: "mdi:alert",
      acceptLabel: "Sí, cancelar pago",
      rejectLabel: "No",
      acceptButtonStyleClass: "p-button-danger",
      accept: async () => {
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
      },
    });
  }
}
