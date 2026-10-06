import { ButtonWeb } from "@ui/buttons/web";
import { Component, inject, ChangeDetectionStrategy } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { DynamicDialogRef } from "@core/services/dialog-handler.service";

import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
@Component({
  selector: "app-rejection-reason-prompt",
  imports: [ButtonWeb, ReactiveFormsModule, CustomInputTextAreaSignal],
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

