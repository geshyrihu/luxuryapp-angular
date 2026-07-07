import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";

@Component({
  selector: "app-fire-cycle-inspection-estacion-form",
  templateUrl: "./fire-cycle-inspection-estacion-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    WebButtonLabelSave,
    CustomInputCheckSignal,
    CustomInputTextAreaSignal,
  ],
})
export class FireCycleInspectionEstacionForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private authS = inject(AuthService);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);

  submitting = signal(false);
  cycleId = "";
  equipmentId = "";

  form = new FormGroup({
    fireInspectionCycleId: new FormControl("", { nonNullable: true }),
    stationId: new FormControl("", { nonNullable: true }),
    accessibleAndVisible: new FormControl(false, { nonNullable: true }),
    housingOk: new FormControl(false, { nonNullable: true }),
    leverOk: new FormControl(false, { nonNullable: true }),
    glassIntact: new FormControl(false, { nonNullable: true }),
    mountingSecure: new FormControl(false, { nonNullable: true }),
    signageOk: new FormControl(false, { nonNullable: true }),
    observations: new FormControl<string | null>(null),
    applicationUserId: new FormControl(this.authS.applicationUserId, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    this.cycleId = this.config.data?.cycleId ?? "";
    this.equipmentId = this.config.data?.equipmentId ?? "";
    this.form.patchValue({
      fireInspectionCycleId: this.cycleId,
      stationId: this.equipmentId,
    });
    this.onLoadExisting();
  }

  onLoadExisting() {
    this.apiResponseS
      .onGetItem(
        `FireCycleInspection/estacion/${this.cycleId}/${this.equipmentId}`,
      )
      .then((result: any) => {
        if (result) this.form.patchValue(result);
      });
  }

  async onSubmit() {
    await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: "FireCycleInspection/estacion",
      id: "",
      ref: this.ref,
      submitting: this.submitting,
      closeOnSuccess: true,
    });
  }
}
