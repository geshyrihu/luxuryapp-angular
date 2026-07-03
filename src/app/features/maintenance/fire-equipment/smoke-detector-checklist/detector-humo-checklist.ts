import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ROUTES } from "src/app/routing/route-paths";
import { WebButtonLabelSave } from "src/app/core/components/buttons/web-label/button-save";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web";
import { CustomInputCheckSignal } from "src/app/core/components/inputs/web/custom-input-check-signal";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputTime } from "src/app/core/components/inputs/web/custom-input-time-signal";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { DateService } from "src/app/core/services/date.service";

interface IDetectorHumoChecklistForm {
  id: FormControl<string | null>;
  detectorId: FormControl<string | null>;
  date: FormControl<any>;
  hour: FormControl<string>;
  noObstructions: FormControl<boolean>;
  noContamination: FormControl<boolean>;
  noPhysicalDamage: FormControl<boolean>;
  ledStatusOk: FormControl<boolean>;
  mountingSecure: FormControl<boolean>;
  observations: FormControl<string | null>;
  applicationUserId: FormControl<string>;
}

@Component({
  selector: "app-detector-humo-checklist",
  templateUrl: "./detector-humo-checklist.html",
  imports: [
    ReactiveFormsModule,
    WebButtonLabelSave,
    CustomInputCheckSignal,
    CustomInputDateSignal,
    CustomInputTextAreaSignal,
    CustomInputTime,
  ],
})
export class DetectorHumoChecklist implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  dateS = inject(DateService);
  router = inject(Router);
  rutaActiva = inject(ActivatedRoute);
  dialogConfig = inject(DynamicDialogConfig, { optional: true });
  ref = inject(DynamicDialogRef, { optional: true });

  submitting = signal(false);
  id = "";
  detectorId = "";

  form: FormGroup<IDetectorHumoChecklistForm> =
    new FormGroup<IDetectorHumoChecklistForm>({
      id: new FormControl({ value: null, disabled: true }),
      detectorId: new FormControl(null),
      date: new FormControl<any>(this.dateS.getDateNow(), {
        nonNullable: true,
        validators: [Validators.required],
      }),
      hour: new FormControl(this.dateS.getHoraNow(new Date()), {
        nonNullable: true,
        validators: [Validators.required],
      }),
      noObstructions: new FormControl(false, { nonNullable: true }),
      noContamination: new FormControl(false, { nonNullable: true }),
      noPhysicalDamage: new FormControl(false, { nonNullable: true }),
      ledStatusOk: new FormControl(false, { nonNullable: true }),
      mountingSecure: new FormControl(false, { nonNullable: true }),
      observations: new FormControl(null),
      applicationUserId: new FormControl(this.authS.applicationUserId, {
        nonNullable: true,
      }),
    });

  ngOnInit(): void {
    this.id = this.dialogConfig?.data?.id ?? "";
    this.detectorId =
      this.dialogConfig?.data?.detectorId ??
      this.rutaActiva.snapshot.params["id"] ??
      "";
    this.form.patchValue({ detectorId: this.detectorId });
    if (this.id) this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(`BitacoraDetectorHumo/${this.id}`)
      .then((result: any) => {
        this.form.patchValue(result);
      });
  }

  async onSubmit() {
    const result = await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: "BitacoraDetectorHumo",
      id: this.id,
      ref: this.ref ?? undefined,
      submitting: this.submitting,
      closeOnSuccess: !!this.ref,
      transformPayload: () => ({
        ...this.form.getRawValue(),
        detectorId: this.detectorId,
        date: this.dateS.getDateFormat(this.form.getRawValue().date),
      }),
    });

    if (result !== false && !this.ref) {
      this.router.navigate(ROUTES.BITACORAS.DETECTOR_HUMO_BITACORA(this.detectorId));
    }
  }
}
