import { Directive, input, model, output } from "@angular/core";

export type ConfirmType = "danger" | "warning" | "info" | "success";

export const CONFIRM_TYPE_CONFIG: Record<
  ConfirmType,
  { icon: string; color: string; severity: "danger" | "warn" | "info" | "success" }
> = {
  danger: { icon: "mdi:alert-circle", color: "var(--ds-danger)", severity: "danger" },
  warning: { icon: "mdi:alert", color: "var(--ds-warning)", severity: "warn" },
  info: { icon: "mdi:information", color: "var(--ds-info)", severity: "info" },
  success: { icon: "mdi:check-circle", color: "var(--ds-success)", severity: "success" },
};

/**
 * Base compartida de ConfirmDialog (API + lógica de tipo).
 *  - web:     `app-confirm-dialog` (PrimeNG p-dialog)
 *  - mobile:  `ili-confirm-dialog` (overlay Ionic)
 *  - wrapper: `lx-confirm-dialog`  (auto runtime)
 */
@Directive()
export abstract class ConfirmDialogBase {
  visible = model<boolean>(false);
  title = input("Confirmar acción");
  message = input("¿Estás seguro de realizar esta acción?");
  type = input<ConfirmType>("danger");
  confirmLabel = input("Confirmar");
  cancelLabel = input("Cancelar");

  confirm = output<void>();
  cancel = output<void>();

  get config() {
    return CONFIRM_TYPE_CONFIG[this.type()] || CONFIRM_TYPE_CONFIG.danger;
  }

  onConfirm(): void {
    this.visible.set(false);
    this.confirm.emit();
  }

  onCancel(): void {
    this.visible.set(false);
    this.cancel.emit();
  }
}
