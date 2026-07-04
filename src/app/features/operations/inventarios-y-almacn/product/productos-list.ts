import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { AvatarModule } from "primeng/avatar";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
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
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { ProductosForm } from "./productos-form";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";

import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";

@Component({
  selector: "app-productos-list",
  templateUrl: "./productos-list.html",
  imports: [
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    AvatarModule,
  ],
})
export class ProductosList implements OnInit {
  authS = inject(AuthService);
  aspRoleS = inject(AspRoleService);
  dialogHandlerS = inject(DialogHandlerService);
  apiResponseS = inject(ApiResponseService);
  tableScrollHeightS = inject(TableScrollHeightService);
  // Signals
  dataSignal = signal<any[]>([]);
  filteredDataSignal = signal<any[]>([]);
  public AspRole = EApplicationRole;

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();

  private readonly MOBILE_PAGE_SIZE = 20;
  mobilePage = signal(1);
  mobileDataSignal = signal<any[]>([]);
  mobileTotalRecords = signal(0);

  ref: DynamicDialogRef;
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  account_id: string = this.authS.userToken.infoUserAuthDTO.applicationUserId;

  ngOnInit(): void {
    this.onLoadData();
    this.onLoadMobile();
  }

  onLoadData() {
    return this.apiResponseS
      .onGetList(Endpoints.Products.getAll)
      .then((result: any) => {
        if (result) {
          this.dataSignal.set(result);
          this.filteredDataSignal.set(result);
        }
      });
  }

  onLoadMobile() {
    this.mobilePage.set(1);
    const params = { page: 1, recordsNumber: this.MOBILE_PAGE_SIZE };
    return this.apiResponseS
      .onGetListNotLoading<any>(Endpoints.Products.getAllPaged, params)
      .then((result: any) => {
        if (result) {
          this.mobileDataSignal.set(result.items ?? []);
          this.mobileTotalRecords.set(result.totalRecords ?? 0);
        }
      });
  }

  // ... Eliminar registro
  onDelete(id: any) {
    return this.apiResponseS
      .onDelete(Endpoints.Products.delete(id))
      .then((result: boolean) => {
        if (result) {
          this.dataSignal.update((data) =>
            data.filter((item) => item.id !== id),
          );
          this.filteredDataSignal.update((data) =>
            data.filter((item) => item.id !== id),
          );
          this.mobileDataSignal.update((data) =>
            data.filter((item) => item.id !== id),
          );
          this.mobileTotalRecords.update((n) => n - 1);
        }
      });
  }

  loadNextPage(event: any) {
    const nextPage = this.mobilePage() + 1;
    const params = { page: nextPage, recordsNumber: this.MOBILE_PAGE_SIZE };
    this.apiResponseS
      .onGetListNotLoading<any>(Endpoints.Products.getAllPaged, params)
      .then((result: any) => {
        if (result?.items?.length) {
          this.mobilePage.set(nextPage);
          this.mobileDataSignal.update((items) => [...items, ...result.items]);
        }
        event.target.complete();
        const noMore = !result || !result.items?.length;
        const allLoaded =
          this.mobileDataSignal().length >= this.mobileTotalRecords();
        if (noMore || allLoaded) event.target.disabled = true;
      });
  }

  // ... Llamada al Modal agregar o editar
  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(ProductosForm, data, data.title, this.dialogHandlerS.sizeLg)
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
          this.onLoadMobile();
        }
      });
  }
}
