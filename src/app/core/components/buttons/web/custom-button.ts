import { CommonModule } from "@angular/common";
import { Component, computed } from "@angular/core";
import { TooltipModule } from "primeng/tooltip";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "custom-button",
  imports: [CommonModule, TooltipModule],
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      [class]="
        'inline-flex align-items-center justify-content-center gap-1 ' +
        btnClasses() +
        ' ' +
        customClass()
      "
      [ngClass]="customNgClass()"
      (click)="clicked.emit($event)"
      [pTooltip]="ngbTooltip()"
      [tooltipPosition]="tooltipPosition()"
    >
      @if (loading()) {
        <span [class]="iconShellClasses(showLabelOnDesktop())" aria-hidden="true">
          <i class="pi pi-spin pi-spinner"></i>
        </span>
      } @else if (resolvedIconClass()) {
        <span [class]="iconShellClasses(showLabelOnDesktop())" aria-hidden="true">
          <i [class]="resolvedIconClass()"></i>
        </span>
      }
      @if (showLabelOnDesktop()) {
        <span>{{ finalLabel() }}</span>
      }
    </button>
  `,
})
export class CustomButton extends BaseButton {
  finalLabel = computed(() => this.label() || "Accion");
}
