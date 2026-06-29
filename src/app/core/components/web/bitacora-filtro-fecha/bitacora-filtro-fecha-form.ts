import { Component, inject, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomButtonSave } from "src/app/core/components/web/buttons/custom-button-save";

@Component({
  selector: "app-bitacora-filtro-fecha-form",
  templateUrl: "./bitacora-filtro-fecha-form.html",
  imports: [
    ReactiveFormsModule,
    CardModule,
    CustomInputDateSignal,
    CustomButtonSave,
  ],
})
export class BitacoraFiltroFechaForm {
  ref = inject(DynamicDialogRef);
  formB = inject(FormBuilder);
  submitting = signal(false);

  form = this.formB.group({
    from: new FormControl<Date | null>(null, {
      validators: [Validators.required],
    }),
    to: new FormControl<Date | null>(null, {
      validators: [Validators.required],
    }),
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.ref.close({ from: this.form.value.from!, to: this.form.value.to! });
  }
}
