import { CommonModule } from "@angular/common";
import { Component, computed, input } from "@angular/core";
import { TooltipModule } from "primeng/tooltip";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "custom-button-item",
  imports: [CommonModule, TooltipModule],
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      [class]="btnClasses() + ' ' + customClass()"
      [ngClass]="customNgClass()"
      (click)="clicked.emit($event)"
      [pTooltip]="getTooltip()"
      [tooltipPosition]="tooltipPosition()"
    >
      @if (resolvedIconClass()) {
        <span
          [class]="iconShellClasses(showLabelOnDesktop() && !!label())"
          aria-hidden="true"
        >
          <i [class]="resolvedIconClass()"></i>
        </span>
      }
      @if (showLabelOnDesktop() && label()) {
        <span>{{ label() }}</span>
      }
    </button>
  `,
})
export class CustomButtonItem extends BaseButton {
  override text = input<boolean>(true);
  override severity = input<any>("secondary");
  override rounded = input<boolean>(true);
  override size = input<any>("small");
  override showLabelOnDesktop = input<boolean>(false);

  getTooltip = computed(
    () => this.tooltip() || this.ngbTooltip() || this.label() || "",
  );
}
