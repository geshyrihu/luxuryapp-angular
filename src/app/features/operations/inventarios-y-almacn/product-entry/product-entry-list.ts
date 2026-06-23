import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { CardModule } from "primeng/card";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
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
import { ProductEntryForm } from "./product-entry-form";
@Component({
  selector: "app-list-entradas",
  templateUrl: "./product-entry-list.html",
  imports: [
    CommonModule,
    TableModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    ActionMenu,
    CustomButtonEdit,
    CustomButtonDelete,
    CardModule,
    IonItem,
    IonLabel,
    CustomButtonDelete,
    CustomButtonEdit,
  ],
})
export class ProductEntryList {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  public aspRoleS = inject(AspRoleService);
  public AspRole = EApplicationRole;
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
    const urlApi = `EntradaProducto/GetEntradaProductos/${this.customerIdS.customerId()}`;
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      if (result) {
        this.dataSignal.set(result);
      }
    });
  }
  onDelete(id: any) {
    this.apiResponseS
      .onDelete(`entradaproducto/${id}`)
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









