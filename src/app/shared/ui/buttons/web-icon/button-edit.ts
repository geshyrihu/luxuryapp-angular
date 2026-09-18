import { AppIcon as AppIconCatalog } from "../../shared/app-icon/app-icon.catalog";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { AppIcon } from "../../shared/app-icon/app-icon";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "iw-button-edit",

   imports: [AppIcon, LxTooltipDirective],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button
      type="button"
      [class]="buttonClasses()"
      [attr.aria-label]="ariaLabel() || null"
      [disabled]="disabled() || loading()"
      [lxTooltip]="tooltipText()"
      [tooltipPosition]="tooltipPosition()"
      [tooltipDisabled]="!tooltipText()"
      (click)="emitClick($event)"
    >
      <!-- <app-icon [icon]="resolvedIconClass() || 'material-symbols-light:edit'" /> -->
      <app-icon [icon]="resolvedIconClass() || IconCatalog.Edit" />
    </button>
  `,
})
export class WebButtonIconEdit extends BaseButton {
  protected readonly IconCatalog = AppIconCatalog;
  override variant = input<"solid" | "outline" | "soft" | "text" | "link">(
    "soft",
  );
  override severity = input<any>("info");
}
