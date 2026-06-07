import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
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
@Component({
  selector: "app-prestamo-herramientas-control",
  templateUrl: "./prestamo-herramientas-control.html",
  imports: [
    CommonModule,
    TableModule,
    CustomButtonDelete,
    CustomButtonEdit,
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
    const urlApi = `ControlPrestamoHerramientas/list/${this.customerIdS.customerId()}`;
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
      .onDelete(`ControlPrestamoHerramientas/${id}`)
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









