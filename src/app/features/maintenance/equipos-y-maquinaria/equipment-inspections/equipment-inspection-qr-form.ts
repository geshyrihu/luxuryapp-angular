import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButtonSave } from "src/app/core/components/web/buttons/custom-button-save";
import { CustomInputCheckSignal } from "src/app/core/components/web/inputs/custom-input-check-signal";
import { CustomInputSelectSignal } from "src/app/core/components/web/inputs/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/web/inputs/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/web/inputs/custom-input-textarea-signal";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { EquipmentQrLabelAddOrEditDTO } from "./equipment-inspection.models";
import { EquipmentInspectionService } from "./equipment-inspection.service";

interface EquipmentQrFormGroup {
  name: FormControl<string>;
  qrType: FormControl<number>;
  isActive: FormControl<boolean>;
  notes: FormControl<string>;
}

@Component({
  selector: "app-equipment-inspection-qr-form",
  templateUrl: "./equipment-inspection-qr-form.html",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomButtonSave,
    CustomInputCheckSignal,
    CustomInputSelectSignal,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
  ],
})
export class EquipmentInspectionQrForm implements OnInit {
  private formBuilder = inject(FormBuilder);
  private customerIdS = inject(CustomerIdService);
  private equipmentInspectionS = inject(EquipmentInspectionService);

  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);

  submitting = signal(false);
  qrTypeOptions = this.equipmentInspectionS.qrTypeOptions;

  form: FormGroup<EquipmentQrFormGroup> = this.formBuilder.group({
    name: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    qrType: new FormControl(1, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    isActive: new FormControl(true, { nonNullable: true }),
    notes: new FormControl("", { nonNullable: true }),
  });

  ngOnInit(): void {
    if (this.config.data?.defaultName) {
      this.form.controls.name.setValue(this.config.data.defaultName);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    try {
      const payload: EquipmentQrLabelAddOrEditDTO = {
        customerId: this.customerIdS.customerId(),
        machineryId: this.config.data.machineryId,
        name: this.form.controls.name.value,
        qrType: this.form.controls.qrType.value as 1 | 2 | 3,
        isActive: this.form.controls.isActive.value,
        notes: this.form.controls.notes.value || null,
      };

      const result = await this.equipmentInspectionS.createQrLabel(payload);
      if (result !== false) {
        this.ref.close(true);
      }
    } finally {
      this.submitting.set(false);
    }
  }
}


