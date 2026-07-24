import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { AppAvatar } from "@ui/web/avatar/avatar";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { InputNumberModule } from "@ui/web/primeng-inputnumber/primeng-inputnumber";

import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";

import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { ProductosForm } from "src/app/apps/supplier.luxuryapp/product/productos-form";
import { TarjetaProducto } from "src/app/apps/supplier.luxuryapp/product/tarjeta-producto";
import { AuthService } from "src/app/core/auth/services/auth.service";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";

interface IOrdenCompraDetalleRowForm {
  productoId: FormControl<string | null>;
  marca: FormControl<string>;
  producto: FormControl<string>;
  urlImagen: FormControl<string | null>;
  cantidad: FormControl<number | null>;
  unidadMedidaId: FormControl<string | null>;
  precio: FormControl<number | null>;
  descuento: FormControl<number | null>;
  ivaAplicado: FormControl<number | null>;
  retencionIVAPorcentaje: FormControl<number | null>;
  retencionISRPorcentaje: FormControl<number | null>;
}

import { LxMessage } from "@ui/adaptive/message/message";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";

@Component({
  selector: "app-orden-compra-detalle-add-producto",
  templateUrl: "./orden-compra-detalle-add-producto.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIconItem,
    ReactiveFormsModule,
    TableModule,
    AppAvatar,
    InputNumberModule,
    CustomInputSelectSignal,
    CustomInputNumberSignal,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    LxMessage,
  ],
})
export class OrdenCompraDetalleAddProducto implements OnInit, OnDestroy {
  private apiResponseS = inject(ApiResponseService);
  private dialogHandlerS = inject(DialogHandlerService);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private authS = inject(AuthService);
  private formB = inject(FormBuilder);

  ordenCompraId: string = "";
  dataSignal = signal<any>({
    items: [],
    totalRecords: 0,
  });
  formArray = new FormArray<FormGroup<IOrdenCompraDetalleRowForm>>([]);
  formControls = signal<FormGroup<IOrdenCompraDetalleRowForm>[]>([]);

  // Pagination Setup
  rows = 30;
  totalRecords = 0;
  page: number = 1;
  searchTerm: string = "";
  sortField: string = "";
  sortOrder: number = 1;

  globalFilterFields = computed(() => {
    const data = this.dataSignal()?.items;
    return data && data.length > 0 ? Object.keys(data[0]) : [];
  });

  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  mensajeError = false;

  cb_unidadMedida: any[] = [];

  ngOnInit(): void {
    this.apiResponseS
      .onGetSelectItem<SelectItemDto[]>(Endpoints.SelectItems.measurementUnits)
      .then((response: any) => {
        this.cb_unidadMedida = response;
      });

    this.ordenCompraId = this.config.data.ordenCompraId;
    console.debug("[OrdenCompraDetalleAddProducto] Modal initialized", {
      ordenCompraId: this.ordenCompraId,
      data: this.config.data,
    });
  }

  loadDataLazy(event: any) {
    this.page = Math.floor(event.first / event.rows) + 1;
    this.rows = event.rows;
    this.sortField = event.sortField;
    this.sortOrder = event.sortOrder;
    this.searchTerm = event.globalFilter || "";
    this.onLoadProduct();
  }

  applyFilter() {
    this.page = 1;
    this.onLoadProduct();
  }

  onLoadProduct() {
    if (!this.ordenCompraId) {
      console.error(
        "[OrdenCompraDetalleAddProducto] Missing ordenCompraId while loading products",
      );
      return;
    }
    this.loading.set(true);

    const urlApi = Endpoints.PurchaseOrderDetails.addProductToOrder(
      this.ordenCompraId,
    );
    const httpParams: Record<string, unknown> = {
      page: this.page,
      recordsNumber: this.rows,
      filter: this.searchTerm,
      sortOrder: this.sortOrder,
    };
    if (this.sortField) {
      httpParams.sortField = this.sortField;
    }

    this.apiResponseS.onGetList(urlApi, httpParams).then((result: any) => {
      if (!result) {
        console.error(
          "[OrdenCompraDetalleAddProducto] Failed to load products for purchase order",
          {
            ordenCompraId: this.ordenCompraId,
            urlApi,
            httpParams,
          },
        );
        this.dataSignal.set({ items: [], totalRecords: 0 });
        this.formArray.clear();
        this.formControls.set([]);
        this.totalRecords = 0;
        this.loading.set(false);
        return;
      }

      console.debug(
        "[OrdenCompraDetalleAddProducto] Products loaded for purchase order",
        {
          ordenCompraId: this.ordenCompraId,
          totalRecords: result?.totalRecords || 0,
          currentPage: this.page,
        },
      );

      this.dataSignal.set(result);
      this.totalRecords = result?.totalRecords || 0;
      this.formArray.clear();

      if (result?.items && Array.isArray(result.items)) {
        result.items.forEach((item: any) => {
          this.formArray.push(
            this.formB.group({
              productoId: new FormControl(item.productoId),
              marca: new FormControl(item.marca || ""),
              producto: new FormControl(item.producto),
              urlImagen: new FormControl(item.urlImagenProducto),
              cantidad: new FormControl(item.cantidad, {
                validators: [Validators.required, Validators.min(0.01)],
              }),
              unidadMedidaId: new FormControl(item.unidadMedidaId, {
                validators: [Validators.required],
              }),
              precio: new FormControl(item.precio, {
                validators: [Validators.min(0)],
              }),
              descuento: new FormControl(item.descuento, {
                validators: [Validators.min(0)],
              }),
              ivaAplicado: new FormControl(item.ivaAplicado, {
                validators: [Validators.min(0)],
              }),
              retencionIVAPorcentaje: new FormControl(
                item.retencionIVAPorcentaje,
                {
                  validators: [Validators.min(0)],
                },
              ),
              retencionISRPorcentaje: new FormControl(
                item.retencionISRPorcentaje,
                {
                  validators: [Validators.min(0)],
                },
              ),
            }),
          );
        });
      }
      this.formControls.set([...this.formArray.controls]);
      this.loading.set(false);
    });
  }

  onSubmit(rowGroup: FormGroup<IOrdenCompraDetalleRowForm>) {
    rowGroup.markAllAsTouched();
    const value = rowGroup.getRawValue();

    if (rowGroup.invalid || !value.unidadMedidaId || !value.productoId) {
      this.mensajeError = true;
      return;
    }

    const payload = {
      ...value,
      applicationUserId: this.authS.userToken.infoUserAuthDTO.applicationUserId,
      ordenCompraId: this.ordenCompraId,
    };

    this.apiResponseS
      .onPost(Endpoints.PurchaseOrderDetails.create, payload)
      .then((result) => {
        if (!result) {
          console.error(
            "[OrdenCompraDetalleAddProducto] Failed to add product to purchase order",
            {
              ordenCompraId: this.ordenCompraId,
              productoId: value.productoId,
              payload,
            },
          );
          return;
        }

        console.debug(
          "[OrdenCompraDetalleAddProducto] Product added to purchase order",
          {
            ordenCompraId: this.ordenCompraId,
            productoId: value.productoId,
          },
        );
        this.mensajeError = false;
        this.onLoadProduct();
      });
  }

  onModalForm() {
    this.ref.close();
    this.dialogHandlerS.openDialog(
      ProductosForm,
      { id: 0 },
      "Registrar nuevo Producto",
      this.dialogHandlerS.sizeLg,
    );
  }

  onModalTarjetaProducto(productoId: any): void {
    this.dialogHandlerS.openDialog(
      TarjetaProducto,
      { productoId: productoId },
      "Tarjeta de Producto",
      this.dialogHandlerS.sizeLg,
    );
  }

  ngOnDestroy(): void {
    this.ref.close(true);
  }
}
