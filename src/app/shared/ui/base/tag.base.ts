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
        bg: "var(--ds-success-light, #d8f8e1)",
        text: "var(--ds-success, #006837)",
        border: "transparent",
      },
      info: {
        bg: "var(--ds-info-light, #dff3ff)",
        text: "var(--ds-info, #0b63a5)",
        border: "transparent",
      },
      warn: {
        bg: "var(--ds-warning-light, #fff4d6)",
        text: "var(--ds-warning, #8a5a00)",
        border: "transparent",
      },
      danger: {
        bg: "var(--ds-danger-light, #ffdad6)",
        text: "var(--ds-danger, #ba1a1a)",
        border: "transparent",
      },
      secondary: {
        bg: "var(--ds-bg-sunken, #f4f5f8)",
        text: "var(--ds-text-secondary, #4d5562)",
        border: "var(--ds-border, #d7dbe3)",
      },
      contrast: {
        bg: "var(--ds-bg-page, #ffffff)",
        text: "var(--ds-text-primary, #1f2937)",
        border: "var(--ds-border-strong, #aeb6c2)",
      },
      warning: {
        bg: "var(--ds-warning-light, #fff4d6)",
        text: "var(--ds-warning, #8a5a00)",
        border: "transparent",
      },
    };

    return map[this.normalizedSeverity()] ?? map.secondary;
  });
}
