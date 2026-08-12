import { Directive, input, output, computed } from "@angular/core";
import type { AppIconName } from "@ui/shared/app-icon/app-icon.catalog";

export type ConfirmPopupType = "danger" | "warning" | "info" | "success";

@Directive()
export abstract class ConfirmPopupBase {
  key = input<string>("default");
  message = input<string>("¿Estás seguro?");
  acceptLabel = input<string>("Sí");
  rejectLabel = input<string>("No");
  type = input<ConfirmPopupType>("danger");
  icon = input<AppIconName>();

  accept = output<void>();
  reject = output<void>();

  severityConfig = computed(() => {
    const map: Record<ConfirmPopupType, { icon: AppIconName; color: string; severity: string }> = {
      danger: { icon: "material-symbols-light:error", color: "var(--ds-danger)", severity: "danger" },
      warning: { icon: "material-symbols-light:warning", color: "var(--ds-warning)", severity: "warn" },
      info: { icon: "material-symbols-light:info", color: "var(--ds-info)", severity: "info" },
      success: { icon: "material-symbols-light:check-circle", color: "var(--ds-success)", severity: "success" },
    };
    return map[this.type()] ?? map.danger;
  });
}
