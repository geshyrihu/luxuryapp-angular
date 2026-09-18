import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { AppIcon } from "../../shared/app-icon/app-icon";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "iw-button",
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
        <app-icon [icon]="resolvedIconClass()" />
      } @else if (icon()) {
        <app-icon [icon]="resolvedIcon()" />
      }
    </button>
  `,
})
export class WebButtonIcon extends BaseButton {
  override variant = input<"solid" | "outline" | "soft" | "text" | "link">(
    "soft",
  );
}
