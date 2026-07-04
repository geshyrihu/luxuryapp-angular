import { CommonModule } from "@angular/common";
import { Component, input } from "@angular/core";
import { AppIcon } from "../../shared/app-icon/app-icon.component";
import { BaseButton } from "../base/base-button";
import { openPdf } from "../shared/pdf";

@Component({
  selector: "iw-button-view-pdf",
  standalone: true,
  imports: [CommonModule, AppIcon],
  template: `
    <button
      type="button"
      [class]="buttonClasses()"
      [disabled]="disabled() || loading()"
      (click)="handleClick($event)"
    >
      <app-icon [icon]="iconClass() || 'fluent-color:document-16'" />
    </button>
  `,
})
export class WebButtonIconViewPdf extends BaseButton {
  url = input<string>("");
  fileName = input<string>("");

  override variant = input<"solid" | "outline" | "ghost" | "text" | "link">(
    "ghost",
  );
  override severity = input<any>("secondary");

  protected handleClick(event: Event): void {
    if (this.url()) {
      openPdf(this.url());
      return;
    }
    this.emitClick(event);
  }
}
