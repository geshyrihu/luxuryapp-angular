import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { IonButton, IonSpinner } from "@ionic/angular";
import { AppIcon } from "../../primitives/app-icon/app-icon";
import type { AppIconName } from "../../primitives/app-icon/app-icon.catalog";
import { MobileButtonBase } from "../mobile-button-base";
import type { ButtonDisplayMode } from "../base/base-button";

type MobileButtonKind =
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

const DEFAULTS: Record<Exclude<MobileButtonKind, "custom">, { label: string; icon: string }> = {
  add: { label: "Agregar", icon: "material-symbols-light:add" },
  edit: { label: "Editar", icon: "material-symbols-light:edit" },
  delete: { label: "Eliminar", icon: "material-symbols-light:delete" },
  save: { label: "Guardar", icon: "material-symbols-light:save" },
  download: { label: "Descargar", icon: "material-symbols-light:download" },
  confirm: { label: "Confirmar", icon: "material-symbols-light:check" },
  "send-email": { label: "Enviar correo", icon: "material-symbols-light:mail" },
  "view-pdf": { label: "Ver PDF", icon: "material-symbols-light:picture-as-pdf" },
  tracking: { label: "Seguimiento", icon: "material-symbols-light:location-searching" },
  "active-desactive": { label: "Activar / desactivar", icon: "material-symbols-light:toggle_on" },
  item: { label: "Seleccionar", icon: "material-symbols-light:touch-app" },
};

@Component({
  selector: "lux-button-mobile",
  imports: [IonButton, IonSpinner, AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <ion-button
      [type]="type()"
      [expand]="expand()"
      [fill]="resolvedFill()"
      [color]="resolvedColor()"
      [size]="size()"
      [disabled]="disabled() || loading()"
      [class]="styleClass()"
      [attr.title]="title() || ariaLabel() || resolvedLabel() || null"
      [attr.aria-label]="ariaLabel() || title() || resolvedLabel() || null"
      (click)="onClick($event)"
    >
      @if (loading()) {
        <ion-spinner name="crescent" />
      } @else {
        @if (displayMode() !== "label") {
          <app-icon [icon]="resolvedIconClass() || resolvedKindIcon()" slot="start" />
        }
        @if (displayMode() !== "icon") {
          {{ resolvedLabel() }}
        }
      }
    </ion-button>
  `,
})
export class ButtonMobile extends MobileButtonBase {
  kind = input<MobileButtonKind>("custom");
  override displayMode = input<ButtonDisplayMode>("both");
  private readonly defaults = computed(() => DEFAULTS[this.kind() as Exclude<MobileButtonKind, "custom">]);
  protected resolvedLabel = computed(() => this.label() || this.defaults()?.label || "Continuar");
  protected resolvedKindIcon = computed<AppIconName>(() =>
    (this.defaults()?.icon || "material-symbols-light:touch-app") as AppIconName,
  );
}
