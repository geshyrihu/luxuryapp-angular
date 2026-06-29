import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { CardModule } from "primeng/card";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import {
  CustomButtonDelete,
  CustomButtonEdit,
  CustomButtonItem,
} from "src/app/core/components/web/buttons";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { EmptyState } from "src/app/core/components/shared/empty-state/empty-state";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
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
import { ProductOutputForm } from "src/app/features/operations/inventarios-y-almacn/product-exit/product-output-form";
import { TarjetaProducto } from "src/app/features/operations/inventarios-y-almacn/product/tarjeta-producto";
import { ProductEntryForm } from "../product-entry/product-entry-form";
import { WarehouseStockAdd } from "./warehouse-stock-add";
import { WarehouseStockEdit } from "./warehouse-stock-edit";
@Component({
  selector: "app-warehouse-stock-list",
  templateUrl: "./warehouse-stock-list.html",
  imports: [
    EmptyState,
    CommonModule,
    TableModule,
    PrimeNgCustomCaption,
    DataViewMobile,
    ActionMenu,
    CustomButtonItem,
    CustomButtonEdit,
    CustomButtonDelete,
    CardModule,
    IonItem,
    IonLabel,
    CustomButtonDelete,
    CustomButtonEdit,
    CustomButtonItem,
  ],
})
export class WarehouseStockList {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  authS = inject(AuthService);
  route = inject(ActivatedRoute);
  public aspRoleS = inject(AspRoleService);
  public AspRole = EApplicationRole;
  // Señales
  dataSignal = signal<any[]>([]);
  almacenIdFromRoute: string | null = null;

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  ref: DynamicDialogRef;

  rowGroupMetadata: any = this.customerIdS.customerId;

  constructor() {
    this.almacenIdFromRoute = this.route.snapshot.paramMap.get("almacenId");
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }
  onSort() {
    this.updateRowGroupMetaData();
  }

  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};
    const data = this.dataSignal();

    if (data) {
      for (let i = 0; i < data.length; i++) {
        let rowData = data[i];
        let representativeName = rowData.category;
        if (i == 0) {
          this.rowGroupMetadata[representativeName] = { index: 0, size: 1 };
        } else {
          let previousRowData = data[i - 1];
          let previousRowGroup = previousRowData.category;
          if (representativeName === previousRowGroup)
            this.rowGroupMetadata[representativeName].size++;
          else
            this.rowGroupMetadata[representativeName] = { index: i, size: 1 };
        }
      }
    }
  }

  onLoadData() {
    const customerId: string = this.customerIdS.customerId();
    let urlApi = `InventarioProducto/GetAsyncAll/${customerId}/${this.almacenIdFromRoute}`;
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      if (result) {
        this.dataSignal.set(result);
        this.updateRowGroupMetaData();
      }
    });
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(`InventarioProducto/${id}`)
      .then((result: boolean) => {
        if (result) {
          this.dataSignal.update((data) =>
            data.filter((item) => item.id !== id),
          );
          this.updateRowGroupMetaData();
        }
      });
  }

  editProductos(data: any) {
    this.dialogHandlerS
      .openDialog(
        WarehouseStockEdit,
        {
          id: data.id,
          idProducto: data.idProducto,
        },
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  addProductos(data: any) {
    this.dialogHandlerS
      .openDialog(
        WarehouseStockAdd,
        {
          almacenId: this.almacenIdFromRoute,
          id: data.id,
          idProducto: data.idProducto,
        },
        data.title,
        this.dialogHandlerS.sizeFull,
      )
      .then(() => {
        this.onLoadData();
      });
  }

  onAddEntrada(data: any) {
    this.dialogHandlerS
      .openDialog(
        ProductEntryForm,
        {
          id: 0,
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
  onAddSalida(data: any) {
    this.dialogHandlerS
      .openDialog(
        ProductOutputForm,
        {
          id: data.id,
          idInventarioProducto: data.idInventarioProducto,
          idProducto: data.idProducto,
          nombreProducto: data.nombreProducto,
          almacenId: data.almacenId,
        },
        "Salida de Productos",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onModalTarjetaProducto(productoId: any): void {
    this.dialogHandlerS.openDialog(
      TarjetaProducto,
      {
        productoId: productoId,
      },
      "Tarjeta de Producto",
      this.dialogHandlerS.sizeLg,
    );
  }
}

