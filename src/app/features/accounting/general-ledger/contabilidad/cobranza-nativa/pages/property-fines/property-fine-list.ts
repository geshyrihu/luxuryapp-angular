import { EmptyState } from "src/app/core/components/shared/empty-state/empty-state";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { Component, effect, inject, signal } from "@angular/core";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { alertCircleOutline } from "ionicons/icons";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
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
import { EFineStatus } from "../../models/enums";
import { PropertyFineResponseDTO } from "../../models/property-fine.dto";
import { IssueFineChargeForm } from "./issue-fine-charge-form";
import { PropertyFineForm } from "./property-fine-form";

type TagSeverity =
  | "success"
  | "info"
  | "warn"
  | "danger"
  | "secondary"
  | "contrast";

@Component({
  selector: "app-property-fine-list",
  imports: [
    EmptyState,
    TableModule,
    TagModule,
    PrimeNgCustomCaption,
    CustomButtonEdit,
    CustomButtonDelete,
    CurrencyPipe,
    DatePipe,
    DataViewMobile,
    ActionMenu,
    CustomButtonEdit,
    CustomButtonDelete,
    IonItem,
    IonLabel,
  ],
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
      Endpoints.AccountingCoi.NativeCollection.PropertyFines.byCustomer(
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
        Endpoints.AccountingCoi.NativeCollection.PropertyFines.void(
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
