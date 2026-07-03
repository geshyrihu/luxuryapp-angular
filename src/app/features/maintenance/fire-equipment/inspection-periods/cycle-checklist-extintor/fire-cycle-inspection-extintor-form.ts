import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabelSave } from "src/app/core/components/buttons/web-label/button-save";
import { CustomInputCheckSignal } from "src/app/core/components/inputs/web/custom-input-check-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";

@Component({
  selector: "app-fire-cycle-inspection-extintor-form",
  templateUrl: "./fire-cycle-inspection-extintor-form.html",
  imports: [
    ReactiveFormsModule,
    WebButtonLabelSave,
    CustomInputCheckSignal,
    CustomInputTextAreaSignal,
  ],
})
export class FireCycleInspectionExtintorForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private authS = inject(AuthService);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);

  submitting = signal(false);
  cycleId = "";
  equipmentId = "";

  form = new FormGroup({
    fireInspectionCycleId: new FormControl("", { nonNullable: true }),
    extinguisherId: new FormControl("", { nonNullable: true }),
    adequatePressure: new FormControl(false, { nonNullable: true }),
    safetyPinOk: new FormControl(false, { nonNullable: true }),
    labelsOk: new FormControl(false, { nonNullable: true }),
    noPhysicalDamage: new FormControl(false, { nonNullable: true }),
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
      extinguisherId: this.equipmentId,
    });
    this.onLoadExisting();
  }

  onLoadExisting() {
    this.apiResponseS
      .onGetItem(
        `FireCycleInspection/extintor/${this.cycleId}/${this.equipmentId}`,
      )
      .then((result: any) => {
        if (result) this.form.patchValue(result);
      });
  }

  async onSubmit() {
    await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: "FireCycleInspection/extintor",
      id: "",
      ref: this.ref,
      submitting: this.submitting,
      closeOnSuccess: true,
    });
  }
}
