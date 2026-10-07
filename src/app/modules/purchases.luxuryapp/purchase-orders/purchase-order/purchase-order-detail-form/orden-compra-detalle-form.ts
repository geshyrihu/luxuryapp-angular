import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { ButtonWeb } from "@ui/buttons/web";
// Bootstrap Modules
// Project components & services
import { ApiResponseService } from "@core/http/services/api-response.service";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { LuxInputCurrencySignal } from "@ui/inputs/web/lux-input-currency-signal";
import { LuxInputDecimal } from "@ui/inputs/web/lux-input-decimal-signal";
import { LuxInputNumberSignal } from "@ui/inputs/web/lux-input-number-signal";
import { LuxInputSelectSignal } from "@ui/inputs/web/lux-input-select-signal";
import { PurchaseOrderProductDraft } from "../purchase-order.types";
export interface IOrdenCompraDetalleCompForm {
  productoId: FormControl<string | null>;
  productName: FormControl<string | null>;
  unidadMedidaId: FormControl<string | null>;
  quantity: FormControl<number | null>;
  unitPrice: FormControl<number | null>;
  descuento: FormControl<number | null>;
  ivaAplicado: FormControl<number | null>;
  retencionIVAPorcentaje: FormControl<number | null>;
  retencionISRPorcentaje: FormControl<number | null>;
}

@Component({
  selector: "app-orden-compra-detalle-form",
  imports: [
    ButtonWeb,
    ReactiveFormsModule,
    LuxInputSelectSignal,
    LuxInputNumberSignal,
    LuxInputCurrencySignal,
    LuxInputDecimal,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./orden-compra-detalle-form.html",
})
export class OrdenCompraDetalleForm implements OnInit {
  private fb = inject(FormBuilder);
  public config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private apiResponseS = inject(ApiResponseService);
  form: FormGroup<IOrdenCompraDetalleCompForm>;
  productData: Partial<PurchaseOrderProductDraft>;
  cb_measurement_units: SelectItemDto[] = [];

  ngOnInit(): void {
    this.productData = this.config.data
      .product as Partial<PurchaseOrderProductDraft>;
    this.cb_measurement_units = this.config.data
      .measurementUnits as SelectItemDto[];

    this.form = this.fb.group<IOrdenCompraDetalleCompForm>({
      productoId: new FormControl(
        this.productData.productoId ?? null,
        Validators.required,
      ),
      productName: new FormControl(
        this.productData.productName ?? "",
        Validators.required,
      ),
      unidadMedidaId: new FormControl(
        this.productData.unidadMedidaId ?? null,
        Validators.required,
      ),
      quantity: new FormControl(this.productData.quantity ?? 1, [
        Validators.required,
        Validators.min(1),
      ]),
      unitPrice: new FormControl(this.productData.unitPrice ?? 0, [
        Validators.required,
        Validators.min(0.01),
      ]),
      descuento: new FormControl(this.productData.descuento ?? 0, [
        Validators.min(0),
        Validators.max(100),
      ]),
      ivaAplicado: new FormControl(this.productData.ivaAplicado ?? 0, [
        Validators.min(0),
        Validators.max(100),
      ]),
      retencionIVAPorcentaje: new FormControl(
        this.productData.retencionIVAPorcentaje ?? 0,
        [Validators.min(0), Validators.max(100)],
      ),
      retencionISRPorcentaje: new FormControl(
        this.productData.retencionISRPorcentaje ?? 0,
        [Validators.min(0), Validators.max(100)],
      ),
    });
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) {
      return;
    }
    // Return the form data when closing the dialog
    this.ref.close(this.form.value);
  }

  closeDialog() {
    // Close without returning data
    this.ref.close();
  }
}
