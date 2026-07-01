import { CommonModule } from "@angular/common";
import { Component, input } from "@angular/core";
import { AppIcon } from "../../../shared/app-icon/app-icon.component";
import { WebButtonBase } from "./web-button-base";

@Component({
  selector: "custom-button-download",
  standalone: true,
  imports: [CommonModule, AppIcon],
  template: `
    <button
      type="button"
      [class]="buttonClasses()"
      [disabled]="disabled() || loading()"
      (click)="emitClick($event)"
    >
      <app-icon [icon]="iconClass() || 'mdi:download'" />
      @if (showLabelOnDesktop() && label()) {
        <span>{{ label() }}</span>
      }
    </button>
  `,
})
export class CustomButtonDownload extends WebButtonBase {
  override variant = input<"solid" | "outline" | "ghost" | "text" | "link">(
    "ghost",
  );
  override severity = input<any>("secondary");
}
