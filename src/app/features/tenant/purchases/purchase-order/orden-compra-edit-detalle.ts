import { Endpoints } from "src/app/core/constants/endpoints";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputCurrencySignal } from "src/app/core/components/inputs/web/custom-input-currency-signal";
import { CustomInputDecimal } from "src/app/core/components/inputs/web/custom-input-decimal-signal";
import { CustomInputNumberSignal } from "src/app/core/components/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
export interface IOrdenCompraDetalleForm {
  id: FormControl<string | null>;
  ordenCompraId: FormControl<string | null>;
  productoId: FormControl<string | null>;
  cantidad: FormControl<number | null>;
  unidadMedidaId: FormControl<string | null>;
  precio: FormControl<number | null>;
  descuento: FormControl<number | null>;
  ivaAplicado: FormControl<number | null>;
  retencionIVAPorcentaje: FormControl<number | null>;
  retencionISRPorcentaje: FormControl<number | null>;
}

@Component({
  selector: "app-orden-compra-edit-detalle",
  templateUrl: "./orden-compra-edit-detalle.html",
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputNumberSignal,
    CustomInputSelectSignal,
    CustomInputCurrencySignal,
    CustomInputDecimal,
    CustomButtonSave,
    CardModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush, // Add OnPush strategy
})
export class OrdenCompraEditDetalle implements OnInit {
  apiResponseS = inject(ApiResponseService);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  cdr = inject(ChangeDetectorRef); // Inject ChangeDetectorRef
  submitting = signal(false);

  id: string = "";

  cb_unidadMedida: any[] = [];
  form: FormGroup<IOrdenCompraDetalleForm> =
    this.formB.group<IOrdenCompraDetalleForm>({
      id: new FormControl({ value: this.config.data.id, disabled: true }),
      ordenCompraId: new FormControl("", Validators.required),
      productoId: new FormControl("", Validators.required),
      cantidad: new FormControl(null, Validators.required),
      unidadMedidaId: new FormControl("", Validators.required),
      precio: new FormControl(null, Validators.required),
      descuento: new FormControl(null, Validators.required),
      ivaAplicado: new FormControl(null, Validators.required),
      retencionIVAPorcentaje: new FormControl(null, Validators.required),
      retencionISRPorcentaje: new FormControl(null, Validators.required),
    });

  ngOnInit(): void {
    this.id = this.config.data.id;
    this.onSelectItem();
    if (this.id) this.onLoadData();
  }

  onSelectItem() {
    this.apiResponseS
      .onGetSelectItem<ISelectItem[]>(Endpoints.SelectItems.measurementUnits)
      .then((response: any) => {
        this.cb_unidadMedida = response;
        this.cdr.detectChanges(); // Call detectChanges after updating the data
      });
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(Endpoints.PurchaseOrderDetails.getById(this.id))
      .then((result: any) => {
        this.form.patchValue(result);
        this.cdr.detectChanges(); // Call detectChanges after patching the form
      });
  }
  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);

    this.apiResponseS
      .onPut(Endpoints.PurchaseOrderDetails.update(this.id), this.form.value)
      .then((result: boolean) => {
        result ? this.ref.close(true) : this.submitting.set(false);
      });
  }
}
