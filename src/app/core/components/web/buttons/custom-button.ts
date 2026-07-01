import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { AppIcon } from "../../shared/app-icon/app-icon.component";
import { WebButtonBase } from "./web-button-base";

@Component({
  selector: "custom-button",
  standalone: true,
  imports: [CommonModule, AppIcon],
  template: `
    <button
      [type]="type()"
      [class]="buttonClasses()"
      [disabled]="disabled() || loading()"
      (click)="emitClick($event)"
    >
      @if (emoji()) {
        <span>{{ emoji() }}</span>
      } @else if (iconClass()) {
        <app-icon [icon]="iconClass()" />
      }
      @if (showLabelOnDesktop() && label()) {
        <span>{{ label() }}</span>
      }
    </button>
  `,
})
export class CustomButton extends WebButtonBase {}
