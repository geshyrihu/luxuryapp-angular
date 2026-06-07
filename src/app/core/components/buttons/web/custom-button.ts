import { CommonModule } from "@angular/common";
import { Component, input } from "@angular/core";
import { TooltipModule } from "primeng/tooltip";
import { AppIcon } from "../../app-icon/app-icon.component";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "custom-button",
  imports: [CommonModule, TooltipModule, AppIcon],
  template: `
    <div [class.field]="!noMargin()" [class.mb-0]="noMargin()">
      <button
        [type]="type()"
        [disabled]="disabled()"
        [class]="
          'inline-flex align-items-center gap-1 ' +
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
            <app-icon icon="mdi:loading" class="ds-animate-spin" />
          </span>
        } @else if (resolvedIcon()) {
          <span
            [class]="iconShellClasses(showLabelOnDesktop())"
            aria-hidden="true"
          >
            <app-icon [icon]="resolvedIcon()" />
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
