import { CurrencyPipe, DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { addIcons } from "ionicons";
import { alertCircleOutline } from "ionicons/icons";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { EFineStatus } from "../interfaces/enums";
import { PropertyFineResponseDTO } from "../interfaces/property-fine.dto";
import { IssueFineChargeForm } from "./issue-fine-charge-form";
import { PropertyFineForm } from "./property-fine-form";

type TagSeverity =
  "success" | "info" | "warn" | "danger" | "secondary" | "contrast";

import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";

@Component({
  selector: "app-property-fine-list",
  imports: [
    AppIcon,
    LxTag,
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    MobileListItem,
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    PrimeNgCustomCaption,
    CurrencyPipe,
    DatePipe,
    DataViewMobile,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./property-fine-list.html",
})
export default class PropertyFineList {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);

  tablePrimeNgRows = tablePrimeNgRows();
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
      Endpoints.CobranzaCore.PropertyFines.byCustomer(
        customerId,
      ),
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
        this.dialogHandlerS.sizeLg,
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
    const reason = "Anulada por el administrador";
    this.apiResponseS
      .onDelete(
        Endpoints.CobranzaCore.PropertyFines.void(
          item.id,
          reason,
        ),
      )
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

