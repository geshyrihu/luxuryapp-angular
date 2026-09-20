import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";

/**
 * 🧮 Diálogo para crear una nueva propuesta de proyección de sueldos.
 */
@Component({
  selector: "app-salary-projection-create-dialog",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, WebButtonLabel, CustomInputTextSignal],
  template: `
    <div class="d-flex flex-column gap-3 p-3">
      <custom-input-text-signal
        label="Nombre de la propuesta"
        [ngModel]="name()"
        (ngModelChange)="name.set($event)"
      />
      @if (showError()) {
        <small class="text-danger">El nombre de la propuesta es requerido.</small>
      }

      <div class="d-flex justify-content-end gap-2">
        <il-button
          label="Cancelar"
          severity="secondary"
          variant="outline"
          size="small"
          (clicked)="cancel()"
        />
        <il-button
          label="Crear propuesta"
          iconClass="material-symbols-light:add"
          severity="primary"
          size="small"
          (clicked)="confirm()"
        />
      </div>
    </div>
  `,
})
export class SalaryProjectionCreateDialog {
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig, { optional: true });

  readonly name = signal(this.config?.data?.name ?? "");
  readonly showError = signal(false);

  cancel(): void {
    this.ref.close(undefined);
  }

  confirm(): void {
    const name = this.name().trim();
    if (!name) {
      this.showError.set(true);
      return;
    }
    this.ref.close({ name });
  }
}
