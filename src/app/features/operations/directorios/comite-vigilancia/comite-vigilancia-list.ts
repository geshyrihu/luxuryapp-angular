import { Component, computed, effect, inject, signal } from "@angular/core";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { WebButtonLabelSendEmail } from "@ui/buttons/web-label/button-send-email";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { IComiteVigilancia } from "src/app/core/interfaces/comite-vigilancia.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { ComiteVigilanciaForm } from "./comite-vigilancia-form";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelSendEmail } from "@ui/buttons/mobile-label/button-send-email";

import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconSendEmail } from "@ui/buttons/web-icon/button-send-email";

@Component({
  selector: "app-comite-vigilancia-list",
  templateUrl: "./comite-vigilancia-list.html",
  // Aóadido para Angular 20
  imports: [
    WebButtonIconEdit,
    WebButtonIconDelete,
    WebButtonIconSendEmail,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    MobileButtonLabelSendEmail,
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    NgbTooltipModule,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    WebButtonLabelSendEmail,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    ActionMenu,
    IonItem,
    IonLabel,
    WebButtonLabelDelete,
    WebButtonLabelEdit,
    WebButtonLabelSendEmail,
  ],
})
export class ComiteVigilanciaList {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  dataSignal = signal<IComiteVigilancia[]>([]);
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
    this.loading.set(true);
    this.apiResponseS
      .onGetList(
        Endpoints.CommitteeVigilance.list(this.customerIdS.customerId()),
      )
      .then((result: any) => {
        this.dataSignal.set(result);
        this.loading.set(false);
      });
  }
  onSendCredential(id: any) {
    this.apiResponseS
      .onPost(Endpoints.CommitteeVigilance.sendCredentials(id))
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onDelete(id: any) {
    this.apiResponseS
      .onDelete(Endpoints.CommitteeVigilance.delete(id))
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((currentData) =>
            currentData.filter((item) => item.id !== id),
          );
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        ComiteVigilanciaForm,
        {
          id: data.id,
        },
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
