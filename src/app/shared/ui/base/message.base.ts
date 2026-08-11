import { Directive, input, output, computed } from "@angular/core";

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
  icon = input<string>("");

  close = output<void>();

  normalizedSeverity = computed<MessageSeverity>(() => {
    if (this.severity() === "warning") return "warn";
    if (this.severity() === "error") return "danger";
    return this.severity();
  });

  colors = computed<{ bg: string; text: string; border: string; icon: string }>(() => {
    const map: Record<MessageSeverity, { bg: string; text: string; border: string; icon: string }> = {
      success: {
        bg: "var(--ds-success-light)",
        text: "var(--ds-success)",
        border: "transparent",
        icon: "mdi:check-circle-outline",
      },
      info: {
        bg: "var(--ds-info-light)",
        text: "var(--ds-info)",
        border: "transparent",
        icon: "mdi:information-outline",
      },
      warn: {
        bg: "var(--ds-warning-light)",
        text: "var(--ds-warning)",
        border: "transparent",
        icon: "mdi:alert-outline",
      },
      warning: {
        bg: "var(--ds-warning-light)",
        text: "var(--ds-warning)",
        border: "transparent",
        icon: "mdi:alert-outline",
      },
      danger: {
        bg: "var(--ds-danger-light)",
        text: "var(--ds-danger)",
        border: "transparent",
        icon: "mdi:alert-circle-outline",
      },
      error: {
        bg: "var(--ds-danger-light)",
        text: "var(--ds-danger)",
        border: "transparent",
        icon: "mdi:alert-circle-outline",
      },
      secondary: {
        bg: "var(--ds-bg-sunken)",
        text: "var(--ds-text-secondary)",
        border: "var(--ds-border)",
        icon: "mdi:information-outline",
      },
    };

    return map[this.normalizedSeverity()] ?? map.info;
  });

  displayIcon = computed<string>(() => {
    return this.icon() || this.colors().icon;
  });

  onClose(): void {
    this.close.emit();
  }
}
