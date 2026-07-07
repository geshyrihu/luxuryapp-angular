import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ROUTES } from "src/app/routing/route-paths";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputTextAreaSignal } from "@ui/inputs/web";
import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputTime } from "@ui/inputs/web/custom-input-time-signal";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { DateService } from "src/app/core/services/date.service";

interface IExtintorChecklistForm {
  id: FormControl<string | null>;
  extinguisherId: FormControl<string | null>;
  date: FormControl<any>;
  hour: FormControl<string>;
  adequatePressure: FormControl<boolean>;
  safetyPinOk: FormControl<boolean>;
  labelsOk: FormControl<boolean>;
  noPhysicalDamage: FormControl<boolean>;
  observations: FormControl<string | null>;
  applicationUserId: FormControl<string>;
}

@Component({
  selector: "app-extintor-checklist",
  templateUrl: "./extintor-checklist.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    WebButtonLabelSave,
    CustomInputCheckSignal,
    CustomInputDateSignal,
    CustomInputTextAreaSignal,
    CustomInputTime,
  ],
})
export class ExtintorChecklist implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  dateS = inject(DateService);
  router = inject(Router);
  rutaActiva = inject(ActivatedRoute);
  dialogConfig = inject(DynamicDialogConfig, { optional: true });
  ref = inject(DynamicDialogRef, { optional: true });

  submitting = signal(false);
  id = "";
  extinguisherId = "";

  form: FormGroup<IExtintorChecklistForm> =
    new FormGroup<IExtintorChecklistForm>({
      id: new FormControl({ value: null, disabled: true }),
      extinguisherId: new FormControl(null),
      date: new FormControl<any>(this.dateS.getDateNow(), {
        nonNullable: true,
        validators: [Validators.required],
      }),
      hour: new FormControl(this.dateS.getHoraNow(new Date()), {
        nonNullable: true,
        validators: [Validators.required],
      }),
      adequatePressure: new FormControl(false, { nonNullable: true }),
      safetyPinOk: new FormControl(false, { nonNullable: true }),
      labelsOk: new FormControl(false, { nonNullable: true }),
      noPhysicalDamage: new FormControl(false, { nonNullable: true }),
      observations: new FormControl(null),
      applicationUserId: new FormControl(this.authS.applicationUserId, {
        nonNullable: true,
      }),
    });

  ngOnInit(): void {
    this.id = this.dialogConfig?.data?.id ?? "";
    this.extinguisherId =
      this.dialogConfig?.data?.extinguisherId ??
      this.rutaActiva.snapshot.params["id"] ??
      "";

    this.form.patchValue({ extinguisherId: this.extinguisherId });

    if (this.id) this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(`BitacoraExtintor/${this.id}`)
      .then((result: any) => {
        this.form.patchValue(result);
      });
  }

  async onSubmit() {
    const result = await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: "BitacoraExtintor",
      id: this.id,
      ref: this.ref ?? undefined,
      submitting: this.submitting,
      closeOnSuccess: !!this.ref,
      transformPayload: () => ({
        ...this.form.getRawValue(),
        extinguisherId: this.extinguisherId,
        date: this.dateS.getDateFormat(this.form.getRawValue().date),
      }),
    });

    if (result !== false && !this.ref) {
      this.router.navigate(ROUTES.BITACORAS.EXTINTOR_BITACORA(this.extinguisherId));
    }
  }
}
