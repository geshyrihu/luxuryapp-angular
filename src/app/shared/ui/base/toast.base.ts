import { Directive, input } from "@angular/core";

export type ToastSeverity = "success" | "info" | "warn" | "error";

@Directive()
export abstract class ToastBase {
  severity = input<ToastSeverity>("info");
  summary = input<string>("");
  detail = input<string>("");
  life = input<number>(3000);
  position = input<"top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right">("top-left");

  protected ionColor(): string {
    const map: Record<ToastSeverity, string> = {
      success: "success",
      info: "primary",
      warn: "warning",
      error: "danger",
    };
    return map[this.severity()];
  }

  protected ionIcon(): string {
    const map: Record<ToastSeverity, string> = {
      success: "checkmark-circle",
      info: "information-circle",
      warn: "warning",
      error: "alert-circle",
    };
    return map[this.severity()];
  }
}
