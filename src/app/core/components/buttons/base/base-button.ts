import { computed, Directive, input, output } from "@angular/core";
import { ButtonType } from "../../../enums/button-type";
import { TooltipPlacement } from "../../../enums/tooltip-placement";
import {
  normalizePrimeIconClass,
  resolvePrimeIcon,
} from "../../../utils/prime-icon-resolver";

type Severity =
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warn"
  | "help"
  | "danger"
  | "contrast"
  | null;

/**
 * BASE BUTTON (Web / Design System)
 * -------------------------------------------------------------------------
 * Clase base para todos los botones de escritorio/web.
 * Genera clases del Design System y utilidades PrimeFlex. Sin dependencia de p-button.
 * Para botones moviles Ionic, ver: BaseIonicButton.
 */
@Directive({})
export abstract class BaseButton {
  disabled = input<boolean>(false);
  customClass = input<string>("");
  customNgClass = input<Record<string, boolean>>({});
  iconClass = input<string>("");
  icon = input<string>("");
  emoji = input<string>("");

  label = input<string>("");
  tooltip = input<string>("");
  ngbTooltip = input<string>("");
  tooltipPosition = input<string>("top");
  placement = input<TooltipPlacement>(TooltipPlacement.Top);

  mostrar = input<boolean>(true);
  showLabelOnDesktop = input<boolean>(false);
  noMargin = input<boolean>(true);

  type = input<ButtonType>(ButtonType.Button);

  severity = input<Severity>(null);
  variant = input<"outlined" | "text" | null>(null);
  rounded = input<boolean>(false);
  fluid = input<boolean>(false);
  loading = input<boolean>(false);
  size = input<"small" | "large" | null>(null);

  // Conservados por compatibilidad con templates existentes.
  raised = input<boolean>(false);
  link = input<boolean>(false);
  text = input<boolean>(false);

  resolvedIconClass = computed(() => {
    const icon = this.icon() || this.iconClass();
    const directIcon = normalizePrimeIconClass(icon);
    if (directIcon) return directIcon;

    return resolvePrimeIcon(this.emoji());
  });

  btnClasses = computed(() => {
    const dsSeverity = this.normalizeSeverity(this.severity());
    const varnt = this.variant();
    const isText = this.text() || varnt === "text";
    const isOutlined = varnt === "outlined";
    const isRounded = this.rounded();
    const isFull = this.fluid();
    const size = this.size();

    const parts: string[] = ["btn", "no-print"];

    if (isText || (isRounded && !isOutlined)) {
      parts.push(
        dsSeverity === "primary"
          ? "btn-ghost-primary"
          : `btn-ghost-${dsSeverity}`,
      );
    } else if (isOutlined) {
      parts.push(
        dsSeverity === "primary" ? "btn-outline" : `btn-outline-${dsSeverity}`,
      );
    } else {
      parts.push(`btn-${dsSeverity}`);
    }

    if (isRounded) {
      const hasLabel = this.showLabelOnDesktop() && !!this.label();
      parts.push(hasLabel ? "btn--pill" : "btn--circle");
    }

    if (size === "small") {
      parts.push("btn-sm");
    } else if (size === "large") {
      parts.push("btn-lg");
    }

    if (isFull) {
      parts.push("btn-block");
    }

    return parts.join(" ");
  });

  clicked = output<MouseEvent>();

  iconShellClasses(withLabel = false): string {
    const tone =
      this.text() || this.variant() === "text" || this.variant() === "outlined"
        ? "btn-icon-shell--soft"
        : "btn-icon-shell--inverse";

    return [
      "btn-icon-shell",
      `btn-icon-shell--${this.normalizeSeverity(this.severity())}`,
      tone,
      withLabel ? "btn-icon-shell--with-label" : "btn-icon-shell--compact",
    ].join(" ");
  }

  onClick(event: MouseEvent): void {
    event.stopPropagation();
    this.clicked.emit(event);
  }

  private normalizeSeverity(severity: Severity): string {
    if (!severity) return "primary";
    return severity === "warn" ? "warning" : severity;
  }
}
