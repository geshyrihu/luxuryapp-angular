import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { AppIcon } from "../../primitives/app-icon/app-icon";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "iw-button",
  host: { class: "lux-button-web" },
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
      [attr.aria-label]="ariaLabel() || title() || label() || null"
      (click)="emitClick($event)"
    >
      @if (emoji()) {
        <span>{{ emoji() }}</span>
      } @else if (iconClass()) {
        <lux-icon [icon]="resolvedIconClass()" />
      } @else if (icon()) {
        <lux-icon [icon]="resolvedIcon()" />
      }
    </button>
  `,
})
export class WebButtonIcon extends BaseButton {
  override variant = input<"solid" | "outline" | "soft" | "text" | "link">(
    "soft",
  );
}
