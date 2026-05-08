import { CommonModule } from "@angular/common";
import { Component, computed, input } from "@angular/core";
import { TooltipModule } from "primeng/tooltip";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "custom-button-edit",
  imports: [CommonModule, TooltipModule],
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
        <i [class]="finalIcon()"></i>
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

  finalIcon = computed(() => this.resolvedIconClass() || "pi pi-pencil");
}
