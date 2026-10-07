import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogRef } from "@core/services/dialog-handler.service";
import { ButtonWeb } from "@ui/buttons/web";
import { LuxInputDateSignal } from "@ui/inputs/web/lux-input-date-signal";

@Component({
  selector: "lux-bitacora-filtro-fecha-form-web",
  templateUrl: "./bitacora-filtro-fecha-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ReactiveFormsModule, LuxInputDateSignal, ButtonWeb],
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
