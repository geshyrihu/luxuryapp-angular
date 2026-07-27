import { CurrencyPipe, DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { LxCard } from "@ui/adaptive/card/card";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { addIcons } from "ionicons";
import { alertCircleOutline } from "ionicons/icons";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { CollectionCaseResponseDTO } from "../../interfaces/collection-case.dto";

@Component({
  selector: "app-collection-case-list",
  imports: [
    AppIcon,
    LxCard,
    LxTag,
    MobileListItem,
    WebButtonIconEdit,
    MobileActionMenu,
    MobileButtonLabelEdit,
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    PrimeNgCustomCaption,
    WebButtonLabel,
    DataViewMobile,
    DatePipe,
    CurrencyPipe,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./collection-case-list.html",
})
export default class CollectionCaseList {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);

  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();
  scrollHeight = inject(TableScrollHeightService).scrollHeight;

  dataSignal = signal<CollectionCaseResponseDTO[]>([]);
  escalating = signal(false);

  constructor() {
    addIcons({ alertCircleOutline });
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) this.onLoadData(customerId);
    });
  }

  async onLoadData(customerId: string) {
    const res = await this.apiResponseS.onGetItem<CollectionCaseResponseDTO[]>(
      Endpoints.CobranzaCore.CollectionCases.byCustomer(
        customerId,
      ),
    );
    this.dataSignal.set(res ?? []);
  }

  async onEvaluateAndEscalate() {
    const customerId = this.customerIdS.customerId();
    if (!customerId) return;
    this.escalating.set(true);
    try {
      const res = await this.apiResponseS.onPost<number>(
        Endpoints.CobranzaCore.CollectionCases.evaluateAndEscalate(
          customerId,
        ),
        {},
      );
      if (res !== null) await this.onLoadData(customerId);
    } finally {
      this.escalating.set(false);
    }
  }

  openDetail(item: CollectionCaseResponseDTO) {
    import("./collection-case-detail-modal").then((m) => {
      this.dialogHandlerS
        .openDialog(
          m.default,
          { item },
          "Expediente de Cobranza",
          this.dialogHandlerS.sizeLg,
        )
        .then((refreshed: boolean) => {
          if (refreshed) this.onLoadData(this.customerIdS.customerId()!);
        });
    });
  }

  agingMeta(bucket: string) {
    if (bucket?.includes("90")) {
      return { label: bucket, severity: "danger" as const };
    }
    if (bucket?.includes("60")) {
      return { label: bucket, severity: "warning" as const };
    }
    if (bucket?.includes("30")) {
      return { label: bucket, severity: "secondary" as const };
    }
    return { label: bucket, severity: "contrast" as const };
  }

  statusMeta(status: string) {
    const map: Record<string, { label: string; severity: "danger" | "success" | "warning" | "contrast" }> = {
      Activo: { label: "Activo", severity: "danger" },
      Resuelto: { label: "Resuelto", severity: "success" },
      Pausado: { label: "Pausado", severity: "warning" },
    };
    return map[status] ?? { label: status, severity: "contrast" };
  }
}
