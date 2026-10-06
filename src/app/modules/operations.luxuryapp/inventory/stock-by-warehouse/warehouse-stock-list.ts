import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { ProductOutputForm } from "@operations.luxuryapp/inventory/product-exit/product-output-form";
import { TarjetaProducto } from "@purchases.luxuryapp/products/tarjeta-producto";
import { ProductEntryForm } from "../product-entry/product-entry-form";
import { WarehouseStockListDesktop } from "./desktop/warehouse-stock-list-desktop";
import { WarehouseStockListMobile } from "./mobile/warehouse-stock-list-mobile";
import { WarehouseStockAdd } from "./warehouse-stock-add";
import { WarehouseStockEdit } from "./warehouse-stock-edit";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";

@Component({
  selector: "app-warehouse-stock-list",
  templateUrl: "./warehouse-stock-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [WarehouseStockListDesktop, WarehouseStockListMobile],
})
export class WarehouseStockList {
  apiResponseS = inject(ApiResponseService);
  confirmS = inject(ConfirmService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  authS = inject(AuthService);
  platformS = inject(PlatformService);
  route = inject(ActivatedRoute);
  public aspRoleS = inject(AspRoleService);
  public AspRole = ApplicationRole;

  dataSignal = signal<any[]>([]);
  almacenIdFromRoute: string | null = null;

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
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
    let urlApi = Endpoints.InventarioProducto.listByWarehouse(
      customerId,
      this.almacenIdFromRoute,
    );
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      if (result) {
        this.dataSignal.set(result);
        this.updateRowGroupMetaData();
      }
    });
  }

  async onDelete(id: any) {
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar este registro?",
    );
    if (!confirmed) return;
    this.apiResponseS
      .onDelete(Endpoints.InventarioProducto.delete(id))
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
        this.dialogHandlerS.sizeXl,
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
        this.dialogHandlerS.sizeXl,
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
        this.dialogHandlerS.sizeXl,
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
      this.dialogHandlerS.sizeXl,
    );
  }
}
