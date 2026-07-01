import { CommonModule } from "@angular/common";
import { Component, input } from "@angular/core";
import { AppIcon } from "../shared/app-icon/app-icon.component";
import { IlButtonBase } from "./il-button-base";

@Component({
  selector: "il-button-view-pdf",
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
      <span>{{ label() || "Ver archivo" }}</span>
    </button>
  `,
})
export class IlButtonViewPdf extends IlButtonBase {
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
