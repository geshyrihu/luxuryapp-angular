import { CurrencyPipe, DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { addIcons } from "ionicons";
import { alertCircleOutline } from "ionicons/icons";
import { TableModule } from "primeng/table";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { CollectionCaseResponseDTO } from "../../models/collection-case.dto";

import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";

@Component({
  selector: "app-collection-case-list",
  imports: [
    WebButtonIconEdit,
    MobileActionMenu,
    MobileButtonLabelEdit,
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    PrimeNgCustomCaption,
    WebButtonLabel,
    DataViewMobile,
    IonItem,
    IonLabel,
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
      Endpoints.AccountingCoi.NativeCollection.CollectionCases.byCustomer(
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
        Endpoints.AccountingCoi.NativeCollection.CollectionCases.evaluateAndEscalate(
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

  agingClass(bucket: string): string {
    if (bucket?.includes("90")) return "bg-red-100 text-red-800";
    if (bucket?.includes("60")) return "bg-orange-100 text-orange-800";
    if (bucket?.includes("30")) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-600";
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      Activo: "bg-red-100 text-red-800",
      Resuelto: "bg-green-100 text-green-800",
      Pausado: "bg-yellow-100 text-yellow-800",
    };
    return map[status] ?? "bg-gray-100 text-gray-600";
  }
}
