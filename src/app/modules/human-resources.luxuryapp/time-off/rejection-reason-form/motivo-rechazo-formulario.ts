import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { DynamicDialogRef } from "@core/services/dialog-handler.service";
import { ButtonWeb } from "@ui/buttons/web";

import { LuxInputTextAreaSignal } from "@ui/inputs/web/lux-input-textarea-signal";
@Component({
  selector: "app-rejection-reason-prompt",
  imports: [ButtonWeb, ReactiveFormsModule, LuxInputTextAreaSignal],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./motivo-rechazo-formulario.html",
})
export class MotivoRechazoFormulario {
  ref = inject(DynamicDialogRef);
  reasonControl = new FormControl<string>("");
  confirm(): void {
    this.ref.close(this.reasonControl.value);
  }

  close(data: unknown): void {
    this.ref.close(data);
  }
}
