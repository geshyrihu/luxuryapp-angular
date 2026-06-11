import { Component, computed, effect, inject, signal } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonAvatar } from "@ionic/angular/standalone";
import { CardModule } from "primeng/card";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { ImageModule } from "primeng/image";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { IonButtonItem } from "src/app/core/components/buttons/mobile";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { CustomButtonItem } from "src/app/core/components/buttons/web/custom-button-item";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { PiscinaForm } from "./piscina-form";
@Component({
  selector: "app-piscina-list",
  templateUrl: "./piscina-list.html",
  imports: [
    TableModule,
    ImageModule,
    RouterModule,
    ActionMenu,
    CustomButtonDelete,
    CustomButtonEdit,
    CustomButtonItem,
    DataViewMobile,
    PrimeNgCustomCaption,
    PrimeNgCustomCaption,
    CardModule,

    IonAvatar,

    IonButtonItem,
  ],
})
export class PiscinaList {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);

  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  ref: DynamicDialogRef;

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }
  onLoadData() {
    const urlApi = "piscina/list/" + this.customerIdS.customerId();
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }
  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(PiscinaForm, data, data.title, this.dialogHandlerS.sizeLg)
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onDelete(id: any) {
    this.apiResponseS.onDelete(`piscina/${id}`).then((result: boolean) => {
      if (result)
        this.dataSignal.update((data) => data.filter((item) => item.id !== id));
    });
  }
}









