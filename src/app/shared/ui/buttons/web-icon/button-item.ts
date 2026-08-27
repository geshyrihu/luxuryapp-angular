import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { AppIcon } from "../../shared/app-icon/app-icon";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "iw-button-item",

  imports: [AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button
      type="button"
      [class]="buttonClasses()"
      [attr.aria-label]="ariaLabel() || label() || null"
      [disabled]="disabled() || loading()"
      (click)="emitClick($event)"
    >
      @let iconName = iconClass() || icon();
      @if (emoji()) {
        <span>{{ emoji() }}</span>
      }
      @if (iconName && (resolvedIcon() || resolvedIconClass())) {
        <app-icon [icon]="resolvedIcon() || resolvedIconClass()" />
      }
      @if (label(); as labelText) {
        <span>{{ labelText }}</span>
      }
    </button>
  `,
})
export class WebButtonIconItem extends BaseButton {
  override variant = input<"solid" | "outline" | "ghost" | "text" | "link">(
    "ghost",
  );
  override severity = input<any>("secondary");
}
