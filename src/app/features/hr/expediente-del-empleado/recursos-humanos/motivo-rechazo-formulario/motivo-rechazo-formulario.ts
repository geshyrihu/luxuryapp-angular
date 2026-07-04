import { Component, inject } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
@Component({
  selector: "app-rejection-reason-prompt",
  imports: [ReactiveFormsModule, CustomInputTextAreaSignal, WebButtonLabel],
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
