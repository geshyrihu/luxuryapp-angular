import { Directive, input, output, computed } from "@angular/core";
import type { AppIconName } from "src/app/shared/ui/shared/app-icon/app-icon.catalog";

export type MessageSeverity =
  | "success"
  | "info"
  | "warn"
  | "warning"
  | "danger"
  | "error"
  | "secondary";

@Directive()
export abstract class MessageBase {
  text = input<string>("");
  severity = input<MessageSeverity>("info");
  closable = input<boolean>(false);
  icon = input<AppIconName>();

  close = output<void>();

  normalizedSeverity = computed<MessageSeverity>(() => {
    if (this.severity() === "warning") return "warn";
    if (this.severity() === "error") return "danger";
    return this.severity();
  });

  colors = computed<{ bg: string; text: string; border: string; icon: AppIconName }>(() => {
    const map: Record<MessageSeverity, { bg: string; text: string; border: string; icon: AppIconName }> = {
      success: {
        bg: "var(--ds-success-light)",
        text: "var(--ds-success)",
        border: "transparent",
        icon: "material-symbols-light:check-circle-outline",
      },
      info: {
        bg: "var(--ds-info-light)",
        text: "var(--ds-info)",
        border: "transparent",
        icon: "material-symbols-light:info",
      },
      warn: {
        bg: "var(--ds-warning-light)",
        text: "var(--ds-warning)",
        border: "transparent",
        icon: "material-symbols-light:warning-outline",
      },
      warning: {
        bg: "var(--ds-warning-light)",
        text: "var(--ds-warning)",
        border: "transparent",
        icon: "material-symbols-light:warning-outline",
      },
      danger: {
        bg: "var(--ds-danger-light)",
        text: "var(--ds-danger)",
        border: "transparent",
        icon: "material-symbols-light:error-outline",
      },
      error: {
        bg: "var(--ds-danger-light)",
        text: "var(--ds-danger)",
        border: "transparent",
        icon: "material-symbols-light:error-outline",
      },
      secondary: {
        bg: "var(--ds-bg-sunken)",
        text: "var(--ds-text-secondary)",
        border: "var(--ds-border)",
        icon: "material-symbols-light:info",
      },
    };

    return map[this.normalizedSeverity()] ?? map.info;
  });

  displayIcon = computed<AppIconName>(() => {
    return this.icon() || this.colors().icon;
  });

  onClose(): void {
    this.close.emit();
  }
}
