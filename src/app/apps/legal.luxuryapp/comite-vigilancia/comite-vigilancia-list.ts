import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileButtonLabelSendEmail } from "@ui/buttons/mobile-label/button-send-email";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ComiteVigilancia } from "src/app/core/interfaces/comite-vigilancia.interface";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { ComiteVigilanciaForm } from "./comite-vigilancia-form";

import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconSendEmail } from "@ui/buttons/web-icon/button-send-email";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "app-comite-vigilancia-list",
  templateUrl: "./comite-vigilancia-list.html",
  // Aóadido para Angular 20
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    AppIcon,
    MobileListItem,
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
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
  ],
})
export class ComiteVigilanciaList {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  dataSignal = signal<ComiteVigilancia[]>([]);
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
