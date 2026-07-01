import { CommonModule } from "@angular/common";
import { Component, input } from "@angular/core";
import { AppIcon } from "../shared/app-icon/app-icon.component";
import { IwButtonBase } from "./iw-button-base";

@Component({
  selector: "iw-button-download",
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
    </button>
  `,
})
export class IwButtonDownload extends IwButtonBase {
  override variant = input<"solid" | "outline" | "ghost" | "text" | "link">("ghost");
  override severity = input<any>("secondary");
}
