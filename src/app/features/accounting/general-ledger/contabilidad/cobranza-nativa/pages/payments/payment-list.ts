import { Component, effect, inject, signal } from "@angular/core";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { cashOutline } from "ionicons/icons";
import { ConfirmationService } from "primeng/api";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { EmptyState } from "src/app/core/components/shared/empty-state/empty-state";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";

import { Endpoints } from "src/app/core/constants/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { CobranzaPaymentResponseDTO } from "../../models/cobranza-payment.dto";
import CreditNoteModalComponent from "./credit-note-modal";
import { PaymentForm } from "./payment-form";

// Pipes
import { DatePipe, DecimalPipe } from "@angular/common";
import { EPaymentMethod, EPaymentStatus } from "../../models/enums";

@Component({
  selector: "app-payment-list",
  imports: [
    TableModule,
    EmptyState,
    PrimeNgCustomCaption,
    CustomButtonEdit,
    CustomButtonDelete,
    ConfirmDialogModule,
    DecimalPipe,
    DatePipe,
    DataViewMobile,
    ActionMenu,
    CustomButtonEdit,
    CustomButtonDelete,
    IonItem,
    IonLabel,
  ],
  providers: [ConfirmationService],
  templateUrl: "./payment-list.html",
})
export default class PaymentList {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);
  private confirmationS = inject(ConfirmationService);

  // PrimeNG Constants
  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();
  scrollHeight = inject(TableScrollHeightService).scrollHeight;

  // States
  dataSignal = signal<CobranzaPaymentResponseDTO[]>([]);

  EPaymentStatus = EPaymentStatus;
  EPaymentMethod = EPaymentMethod;

  constructor() {
    addIcons({ cashOutline });
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) {
        this.onLoadData();
      }
    });
  }

  async onLoadData() {
    const customerId = this.customerIdS.customerId();
    if (!customerId) return;

    const result = await this.apiResponseS.onGetItem<
      CobranzaPaymentResponseDTO[]
    >(Endpoints.AccountingCoi.NativeCollection.Payments.customer(customerId));
    if (result) {
      this.dataSignal.set(result);
    } else {
      this.dataSignal.set([]);
    }
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
      header: "Cancelar Pago Rebotado",
      icon: "mdi:alert",
      acceptLabel: "Sí, cancelar pago",
      rejectLabel: "No",
      acceptButtonStyleClass: "p-button-danger",
      accept: async () => {
        const success = await this.apiResponseS.onPost(
          Endpoints.AccountingCoi.NativeCollection.Payments.cancel(item.id),
          {},
        );
        if (success !== false) this.onLoadData();
      },
    });
  }

  async onDelete(item: CobranzaPaymentResponseDTO) {
    this.apiResponseS
      .onDelete(
        Endpoints.AccountingCoi.NativeCollection.Payments.delete(item.id),
      )
      .then((res) => {
        if (res) this.onLoadData();
      });
  }
}
