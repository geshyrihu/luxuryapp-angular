import { Component, input, model, output, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";

type ConfirmType = "danger" | "warning" | "info" | "success";

const typeConfig: Record<ConfirmType, { icon: string; color: string; severity: "danger" | "warn" | "info" | "success" }> = {
  danger:  { icon: "mdi:alert-circle",    color: "var(--ds-danger)",  severity: "danger" },
  warning: { icon: "mdi:alert",           color: "var(--ds-warning)", severity: "warn" },
  info:    { icon: "mdi:information",     color: "var(--ds-info)",    severity: "info" },
  success: { icon: "mdi:check-circle",    color: "var(--ds-success)", severity: "success" },
};

@Component({
  selector: "app-confirm-dialog",
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, AppIcon],
  template: `
    <p-dialog
      [(visible)]="visible"
      [header]="title()"
      [modal]="true"
      [closable]="false"
      [draggable]="false"
      [style]="{ width: '420px' }"
      [breakpoints]="{ '480px': '90vw' }"
    >
      <div class="flex flex-column align-items-center text-center gap-3 py-3">
        <app-icon [icon]="config.icon" class="text-4xl" [style.color]="config.color" />
        <p class="m-0 text-color-secondary line-height-3">{{ message() }}</p>
      </div>
      <ng-template #footer>
        <div class="flex gap-2 justify-content-end">
          <p-button
            [label]="cancelLabel()"
            severity="secondary"
            [outlined]="true"
            (onClick)="onCancel()"
          />
          <p-button
            [label]="confirmLabel()"
            [severity]="config.severity"
            (onClick)="onConfirm()"
          />
        </div>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    :host { display: contents; }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class ConfirmDialog {
  visible = model<boolean>(false);
  title = input("Confirmar acción");
  message = input("¿Estás seguro de realizar esta acción?");
  type = input<ConfirmType>("danger");
  confirmLabel = input("Confirmar");
  cancelLabel = input("Cancelar");

  confirm = output<void>();
  cancel = output<void>();

  get config() {
    return typeConfig[this.type()] || typeConfig.danger;
  }

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
