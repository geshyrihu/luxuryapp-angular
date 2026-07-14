import { NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { addIcons } from "ionicons";
import { layersOutline } from "ionicons/icons";
import { TableModule } from "primeng/table";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { ChargeTypeCatalogResponseDTO } from "../interfaces/charge-type-catalog.dto";
import { ChargeTypeForm } from "./charge-type-form";

@Component({
  selector: "app-charge-type-list",
  imports: [
    NgClass,
    TableModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableEmptyMessage,
    DataViewMobile,
    MobileListItem,

    MobileActionMenu,
    AppIcon,
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
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
    >(
      Endpoints.AccountingCoi.NativeCollection.ChargeTypes.customer(customerId),
    );

    this.dataSignal.set(result ?? []);
  }

  onModalForm(id: string = "") {
    const data = {
      id,
      title: id === "" ? "Nuevo Tipo de Cargo" : "Editar Tipo de Cargo",
      customerId: this.customerIdS.customerId(),
    };

    this.dialogHandlerS
      .openDialog(ChargeTypeForm, data, data.title, this.dialogHandlerS.sizeMd)
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
