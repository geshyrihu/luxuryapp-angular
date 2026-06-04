import { CommonModule } from "@angular/common";
import { Component, input } from "@angular/core";
import { TooltipModule } from "primeng/tooltip";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "custom-button",
  imports: [CommonModule, TooltipModule],
  template: `
    <div [class.field]="!noMargin()" [class.mb-0]="noMargin()">
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
        [pTooltip]="tooltip() || ngbTooltip() || label()"
        [tooltipPosition]="tooltipPosition()"
      >
        @if (loading()) {
          <span
            [class]="iconShellClasses(showLabelOnDesktop())"
            aria-hidden="true"
          >
            <i class="pi pi-spin pi-spinner"></i>
          </span>
        } @else if (resolvedIconClass()) {
          <span
            [class]="iconShellClasses(showLabelOnDesktop())"
            aria-hidden="true"
          >
            <i [class]="resolvedIconClass()"></i>
          </span>
        }
        @if (showLabelOnDesktop() && label()) {
          <span>{{ label() }}</span>
        }
      </button>
    </div>
  `,
  styles: [
    `
      .field {
        margin-bottom: 1rem;
      }
    `,
  ],
})
export class CustomButton extends BaseButton {
  override showLabelOnDesktop = input<boolean>(true);
}
