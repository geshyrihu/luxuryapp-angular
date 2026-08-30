import { computed, Directive, input, output } from "@angular/core";
import { resolveIconifyIcon } from "src/app/shared/utils/icon-mapping";
import type { AppIconName } from "../../shared/app-icon/app-icon.catalog";
type ButtonSeverity =
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "warn"
  | "danger"
  | "help"
  | "contrast"
  | "ai";
type ButtonVariant = "solid" | "outline" | "ghost" | "text" | "link";
type ButtonSize = "small" | "large" | "sm" | "md" | "lg";

@Directive()
export abstract class BaseButton {
  label = input<string>("");
  title = input<string>("");
  icon = input<string>("");
  iconClass = input<string>("");
  emoji = input<string>("");
  severity = input<ButtonSeverity>("primary");
  variant = input<ButtonVariant>("solid");
  size = input<ButtonSize>("md");
  customClass = input<string>("", { alias: "styleClass" });
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  rounded = input<boolean>(false);
  outlined = input<boolean>(false);
  text = input<boolean>(false);
  plain = input<boolean>(false);
  block = input<boolean>(false);
  fluid = input<boolean>(false);
  type = input<"button" | "submit" | "reset">("button");
  ariaLabel = input<string>("");
  clicked = output<Event>();
  protected normalizedSeverity = computed(() =>
    this.severity() === "warn" ? "warning" : this.severity(),
  );
  /**
   * Icono resuelto a `AppIconName` para el binding de `<app-icon>`.
   *
   * Hasta 2026-08-11 existía además `isPrimeIcon()`, y las plantillas
   * bifurcaban: si el valor empezaba por `"pi "` se pintaba un `<i>` con esa
   * clase de PrimeIcons. Ese camino ya no existe — no quedan `pi pi-` en el
   * código— y mantenerlo solo dejaba abierta la puerta a reintroducirlos.
   *
   * `resolveIconifyIcon` sigue traduciendo nombres heredados que puedan llegar
   * en datos (`"plus"`, `"trash"`), así que la compatibilidad de entrada se
   * conserva; lo que se retiró es la salida en formato PrimeIcons.
   */
  protected resolvedIcon = computed<AppIconName | null>(() =>
    this.icon() ? (resolveIconifyIcon(this.icon()) as AppIconName) : null,
  );
  protected resolvedIconClass = computed<AppIconName | null>(() =>
    this.iconClass() ? (resolveIconifyIcon(this.iconClass()) as AppIconName) : null,
  );
  buttonClasses = computed(() => {
    const classes = ["btn"];
    const variant = this.outlined()
      ? "outline"
      : this.text()
        ? "text"
        : this.variant();
    const severity = this.normalizedSeverity();
    if (variant === "outline") {
      classes.push(`btn-outline-${severity}`);
    } else if (variant === "ghost") {
      classes.push(`btn-ghost-${severity}`);
    } else if (variant === "text") {
      classes.push(`btn-text-${severity}`);
    } else if (variant === "link") {
      classes.push("btn-link");
    } else {
      classes.push(`btn-${severity}`);
    }
    const size = this.size();
    if (size === "small" || size === "sm") classes.push("btn-sm");
    if (size === "large" || size === "lg") classes.push("btn-lg");
    if (this.rounded()) classes.push("btn--pill");
    if (this.block()) classes.push("btn-block");
    if (this.fluid()) classes.push("btn-fluid");
    if (this.customClass()) classes.push(this.customClass());
    return classes.join(" ");
  });
  protected emitClick(event: Event): void {
    if (this.disabled() || this.loading()) return;
    this.clicked.emit(event);
  }
}
