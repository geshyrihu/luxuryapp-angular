import { DecimalPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { LxTag } from "@ui/adaptive/tag/tag";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { TableCaption } from "@ui/web/table-caption/table-caption";
import { AppTable } from "@ui/web/table/table";
import { addIcons } from "ionicons";
import { warningOutline } from "ionicons/icons";
import { ELateFeeType } from "../../interfaces/enums";
import { LateFeePolicyResponseDTO } from "../../interfaces/late-fee-policy.dto";
import { LateFeePolicyForm } from "./late-fee-policy-form";

@Component({
  selector: "app-late-fee-policy-list",
  imports: [
    AppIcon,
    MobileListItem,
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    LxTag,
    AppTable,
    TableCaption,
    DecimalPipe,
    DataViewMobile,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./late-fee-policy-list.html",
})
export default class LateFeePolicyList {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);

  tableRows = tableRows();
  rowsPerPageOptions = rowsPerPageOptions();
  scrollHeight = inject(TableScrollHeightService).scrollHeight;

  dataSignal = signal<LateFeePolicyResponseDTO[]>([]);

  ELateFeeType = ELateFeeType;

  constructor() {
    addIcons({ warningOutline });
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

    const result = await this.apiResponseS.onGetItem<
      LateFeePolicyResponseDTO[]
    >(Endpoints.CobranzaCore.LateFeePolicies.customer(customerId));
    if (result) {
      this.dataSignal.set(result);
    } else {
      this.dataSignal.set([]);
    }
  }

  onModalForm(id: string = "") {
    const data = {
      id,
      title: id === "" ? "Nueva Política de Mora" : "Editar Política",
      customerId: this.customerIdS.customerId(),
    };
    this.dialogHandlerS
      .openDialog(
        LateFeePolicyForm,
        data,
        data.title,
        this.dialogHandlerS.sizeMd,
      )
      .then((res: boolean) => {
        if (res) this.onLoadData();
      });
  }

  async onDelete(item: LateFeePolicyResponseDTO) {
    this.apiResponseS
      .onDelete(Endpoints.CobranzaCore.LateFeePolicies.delete(item.id))
      .then((res) => {
        if (res) this.onLoadData();
      });
  }

  lateFeeTypeMeta(type: ELateFeeType) {
    switch (type) {
      case ELateFeeType.Fijo:
        return { label: "Monto Fijo", severity: "info" as const };
      case ELateFeeType.Porcentaje:
        return { label: "Porcentaje", severity: "secondary" as const };
      default:
        return { label: String(type), severity: "contrast" as const };
    }
  }
}
