import { computed, Directive, input, output } from "@angular/core";

type ButtonSeverity =
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "warn"
  | "danger"
  | "help"
  | "contrast";

type ButtonVariant = "solid" | "outline" | "ghost" | "text" | "link";
type ButtonSize = "small" | "large" | "sm" | "md" | "lg";

@Directive()
export abstract class BaseButton {
  label = input<string>("");
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

  clicked = output<Event>();

  protected normalizedSeverity = computed(() =>
    this.severity() === "warn" ? "warning" : this.severity(),
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
