import { Directive, input, computed } from "@angular/core";

export type TagSeverity =
  | "success"
  | "info"
  | "warn"
  | "warning"
  | "danger"
  | "secondary"
  | "contrast";

@Directive()
export abstract class TagBase {
  value = input<string | number>("");
  severity = input<TagSeverity>("secondary");
  rounded = input<boolean>(false);
  icon = input<string>("");
  tooltip = input<string>("");

  displayValue = computed<string>(() => {
    const val = this.value();
    return val === null || val === undefined ? "" : String(val);
  });

  normalizedSeverity = computed<TagSeverity>(() => {
    return this.severity() === "warning" ? "warn" : this.severity();
  });

  colors = computed<{ bg: string; text: string; border: string }>(() => {
    const map: Record<TagSeverity, { bg: string; text: string; border: string }> = {
      success: {
        bg: "var(--ds-success-light)",
        text: "var(--ds-success)",
        border: "transparent",
      },
      info: {
        bg: "var(--ds-info-light)",
        text: "var(--ds-info)",
        border: "transparent",
      },
      warn: {
        bg: "var(--ds-warning-light)",
        text: "var(--ds-warning)",
        border: "transparent",
      },
      danger: {
        bg: "var(--ds-danger-light)",
        text: "var(--ds-danger)",
        border: "transparent",
      },
      secondary: {
        bg: "var(--ds-bg-sunken)",
        text: "var(--ds-text-secondary)",
        border: "var(--ds-border)",
      },
      contrast: {
        bg: "var(--ds-bg-page)",
        text: "var(--ds-text-primary)",
        border: "var(--ds-border-strong)",
      },
      warning: {
        bg: "var(--ds-warning-light)",
        text: "var(--ds-warning)",
        border: "transparent",
      },
    };

    return map[this.normalizedSeverity()] ?? map.secondary;
  });
}
