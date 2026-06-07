import { CommonModule } from "@angular/common";
import { Component, computed, input } from "@angular/core";
import { TooltipModule } from "primeng/tooltip";
import { AppIcon } from "../../app-icon/app-icon.component";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "custom-button-download",
  imports: [CommonModule, TooltipModule, AppIcon],
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      [class]="btnClasses() + ' ' + customClass()"
      [ngClass]="customNgClass()"
      (click)="onClick($event)"
      [pTooltip]="ngbTooltip() || label() || 'Descargar'"
      tooltipPosition="top"
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
export class CustomButtonDownload extends BaseButton {
  override text = input<boolean>(true);
  override severity = input<any>("secondary");
  override rounded = input<boolean>(true);

  finalIcon = computed(() => this.icon() || this.iconClass() || "mdi:download");
}
