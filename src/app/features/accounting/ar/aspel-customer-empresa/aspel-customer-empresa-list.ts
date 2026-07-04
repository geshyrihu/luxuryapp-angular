import { CommonModule } from "@angular/common";
import { Component, OnInit, computed, inject, signal } from "@angular/core";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import {
  WebButtonLabelDelete,
  WebButtonLabelEdit,
} from "src/app/core/components/buttons/web-label";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomTableEmptyMessage } from "src/app/core/components/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import {
  ETypeEmpresa,
  StatusBadge,
} from "src/app/core/components/web/status-badge/status-badge";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { AspelCustomerEmpresaForm } from "./aspel-customer-empresa-form";

import { MobileActionMenu } from "src/app/core/components/mobile/action-menu-mobile/action-menu-mobile";
import { MobileButtonLabelEdit } from "src/app/core/components/buttons/mobile-label/button-edit";
import { MobileButtonLabelDelete } from "src/app/core/components/buttons/mobile-label/button-delete";

import { WebButtonIconEdit } from "src/app/core/components/buttons/web-icon/button-edit";
import { WebButtonIconDelete } from "src/app/core/components/buttons/web-icon/button-delete";

@Component({
  selector: "app-aspel-customer-empresa-list",
  templateUrl: "./aspel-customer-empresa-list.html",
  imports: [
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    ActionMenu,
    CommonModule,
    WebButtonLabelDelete,
    WebButtonLabelEdit,
    DataViewMobile,
    PrimeNgCustomTableEmptyMessage,
    IonItem,
    IonLabel,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    TableModule,
    TooltipModule,
    WebButtonLabelDelete,
    WebButtonLabelEdit,
    StatusBadge,
  ],
})
export class AspelCustomerEmpresaList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdService = inject(CustomerIdService);

  dataSignal = signal<any[]>([]);
  customerId = this.customerIdService.customerId;
  ETypeEmpresa = ETypeEmpresa;

  readonly tablePrimeNgRows: number = tablePrimeNgRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  readonly globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(Endpoints.AspelCustomerEmpresa.getAll)
      .then((res: any) => this.dataSignal.set(res));
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        AspelCustomerEmpresaForm,
        { ...data, customerId: this.customerId() },
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }

  onDelete(id: string) {
    this.apiResponseS
      .onDelete(Endpoints.AspelCustomerEmpresa.delete(id))
      .then((res: any) => {
        if (res) this.onLoadData();
      });
  }
}
function getGlobalFilterFields(data: void): any {
  throw new Error("Function not implemented.");
}
