import { Component, effect, inject, signal } from "@angular/core";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { warningOutline } from "ionicons/icons";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { CustomButtonDelete } from "src/app/core/components/web/buttons/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/web/buttons/custom-button-edit";
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
import { LateFeePolicyResponseDTO } from "../../models/late-fee-policy.dto";
import { LateFeePolicyForm } from "./late-fee-policy-form";

// Pipes
import { DecimalPipe } from "@angular/common";
import { ELateFeeType } from "../../models/enums";

@Component({
  selector: "app-late-fee-policy-list",
  imports: [
    TableModule,
    PrimeNgCustomCaption,
    CustomButtonEdit,
    CustomButtonDelete,
    DecimalPipe,
    DataViewMobile,
    ActionMenu,
    CustomButtonEdit,
    CustomButtonDelete,
    IonItem,
    IonLabel,
  ],
  templateUrl: "./late-fee-policy-list.html",
})
export default class LateFeePolicyList {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);

  // PrimeNG Constants
  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();
  scrollHeight = inject(TableScrollHeightService).scrollHeight;

  // States
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
    >(
      Endpoints.AccountingCoi.NativeCollection.LateFeePolicies.customer(
        customerId,
      ),
    );
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
      .onDelete(
        Endpoints.AccountingCoi.NativeCollection.LateFeePolicies.delete(
          item.id,
        ),
      )
      .then((res) => {
        if (res) this.onLoadData();
      });
  }
}

