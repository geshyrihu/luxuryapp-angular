import { Component, DestroyRef, inject, OnInit, signal, ChangeDetectionStrategy } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { InputTextModule } from "primeng/inputtext";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { DateService } from "src/app/core/services/date.service";

interface IMedidorLecturaForm {
  id: FormControl<string | null>;
  medidorId: FormControl<string | null>;
  fechaRegistro: FormControl<string | null>;
  lectura: FormControl<number | null>;
  applicationUserId: FormControl<string | null>;
  ultimaLectura: FormControl<number | null>; // Added
}

@Component({
  selector: "app-medidor-lectura-form",
  templateUrl: "./medidor-lectura-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    WebButtonLabelSave,
    InputTextModule,
    CustomInputNumberSignal,
    CustomInputTextSignal,
  ],
})
export class MedidorLecturaForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  formB = inject(FormBuilder);
  dateS = inject(DateService);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  destroyRef = inject(DestroyRef);
  submitting = signal(false);

  dateString: string = "";
  dateStringUltimoRegistro: string = "";
  seRegistroEsteDia: boolean = false;
  seRegistroEsteDiaMensaje: string = "Ya se cargo el registro de este día";
  id: string = "";
  ultimaLectura: number = 0;
  medidorId: string = "";
  laLecturaEsMenor: boolean = false;

  form: FormGroup<IMedidorLecturaForm> = this.formB.group({
    id: new FormControl({ value: "", disabled: true }),
    medidorId: new FormControl<string | null>(null),
    fechaRegistro: new FormControl(""),
    lectura: new FormControl<number | null>(null, [Validators.required]),
    applicationUserId: new FormControl(this.authS.applicationUserId),
    ultimaLectura: new FormControl({ value: 0, disabled: true }), // Added
  });

  validarUltimaLectura() {
    if (this.dateString === this.dateStringUltimoRegistro) {
      this.seRegistroEsteDia = true;
      this.form.disable();
    } else {
      this.seRegistroEsteDia = false;
    }
  }

  ngOnInit(): void {
    this.id = this.config.data.id;
    console.log(
      "?? ~ MedidorLecturaForm ~ ngOnInit ~ this.config.data:",
      this.config.data,
    );
    this.medidorId = this.config.data.medidorId;
    this.form.patchValue({ medidorId: this.medidorId });

    const urlApi = Endpoints.MeterReadings.lastReading(this.medidorId);
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      if (result !== null) {
        this.dateStringUltimoRegistro = this.dateS.getDateFormat(
          result.fechaRegistro,
        );
        this.validarUltimaLectura();
        this.ultimaLectura = result.lectura;
        this.form.patchValue({ ultimaLectura: result.lectura }); // Added
      }
    });

    if (this.id) this.onLoadData();

    // Validar que la lectura sea mayor a la anterior
    this.form.controls.lectura.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((val) => {
        if (
          val !== null &&
          val < this.ultimaLectura &&
          this.ultimaLectura !== 0
        ) {
          this.form.controls.lectura.setErrors({ lecturaMenor: true });
          this.laLecturaEsMenor = true;
        } else {
          // Si tenóa error lecturaMenor, quitarlo.
          // Nota: setErrors(null) quita todos. Si hay required, se valida solo.
          const errors = this.form.controls.lectura.errors;
          if (errors && errors["lecturaMenor"]) {
            delete errors["lecturaMenor"];
            this.form.controls.lectura.setErrors(
              Object.keys(errors).length ? errors : null,
            );
          }
          this.laLecturaEsMenor = false;
        }
      });
  }

  onLoadData() {
    const urlApi = Endpoints.MeterReadings.getById(this.id);
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue({
        ...result,
        fechaRegistro: result.fechaRegistro
          ? this.dateS.getDateFormat(result.fechaRegistro)
          : null,
      });
    });
  }

  onSubmit() {
    if (this.form.value.lectura == 0) return;
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.MeterReadings.create,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => ({
        ...this.form.getRawValue(),
        fechaRegistro: this.form.controls.fechaRegistro.value
          ? this.dateS.getDateFormat(this.form.controls.fechaRegistro.value)
          : null,
      }),
    });
  }
}
