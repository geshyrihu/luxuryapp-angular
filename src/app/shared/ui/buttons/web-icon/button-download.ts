import { AppIcon as AppIconCatalog } from "../../primitives/app-icon/app-icon.catalog";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { AppIcon } from "../../primitives/app-icon/app-icon";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "iw-button-download",

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
      (click)="emitClick($event)"
    >
      <lux-icon-base [icon]="resolvedIconClass() || IconCatalog.Download" />
    </button>
  `,
})
export class WebButtonIconDownload extends BaseButton {
  protected readonly IconCatalog = AppIconCatalog;
  override variant = input<"solid" | "outline" | "soft" | "text" | "link">(
    "soft",
  );
  override severity = input<any>("secondary");
}
