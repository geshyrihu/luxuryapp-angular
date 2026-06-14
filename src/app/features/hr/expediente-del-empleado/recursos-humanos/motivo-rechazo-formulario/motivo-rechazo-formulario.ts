import { Component, inject } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
@Component({
  selector: "app-rejection-reason-prompt",
  imports: [ReactiveFormsModule, CustomInputTextAreaSignal, CustomButton],
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








