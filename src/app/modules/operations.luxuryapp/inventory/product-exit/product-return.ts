import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { ButtonWeb } from "@ui/buttons/web";
import { LuxInputNumberSignal } from "@ui/inputs/web/lux-input-number-signal";
import { LuxInputTextSignal } from "@ui/inputs/web/lux-input-text-signal";

interface IProductReturnForm {
  salidaProductoId: FormControl<string>;
  cantidadADevolver: FormControl<number>;
  motivo: FormControl<string | null>;
}

@Component({
  selector: "app-product-return",
  templateUrl: "./product-return.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    LuxInputNumberSignal,
    LuxInputTextSignal,
    ButtonWeb,
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

    // Añadirvalidador dinámico para la cantidad máxima
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
      .onPost(Endpoints.ProductOutputs.returnProduct, this.form.value)
      .then((result) => {
        if (result) {
          this.ref.close(true);
        } else {
          this.submitting.set(false);
        }
      });
  }
}
