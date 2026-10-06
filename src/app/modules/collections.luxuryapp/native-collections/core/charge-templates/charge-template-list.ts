import { CurrencyPipe, NgClass } from "@angular/common";
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
import { LxIcon } from "@ui/adaptive/icon/icon";
import { addIcons } from "ionicons";
import { receiptOutline } from "ionicons/icons";
import { ApiDatePipe } from "src/app/shared/pipes/api-date.pipe";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";
import { ChargeTemplateResponseDTO } from "../../interfaces/charge-template.dto";
import { ECalculationMethod, Recurrence } from "../../interfaces/enums";
import { ChargeTemplateForm } from "./charge-template-form";

@Component({
  selector: "app-charge-template-list",
  imports: [
    MobileListItem,
    ButtonWeb,
    MobileActionMenu,
    ButtonMobile,
    LxTag,
    LxIcon,
    CurrencyPipe,
    DataViewMobile,
    ApiDatePipe,
    NgClass,
    TableEmptyMessage,
    LuxTableCaption,
    AppTable,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./charge-template-list.html",
})
export default class ChargeTemplateList {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);
  private confirmS = inject(ConfirmService);

  tableRows = tableRows();
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
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar esta plantilla de cargo?",
    );
    if (!confirmed) return;
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
