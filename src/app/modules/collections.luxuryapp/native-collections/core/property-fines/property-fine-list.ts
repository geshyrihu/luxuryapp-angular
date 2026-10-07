import { CurrencyPipe } from "@angular/common";
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
import { LxIcon } from "@ui/adaptive/icon/icon";
import { LxTag } from "@ui/adaptive/tag/tag";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { addIcons } from "ionicons";
import { alertCircleOutline } from "ionicons/icons";
import { ApiDatePipe } from "src/app/shared/pipes/api-date.pipe";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";
import { EFineStatus } from "../../interfaces/enums";
import { PropertyFineResponseDTO } from "../../interfaces/property-fine.dto";
import { IssueFineChargeForm } from "./issue-fine-charge-form";
import { PropertyFineForm } from "./property-fine-form";

type TagSeverity =
  "success" | "info" | "warn" | "danger" | "secondary" | "contrast";

import { ButtonMobile } from "@ui/buttons/mobile";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { ButtonWeb } from "@ui/buttons/web";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

@Component({
  selector: "app-property-fine-list",
  imports: [
    LxIcon,
    LxTag,
    ButtonWeb,
    MobileActionMenu,
    ButtonMobile,
    MobileListItem,
    TableEmptyMessage,
    AppTable,
    LuxTableCaption,
    CurrencyPipe,
    ApiDatePipe,
    LuxDataViewMobile,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./property-fine-list.html",
})
export default class PropertyFineList {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);
  private confirmS = inject(ConfirmService);

  tableRows = tableRows();
  rowsPerPageOptions = rowsPerPageOptions();
  scrollHeight = inject(TableScrollHeightService).scrollHeight;

  dataSignal = signal<PropertyFineResponseDTO[]>([]);
  EFineStatus = EFineStatus;

  constructor() {
    addIcons({ alertCircleOutline });
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  async onLoadData() {
    const customerId = this.customerIdS.customerId();
    if (!customerId) return;
    const result = await this.apiResponseS.onGetItem<PropertyFineResponseDTO[]>(
      Endpoints.CobranzaCore.PropertyFines.byCustomer(customerId),
    );
    this.dataSignal.set(result ?? []);
  }

  onModalForm(id: string = "") {
    const data = {
      id,
      title: id === "" ? "Nueva Multa" : "Editar Multa",
      customerId: this.customerIdS.customerId(),
    };
    this.dialogHandlerS
      .openDialog(
        PropertyFineForm,
        data,
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then((res: boolean) => {
        if (res) this.onLoadData();
      });
  }

  onIssueCharge(fine: PropertyFineResponseDTO) {
    const data = { fine, title: "Generar Cargo de Multa" };
    this.dialogHandlerS
      .openDialog(
        IssueFineChargeForm,
        data,
        data.title,
        this.dialogHandlerS.sizeMd,
      )
      .then((res: boolean) => {
        if (res) this.onLoadData();
      });
  }

  async onVoid(item: PropertyFineResponseDTO) {
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de anular esta multa?",
    );
    if (!confirmed) return;
    const reason = "Anulada por el administrador";
    this.apiResponseS
      .onDelete(Endpoints.CobranzaCore.PropertyFines.void(item.id, reason))
      .then((res) => {
        if (res) this.onLoadData();
      });
  }

  fineStatusSeverity(status: EFineStatus): TagSeverity {
    switch (status) {
      case EFineStatus.Emitida:
        return "warn";
      case EFineStatus.Notificada:
        return "info";
      case EFineStatus.CargoGenerado:
        return "danger";
      case EFineStatus.Pagada:
        return "success";
      case EFineStatus.Anulada:
        return "secondary";
    }
  }

  fineStatusLabel(status: EFineStatus): string {
    switch (status) {
      case EFineStatus.Emitida:
        return "Emitida";
      case EFineStatus.Notificada:
        return "Notificada";
      case EFineStatus.CargoGenerado:
        return "Cargo Generado";
      case EFineStatus.Pagada:
        return "Pagada";
      case EFineStatus.Anulada:
        return "Anulada";
    }
  }

  canEdit(status: EFineStatus): boolean {
    return status === EFineStatus.Emitida || status === EFineStatus.Notificada;
  }

  canIssueCharge(status: EFineStatus): boolean {
    return status === EFineStatus.Emitida || status === EFineStatus.Notificada;
  }

  canVoid(status: EFineStatus): boolean {
    return status !== EFineStatus.Pagada && status !== EFineStatus.Anulada;
  }
}
