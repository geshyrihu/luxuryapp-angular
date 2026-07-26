import { DatePipe, DecimalPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { addIcons } from "ionicons";
import { cardOutline } from "ionicons/icons";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { SignalRService } from "src/app/core/services/signalr.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { ChargeResponseDTO } from "../../contracts/external-compatibility/interfaces/charge.dto";
import { EChargeStatus } from "../../interfaces/enums";
import { ChargeForm } from "./charge-form";

import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";

import { WebButtonIcon } from "@ui/buttons/web-icon/button";

@Component({
  selector: "app-charge-list",
  imports: [
    AppIcon,
    MobileListItem,
    WebButtonIcon,
    WebButtonIconEdit,
    LxTooltipDirective,
    MobileActionMenu,
    MobileButtonLabelEdit,
    TableModule,
    PrimeNgCustomTableEmptyMessage,
    PrimeNgCustomCaption,
    WebButtonLabel,
    DecimalPipe,
    DatePipe,
    DataViewMobile,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./charge-list.html",
})
export default class ChargeList {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);
  private destroyRef = inject(DestroyRef);
  private signalRService = inject(SignalRService);

  private realtimeCustomerId: string | null = null;

  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();
  scrollHeight = inject(TableScrollHeightService).scrollHeight;

  dataSignal = signal<ChargeResponseDTO[]>([]);

  EChargeStatus = EChargeStatus;

  constructor() {
    addIcons({ cardOutline });
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

    const result = await this.apiResponseS.onGetItem<ChargeResponseDTO[]>(
      Endpoints.CobranzaCore.Charges.customer(customerId),
    );

    this.dataSignal.set(result ?? []);
  }

  onModalForm(id: string = "") {
    const data = {
      id,
      title: id === "" ? "Nuevo Cargo a Cuota" : "Editar Cargo",
      customerId: this.customerIdS.customerId(),
    };

    this.dialogHandlerS
      .openDialog(ChargeForm, data, data.title, this.dialogHandlerS.sizeLg)
      .then((res: boolean) => {
        if (res) this.onLoadData();
      });
  }

  async onCancel(item: ChargeResponseDTO) {
    if (
      !window.confirm(
        `¿Deseas cancelar el cargo "${item.concept}" de ${item.propertyFullName || "la propiedad seleccionada"}?`,
      )
    ) {
      return;
    }

    const res = await this.apiResponseS.onPost(
      Endpoints.CobranzaCore.Charges.cancel(item.id),
    );

    if (res !== false) this.onLoadData();
  }

  openBulkImport() {
    import("./bulk-import-modal").then((m) => {
      const data = { customerId: this.customerIdS.customerId() };
      this.dialogHandlerS
        .openDialog(
          m.default,
          data,
          "Importar Saldos Iniciales",
          this.dialogHandlerS.sizeLg,
        )
        .then((res: boolean) => {
          if (res) this.onLoadData();
        });
    });
  }
}


