import { Directive, computed, input } from "@angular/core";
import type { AppIconName } from "../shared/app-icon/app-icon.catalog";
import { resolveIconifyIcon } from "src/app/shared/utils/icon-mapping";
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
  /** Variante semántica (ver variantMap). Tiene prioridad sobre fill/color.
   *  Tipo `string` para tolerar alias web; valores desconocidos caen a fill/color. */
  variant = input<IliButtonVariant | (string & {})>("");
  color = input<string>("primary");
  fill = input<IonFill>("solid");
  expand = input<"block" | "full" | "">("");
  size = input<"small" | "default" | "large">("default");
  styleClass = input<string>("");

  // Incluye alias de las variantes WEB (outlined/ghost-text/link/solid) para
  // tolerar plantillas donde se copió un `variant` de un botón web a uno móvil.
  private readonly variantMap: Record<string, { fill: IonFill; color: string }> =
    {
      primary: { fill: "solid", color: "primary" },
      secondary: { fill: "solid", color: "secondary" },
      outline: { fill: "outline", color: "primary" },
      outlined: { fill: "outline", color: "primary" },
      text: { fill: "clear", color: "primary" },
      link: { fill: "clear", color: "primary" },
      danger: { fill: "solid", color: "danger" },
      ghost: { fill: "clear", color: "medium" },
      "ghost-text": { fill: "clear", color: "medium" },
      solid: { fill: "solid", color: "primary" },
    };

  protected resolvedFill = computed<IonFill>(() => {
    const mapped = this.variantMap[this.variant() as IliButtonVariant];
    return mapped ? mapped.fill : this.fill();
  });

  protected resolvedColor = computed<string>(() => {
    const mapped = this.variantMap[this.variant() as IliButtonVariant];
    return mapped ? mapped.color : this.color();
  });

  /**
   * Icono normalizado a identificador de Iconify para `<app-icon>`.
   *
   * `iconClass`/`icon` aceptan formatos heredados (`"add"`, `"pi pi-plus"`,
   * `"material-symbols-light:add"`), así que hay que pasarlos por el resolutor.
   * Devuelve `null` cuando no hay icono: las plantillas dependen de eso para
   * aplicar su propio valor por defecto (`resolvedIconClass() || '…'`).
   *
   * El aserto de tipo es deliberado: `resolveIconifyIcon` garantiza un
   * identificador de Iconify bien formado, no que pertenezca al catálogo.
   * Los nombres heredados que no estén mapeados pasan tal cual.
   */
  protected resolvedIconClass = computed<AppIconName | null>(() => {
    const raw = this.iconClass() || this.icon();
    if (!raw) return null;
    return resolveIconifyIcon(raw) as AppIconName;
  });
}
