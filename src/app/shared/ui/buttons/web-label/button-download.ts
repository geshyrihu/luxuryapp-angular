import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { AppIcon } from "../../shared/app-icon/app-icon";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "il-button-download",

  imports: [AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button
      type="button"
      [class]="buttonClasses()"
      [disabled]="disabled() || loading()"
      (click)="emitClick($event)"
    >
      <app-icon [icon]="iconClass() || 'mdi:download'" />
      <span>{{ label() || "Descargar" }}</span>
    </button>
  `,
})
export class WebButtonLabelDownload extends BaseButton {
  override variant = input<"solid" | "outline" | "ghost" | "text" | "link">(
    "ghost",
  );
  override severity = input<any>("secondary");
}
