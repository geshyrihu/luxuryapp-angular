import { Component, computed, inject, OnInit, signal } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { CustomButtonItem } from "src/app/core/components/buttons/web/custom-button-item";
import { CustomInputNumberSignal } from "src/app/core/components/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomSearchInput } from "src/app/core/components/inputs/web/custom-search-input-signal";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TarjetaProducto } from "src/app/features/operations/inventarios-y-almacn/product/tarjeta-producto";
import { FormHelper } from "src/app/core/helpers/form-helper";

interface IWarehouseStockRowForm {
  productoId: FormControl<number>;
  nombreProducto: FormControl<string>;
  existencia: FormControl<number | null>;
  unidadDeMedidaId: FormControl<string | null>;
  stockMax: FormControl<number | null>;
  stockMin: FormControl<number | null>;
  errorMessage: FormControl<string | null>;
}

@Component({
  selector: "app-warehouse-stock-add",
  templateUrl: "./warehouse-stock-add.html",
  imports: [
    TableModule,
    CustomInputSelectSignal,
    PrimeNgCustomTableFooter,
    CustomInputNumberSignal,
    ReactiveFormsModule,
    CustomButtonItem,
    CustomSearchInput,
  ],
})
export class WarehouseStockAdd implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  formB = inject(FormBuilder);

  dataSignal = signal<any[]>([]);
  formArray = new FormArray<FormGroup<IWarehouseStockRowForm>>([]);
  submitting = signal(false);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || !Array.isArray(data) || data.length === 0 || !data[0])
      return [];
    return Object.keys(data[0]).map((k) => `value.${k}`);
  });

  loading = signal(true);
  totalRecords: number = 0; // Total de registros para paginador

  // Configuración de paginación y filtro
  rows: number = 30; // Registros por página
  first: number = 0; // Índice del primer registro
  page: number = 1; // Página actual
  searchTerm: string = ""; // Filtro global

  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  cb_UnidadMedida = signal<ISelectItem[]>([]);

  onLoadSelectItem() {
    this.apiResponseS
      .onGetSelectItem<ISelectItem[]>(`getMeasurementUnits`)
      .then((response: any) => {
        this.cb_UnidadMedida.set(response);
      });
  }

  ngOnInit(): void {
    this.onLoadSelectItem();
    // La primera carga es disparada automáticamente por el (onLazyLoad) de p-table
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

  async onLoadData(
    page: number = 1,
    pageSize: number = this.rows,
    filter: string = this.searchTerm,
  ) {
    this.loading.set(true);

    const customerId: string = this.customerIdS.customerId();
    const almacenId = this.config.data.almacenId; // Get almacenId from dialog config
    const urlApi = `InventarioProducto/GetProductoDropdownPaged`;

    const params = {
      page: page,
      recordsNumber: pageSize,
      filter: filter,
      customerId: customerId,
      almacenId: almacenId,
    };

    const res = await this.apiResponseS.onGetPaged<any>(urlApi, params);

    if (res && res.data) {
      const items = res.data.items || [];
      const tCount = res.data.totalRecords || res.totalCount || 0;

      this.dataSignal.set(items);
      this.totalRecords = tCount;
      this.formArray.clear();

      items.forEach((item: any) => {
        const unidadId =
          item.unidadDeMedidaId === "00000000-0000-0000-0000-000000000000"
            ? null
            : item.unidadDeMedidaId;
        this.formArray.push(
          this.formB.group({
            productoId: new FormControl(item.productoId, { nonNullable: true }),
            nombreProducto: new FormControl(item.nombreProducto, {
              nonNullable: true,
            }),
            existencia: new FormControl<number | null>(item.existencia, {
              validators: [Validators.required, Validators.min(0)],
            }),
            unidadDeMedidaId: new FormControl<string | null>(unidadId, {
              validators: [Validators.required],
            }),
            stockMax: new FormControl<number | null>(item.stockMax, {
              validators: [Validators.required, Validators.min(1)],
            }),
            stockMin: new FormControl<number | null>(item.stockMin, {
              validators: [Validators.required, Validators.min(0)],
            }),
            errorMessage: new FormControl<string | null>(null),
          }),
        );
      });
    }
    this.loading.set(false);
  }

  loadDataLazy(event: any) {
    this.page = Math.floor((event.first || 0) / (event.rows || 30)) + 1;
    this.rows = event.rows || 30;
    this.first = event.first || 0;
    this.onLoadData(this.page, this.rows, this.searchTerm);
  }

  applyGlobalFilter(filterValue: string) {
    this.searchTerm = filterValue;
    this.first = 0;
    this.page = 1;
    this.onLoadData(this.page, this.rows, this.searchTerm);
  }

  async onSubmit(rowGroup: FormGroup<IWarehouseStockRowForm>) {
    rowGroup.controls.errorMessage.setValue(null);

    if (rowGroup.invalid) {
      rowGroup.markAllAsTouched();
      rowGroup.controls.errorMessage.setValue(
        "Complete todos los campos requeridos correctamente.",
      );
      return;
    }

    const value = rowGroup.getRawValue();

    // Validar que Stock Mónimo < Stock Móximo
    if (value.stockMax && value.stockMin && value.stockMin >= value.stockMax) {
      rowGroup.controls.errorMessage.setValue(
        "El 'Stock Mónimo' no puede ser mayor o igual al 'Stock Móximo'.",
      );
      return;
    }

    const success = await FormHelper.submitCrud({
      form: rowGroup,
      api: this.apiResponseS,
      endpoint: Endpoints.InventarioProducto.create,
      method: "POST",
      submitting: this.submitting,
      closeOnSuccess: false,
      transformPayload: (val) => ({
        ...val,
        applicationUserId: this.authS.applicationUserId,
        almacenId: this.config.data.almacenId,
        customerId: this.customerIdS.customerId(),
      }),
    });

    if (success !== false) {
      this.onLoadData(this.page, this.rows, this.searchTerm);
    }
  }
}

