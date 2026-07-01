import { DatePipe } from "@angular/common";
import { Component, effect, inject, signal } from "@angular/core";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { shieldCheckmarkOutline } from "ionicons/icons";
import { TableModule } from "primeng/table";
import { WebButtonLabel } from "src/app/core/components/buttons/web/label";
import { WebButtonLabelEdit } from "src/app/core/components/buttons/web/label/button-edit";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomTableEmptyMessage } from "src/app/core/components/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
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
import {
  EFinancialApprovalOperationType,
  EFinancialApprovalStatus,
} from "../../models/enums";
import { FinancialApprovalResponseDTO } from "../../models/financial-approval.dto";

@Component({
  selector: "app-approval-inbox",
  imports: [
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    PrimeNgCustomCaption,
    WebButtonLabel,
    DataViewMobile,
    ActionMenu,
    WebButtonLabelEdit,
    IonItem,
    IonLabel,
    DatePipe,
  ],
  templateUrl: "./approval-inbox.html",
})
export default class ApprovalInbox {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);

  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();
  scrollHeight = inject(TableScrollHeightService).scrollHeight;

  EFinancialApprovalStatus = EFinancialApprovalStatus;
  EFinancialApprovalOperationType = EFinancialApprovalOperationType;

  dataSignal = signal<FinancialApprovalResponseDTO[]>([]);

  constructor() {
    addIcons({ shieldCheckmarkOutline });
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  async onLoadData() {
    const customerId = this.customerIdS.customerId();
    if (!customerId) return;
    const res = await this.apiResponseS.onGetItem<
      FinancialApprovalResponseDTO[]
    >(
      Endpoints.AccountingCoi.NativeCollection.FinancialApprovals.pending(
        customerId,
      ),
    );
    this.dataSignal.set(res ?? []);
  }

  openDetail(item: FinancialApprovalResponseDTO) {
    import("./approval-detail-modal").then((m) => {
      this.dialogHandlerS
        .openDialog(
          m.default,
          { item },
          "Revisar Solicitud",
          this.dialogHandlerS.sizeLg,
        )
        .then((res: boolean) => {
          if (res) this.onLoadData();
        });
    });
  }

  operationLabel(op: EFinancialApprovalOperationType): string {
    const labels: Record<EFinancialApprovalOperationType, string> = {
      [EFinancialApprovalOperationType.Condonacion]: "Condonacion",
      [EFinancialApprovalOperationType.DevolucionPago]: "Devolucion Pago",
      [EFinancialApprovalOperationType.ReaperturaPeriodo]: "Reapertura Periodo",
      [EFinancialApprovalOperationType.AnulacionCargoPagado]: "Anulacion Cargo",
      [EFinancialApprovalOperationType.AjusteAlAlza]: "Ajuste al Alza",
    };
    return labels[op] ?? String(op);
  }

  statusClass(status: EFinancialApprovalStatus): string {
    const classes: Record<EFinancialApprovalStatus, string> = {
      [EFinancialApprovalStatus.Pendiente]: "bg-yellow-100 text-yellow-800",
      [EFinancialApprovalStatus.Aprobada]: "bg-green-100 text-green-800",
      [EFinancialApprovalStatus.Rechazada]: "bg-red-100 text-red-800",
      [EFinancialApprovalStatus.Cancelada]: "bg-gray-100 text-gray-600",
    };
    return classes[status] ?? "";
  }

  statusLabel(status: EFinancialApprovalStatus): string {
    return EFinancialApprovalStatus[status] ?? String(status);
  }
}
