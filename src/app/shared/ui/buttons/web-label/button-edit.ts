import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { AppIcon } from "../../shared/app-icon/app-icon";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "il-button-edit",

  imports: [AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button
      type="button"
      [class]="buttonClasses()"
      [disabled]="disabled() || loading()"
      (click)="emitClick($event)"
    >
      <app-icon [icon]="iconClass() || 'mdi:pencil-outline'" />
      <span>{{ label() || "Editar" }}</span>
    </button>
  `,
})
export class WebButtonLabelEdit extends BaseButton {
  override variant = input<"solid" | "outline" | "ghost" | "text" | "link">(
    "ghost",
  );
  override severity = input<any>("info");
}
