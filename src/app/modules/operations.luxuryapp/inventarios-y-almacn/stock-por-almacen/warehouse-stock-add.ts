import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
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
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { FormHelper } from "@core/helpers/form-helper";
import { rowsPerPageOptions } from "@core/helpers/table-primeng-option";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import {
  DialogHandlerService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { TarjetaProducto } from "@supplier.luxuryapp/product/tarjeta-producto";

interface IWarehouseStockRowForm {
  productoId: FormControl<string>;
  nombreProducto: FormControl<string>;
  existencia: FormControl<number | null>;
  unidadDeMedidaId: FormControl<string | null>;
  stockMax: FormControl<number | null>;
  stockMin: FormControl<number | null>;
  errorMessage: FormControl<string | null>;
}

import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { LazyLoadEvent } from "@core/interfaces/lazy-load-event.interface";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";

@Component({
  selector: "app-warehouse-stock-add",
  templateUrl: "./warehouse-stock-add.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIconItem,
    LxTooltipDirective,
    AppTable,

    AppSortableColumn,

    AppSorticon,
    CustomInputSelectSignal,
    PrimeNgCustomTableFooter,
    CustomInputNumberSignal,
    ReactiveFormsModule,
    PrimeNgCustomCaption,
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

  globalFilterFields = computed(() => [
    "value.nombreProducto",
    "value.existencia",
    "value.stockMax",
    "value.stockMin",
  ]);

  loading = signal(true);
  totalRecords: number = 0;

  rows: number = 6;
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  private currentFilter: string = "";
  private currentPage: number = 1;

  cb_UnidadMedida = signal<SelectItemDto[]>([]);

  onLoadSelectItem() {
    this.apiResponseS
      .onGetSelectItem<SelectItemDto[]>(Endpoints.SelectItems.measurementUnits)
      .then((response: any) => {
        this.cb_UnidadMedida.set(response);
      });
  }

  ngOnInit(): void {
    this.onLoadSelectItem();

    // AppTable no emite onLazyLoad en el render inicial (solo en goToPage/
    // changeRows/sort), asi que la primera carga hay que dispararla aqui.
    this.loadPage(this.currentPage, this.rows, this.currentFilter);
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

  onLazyLoad(event: LazyLoadEvent): void {
    this.currentPage =
      Math.floor((event.first ?? 0) / (event.rows ?? this.rows)) + 1;
    const pageSize = event.rows ?? this.rows;
    this.currentFilter = (event.globalFilter as string) ?? "";
    this.loadPage(this.currentPage, pageSize, this.currentFilter);
  }

  async loadPage(
    page: number,
    pageSize: number,
    filter: string,
  ): Promise<void> {
    this.loading.set(true);

    const customerId: string = this.customerIdS.customerId();
    const almacenId = this.config.data.almacenId;
    const urlApi = Endpoints.InventarioProducto.productDropdownPaged;

    const params: any = {
      customerId,
      almacenId,
      Page: page,
      RecordsNumber: pageSize,
    };
    if (filter) {
      params.Filter = filter;
    }

    const res = await this.apiResponseS.onGetPaged<{
      items: any[];
      totalRecords: number;
    }>(urlApi, params);

    if (res?.data) {
      const items = res.data.items;

      this.dataSignal.set(items);
      this.totalRecords = res.data.totalRecords;
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
            existencia: new FormControl<number | null>(null, {
              validators: [Validators.required, Validators.min(0)],
            }),
            unidadDeMedidaId: new FormControl<string | null>(unidadId, {
              validators: [Validators.required],
            }),
            stockMax: new FormControl<number | null>(null, {
              validators: [Validators.required, Validators.min(1)],
            }),
            stockMin: new FormControl<number | null>(null, {
              validators: [Validators.required, Validators.min(0)],
            }),
            errorMessage: new FormControl<string | null>(null),
          }),
        );
      });
    }

    this.loading.set(false);
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

    if (value.stockMax && value.stockMin && value.stockMin >= value.stockMax) {
      rowGroup.controls.errorMessage.setValue(
        "El 'Stock Mínimo' no puede ser mayor o igual al 'Stock Máximo'.",
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
      this.loadPage(this.currentPage, this.rows, this.currentFilter);
    }
  }
}


