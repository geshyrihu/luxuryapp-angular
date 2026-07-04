import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { Endpoints } from "src/app/core/constants/endpoints";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { PrestamoHerramientaFormControl } from "./prestamo-herramienta-form-control";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";

import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";

@Component({
  selector: "app-prestamo-herramientas-control",
  templateUrl: "./prestamo-herramientas-control.html",
  imports: [
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    TableModule,
    WebButtonLabelDelete,
    WebButtonLabelEdit,
    PrimeNgCustomCaption,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    ActionMenu,
    AppIcon,
  ],
})
export class PrestamoHerramientasControl {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  public aspRoleS = inject(AspRoleService);
  public AspRole = EApplicationRole;

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
