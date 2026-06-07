import { CommonModule } from "@angular/common";
import { Component, computed, input } from "@angular/core";
import { TooltipModule } from "primeng/tooltip";
import { AppIcon } from "../../app-icon/app-icon.component";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "custom-button-edit",
  imports: [CommonModule, TooltipModule, AppIcon],
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      [class]="btnClasses() + ' ' + customClass()"
      [ngClass]="customNgClass()"
      (click)="clicked.emit($event)"
      [pTooltip]="ngbTooltip() || label() || 'Editar'"
      [tooltipPosition]="tooltipPosition()"
    >
      <span
        [class]="iconShellClasses(showLabelOnDesktop() && !!label())"
        aria-hidden="true"
      >
        <app-icon [icon]="finalIcon()" />
      </span>
      @if (showLabelOnDesktop() && label()) {
        <span>{{ label() }}</span>
      }
    </button>
  `,
})
export class CustomButtonEdit extends BaseButton {
  override text = input<boolean>(true);
  override severity = input<any>("info");
  override rounded = input<boolean>(true);
  override size = input<any>("small");

  finalIcon = computed(() => this.icon() || this.iconClass() || "mdi:pencil");
}
