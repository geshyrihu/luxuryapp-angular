import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabelSave } from "src/app/core/components/buttons/web-label/button-save";
import { CustomInputCheckSignal } from "src/app/core/components/inputs/web/custom-input-check-signal";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputNumberSignal } from "src/app/core/components/inputs/web/custom-input-number-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { CustomInputTime } from "src/app/core/components/inputs/web/custom-input-time-signal";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { DateService } from "src/app/core/services/date.service";

interface IPiscinaBitacoraForm {
  id: FormControl<string | null>;
  piscinaId: FormControl<string | null>;
  date: FormControl<any>;
  hour: FormControl<string>;
  cl: FormControl<number | null>;
  ph: FormControl<number | null>;
  temperatura: FormControl<number | null>;
  alkalinidad: FormControl<number | null>;
  dureza: FormControl<number | null>;
  aplicationCl: FormControl<number | null>;
  aplicationPhMas: FormControl<number | null>;
  aplicationPhMenos: FormControl<number | null>;
  cepillado: FormControl<boolean>;
  aspirado: FormControl<boolean>;
  cenefas: FormControl<boolean>;
  applicationUserId: FormControl<string>;
}

@Component({
  selector: "app-piscina-bitacora-form",
  templateUrl: "./piscina-bitacora-form.html",
  imports: [
    ReactiveFormsModule,
    WebButtonLabelSave,
    CustomInputCheckSignal,
    CustomInputDateSignal,
    CustomInputNumberSignal,
    CustomInputTextSignal,
    CustomInputTime,
    CardModule,
  ],
})
export class PiscinaBitacoraForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  dateS = inject(DateService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  submitting = signal(false);
  id: string = "";

  form: FormGroup<IPiscinaBitacoraForm> = new FormGroup<IPiscinaBitacoraForm>({
    id: new FormControl({ value: null, disabled: true }),
    piscinaId: new FormControl(this.config.data.piscinaId),
    date: new FormControl<any>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    hour: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    cl: new FormControl(null, { validators: [Validators.required] }),
    ph: new FormControl(null, { validators: [Validators.required] }),
    temperatura: new FormControl(null, { validators: [Validators.required] }),
    alkalinidad: new FormControl(null),
    dureza: new FormControl(null),
    aplicationCl: new FormControl(0),
    aplicationPhMas: new FormControl(0),
    aplicationPhMenos: new FormControl(0),
    cepillado: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    aspirado: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    cenefas: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    applicationUserId: new FormControl(this.authS.applicationUserId, {
      nonNullable: true,
    }),
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id) this.onLoadData();
  }

  onLoadData() {
    const urlApi = `piscinabitacora/${this.id}`;
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: "piscinabitacora",
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => ({
        ...this.form.getRawValue(),
        piscinaId: this.config.data.piscinaId,
        date: this.dateS.getDateFormat(this.form.getRawValue().date),
      }),
    });
  }
}
