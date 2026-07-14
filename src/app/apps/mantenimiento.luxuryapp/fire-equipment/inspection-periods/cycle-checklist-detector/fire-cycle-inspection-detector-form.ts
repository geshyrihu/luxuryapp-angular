import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";

@Component({
  selector: "app-fire-cycle-inspection-detector-form",
  templateUrl: "./fire-cycle-inspection-detector-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    WebButtonLabelSave,
    CustomInputCheckSignal,
    CustomInputTextAreaSignal,
  ],
})
export class FireCycleInspectionDetectorForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private authS = inject(AuthService);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);

  submitting = signal(false);
  cycleId = "";
  equipmentId = "";

  form = new FormGroup({
    fireInspectionCycleId: new FormControl("", { nonNullable: true }),
    detectorId: new FormControl("", { nonNullable: true }),
    noObstructions: new FormControl(false, { nonNullable: true }),
    noContamination: new FormControl(false, { nonNullable: true }),
    noPhysicalDamage: new FormControl(false, { nonNullable: true }),
    ledStatusOk: new FormControl(false, { nonNullable: true }),
    mountingSecure: new FormControl(false, { nonNullable: true }),
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
      detectorId: this.equipmentId,
    });
    this.onLoadExisting();
  }

  onLoadExisting() {
    this.apiResponseS
      .onGetItem(
        Endpoints.RefactorMantenimiento.fireCycleInspectionDetectorByIdById(
          this.cycleId,
          this.equipmentId,
        ),
      )
      .then((result: any) => {
        if (result) this.form.patchValue(result);
      });
  }

  async onSubmit() {
    await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: "fire-cycle-inspection/detector",
      id: "",
      ref: this.ref,
      submitting: this.submitting,
      closeOnSuccess: true,
    });
  }
}
