import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { AppIcon } from "../../shared/app-icon/app-icon";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "iw-button",
  imports: [AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button
      type="button"
      [class]="buttonClasses()"
      [disabled]="disabled() || loading()"
      [attr.title]="title() || ariaLabel() || label() || null"
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
  override variant = input<"solid" | "outline" | "ghost" | "text" | "link">(
    "ghost",
  );
}
