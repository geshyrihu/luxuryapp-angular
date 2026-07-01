import { CommonModule } from "@angular/common";
import { Component, input } from "@angular/core";
import { AppIcon } from "../../shared/app-icon/app-icon.component";
import { WebButtonBase } from "./web-button-base";

@Component({
  selector: "custom-button-item",
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
        <app-icon [icon]="iconClass()" />
      }
      @if (showLabelOnDesktop()) {
        <span>{{ label() || "Accion" }}</span>
      }
    </button>
  `,
})
export class CustomButtonItem extends WebButtonBase {
  override variant = input<"solid" | "outline" | "ghost" | "text" | "link">("ghost");
  override severity = input<any>("secondary");
}
