import { Component, effect, inject, signal } from "@angular/core";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { cardOutline } from "ionicons/icons";
import { TableModule } from "primeng/table";
import { WebButtonLabelDelete } from "src/app/core/components/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "src/app/core/components/buttons/web-label/button-edit";
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
import { ChargeResponseDTO } from "../../models/charge.dto";
import { ChargeForm } from "./charge-form";

// Pipes
import { DatePipe, DecimalPipe } from "@angular/common";
import { WebButtonLabel } from "src/app/core/components/buttons/web-label";
import { EChargeStatus, EChargeType } from "../../models/enums";

@Component({
  selector: "app-charge-list",
  imports: [
    TableModule,
    PrimeNgCustomTableEmptyMessage,
    PrimeNgCustomCaption,
    WebButtonLabel,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    DecimalPipe,
    DatePipe,
    DataViewMobile,
    ActionMenu,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    IonItem,
    IonLabel,
  ],
  templateUrl: "./charge-list.html",
})
export default class ChargeList {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);

  // PrimeNG Constants
  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();
  scrollHeight = inject(TableScrollHeightService).scrollHeight;

  // States
  dataSignal = signal<ChargeResponseDTO[]>([]);

  EChargeType = EChargeType;
  EChargeStatus = EChargeStatus;

  constructor() {
    addIcons({ cardOutline });
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

    const result = await this.apiResponseS.onGetItem<ChargeResponseDTO[]>(
      Endpoints.AccountingCoi.NativeCollection.Charges.customer(customerId),
    );
    if (result) {
      this.dataSignal.set(result);
    } else {
      this.dataSignal.set([]);
    }
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

  async onDelete(item: ChargeResponseDTO) {
    this.apiResponseS
      .onDelete(
        Endpoints.AccountingCoi.NativeCollection.Charges.delete(item.id),
      )
      .then((res) => {
        if (res) this.onLoadData();
      });
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
