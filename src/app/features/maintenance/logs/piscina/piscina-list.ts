import { Component, computed, effect, inject, signal } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CardModule } from "primeng/card";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { ImageModule } from "primeng/image";
import { TableModule } from "primeng/table";
import { WebButtonLabelItem } from "src/app/core/components/buttons/web-label";
import { WebButtonLabelDelete } from "src/app/core/components/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "src/app/core/components/buttons/web-label/button-edit";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomTableEmptyMessage } from "src/app/core/components/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { Endpoints } from "src/app/core/constants/endpoints";
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
import { MobileActionMenu } from "src/app/core/components/mobile/action-menu-mobile/action-menu-mobile";
import { MobileButtonLabelEdit } from "src/app/core/components/buttons/mobile-label/button-edit";
import { MobileButtonLabelDelete } from "src/app/core/components/buttons/mobile-label/button-delete";
import { MobileButtonLabelItem } from "src/app/core/components/buttons/mobile-label/button-item";

import { WebButtonIconEdit } from "src/app/core/components/buttons/web-icon/button-edit";
import { WebButtonIconDelete } from "src/app/core/components/buttons/web-icon/button-delete";
import { WebButtonIconItem } from "src/app/core/components/buttons/web-icon/button-item";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-piscina-list",
  templateUrl: "./piscina-list.html",
  imports: [
    WebButtonIconEdit,
    WebButtonIconDelete,
    WebButtonIconItem,
    TooltipModule,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    MobileButtonLabelItem,
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    ImageModule,
    RouterModule,
    ActionMenu,
    WebButtonLabelDelete,
    WebButtonLabelEdit,
    WebButtonLabelItem,
    DataViewMobile,
    PrimeNgCustomCaption,
    PrimeNgCustomCaption,
    CardModule,
    WebButtonLabelItem,
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
    this.apiResponseS
      .onDelete(Endpoints.Piscina.delete(id))
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((data) =>
            data.filter((item) => item.id !== id),
          );
      });
  }
}
