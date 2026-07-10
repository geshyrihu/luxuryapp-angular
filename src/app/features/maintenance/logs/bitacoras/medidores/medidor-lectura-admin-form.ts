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
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";

interface IMedidorLecturaAdminForm {
  id: FormControl<string | null>;
  medidorId: FormControl<string>;
  fechaRegistro: FormControl<string>;
  lectura: FormControl<number | string>;
  applicationUserId: FormControl<string>;
}

@Component({
  selector: "app-medidor-lectura-admin-form",
  templateUrl: "./medidor-lectura-admin-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    WebButtonLabelSave,
    CustomInputDateSignal,
    CustomInputNumberSignal,
    CustomInputTextSignal,
    CardModule,
  ],
})
export class MedidorLecturaAdminForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  dateS = inject(DateService);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);

  submitting = signal(false);
  id = signal<string>("");
  medidorId = signal<string>("");
  today = signal<string>(this.dateS.getDateFormat(new Date()));

  form: FormGroup<IMedidorLecturaAdminForm> =
    new FormGroup<IMedidorLecturaAdminForm>({
      id: new FormControl({ value: "", disabled: true }),
      medidorId: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      fechaRegistro: new FormControl(this.today(), {
        nonNullable: true,
        validators: [Validators.required],
      }),
      lectura: new FormControl<number | string>("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      applicationUserId: new FormControl(this.authS.applicationUserId, {
        nonNullable: true,
      }),
    });

  ngOnInit(): void {
    this.id.set(this.config.data.id);
    console.log(
      "?? ~ MedidorLecturaAdminForm ~ ngOnInit ~ this.config.data:",
      this.config.data,
    );
    this.medidorId.set(this.config.data.medidorId);

    this.form.patchValue({
      medidorId: this.medidorId(),
    });

    if (this.id()) this.onLoadData();
  }

  onLoadData() {
    if (!this.id()) return;

    const urlApi = Endpoints.MeterReadings.getById(this.id()!);

    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue({
        ...result,
        fechaRegistro: this.dateS.getDateFormat(result.fechaRegistro),
      });
    });
  }

  onSubmit() {
    if (this.form.controls.lectura.value == 0) return;
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.MeterReadings.create,
      id: this.id(),
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => ({
        ...this.form.getRawValue(),
        fechaRegistro: this.dateS.getDateFormat(
          this.form.controls.fechaRegistro.value,
        ),
      }),
    });
  }
}
