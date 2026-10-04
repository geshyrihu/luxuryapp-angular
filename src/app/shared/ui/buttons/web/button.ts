import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { AppIcon } from "../../primitives/app-icon/app-icon";
import type { AppIconName } from "../../primitives/app-icon/app-icon.catalog";
import { AppSpinner } from "../../web/spinner/spinner";
import { BaseButton, type ButtonDisplayMode } from "../base/base-button";

type WebButtonKind =
  | "custom"
  | "add"
  | "edit"
  | "delete"
  | "save"
  | "download"
  | "confirm"
  | "send-email"
  | "view-pdf"
  | "tracking"
  | "active-desactive"
  | "item";

const DEFAULTS: Record<
  Exclude<WebButtonKind, "custom">,
  { label: string; icon: string }
> = {
  add: { label: "Agregar", icon: "material-symbols-light:add" },
  edit: { label: "Editar", icon: "material-symbols-light:edit" },
  delete: { label: "Eliminar", icon: "material-symbols-light:delete" },
  save: { label: "Guardar", icon: "material-symbols-light:save" },
  download: { label: "Descargar", icon: "material-symbols-light:download" },
  confirm: { label: "Confirmar", icon: "material-symbols-light:check" },
  "send-email": { label: "Enviar correo", icon: "material-symbols-light:mail" },
  "view-pdf": {
    label: "Ver PDF",
    icon: "material-symbols-light:picture-as-pdf",
  },
  tracking: {
    label: "Seguimiento",
    icon: "material-symbols-light:location-searching",
  },
  "active-desactive": {
    label: "Activar / desactivar",
    icon: "material-symbols-light:toggle_on",
  },
  item: { label: "Seleccionar", icon: "material-symbols-light:touch-app" },
};

@Component({
  selector: "lux-button-web",
  imports: [AppIcon, AppSpinner, LxTooltipDirective],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button
      [type]="type()"
      [class]="buttonClasses()"
      [disabled]="disabled() || loading()"
      [lxTooltip]="tooltipText()"
      [tooltipPosition]="tooltipPosition()"
      [tooltipDisabled]="!tooltipText()"
      [attr.aria-label]="ariaLabel() || title() || resolvedLabel() || null"
      (click)="emitClick($event)"
    >
      @if (loading()) {
        <app-spinner [size]="16" [strokeWidth]="6" ariaLabel="Cargando" />
      } @else {
        @if (displayMode() !== "label") {
          <app-icon [icon]="resolvedButtonIcon()" />
        }
        @if (displayMode() !== "icon") {
          <span>{{ resolvedLabel() }}</span>
        }
      }
    </button>
  `,
})
export class ButtonWeb extends BaseButton {
  kind = input<WebButtonKind>("custom");
  override displayMode = input<ButtonDisplayMode>("both");
  private readonly defaults = computed(
    () => DEFAULTS[this.kind() as Exclude<WebButtonKind, "custom">],
  );
  protected resolvedLabel = computed(
    () => this.label() || this.defaults()?.label || "Continuar",
  );
  protected resolvedButtonIcon = computed<AppIconName>(
    () =>
      (this.iconClass() ||
        this.icon() ||
        this.defaults()?.icon ||
        "material-symbols-light:touch-app") as AppIconName,
  );
}
