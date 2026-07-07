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
import { firstValueFrom } from "rxjs";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputTextAreaSignal } from "@ui/inputs/web";
import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTime } from "@ui/inputs/web/custom-input-time-signal";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { DateService } from "src/app/core/services/date.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";

interface IHidranteChecklistForm {
  id: FormControl<string | null>;
  hydrantId: FormControl<string | null>;
  date: FormControl<any>;
  hour: FormControl<string>;
  labelPresent: FormControl<boolean>;
  glassIntact: FormControl<boolean>;
  wrenchPresent: FormControl<boolean>;
  hoseOk: FormControl<boolean>;
  nozzlePresent: FormControl<boolean>;
  valveOperational: FormControl<boolean>;
  lockOk: FormControl<boolean>;
  cabinetState: FormControl<number | null>;
  observations: FormControl<string | null>;
  applicationUserId: FormControl<string>;
}

@Component({
  selector: "app-hidrante-checklist",
  templateUrl: "./hidrante-checklist.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    WebButtonLabelSave,
    CustomInputCheckSignal,
    CustomInputDateSignal,
    CustomInputTextAreaSignal,
    CustomInputTime,
    CustomInputSelectSignal,
  ],
})
export class HidranteChecklist implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  dateS = inject(DateService);
  router = inject(Router);
  rutaActiva = inject(ActivatedRoute);
  dialogConfig = inject(DynamicDialogConfig, { optional: true });
  ref = inject(DynamicDialogRef, { optional: true });
  enumSelectS = inject(EnumSelectService);

  submitting = signal(false);
  id = "";
  hydrantId = "";
  cb_cabinetState: ISelectItem[] = [];

  form: FormGroup<IHidranteChecklistForm> =
    new FormGroup<IHidranteChecklistForm>({
      id: new FormControl({ value: null, disabled: true }),
      hydrantId: new FormControl(null),
      date: new FormControl<any>(this.dateS.getDateNow(), {
        nonNullable: true,
        validators: [Validators.required],
      }),
      hour: new FormControl(this.dateS.getHoraNow(new Date()), {
        nonNullable: true,
        validators: [Validators.required],
      }),
      labelPresent: new FormControl(false, { nonNullable: true }),
      glassIntact: new FormControl(false, { nonNullable: true }),
      wrenchPresent: new FormControl(false, { nonNullable: true }),
      hoseOk: new FormControl(false, { nonNullable: true }),
      nozzlePresent: new FormControl(false, { nonNullable: true }),
      valveOperational: new FormControl(false, { nonNullable: true }),
      lockOk: new FormControl(false, { nonNullable: true }),
      cabinetState: new FormControl<number | null>(null, {
        validators: [Validators.required],
      }),
      observations: new FormControl(null),
      applicationUserId: new FormControl(this.authS.applicationUserId, {
        nonNullable: true,
      }),
    });

  async ngOnInit() {
    this.cb_cabinetState = await firstValueFrom(
      this.enumSelectS.cabinetState(),
    );
    this.id = this.dialogConfig?.data?.id ?? "";
    this.hydrantId =
      this.dialogConfig?.data?.hydrantId ??
      this.rutaActiva.snapshot.params["id"] ??
      "";
    this.form.patchValue({ hydrantId: this.hydrantId });
    if (this.id) this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(`BitacoraHidrante/${this.id}`)
      .then((result: any) => {
        this.form.patchValue(result);
      });
  }

  async onSubmit() {
    const result = await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: "BitacoraHidrante",
      id: this.id,
      ref: this.ref ?? undefined,
      submitting: this.submitting,
      closeOnSuccess: !!this.ref,
      transformPayload: () => ({
        ...this.form.getRawValue(),
        hydrantId: this.hydrantId,
        date: this.dateS.getDateFormat(this.form.getRawValue().date),
      }),
    });

    if (result !== false && !this.ref) {
      this.router.navigate(ROUTES.BITACORAS.HIDRANTE_BITACORA(this.hydrantId));
    }
  }
}
