import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from "@angular/core";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import {
  WebButtonLabelDelete,
  WebButtonLabelEdit,
} from "@ui/buttons/web-label";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { ETypeEmpresa, StatusBadge } from "@ui/web/status-badge/status-badge";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
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
    TableEmptyMessage,
    LuxTableCaption,
    TableFooter,
    AppTable,
    AppSortableColumn,
    AppSorticon,
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

  readonly tableRows: number = tableRows();
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
        this.dialogHandlerS.sizeXl,
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
