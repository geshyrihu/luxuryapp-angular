import { Component, effect, inject, signal } from "@angular/core";
import { IonIcon, IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { receiptOutline } from "ionicons/icons";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { IonButtonDelete } from "src/app/core/components/buttons/mobile/ion-button-delete";
import { IonButtonEdit } from "src/app/core/components/buttons/mobile/ion-button-edit";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { ChargeTemplateResponseDTO } from "../../models/charge-template.dto";
import { ChargeTemplateForm } from "./charge-template-form";

// Pipes
import { CurrencyPipe, DatePipe, NgClass } from "@angular/common";
import {
  ECalculationMethod,
  EChargeType,
  ERecurrence,
} from "../../models/enums";

@Component({
  selector: "app-charge-template-list",
  imports: [
    TableModule,
    PrimeNgCustomCaption,
    CustomButtonEdit,
    CustomButtonDelete,
    DatePipe,
    CurrencyPipe,
    NgClass,
    DataViewMobile,
    ActionMenu,
    IonButtonEdit,
    IonButtonDelete,
    IonItem,
    IonLabel,
    IonIcon,
  ],
  templateUrl: "./charge-template-list.html",
})
export default class ChargeTemplateList {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);

  // PrimeNG Constants
  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();
  scrollHeight = inject(TableScrollHeightService).scrollHeight;

  // States
  dataSignal = signal<ChargeTemplateResponseDTO[]>([]);

  ERecurrence = ERecurrence; // For template access
  ECalculationMethod = ECalculationMethod;
  EChargeType = EChargeType;

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
    >(Endpoints.AccountingCoi.NativeCollection.Templates.customer(customerId));
    if (result) {
      this.dataSignal.set(result);
    } else {
      this.dataSignal.set([]);
    }
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
      .onDelete(Endpoints.AccountingCoi.NativeCollection.Templates.delete(item.id))
      .then((res) => {
        if (res) this.onLoadData();
      });
  }
}
