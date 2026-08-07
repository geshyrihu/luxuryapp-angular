import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { PrestamoHerramientaFormControl } from "./prestamo-herramienta-form-control";

import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { MobileListItem } from "@ui/mobile/list-item/list-item";

@Component({
  selector: "app-prestamo-herramientas-control",
  templateUrl: "./prestamo-herramientas-control.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    TableModule,

    PrimeNgCustomCaption,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    AppIcon,
    MobileListItem,
  ],
})
export class PrestamoHerramientasControl {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  public aspRoleS = inject(AspRoleService);
  public AspRole = ApplicationRole;

  // Pagination Setup
  rows = 30;
  totalRecords = 0;
  page: number = 1;
  searchTerm: string = "";
  sortField: string = "";
  sortOrder: number = 1;

  dataSignal = signal<any>({
    items: [],
    totalRecords: 0,
  });

  globalFilterFields = computed(() => {
    const data = this.dataSignal().items;
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

  loadDataLazy(event: any) {
    this.page = Math.floor(event.first / event.rows) + 1;
    this.rows = event.rows;
    this.sortField = event.sortField;
    this.sortOrder = event.sortOrder;
    this.onLoadData();
  }

  applyFilter() {
    this.page = 1;
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = Endpoints.ToolLoans.listByCustomer(
      this.customerIdS.customerId(),
    );
    const httpParams = {
      page: this.page,
      recordsNumber: this.rows,
      filter: this.searchTerm,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
    };

    this.apiResponseS.onGetList(urlApi, httpParams).then((result: any) => {
      this.dataSignal.set(result);
      this.totalRecords = result.totalRecords;
      this.loading.set(false);
    });
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(Endpoints.ToolLoans.delete(id))
      .then((result: boolean) => {
        if (result) {
          this.dataSignal.update((data) => ({
            ...data,
            items: data.items.filter((item: any) => item.id !== id),
            totalRecords: data.totalRecords - 1,
          }));
          this.totalRecords--;
        }
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        PrestamoHerramientaFormControl,
        data,
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
