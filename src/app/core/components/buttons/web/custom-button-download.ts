import { CommonModule } from "@angular/common";
import { Component, computed, input } from "@angular/core";
import { TooltipModule } from "primeng/tooltip";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "custom-button-download",
  imports: [CommonModule, TooltipModule],
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
        <i [class]="finalIcon()"></i>
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

  finalIcon = computed(() => this.resolvedIconClass() || "pi pi-download");
}
