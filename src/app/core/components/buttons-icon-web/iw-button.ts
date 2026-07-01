import { CommonModule } from "@angular/common";
import { Component, input } from "@angular/core";
import { AppIcon } from "../shared/app-icon/app-icon.component";
import { IwButtonBase } from "./iw-button-base";

@Component({
  selector: "iw-button",
  standalone: true,
  imports: [CommonModule, AppIcon],
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
export class IwButton extends IwButtonBase {
  override variant = input<"solid" | "outline" | "ghost" | "text" | "link">("ghost");
}
