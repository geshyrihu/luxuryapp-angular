import { Component, effect, inject, signal } from "@angular/core";
import { NgClass } from "@angular/common";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { layersOutline } from "ionicons/icons";
import { TableModule } from "primeng/table";
import { MobileButtonLabelDelete } from "src/app/core/components/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "src/app/core/components/buttons/mobile-label/button-edit";
import { WebButtonIconDelete } from "src/app/core/components/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "src/app/core/components/buttons/web-icon/button-edit";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { MobileActionMenu } from "src/app/core/components/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "src/app/core/components/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { ChargeTypeCatalogResponseDTO } from "../../models/charge-type-catalog.dto";
import { ChargeTypeForm } from "./charge-type-form";

@Component({
  selector: "app-charge-type-list",
  imports: [
    NgClass,
    TableModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableEmptyMessage,
    DataViewMobile,
    ActionMenu,
    MobileActionMenu,
    AppIcon,
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    IonItem,
    IonLabel,
  ],
  templateUrl: "./charge-type-list.html",
})
export default class ChargeTypeList {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);

  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();
  scrollHeight = inject(TableScrollHeightService).scrollHeight;

  dataSignal = signal<ChargeTypeCatalogResponseDTO[]>([]);

  constructor() {
    addIcons({ layersOutline });
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  async onLoadData() {
    const customerId = this.customerIdS.customerId();
    if (!customerId) return;

    const result = await this.apiResponseS.onGetItem<
      ChargeTypeCatalogResponseDTO[]
    >(Endpoints.AccountingCoi.NativeCollection.ChargeTypes.customer(customerId));

    this.dataSignal.set(result ?? []);
  }

  onModalForm(id: string = "") {
    const data = {
      id,
      title: id === "" ? "Nuevo Tipo de Cargo" : "Editar Tipo de Cargo",
      customerId: this.customerIdS.customerId(),
    };

    this.dialogHandlerS
      .openDialog(
        ChargeTypeForm,
        data,
        data.title,
        this.dialogHandlerS.sizeMd,
      )
      .then((res: boolean) => {
        if (res) this.onLoadData();
      });
  }

  onDelete(item: ChargeTypeCatalogResponseDTO) {
    if (item.isSystem) return;

    this.apiResponseS
      .onDelete(
        Endpoints.AccountingCoi.NativeCollection.ChargeTypes.delete(item.id),
      )
      .then((res) => {
        if (res) this.onLoadData();
      });
  }
}
