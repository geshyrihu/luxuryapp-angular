import { AppIcon as AppIconCatalog } from "../../primitives/app-icon/app-icon.catalog";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { AppIcon } from "../../primitives/app-icon/app-icon";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "iw-button-save",
  host: { class: "lux-button-web" },
   imports: [AppIcon, LxTooltipDirective],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button
      [type]="type()"
      [class]="buttonClasses()"
      [disabled]="disabled() || submitting()"
      [lxTooltip]="tooltipText()"
      [tooltipPosition]="tooltipPosition()"
      [tooltipDisabled]="!tooltipText()"
      (click)="emitClick($event)"
    >
      <lux-icon
        [icon]="propertyId() ? IconCatalog.Save : IconCatalog.Save"
      />
    </button>
  `,
})
export class WebButtonIconSave extends BaseButton {
  protected readonly IconCatalog = AppIconCatalog;
  propertyId = input<string | number | null>(null);
  submitting = input<boolean>(false);

  override severity = input<any>("success");
  override variant = input<"solid" | "outline" | "soft" | "text" | "link">(
    "soft",
  );
  override type = input<"button" | "submit" | "reset">("submit");

  protected finalLabel = computed(() => {
    if (this.label()) return this.label();
    return this.propertyId() ? "Actualizar" : "Guardar";
  });
}
