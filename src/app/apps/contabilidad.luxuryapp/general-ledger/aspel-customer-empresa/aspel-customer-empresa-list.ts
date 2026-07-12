import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from "@angular/core";
import {
  WebButtonLabelDelete,
  WebButtonLabelEdit,
} from "@ui/buttons/web-label";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { ETypeEmpresa, StatusBadge } from "@ui/web/status-badge/status-badge";
import { TableModule } from "primeng/table";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { AspelCustomerEmpresaForm } from "./aspel-customer-empresa-form";

import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";

@Component({
  selector: "app-aspel-customer-empresa-list",
  templateUrl: "./aspel-customer-empresa-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    AppIcon,
    MobileListItem,
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    ActionMenu,
    WebButtonLabelDelete,
    WebButtonLabelEdit,
    DataViewMobile,
    PrimeNgCustomTableEmptyMessage,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    TableModule,
    LxTooltipDirective,
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
