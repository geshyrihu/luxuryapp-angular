import { Directive, computed, input } from "@angular/core";
import { BaseIonicButton } from "./base/base-ionic-button";

export type IliButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "text"
  | "danger"
  | "ghost";

type IonFill = "clear" | "outline" | "solid" | "default";

/**
 * Base de los botones móviles `ili-*` / `ii-*`.
 *
 * Expone `variant` (semántico) además de los `fill`/`color` de Ionic.
 * Si `variant` está definido, tiene prioridad y resuelve el par (fill, color);
 * si no, se usan los `fill`/`color` explícitos (retro-compatible). Los templates
 * consumen `resolvedFill()` / `resolvedColor()`.
 */
@Directive()
export abstract class MobileButtonBase extends BaseIonicButton {
  /** Variante semántica. Tiene prioridad sobre fill/color cuando se define. */
  variant = input<IliButtonVariant | "">("");
  color = input<string>("primary");
  fill = input<IonFill>("solid");
  expand = input<"block" | "full" | "">("");
  size = input<"small" | "default" | "large">("default");
  styleClass = input<string>("");

  private readonly variantMap: Record<
    IliButtonVariant,
    { fill: IonFill; color: string }
  > = {
    primary: { fill: "solid", color: "primary" },
    secondary: { fill: "solid", color: "secondary" },
    outline: { fill: "outline", color: "primary" },
    text: { fill: "clear", color: "primary" },
    danger: { fill: "solid", color: "danger" },
    ghost: { fill: "clear", color: "medium" },
  };

  protected resolvedFill = computed<IonFill>(() => {
    const v = this.variant();
    return v ? this.variantMap[v].fill : this.fill();
  });

  protected resolvedColor = computed<string>(() => {
    const v = this.variant();
    return v ? this.variantMap[v].color : this.color();
  });
}
