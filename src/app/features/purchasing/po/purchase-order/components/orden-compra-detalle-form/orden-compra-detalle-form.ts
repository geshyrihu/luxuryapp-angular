import { Component, inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
// PrimeNG Modules
// Project components & services
import { WebButtonLabel } from "@ui/buttons/web-label";
import { CustomInputCurrencySignal } from "@ui/inputs/web/custom-input-currency-signal";
import { CustomInputDecimal } from "@ui/inputs/web/custom-input-decimal-signal";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
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
    ReactiveFormsModule,
    WebButtonLabel,
    CustomInputSelectSignal,
    CustomInputNumberSignal,
    CustomInputCurrencySignal,
    CustomInputDecimal,
  ],
  templateUrl: "./orden-compra-detalle-form.html",
})
export class OrdenCompraDetalleForm implements OnInit {
  private fb = inject(FormBuilder);
  public config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private apiResponseS = inject(ApiResponseService);
  form: FormGroup<IOrdenCompraDetalleCompForm>;
  productData: any;
  cb_measurement_units: ISelectItem[] = [];

  ngOnInit(): void {
    this.productData = this.config.data.product;
    this.cb_measurement_units = this.config.data.measurementUnits;

    this.form = this.fb.group<IOrdenCompraDetalleCompForm>({
      productoId: new FormControl(
        this.productData.productoId,
        Validators.required,
      ),
      productName: new FormControl(
        this.productData.productName,
        Validators.required,
      ),
      unidadMedidaId: new FormControl(
        this.productData.unidadMedidaId || null,
        Validators.required,
      ),
      quantity: new FormControl(this.productData.quantity || 1, [
        Validators.required,
        Validators.min(1),
      ]),
      unitPrice: new FormControl(this.productData.unitPrice || 0, [
        Validators.required,
        Validators.min(0.01),
      ]),
      descuento: new FormControl(this.productData.descuento || 0, [
        Validators.min(0),
      ]),
      ivaAplicado: new FormControl(this.productData.ivaAplicado || 0, [
        Validators.min(0),
      ]),
      retencionIVAPorcentaje: new FormControl(
        this.productData.retencionIVAPorcentaje || 0,
        [Validators.min(0)],
      ),
      retencionISRPorcentaje: new FormControl(
        this.productData.retencionISRPorcentaje || 0,
        [Validators.min(0)],
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
