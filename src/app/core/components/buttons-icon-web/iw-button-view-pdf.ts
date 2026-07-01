import { CommonModule } from "@angular/common";
import { Component, input } from "@angular/core";
import { AppIcon } from "../shared/app-icon/app-icon.component";
import { IwButtonBase } from "./iw-button-base";

@Component({
  selector: "iw-button-view-pdf",
  standalone: true,
  imports: [CommonModule, AppIcon],
  template: `
    <button
      type="button"
      [class]="buttonClasses()"
      [disabled]="disabled() || loading()"
      (click)="openPdf($event)"
    >
      <app-icon [icon]="iconClass() || 'mdi:file-pdf-box'" />
    </button>
  `,
})
export class IwButtonViewPdf extends IwButtonBase {
  url = input<string>("");
  fileName = input<string>("");

  override variant = input<"solid" | "outline" | "ghost" | "text" | "link">("ghost");
  override severity = input<any>("secondary");

  protected openPdf(event: Event): void {
    if (this.url()) {
      window.open(this.url(), "_blank");
      return;
    }
    this.emitClick(event);
  }
}
