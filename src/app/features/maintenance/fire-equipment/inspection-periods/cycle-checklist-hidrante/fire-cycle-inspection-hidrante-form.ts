import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { firstValueFrom } from "rxjs";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";

@Component({
  selector: "app-fire-cycle-inspection-hidrante-form",
  templateUrl: "./fire-cycle-inspection-hidrante-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    WebButtonLabelSave,
    CustomInputCheckSignal,
    CustomInputSelectSignal,
    CustomInputTextAreaSignal,
  ],
})
export class FireCycleInspectionHidranteForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private authS = inject(AuthService);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private enumSelectS = inject(EnumSelectService);

  submitting = signal(false);
  cycleId = "";
  equipmentId = "";
  cb_cabinetStates: ISelectItem[] = [];

  form = new FormGroup({
    fireInspectionCycleId: new FormControl("", { nonNullable: true }),
    hydrantId: new FormControl("", { nonNullable: true }),
    labelPresent: new FormControl(false, { nonNullable: true }),
    glassIntact: new FormControl(false, { nonNullable: true }),
    wrenchPresent: new FormControl(false, { nonNullable: true }),
    hoseOk: new FormControl(false, { nonNullable: true }),
    nozzlePresent: new FormControl(false, { nonNullable: true }),
    valveOperational: new FormControl(false, { nonNullable: true }),
    lockOk: new FormControl(false, { nonNullable: true }),
    cabinetState: new FormControl<any>(null, {
      validators: [Validators.required],
    }),
    observations: new FormControl<string | null>(null),
    applicationUserId: new FormControl(this.authS.applicationUserId, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  async ngOnInit() {
    this.cycleId = this.config.data?.cycleId ?? "";
    this.equipmentId = this.config.data?.equipmentId ?? "";
    this.form.patchValue({
      fireInspectionCycleId: this.cycleId,
      hydrantId: this.equipmentId,
    });
    this.cb_cabinetStates = await firstValueFrom(
      this.enumSelectS.cabinetState(),
    );
    this.onLoadExisting();
  }

  onLoadExisting() {
    this.apiResponseS
      .onGetItem(
        `FireCycleInspection/hidrante/${this.cycleId}/${this.equipmentId}`,
      )
      .then((result: any) => {
        if (result) this.form.patchValue(result);
      });
  }

  async onSubmit() {
    await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: "FireCycleInspection/hidrante",
      id: "",
      ref: this.ref,
      submitting: this.submitting,
      closeOnSuccess: true,
    });
  }
}
