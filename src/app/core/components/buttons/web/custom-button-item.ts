import { CommonModule } from "@angular/common";
import { Component, computed, input } from "@angular/core";
import { TooltipModule } from "primeng/tooltip";
import { AppIcon } from "../../app-icon/app-icon.component";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "custom-button-item",
  imports: [CommonModule, TooltipModule, AppIcon],
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
      @if (resolvedIcon()) {
        <span
          [class]="iconShellClasses(showLabelOnDesktop() && !!label())"
          aria-hidden="true"
        >
          <app-icon [icon]="resolvedIcon()" />
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
