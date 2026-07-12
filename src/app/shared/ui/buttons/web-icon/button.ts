import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { AppIcon } from "../../shared/app-icon/app-icon.component";
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
      (click)="emitClick($event)"
    >
      @if (emoji()) {
        <span>{{ emoji() }}</span>
      } @else if (iconClass()) {
        @if (isPrimeIcon(iconClass())) {
          <i [class]="iconClass()"></i>
        } @else {
          <app-icon [icon]="iconClass()" />
        }
      }
    </button>
  `,
})
export class WebButtonIcon extends BaseButton {
  override variant = input<"solid" | "outline" | "ghost" | "text" | "link">(
    "ghost",
  );
}
