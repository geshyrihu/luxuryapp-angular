import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { AppIcon } from "../../../shared/app-icon/app-icon.component";
import { WebButtonBase } from "./web-button-base";

@Component({
  selector: "custom-button-add",
  standalone: true,
  imports: [CommonModule, AppIcon],
  template: `
    <button
      type="button"
      [class]="buttonClasses()"
      [disabled]="disabled() || loading()"
      (click)="emitClick($event)"
    >
      <app-icon [icon]="iconClass() || 'mdi:plus'" />
      @if (showLabelOnDesktop()) {
        <span>{{ label() || "Agregar" }}</span>
      }
    </button>
  `,
})
export class CustomButtonAdd extends WebButtonBase {}
