import { Directive, input, output } from "@angular/core";

export type ConfirmPopupType = "danger" | "warning" | "info" | "success";

@Directive()
export abstract class ConfirmPopupBase {
  key = input<string>("default");
  message = input<string>("¿Estás seguro?");
  acceptLabel = input<string>("Sí");
  rejectLabel = input<string>("No");
  type = input<ConfirmPopupType>("danger");
  icon = input<string>("");

  accept = output<void>();
  reject = output<void>();

  get severityConfig() {
    const map: Record<ConfirmPopupType, { icon: string; color: string; severity: string }> = {
      danger: { icon: "mdi:alert-circle", color: "var(--ds-danger)", severity: "danger" },
      warning: { icon: "mdi:alert", color: "var(--ds-warning)", severity: "warn" },
      info: { icon: "mdi:information", color: "var(--ds-info)", severity: "info" },
      success: { icon: "mdi:check-circle", color: "var(--ds-success)", severity: "success" },
    };
    return map[this.type()] ?? map.danger;
  }
}
