import { Component, inject } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";

@Component({
  selector: "app-cobranza-date-picker-modal",

  imports: [CustomInputDateSignal, ReactiveFormsModule, WebButtonLabel],
  template: `
    <div class="p-4">
      <div class="mb-4">
        <custom-input-date-signal
          [control]="dateControl"
          [noMargin]="true"
          [horizontal]="false"
        />
      </div>
      <div class="flex gap-2 justify-content-end">
        <il-button
          [label]="'Cancelar'"
          (clicked)="onCancel()"
          type="secondary"
          size="small"
        />
        <il-button [label]="'Aceptar'" (clicked)="onAccept()" size="small" />
      </div>
    </div>
  `,
})
export class CobranzaDatePickerModalComponent {
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);

  readonly dateControl: FormControl =
    this.config.data?.dateControl || new FormControl();

  onAccept() {
    this.ref.close(this.dateControl.value);
  }

  onCancel() {
    this.ref.close();
  }
}
