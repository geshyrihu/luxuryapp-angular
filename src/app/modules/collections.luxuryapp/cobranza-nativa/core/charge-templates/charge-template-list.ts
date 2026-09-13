import { CurrencyPipe, NgClass } from "@angular/common";
import { ApiDatePipe } from "../../../../../shared/pipes/api-date.pipe";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { addIcons } from "ionicons";
import { receiptOutline } from "ionicons/icons";
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
import { ChargeTemplateResponseDTO } from "../../interfaces/charge-template.dto";
import { ECalculationMethod, Recurrence } from "../../interfaces/enums";
import { ChargeTemplateForm } from "./charge-template-form";

@Component({
  selector: "app-charge-template-list",
  imports: [
    MobileListItem,
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    LxTag,
    AppIcon,
    CurrencyPipe,
    DataViewMobile,
    ApiDatePipe,
    NgClass,
    PrimeNgCustomTableEmptyMessage,
    PrimeNgCustomCaption,
    TableModule,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./charge-template-list.html",
})
export default class ChargeTemplateList {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);

  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();
  scrollHeight = inject(TableScrollHeightService).scrollHeight;

  dataSignal = signal<ChargeTemplateResponseDTO[]>([]);

  constructor() {
    addIcons({ receiptOutline });
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
      ChargeTemplateResponseDTO[]
    >(Endpoints.CobranzaCore.Templates.customer(customerId));

    this.dataSignal.set(result ?? []);
  }

  onModalForm(id: string = "") {
    const data = {
      id,
      title: id === "" ? "Nueva Plantilla de Cargo" : "Editar Plantilla",
      customerId: this.customerIdS.customerId(),
    };

    this.dialogHandlerS
      .openDialog(
        ChargeTemplateForm,
        data,
        data.title,
        this.dialogHandlerS.sizeMd,
      )
      .then((res: boolean) => {
        if (res) this.onLoadData();
      });
  }

  async onDelete(item: ChargeTemplateResponseDTO) {
    this.apiResponseS
      .onDelete(Endpoints.CobranzaCore.Templates.delete(item.id))
      .then((res) => {
        if (res) this.onLoadData();
      });
  }

  calculationMethodMeta(method: ECalculationMethod) {
    if (method === ECalculationMethod.FixedAmount) {
      return { label: "Fijo Depto", severity: "contrast" as const };
    }

    return { label: "Indiviso Total", severity: "warning" as const };
  }

  recurrenceMeta(recurrence: Recurrence) {
    switch (recurrence) {
      case Recurrence.Eventual:
        return { label: "Eventual", severity: "contrast" as const };
      case Recurrence.Mensual:
        return { label: "Mensual", severity: "info" as const };
      case Recurrence.Bimestral:
        return { label: "Bimestral", severity: "secondary" as const };
      case Recurrence.Trimestral:
        return { label: "Trimestral", severity: "success" as const };
      case Recurrence.Cuatrimestral:
        return { label: "Cuatrimestral", severity: "success" as const };
      case Recurrence.Quimestral:
        return { label: "Quimestral", severity: "warning" as const };
      case Recurrence.Semestral:
        return { label: "Semestral", severity: "warning" as const };
      case Recurrence.Anual:
        return { label: "Anual", severity: "danger" as const };
      default:
        return { label: String(recurrence), severity: "contrast" as const };
    }
  }
}
