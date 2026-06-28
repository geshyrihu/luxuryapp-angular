import { Endpoints } from "src/app/core/constants/endpoints";
import {
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
import { AvatarModule } from "primeng/avatar";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { InputNumberModule } from "primeng/inputnumber";
import { MessageModule } from "primeng/message";
import { TableModule } from "primeng/table";

import { CommonModule } from "@angular/common";
import { CustomButtonItem } from "src/app/core/components/buttons/web/custom-button-item";
import { CustomInputNumberSignal } from "src/app/core/components/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/web/primeng-custom-table-footer/primeng-custom-table-footer";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { ProductosForm } from "src/app/features/operations/inventarios-y-almacn/product/productos-form";
import { TarjetaProducto } from "src/app/features/operations/inventarios-y-almacn/product/tarjeta-producto";

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

@Component({
  selector: "app-orden-compra-detalle-add-producto",
  templateUrl: "./orden-compra-detalle-add-producto.html",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    AvatarModule,
    InputNumberModule,
    CustomInputSelectSignal,
    CustomInputNumberSignal,
    CustomButtonItem,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    MessageModule,
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
      .onGetSelectItem<ISelectItem[]>(Endpoints.SelectItems.measurementUnits)
      .then((response: any) => {
        this.cb_unidadMedida = response;
      });

    this.ordenCompraId = this.config.data.ordenCompraId;
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
    if (!this.ordenCompraId) return;
    this.loading.set(true);

    const urlApi = Endpoints.PurchaseOrderDetails.addProductToOrder(this.ordenCompraId);
    const httpParams = {
      page: this.page,
      recordsNumber: this.rows,
      filter: this.searchTerm,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
    };

    this.apiResponseS.onGetList(urlApi, httpParams).then((result: any) => {
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

    this.apiResponseS.onPost(Endpoints.PurchaseOrderDetails.create, payload).then(() => {
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

