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
// D:\repos\luxuryapp-api\client\angular\src\app\core\components\inputs\web\custom-input-autocomplete-multiple-signal.ts
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { DateService } from "src/app/core/services/date.service";

interface IEstacionManualChecklistForm {
  id: FormControl<string | null>;
  stationId: FormControl<string | null>;
  date: FormControl<any>;
  hour: FormControl<string>;
  accessibleAndVisible: FormControl<boolean>;
  housingOk: FormControl<boolean>;
  leverOk: FormControl<boolean>;
  glassIntact: FormControl<boolean>;
  mountingSecure: FormControl<boolean>;
  signageOk: FormControl<boolean>;
  observations: FormControl<string | null>;
  applicationUserId: FormControl<string>;
}

@Component({
  selector: "app-estacion-manual-checklist",
  templateUrl: "./estacion-manual-checklist.html",
  imports: [
    ReactiveFormsModule,
    WebButtonLabelSave,
    CustomInputCheckSignal,
    CustomInputDateSignal,
    CustomInputTextAreaSignal,
    CustomInputTime,
  ],
})
export class EstacionManualChecklist implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  dateS = inject(DateService);
  router = inject(Router);
  rutaActiva = inject(ActivatedRoute);
  dialogConfig = inject(DynamicDialogConfig, { optional: true });
  ref = inject(DynamicDialogRef, { optional: true });

  submitting = signal(false);
  id = "";
  stationId = "";

  form: FormGroup<IEstacionManualChecklistForm> =
    new FormGroup<IEstacionManualChecklistForm>({
      id: new FormControl({ value: null, disabled: true }),
      stationId: new FormControl(null),
      date: new FormControl<any>(this.dateS.getDateNow(), {
        nonNullable: true,
        validators: [Validators.required],
      }),
      hour: new FormControl(this.dateS.getHoraNow(new Date()), {
        nonNullable: true,
        validators: [Validators.required],
      }),
      accessibleAndVisible: new FormControl(false, { nonNullable: true }),
      housingOk: new FormControl(false, { nonNullable: true }),
      leverOk: new FormControl(false, { nonNullable: true }),
      glassIntact: new FormControl(false, { nonNullable: true }),
      mountingSecure: new FormControl(false, { nonNullable: true }),
      signageOk: new FormControl(false, { nonNullable: true }),
      observations: new FormControl(null),
      applicationUserId: new FormControl(this.authS.applicationUserId, {
        nonNullable: true,
      }),
    });

  ngOnInit(): void {
    this.id = this.dialogConfig?.data?.id ?? "";
    this.stationId =
      this.dialogConfig?.data?.stationId ??
      this.rutaActiva.snapshot.params["id"] ??
      "";
    this.form.patchValue({ stationId: this.stationId });
    if (this.id) this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(`BitacoraEstacionManual/${this.id}`)
      .then((result: any) => {
        this.form.patchValue(result);
      });
  }

  async onSubmit() {
    const result = await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: "BitacoraEstacionManual",
      id: this.id,
      ref: this.ref ?? undefined,
      submitting: this.submitting,
      closeOnSuccess: !!this.ref,
      transformPayload: () => ({
        ...this.form.getRawValue(),
        stationId: this.stationId,
        date: this.dateS.getDateFormat(this.form.getRawValue().date),
      }),
    });

    if (result !== false && !this.ref) {
      this.router.navigate(ROUTES.BITACORAS.ESTACION_MANUAL_BITACORA(this.stationId));
    }
  }
}
