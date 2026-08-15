import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { addIcons } from "ionicons";
import { shieldCheckmarkOutline } from "ionicons/icons";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import {
  EFinancialApprovalOperationType,
  EFinancialApprovalStatus,
} from "../../interfaces/enums";
import { FinancialApprovalResponseDTO } from "../../interfaces/financial-approval.dto";

import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";

@Component({
  selector: "app-approval-inbox",
  imports: [
    AppIcon,
    MobileListItem,
    WebButtonIcon,
    LxTooltipDirective,
    LxTag,
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
    >(Endpoints.CobranzaCore.FinancialApprovals.pending(customerId));
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

  statusLabel(status: EFinancialApprovalStatus): string {
    return EFinancialApprovalStatus[status] ?? String(status);
  }

  operationSeverity(operation: EFinancialApprovalOperationType) {
    switch (operation) {
      case EFinancialApprovalOperationType.Condonacion:
        return "warning" as const;
      case EFinancialApprovalOperationType.DevolucionPago:
        return "info" as const;
      case EFinancialApprovalOperationType.ReaperturaPeriodo:
        return "secondary" as const;
      case EFinancialApprovalOperationType.AnulacionCargoPagado:
        return "danger" as const;
      case EFinancialApprovalOperationType.AjusteAlAlza:
        return "success" as const;
      default:
        return "contrast" as const;
    }
  }

  statusSeverity(status: EFinancialApprovalStatus) {
    switch (status) {
      case EFinancialApprovalStatus.Pendiente:
        return "warning" as const;
      case EFinancialApprovalStatus.Aprobada:
        return "success" as const;
      case EFinancialApprovalStatus.Rechazada:
        return "danger" as const;
      case EFinancialApprovalStatus.Cancelada:
        return "contrast" as const;
      default:
        return "contrast" as const;
    }
  }
}
