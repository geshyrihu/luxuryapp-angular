import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { AppIcon } from "../shared/app-icon/app-icon.component";
import { IlButtonBase } from "./il-button-base";

@Component({
  selector: "il-button",
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
        @if (isPrimeIcon(iconClass())) {
          <i [class]="iconClass()"></i>
        } @else {
          <app-icon [icon]="iconClass()" />
        }
      }
      <span>{{ label() || "Continuar" }}</span>
    </button>
  `,
})
export class IlButton extends IlButtonBase {}
