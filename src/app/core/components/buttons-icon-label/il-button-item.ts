import { CommonModule } from "@angular/common";
import { Component, input } from "@angular/core";
import { AppIcon } from "../shared/app-icon/app-icon.component";
import { IlButtonBase } from "./il-button-base";

@Component({
  selector: "il-button-item",
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
      <span>{{ label() || "Accion" }}</span>
    </button>
  `,
})
export class IlButtonItem extends IlButtonBase {
  override variant = input<"solid" | "outline" | "ghost" | "text" | "link">("ghost");
  override severity = input<any>("secondary");
}
