import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "app-payment-cancel-modal",
  imports: [
    ReactiveFormsModule,
    WebButtonLabel,
    WebButtonLabelSave,
    CustomInputTextAreaSignal,
    AppIcon,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div class="flex flex-column gap-4">
      <div class="surface-50 rounded-lg p-3 border-1 border-200">
        <div class="flex align-items-start gap-3">
          <app-icon
            icon="material-symbols-light:error-outline"
            class="text-2xl text-orange-500 mt-1"
          />
          <div>
            <p class="m-0 font-semibold text-900">
              Se cancelara el pago seleccionado
            </p>
            <p class="m-0 mt-2 text-sm text-600 line-height-3">
              {{ summary }}
            </p>
          </div>
        </div>
      </div>

      <custom-input-textarea-signal
        [control]="reasonCtrl"
        label="Motivo formal de cancelacion"
        placeholder="Describe la razon operativa o contable de la cancelacion"
        [rows]="4"
        required
      />

      <div class="flex justify-content-end gap-2">
        <il-button
          label="Cerrar"
          iconClass="material-symbols-light:close"
          variant="ghost-text"
          severity="secondary"
          (clicked)="onClose()"
        />
        <il-button-save
          label="Confirmar Cancelacion"
          iconClass="material-symbols-light:cancel"
          [disabled]="reasonCtrl.invalid"
          (clicked)="onSubmit()"
        />
      </div>
    </div>
  `,
})
export default class PaymentCancelModal {
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);

  readonly summary = this.config.data?.summary ?? "";

  readonly reasonCtrl = new FormControl(
    "Pago cancelado por aclaracion operativa",
    {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)],
    },
  );

  onClose(): void {
    this.ref.close(null);
  }

  onSubmit(): void {
    if (this.reasonCtrl.invalid) {
      this.reasonCtrl.markAsTouched();
      return;
    }

    this.ref.close(this.reasonCtrl.getRawValue().trim());
  }
}
