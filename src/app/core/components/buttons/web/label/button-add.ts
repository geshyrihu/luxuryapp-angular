import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { AppIcon } from "../../../shared/app-icon/app-icon.component";
import { BaseButton } from "../../base/base-button";

@Component({
  selector: "il-button-add",
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
      <span>{{ label() || "Agregar" }}</span>
    </button>
  `,
})
export class WebButtonLabelAdd extends BaseButton {}
