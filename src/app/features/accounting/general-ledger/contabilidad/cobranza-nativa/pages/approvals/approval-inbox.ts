import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { addIcons } from "ionicons";
import { shieldCheckmarkOutline } from "ionicons/icons";
import { TableModule } from "primeng/table";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import {
  EFinancialApprovalOperationType,
  EFinancialApprovalStatus,
} from "../../models/enums";
import { FinancialApprovalResponseDTO } from "../../models/financial-approval.dto";

import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-approval-inbox",
  imports: [
    AppIcon,
    MobileListItem,
    WebButtonIcon,
    TooltipModule,
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    PrimeNgCustomCaption,

    DataViewMobile,
    MobileActionMenu,
    MobileButtonLabelEdit,
    DatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
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
