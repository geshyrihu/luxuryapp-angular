import { AppIcon as AppIconCatalog } from "../../primitives/app-icon/app-icon.catalog";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { AppIcon } from "../../primitives/app-icon/app-icon";
import { BaseButton, type ButtonDisplayMode } from "../base/base-button";

@Component({
  selector: "il-button-edit",

   imports: [AppIcon, LxTooltipDirective],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button
      type="button"
      [class]="buttonClasses()"
      [disabled]="disabled() || loading()"
      [lxTooltip]="tooltipText()"
      [tooltipPosition]="tooltipPosition()"
      [tooltipDisabled]="!tooltipText()"
      [attr.aria-label]="ariaLabel() || title() || label() || 'Editar'"
      (click)="emitClick($event)"
    >
      @if (displayMode() !== "label") {
        <app-icon [icon]="resolvedIconClass() || IconCatalog.PencilOutline" />
      }
      @if (displayMode() !== "icon") {
        <span>{{ label() || "Editar" }}</span>
      }
    </button>
  `,
})
export class WebButtonLabelEdit extends BaseButton {
  protected readonly IconCatalog = AppIconCatalog;
  override displayMode = input<ButtonDisplayMode>("both");
  override variant = input<"solid" | "outline" | "soft" | "text" | "link">(
    "soft",
  );
  override severity = input<any>("info");
}
