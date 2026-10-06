import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { LxTag } from "@ui/adaptive/tag/tag";
import { ButtonMobile } from "@ui/buttons/mobile";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { ButtonWeb } from "@ui/buttons/web";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { addIcons } from "ionicons";
import { layersOutline } from "ionicons/icons";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";
import { ChargeTypeCatalogResponseDTO } from "../../interfaces/charge-type-catalog.dto";
import { ChargeTypeForm } from "./charge-type-form";

@Component({
  selector: "app-charge-type-list",
  imports: [
    AppTable,
    LuxTableCaption,
    TableEmptyMessage,
    LxTag,
    DataViewMobile,
    MobileListItem,
    MobileActionMenu,
    AppIcon,
    ButtonWeb,
    MobileActionMenu,
    ButtonMobile,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./charge-type-list.html",
})
export default class ChargeTypeList {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);
  private confirmS = inject(ConfirmService);

  tableRows = tableRows();
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
    >(Endpoints.CobranzaCore.ChargeTypes.customer(customerId));

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

  async onDelete(item: ChargeTypeCatalogResponseDTO) {
    if (item.isSystem) return;

    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar este tipo de cargo?",
    );
    if (!confirmed) return;

    this.apiResponseS
      .onDelete(Endpoints.CobranzaCore.ChargeTypes.delete(item.id))
      .then((res) => {
        if (res) this.onLoadData();
      });
  }

  originMeta(isSystem: boolean) {
    return isSystem
      ? { label: "Sistema", severity: "info" as const }
      : { label: "Custom", severity: "success" as const };
  }
}
