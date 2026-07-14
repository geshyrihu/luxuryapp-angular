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
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
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
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { ProductEntryForm } from "./product-entry-form";

import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "app-list-entradas",
  templateUrl: "./product-entry-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    AppIcon,
    MobileListItem,
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    TableModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
  ],
})
export class ProductEntryList {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  public aspRoleS = inject(AspRoleService);
  public AspRole = ApplicationRole;
  // Seóales
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
    const urlApi =
      Endpoints.RefactorOperations.entradaProductoGetEntradaProductosById(
        this.customerIdS.customerId(),
      );
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      if (result) {
        this.dataSignal.set(result);
      }
    });
  }
  onDelete(id: any) {
    this.apiResponseS
      .onDelete(Endpoints.RefactorOperations.entradaproductoById(id))
      .then((result: boolean) => {
        if (result) {
          this.dataSignal.update((data) =>
            data.filter((item) => item.id !== id),
          );
        }
      });
  }

  onAddEntrada(data: any) {
    this.dialogHandlerS
      .openDialog(
        ProductEntryForm,
        {
          id: data.id,
          almacenId: data.almacenId,
          idProducto: data.idProducto,
          nombreProducto: data.nombreProducto,
        },
        "Entrada de Productos",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
