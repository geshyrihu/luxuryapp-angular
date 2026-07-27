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
        bg: "var(--ds-success-light, #d8f8e1)",
        text: "var(--ds-success, #006837)",
        border: "transparent",
        icon: "mdi:check-circle-outline",
      },
      info: {
        bg: "var(--ds-info-light, #dff3ff)",
        text: "var(--ds-info, #0b63a5)",
        border: "transparent",
        icon: "mdi:information-outline",
      },
      warn: {
        bg: "var(--ds-warning-light, #fff4d6)",
        text: "var(--ds-warning, #8a5a00)",
        border: "transparent",
        icon: "mdi:alert-outline",
      },
      warning: {
        bg: "var(--ds-warning-light, #fff4d6)",
        text: "var(--ds-warning, #8a5a00)",
        border: "transparent",
        icon: "mdi:alert-outline",
      },
      danger: {
        bg: "var(--ds-danger-light, #ffdad6)",
        text: "var(--ds-danger, #ba1a1a)",
        border: "transparent",
        icon: "mdi:alert-circle-outline",
      },
      error: {
        bg: "var(--ds-danger-light, #ffdad6)",
        text: "var(--ds-danger, #ba1a1a)",
        border: "transparent",
        icon: "mdi:alert-circle-outline",
      },
      secondary: {
        bg: "var(--ds-bg-sunken, #f4f5f8)",
        text: "var(--ds-text-secondary, #4d5562)",
        border: "var(--ds-border, #d7dbe3)",
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
