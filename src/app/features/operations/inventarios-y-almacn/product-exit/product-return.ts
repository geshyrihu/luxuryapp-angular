import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabelSave } from "src/app/core/components/buttons/web/label/button-save";
import { CustomInputNumberSignal } from "src/app/core/components/inputs/web/custom-input-number-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { ApiResponseService } from "src/app/core/services/api-response.service";

interface IProductReturnForm {
  salidaProductoId: FormControl<string>;
  cantidadADevolver: FormControl<number>;
  motivo: FormControl<string | null>;
}

@Component({
  selector: "app-product-return",
  templateUrl: "./product-return.html",
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CustomInputNumberSignal,
    CustomInputTextSignal,
    WebButtonLabelSave,
    CardModule,
  ],
})
export class ProductReturn implements OnInit {
  apiResponseS = inject(ApiResponseService);
  formBuilder = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  // Signals
  salidaOriginal = signal<any>(null);
  cantidadMaximaADevolver = signal<number>(0);
  submitting = signal(false);

  form: FormGroup<IProductReturnForm> = this.formBuilder.group({
    salidaProductoId: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    cantidadADevolver: new FormControl(1, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    motivo: new FormControl(""),
  });

  ngOnInit() {
    const data = this.config.data;
    this.salidaOriginal.set(data);
    const max = data.cantidad - data.cantidadDevuelta;
    this.cantidadMaximaADevolver.set(max);

    this.form.patchValue({ salidaProductoId: data.id });

    // Aóadir validador dinámico para la cantidad máxima
    this.form.controls.cantidadADevolver.setValidators([
      Validators.required,
      Validators.min(1),
      Validators.max(max),
    ]);
    this.form.controls.cantidadADevolver.updateValueAndValidity();
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;
    this.submitting.set(true);

    this.apiResponseS
      .onPost("salidaproductos/devolver", this.form.value)
      .then((result) => {
        if (result) {
          this.ref.close(true);
        } else {
          this.submitting.set(false);
        }
      });
  }
}
